const noop = () => {}
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export const DEFAULT_MUSIC_SOURCE = new URL(
  '../assets/audio/gaslight-inquiry.mp3',
  import.meta.url,
).href

/**
 * Small, dependency-free controller for the game's looping background score.
 *
 * The track may preload, but `play()` is never called until `arm()` observes a
 * trusted pointer or keyboard event. A missing or unsupported audio asset turns
 * the controller into a safe no-op rather than interrupting the game.
 */
export const createGameMusic = (options = {}) => {
  const doc = options.document || globalThis.document
  const win = doc?.defaultView || globalThis.window
  const source = options.source || DEFAULT_MUSIC_SOURCE
  const maximumVolume = clamp(Number(options.maximumVolume) || 0.2, 0.04, 0.32)

  let enabled = options.enabled !== false
  let volume = clamp(Number.isFinite(Number(options.volume)) ? Number(options.volume) : 0.55, 0, 1)
  let unlocked = false
  let failed = false
  let destroyed = false
  let audio = null
  let playPromise = null
  let fadeFrame = null
  let armedRoot = null
  let removeArmListeners = noop

  const requestFrame = win?.requestAnimationFrame?.bind(win)
    || ((callback) => globalThis.setTimeout(() => callback(Date.now()), 16))
  const cancelFrame = win?.cancelAnimationFrame?.bind(win)
    || globalThis.clearTimeout?.bind(globalThis)

  const intendedVolume = () => maximumVolume * volume
  const isVisible = () => !doc || doc.visibilityState !== 'hidden'

  const cancelFade = () => {
    if (fadeFrame === null) return
    cancelFrame?.(fadeFrame)
    fadeFrame = null
  }

  const pauseImmediately = () => {
    cancelFade()
    if (!audio) return
    try {
      audio.volume = 0
      audio.pause?.()
    } catch {
      // Media support is optional; the rest of the game should keep working.
    }
  }

  const fadeTo = (targetValue, duration = 420, pauseAfter = false) => {
    if (!audio || destroyed) return
    cancelFade()

    const target = clamp(Number(targetValue) || 0, 0, maximumVolume)
    const start = clamp(Number(audio.volume) || 0, 0, 1)

    const finish = () => {
      fadeFrame = null
      try {
        audio.volume = target
        if (pauseAfter && target === 0) audio.pause?.()
      } catch {
        // Ignore media state errors from incomplete or unsupported elements.
      }
    }

    if (duration <= 0 || Math.abs(start - target) < 0.001) {
      finish()
      return
    }

    let startedAt = null
    const tick = (time) => {
      if (!audio || destroyed) return
      if (startedAt === null) startedAt = time
      const progress = clamp((time - startedAt) / duration, 0, 1)
      const eased = 1 - (1 - progress) ** 3

      try {
        audio.volume = start + (target - start) * eased
      } catch {
        finish()
        return
      }

      if (progress < 1) fadeFrame = requestFrame(tick)
      else finish()
    }

    fadeFrame = requestFrame(tick)
  }

  const onAudioError = (event) => {
    failed = true
    playPromise = null
    pauseImmediately()
    options.onError?.(event?.error || audio?.error || new Error('Background music could not be loaded.'))
  }

  const ensureAudio = () => {
    if (audio || destroyed || failed) return audio

    try {
      const AudioConstructor = options.Audio || win?.Audio || globalThis.Audio
      audio = AudioConstructor ? new AudioConstructor(source) : doc?.createElement?.('audio') || null
      if (!audio) return null

      if (!audio.src) audio.src = source
      audio.loop = true
      audio.preload = 'metadata'
      audio.playsInline = true
      audio.volume = 0
      audio.addEventListener?.('error', onAudioError)
    } catch (error) {
      failed = true
      audio = null
      options.onError?.(error)
    }

    return audio
  }

  const startPlayback = () => {
    if (destroyed || failed || !enabled || !unlocked || !isVisible()) return false

    const track = ensureAudio()
    if (!track || typeof track.play !== 'function') return false

    if (!track.paused) {
      fadeTo(intendedVolume(), 240)
      return true
    }

    if (playPromise) return playPromise

    cancelFade()
    try {
      track.volume = 0
      const result = track.play()

      if (!result || typeof result.then !== 'function') {
        if (enabled && isVisible()) fadeTo(intendedVolume(), 650)
        removeArmListeners()
        return true
      }

      playPromise = result
        .then(() => {
          playPromise = null
          if (destroyed || !enabled || !isVisible()) {
            pauseImmediately()
            return false
          }
          fadeTo(intendedVolume(), 650)
          removeArmListeners()
          return true
        })
        .catch((error) => {
          playPromise = null
          // Autoplay-policy and transient loading failures may succeed on the
          // next trusted interaction, so they do not permanently disable music.
          try { track.pause?.() } catch {}
          options.onPlayError?.(error)
          return false
        })

      return playPromise
    } catch (error) {
      playPromise = null
      options.onPlayError?.(error)
      return false
    }
  }

  const isModifierOnlyKey = (event) => event?.type === 'keydown'
    && ['Alt', 'Control', 'Meta', 'Shift'].includes(event.key)

  const onTrustedInteraction = (event) => {
    if (destroyed || event?.isTrusted !== true || isModifierOnlyKey(event)) return
    if (!unlocked) {
      unlocked = true
      options.onUnlock?.()
    }
    if (enabled && isVisible()) startPlayback()
  }

  const arm = (root = doc) => {
    if (destroyed || !root?.addEventListener) return noop
    removeArmListeners()
    armedRoot = root

    root.addEventListener('pointerdown', onTrustedInteraction, { capture: true, passive: true })
    root.addEventListener('keydown', onTrustedInteraction, { capture: true })

    removeArmListeners = () => {
      if (!armedRoot) return
      armedRoot.removeEventListener('pointerdown', onTrustedInteraction, { capture: true })
      armedRoot.removeEventListener('keydown', onTrustedInteraction, { capture: true })
      armedRoot = null
      removeArmListeners = noop
    }

    return removeArmListeners
  }

  const setEnabled = (nextEnabled) => {
    enabled = Boolean(nextEnabled)

    if (enabled) {
      if (unlocked && isVisible()) startPlayback()
    } else {
      fadeTo(0, 360, true)
    }

    options.onEnabledChange?.(enabled)
    return enabled
  }

  const setVolume = (nextVolume) => {
    const numericValue = Number(nextVolume)
    if (Number.isFinite(numericValue)) volume = clamp(numericValue, 0, 1)

    if (audio && enabled && unlocked && isVisible() && !audio.paused) {
      fadeTo(intendedVolume(), 140)
    }

    options.onVolumeChange?.(volume)
    return volume
  }

  const onVisibilityChange = () => {
    if (!isVisible()) {
      // requestAnimationFrame is throttled in background tabs, so pause now.
      pauseImmediately()
      return
    }
    if (enabled && unlocked) startPlayback()
  }

  doc?.addEventListener?.('visibilitychange', onVisibilityChange)
  const destroy = () => {
    if (destroyed) return
    destroyed = true
    removeArmListeners()
    doc?.removeEventListener?.('visibilitychange', onVisibilityChange)
    cancelFade()

    if (audio) {
      audio.removeEventListener?.('error', onAudioError)
      try {
        audio.pause?.()
        audio.removeAttribute?.('src')
        audio.load?.()
      } catch {
        // Nothing else owns this element, so cleanup can end here safely.
      }
    }

    audio = null
    playPromise = null
  }

  return Object.freeze({
    arm,
    setEnabled,
    setVolume,
    get enabled() { return enabled },
    get volume() { return volume },
    get unlocked() { return unlocked },
    get available() { return Boolean(audio) && !failed },
    get failed() { return failed },
    get playing() { return Boolean(audio && !audio.paused && !audio.ended) },
    destroy,
  })
}

export default createGameMusic

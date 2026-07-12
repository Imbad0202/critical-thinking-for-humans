const STYLE_ID = 'game-feedback-styles-v1'
const LAYER_CLASS = 'game-feedback-layer'
const VALID_TONES = new Set(['success', 'wrong', 'streak', 'clue', 'paper'])

const noop = () => {}
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const styles = `
  .${LAYER_CLASS} {
    position: fixed;
    z-index: 10000;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    contain: strict;
  }

  .game-feedback-particle,
  .game-feedback-stamp,
  .game-feedback-glow {
    position: fixed;
    left: var(--gf-left);
    top: var(--gf-top);
    pointer-events: none;
    will-change: transform, opacity;
  }

  .game-feedback-particle {
    width: var(--gf-size);
    height: calc(var(--gf-size) * 0.58);
    border: 1px solid color-mix(in srgb, var(--gf-color) 82%, white);
    background: color-mix(in srgb, var(--gf-color) 58%, transparent);
    box-shadow: 0 0 10px color-mix(in srgb, var(--gf-color) 28%, transparent);
    animation: gameFeedbackParticle 760ms cubic-bezier(.16, .72, .26, 1) var(--gf-delay) both;
  }

  .game-feedback-particle[data-shape='diamond'] {
    width: calc(var(--gf-size) * 0.72);
    height: calc(var(--gf-size) * 0.72);
    border-radius: 1px;
  }

  .game-feedback-particle[data-shape='dot'] {
    width: calc(var(--gf-size) * 0.48);
    height: calc(var(--gf-size) * 0.48);
    border: 0;
    border-radius: 50%;
    background: var(--gf-color);
  }

  .game-feedback-particle[data-tone='wrong'] {
    opacity: .62;
    box-shadow: none;
  }

  .game-feedback-stamp {
    display: grid;
    min-width: 5rem;
    min-height: 5rem;
    place-items: center;
    padding: .7rem;
    border: 2px double var(--gf-color);
    border-radius: 50%;
    color: var(--gf-color);
    background: color-mix(in srgb, #07100f 82%, transparent);
    box-shadow:
      inset 0 0 0 4px color-mix(in srgb, var(--gf-color) 11%, transparent),
      0 0 32px color-mix(in srgb, var(--gf-color) 18%, transparent);
    font-family: var(--mono, ui-monospace, monospace);
    font-size: .75rem;
    font-weight: 800;
    letter-spacing: .12em;
    line-height: 1.25;
    text-align: center;
    text-transform: uppercase;
    animation: gameFeedbackStamp 820ms cubic-bezier(.2, .82, .2, 1) both;
  }

  .game-feedback-stamp[data-tone='wrong'] {
    min-width: 4.5rem;
    min-height: 4.5rem;
    border-style: solid;
    opacity: .88;
  }

  .game-feedback-glow {
    width: var(--gf-width);
    height: var(--gf-height);
    border: 1px solid color-mix(in srgb, var(--gf-color) 64%, transparent);
    border-radius: var(--gf-radius);
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--gf-color) 8%, transparent),
      0 0 42px color-mix(in srgb, var(--gf-color) 22%, transparent);
    animation: gameFeedbackGlow 720ms ease-out both;
  }

  .game-feedback-shake {
    animation: gameFeedbackNudge 320ms cubic-bezier(.25, .7, .35, 1) both !important;
  }

  @keyframes gameFeedbackParticle {
    0% {
      opacity: 0;
      transform: translate3d(-50%, -50%, 0) scale(.45) rotate(var(--gf-turn-start));
    }
    18% { opacity: .95; }
    100% {
      opacity: 0;
      transform:
        translate3d(calc(-50% + var(--gf-x)), calc(-50% + var(--gf-y)), 0)
        scale(.92)
        rotate(var(--gf-turn-end));
    }
  }

  @keyframes gameFeedbackStamp {
    0% {
      opacity: 0;
      transform: translate3d(-50%, -50%, 0) rotate(-10deg) scale(1.28);
    }
    34% {
      opacity: 1;
      transform: translate3d(-50%, -50%, 0) rotate(-7deg) scale(.96);
    }
    52%, 82% {
      opacity: 1;
      transform: translate3d(-50%, -50%, 0) rotate(-7deg) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate3d(-50%, -50%, 0) rotate(-7deg) scale(1.02);
    }
  }

  @keyframes gameFeedbackGlow {
    0% {
      opacity: 0;
      transform: translate3d(-50%, -50%, 0) scale(.96);
    }
    24% { opacity: .92; }
    100% {
      opacity: 0;
      transform: translate3d(-50%, -50%, 0) scale(1.045);
    }
  }

  @keyframes gameFeedbackNudge {
    0%, 100% { translate: 0 0; }
    25% { translate: -3px 0; }
    52% { translate: 2px 0; }
    76% { translate: -1px 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .game-feedback-particle { display: none !important; }
    .game-feedback-shake { animation: none !important; }
    .game-feedback-stamp,
    .game-feedback-glow {
      animation: none !important;
      opacity: .86;
      transform: translate3d(-50%, -50%, 0) !important;
    }
  }
`

const addStyles = (doc) => {
  if (!doc || doc.getElementById(STYLE_ID)) return
  const style = doc.createElement('style')
  style.id = STYLE_ID
  style.textContent = styles
  ;(doc.head || doc.documentElement).append(style)
}

const getTone = (tone) => VALID_TONES.has(tone) ? tone : 'success'

/**
 * Native, dependency-free feedback for the Doubt Lab game UI.
 *
 * Audio is intentionally locked until `arm()` receives a trusted interaction,
 * or `unlock(event)` is called from an active user gesture. Calling sound methods
 * before that is a safe no-op, so this module never attempts autoplay.
 */
export const createGameFeedback = (options = {}) => {
  const doc = options.document || globalThis.document
  const win = doc?.defaultView || globalThis.window
  const motionQuery = win?.matchMedia?.('(prefers-reduced-motion: reduce)') || null
  const colors = {
    success: options.colors?.success || '#69cbb7',
    wrong: options.colors?.wrong || '#d58b70',
    streak: options.colors?.streak || '#f2ad5b',
    clue: options.colors?.clue || '#84a7d5',
    paper: options.colors?.paper || '#c5bca3',
  }

  let reducedMotion = Boolean(motionQuery?.matches)
  let muted = Boolean(options.muted)
  let context = null
  let masterGain = null
  let layer = null
  let disarm = noop
  let destroyed = false

  const shakeTimers = new WeakMap()
  const activeCleanups = new Set()

  addStyles(doc)

  const onMotionChange = (event) => { reducedMotion = event.matches }
  if (motionQuery?.addEventListener) motionQuery.addEventListener('change', onMotionChange)
  else motionQuery?.addListener?.(onMotionChange)

  const hasUserActivation = (event) => {
    if (event?.isTrusted) return true
    return Boolean(win?.navigator?.userActivation?.isActive)
  }

  const ensureLayer = () => {
    if (layer?.isConnected) return layer
    if (!doc?.documentElement) return null
    layer = doc.createElement('div')
    layer.className = LAYER_CLASS
    layer.setAttribute('aria-hidden', 'true')
    ;(doc.body || doc.documentElement).append(layer)
    return layer
  }

  const resolveElement = (target) => {
    if (!target) return null
    if (typeof target === 'string') return doc?.querySelector(target) || null
    return typeof target.getBoundingClientRect === 'function' ? target : null
  }

  const getPoint = (target) => {
    if (Number.isFinite(target?.x) && Number.isFinite(target?.y)) {
      return { x: target.x, y: target.y, width: 0, height: 0, radius: '50%' }
    }

    const element = resolveElement(target)
    if (element) {
      const rect = element.getBoundingClientRect()
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        radius: win?.getComputedStyle?.(element).borderRadius || '4px',
      }
    }

    return {
      x: (win?.innerWidth || 0) / 2,
      y: (win?.innerHeight || 0) / 2,
      width: 0,
      height: 0,
      radius: '50%',
    }
  }

  const trackCleanup = (cleanup) => {
    activeCleanups.add(cleanup)
    return () => {
      if (!activeCleanups.delete(cleanup)) return
      cleanup()
    }
  }

  const removeAfter = (elements, delay) => {
    const nodes = Array.isArray(elements) ? elements : [elements]
    let timer = 0
    const cleanup = trackCleanup(() => {
      win?.clearTimeout?.(timer)
      nodes.forEach((node) => node?.remove())
    })
    timer = win?.setTimeout?.(cleanup, delay) || 0
    return cleanup
  }

  const unlock = async (interactionEvent) => {
    if (destroyed) return false
    if (context?.state === 'running') return true
    if (!hasUserActivation(interactionEvent)) return false

    if (!context) {
      const AudioContext = win?.AudioContext || win?.webkitAudioContext
      if (!AudioContext) return false
      try {
        context = new AudioContext({ latencyHint: 'interactive' })
      } catch {
        context = new AudioContext()
      }
      masterGain = context.createGain()
      masterGain.gain.value = muted ? 0 : 0.72
      masterGain.connect(context.destination)
    }

    try {
      if (context.state === 'suspended') await context.resume()
      return context.state === 'running'
    } catch {
      return false
    }
  }

  const arm = (interactionRoot = options.root || doc) => {
    disarm()
    if (!interactionRoot?.addEventListener || destroyed) return noop

    const handleGesture = (event) => {
      if (event.type === 'keydown' && event.repeat) return
      void unlock(event)
      disarm()
    }

    interactionRoot.addEventListener('pointerdown', handleGesture, { capture: true, passive: true })
    interactionRoot.addEventListener('keydown', handleGesture, { capture: true })
    disarm = () => {
      interactionRoot.removeEventListener('pointerdown', handleGesture, { capture: true })
      interactionRoot.removeEventListener('keydown', handleGesture, { capture: true })
      disarm = noop
    }
    return disarm
  }

  const canPlay = () => {
    if (destroyed || muted || !context || context.state === 'closed') return false
    if (doc?.visibilityState === 'hidden') return false
    if (context.state === 'suspended') {
      if (!hasUserActivation()) return false
      void context.resume().catch(noop)
    }
    return true
  }

  const tone = ({ frequency, toFrequency, at = 0, duration = 0.16, gain = 0.028, type = 'sine' }) => {
    const start = context.currentTime + 0.008 + at
    const oscillator = context.createOscillator()
    const envelope = context.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, start)
    if (toFrequency) oscillator.frequency.exponentialRampToValueAtTime(toFrequency, start + duration)

    envelope.gain.setValueAtTime(0.0001, start)
    envelope.gain.exponentialRampToValueAtTime(gain, start + Math.min(0.018, duration * 0.2))
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration)

    oscillator.connect(envelope)
    envelope.connect(masterGain)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.015)
  }

  const playTones = (notes) => {
    if (!canPlay()) return false
    notes.forEach(tone)
    return true
  }

  const sound = Object.freeze({
    success: () => playTones([
      { frequency: 392, duration: 0.19, gain: 0.026, type: 'sine' },
      { frequency: 493.88, at: 0.055, duration: 0.2, gain: 0.025, type: 'sine' },
      { frequency: 659.25, at: 0.112, duration: 0.24, gain: 0.022, type: 'triangle' },
    ]),

    // A soft, book-closing interval: corrective without a buzzer or alarm cue.
    wrong: () => playTones([
      { frequency: 392, toFrequency: 369.99, duration: 0.17, gain: 0.018, type: 'sine' },
      { frequency: 329.63, at: 0.085, duration: 0.22, gain: 0.017, type: 'triangle' },
    ]),

    streak: (count = 2) => {
      const tier = clamp(Math.floor(Number(count) || 1), 1, 5)
      const frequencies = [440, 523.25, 659.25, 783.99, 880].slice(0, Math.max(2, tier))
      return playTones(frequencies.map((frequency, index) => ({
        frequency,
        at: index * 0.047,
        duration: 0.17 + index * 0.012,
        gain: 0.016 + index * 0.0015,
        type: index === frequencies.length - 1 ? 'triangle' : 'sine',
      })))
    },

    clue: () => playTones([
      { frequency: 587.33, toFrequency: 622.25, duration: 0.18, gain: 0.019, type: 'sine' },
      { frequency: 880, at: 0.075, duration: 0.25, gain: 0.017, type: 'sine' },
    ]),

    paper: () => {
      if (!canPlay()) return false
      const duration = 0.16
      const frameCount = Math.floor(context.sampleRate * duration)
      const buffer = context.createBuffer(1, frameCount, context.sampleRate)
      const data = buffer.getChannelData(0)
      let smoothed = 0

      for (let index = 0; index < frameCount; index += 1) {
        const progress = index / frameCount
        const flutter = 0.55 + 0.45 * Math.sin(progress * Math.PI * 5) ** 2
        const envelope = Math.sin(progress * Math.PI) ** 1.4
        smoothed = smoothed * 0.72 + (Math.random() * 2 - 1) * 0.28
        data[index] = smoothed * flutter * envelope
      }

      const source = context.createBufferSource()
      const highpass = context.createBiquadFilter()
      const lowpass = context.createBiquadFilter()
      const gain = context.createGain()
      highpass.type = 'highpass'
      highpass.frequency.value = 240
      lowpass.type = 'lowpass'
      lowpass.frequency.value = 2300
      gain.gain.value = 0.018
      source.buffer = buffer
      source.connect(highpass)
      highpass.connect(lowpass)
      lowpass.connect(gain)
      gain.connect(masterGain)
      source.start()
      return true
    },
  })

  const effects = Object.freeze({
    particles: (target, effectOptions = {}) => {
      if (destroyed || reducedMotion) return noop
      const host = ensureLayer()
      if (!host) return noop

      const toneName = getTone(effectOptions.tone || 'success')
      const origin = getPoint(target)
      const count = clamp(Math.round(effectOptions.count ?? (toneName === 'streak' ? 20 : 14)), 1, 28)
      const spread = clamp(Number(effectOptions.spread) || 86, 24, 180)
      const nodes = []
      const fragment = doc.createDocumentFragment()

      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.36
        const distance = spread * (0.58 + Math.random() * 0.58)
        const particle = doc.createElement('i')
        particle.className = 'game-feedback-particle'
        particle.dataset.tone = toneName
        particle.dataset.shape = ['slip', 'diamond', 'dot'][index % 3]
        particle.style.setProperty('--gf-left', `${origin.x}px`)
        particle.style.setProperty('--gf-top', `${origin.y}px`)
        particle.style.setProperty('--gf-x', `${Math.cos(angle) * distance}px`)
        particle.style.setProperty('--gf-y', `${Math.sin(angle) * distance - spread * 0.14}px`)
        particle.style.setProperty('--gf-size', `${5 + Math.random() * 6}px`)
        particle.style.setProperty('--gf-delay', `${Math.random() * 72}ms`)
        particle.style.setProperty('--gf-turn-start', `${Math.random() * 70 - 35}deg`)
        particle.style.setProperty('--gf-turn-end', `${Math.random() * 280 - 140}deg`)
        particle.style.setProperty('--gf-color', colors[toneName])
        nodes.push(particle)
        fragment.append(particle)
      }

      host.append(fragment)
      return removeAfter(nodes, 920)
    },

    stamp: (target, effectOptions = {}) => {
      if (destroyed) return noop
      const host = ensureLayer()
      if (!host) return noop

      const toneName = getTone(effectOptions.tone || 'success')
      const origin = getPoint(target)
      const stamp = doc.createElement('span')
      stamp.className = 'game-feedback-stamp'
      stamp.dataset.tone = toneName
      stamp.textContent = String(effectOptions.text || (toneName === 'wrong' ? '再查一眼' : '命中'))
      stamp.style.setProperty('--gf-left', `${origin.x}px`)
      stamp.style.setProperty('--gf-top', `${origin.y}px`)
      stamp.style.setProperty('--gf-color', colors[toneName])
      host.append(stamp)
      return removeAfter(stamp, reducedMotion ? 680 : 900)
    },

    shake: (target) => {
      const element = resolveElement(target)
      if (!element || destroyed || reducedMotion) return noop

      const previousTimer = shakeTimers.get(element)
      if (previousTimer) win.clearTimeout(previousTimer)
      element.classList.remove('game-feedback-shake')
      void element.getBoundingClientRect()
      element.classList.add('game-feedback-shake')

      const cleanup = () => {
        element.classList.remove('game-feedback-shake')
        shakeTimers.delete(element)
      }
      const timer = win.setTimeout(cleanup, 360)
      shakeTimers.set(element, timer)
      return cleanup
    },

    glow: (target, effectOptions = {}) => {
      if (destroyed) return noop
      const host = ensureLayer()
      if (!host) return noop

      const toneName = getTone(effectOptions.tone || 'clue')
      const box = getPoint(target)
      const glow = doc.createElement('i')
      glow.className = 'game-feedback-glow'
      glow.dataset.tone = toneName
      glow.style.setProperty('--gf-left', `${box.x}px`)
      glow.style.setProperty('--gf-top', `${box.y}px`)
      glow.style.setProperty('--gf-width', `${Math.max(42, box.width + 10)}px`)
      glow.style.setProperty('--gf-height', `${Math.max(42, box.height + 10)}px`)
      glow.style.setProperty('--gf-radius', box.radius)
      glow.style.setProperty('--gf-color', colors[toneName])
      host.append(glow)
      return removeAfter(glow, reducedMotion ? 620 : 780)
    },
  })

  const combine = (...cleanups) => () => cleanups.forEach((cleanup) => cleanup?.())

  const cue = Object.freeze({
    success: (target, cueOptions = {}) => {
      if (cueOptions.sound !== false) sound.success()
      return combine(
        cueOptions.stamp === false ? noop : effects.stamp(target, { tone: 'success', text: cueOptions.stamp || '命中' }),
        cueOptions.particles === false ? noop : effects.particles(target, { tone: 'success', count: cueOptions.count }),
        effects.glow(target, { tone: 'success' }),
      )
    },

    wrong: (target, cueOptions = {}) => {
      if (cueOptions.sound !== false) sound.wrong()
      return combine(
        effects.shake(target),
        cueOptions.stamp === false ? noop : effects.stamp(target, { tone: 'wrong', text: cueOptions.stamp || '再查一眼' }),
      )
    },

    streak: (target, count = 2, cueOptions = {}) => {
      const safeCount = clamp(Math.floor(Number(count) || 1), 1, 999)
      if (cueOptions.sound !== false) sound.streak(safeCount)
      return combine(
        cueOptions.stamp === false ? noop : effects.stamp(target, { tone: 'streak', text: cueOptions.stamp || `${safeCount} 日` }),
        effects.particles(target, { tone: 'streak', count: cueOptions.count ?? 20, spread: cueOptions.spread ?? 108 }),
        effects.glow(target, { tone: 'streak' }),
      )
    },

    clue: (target, cueOptions = {}) => {
      if (cueOptions.sound !== false) sound.clue()
      return combine(
        cueOptions.stamp ? effects.stamp(target, { tone: 'clue', text: cueOptions.stamp }) : noop,
        effects.particles(target, { tone: 'clue', count: cueOptions.count ?? 9, spread: cueOptions.spread ?? 58 }),
        effects.glow(target, { tone: 'clue' }),
      )
    },

    paper: (target, cueOptions = {}) => {
      if (cueOptions.sound !== false) sound.paper()
      return cueOptions.particles
        ? effects.particles(target, { tone: 'paper', count: cueOptions.count ?? 6, spread: cueOptions.spread ?? 44 })
        : noop
    },
  })

  const setMuted = (nextMuted) => {
    muted = Boolean(nextMuted)
    if (masterGain && context?.state !== 'closed') {
      const now = context.currentTime
      masterGain.gain.cancelScheduledValues(now)
      masterGain.gain.setTargetAtTime(muted ? 0 : 0.72, now, 0.012)
    }
    options.onMuteChange?.(muted)
    return muted
  }

  const destroy = () => {
    if (destroyed) return
    destroyed = true
    disarm()
    activeCleanups.forEach((cleanup) => cleanup())
    activeCleanups.clear()
    layer?.remove()
    layer = null
    if (motionQuery?.removeEventListener) motionQuery.removeEventListener('change', onMotionChange)
    else motionQuery?.removeListener?.(onMotionChange)
    if (context?.state !== 'closed') void context?.close?.().catch(noop)
    context = null
    masterGain = null
  }

  return Object.freeze({
    arm,
    unlock,
    setMuted,
    toggleMuted: () => setMuted(!muted),
    get muted() { return muted },
    get unlocked() { return context?.state === 'running' },
    get reducedMotion() { return reducedMotion },
    sound,
    effects,
    cue,
    destroy,
  })
}

export default createGameFeedback

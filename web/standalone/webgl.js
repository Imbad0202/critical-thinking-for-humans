const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_pointer;
  uniform float u_time;
  uniform vec3 u_active;

  #define PI 3.14159265359

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  float line(float value, float width) {
    return 1.0 - smoothstep(0.0, width, abs(value));
  }

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  vec3 nodeGlow(vec2 uv, vec2 position, vec3 color, float emphasis) {
    float distanceToNode = length(uv - position);
    float glow = 0.0045 / max(distanceToNode * distanceToNode, 0.001);
    float core = 1.0 - smoothstep(0.027, 0.047, distanceToNode);
    float halo = line(distanceToNode - 0.075 - emphasis * 0.012, 0.004);
    return color * (glow * 0.12 + core * 1.4 + halo * (0.22 + emphasis * 0.4));
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = (frag * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    uv += u_pointer * vec2(0.055, 0.035);
    float t = u_time;

    vec3 color = vec3(0.023, 0.052, 0.047);
    color += vec3(0.015, 0.035, 0.031) * (1.0 - smoothstep(-0.7, 0.9, uv.y));

    vec2 horizonUv = uv;
    float horizon = smoothstep(-0.1, -1.2, uv.y);
    vec2 projected = vec2(horizonUv.x / max(0.22, horizonUv.y + 1.42), 1.0 / max(0.22, horizonUv.y + 1.42));
    projected.y += t * 0.018;
    vec2 gridCell = abs(fract(projected * vec2(7.0, 2.7)) - 0.5);
    float grid = smoothstep(0.465, 0.498, max(gridCell.x, gridCell.y));
    color += vec3(0.055, 0.17, 0.145) * grid * horizon * 0.34;

    vec2 starCell = floor((uv + 4.0) * 78.0);
    float starRandom = hash21(starCell);
    float star = step(0.9935, starRandom) * (0.35 + 0.65 * sin(t * 0.7 + starRandom * 18.0));
    color += vec3(0.35, 0.62, 0.55) * max(star, 0.0) * 0.42;

    vec2 coreUv = uv - vec2(0.0, 0.02);
    float radius = length(coreUv);
    float angle = atan(coreUv.y, coreUv.x);
    float facets = abs(sin(angle * 5.0 + t * 0.16)) * 0.035;
    float coreShape = 1.0 - smoothstep(0.255 + facets, 0.285 + facets, radius);
    float inner = 1.0 - smoothstep(0.0, 0.27, radius);
    float facetLines = line(sin(angle * 5.0 + t * 0.16) * radius, 0.009) * coreShape;
    color += mix(vec3(0.03, 0.12, 0.105), u_active * 0.38, 0.42) * coreShape * (0.52 + inner);
    color += u_active * facetLines * 0.23;
    color += u_active * (0.0035 / max(radius * radius, 0.001)) * 0.075;

    vec2 ringUv = coreUv;
    ringUv *= rotate2d(0.25 + sin(t * 0.07) * 0.12);
    float ringA = line(length(ringUv * vec2(1.0, 2.9)) - 0.42, 0.004);
    ringUv *= rotate2d(-0.95);
    float ringB = line(length(ringUv * vec2(1.0, 2.2)) - 0.48, 0.003);
    color += vec3(0.82, 0.49, 0.21) * (ringA * 0.42 + ringB * 0.24);

    vec2 drill = vec2(-0.55, 0.31);
    vec2 scene = vec2(0.57, 0.29);
    vec2 expedition = vec2(-0.52, -0.31);
    vec2 detective = vec2(0.55, -0.32);
    color += nodeGlow(uv, drill, vec3(0.95, 0.50, 0.16), length(u_active - vec3(0.95, 0.50, 0.16)) < 0.1 ? 1.0 : 0.0);
    color += nodeGlow(uv, scene, vec3(0.18, 0.82, 0.65), length(u_active - vec3(0.18, 0.82, 0.65)) < 0.1 ? 1.0 : 0.0);
    color += nodeGlow(uv, expedition, vec3(0.26, 0.52, 0.90), length(u_active - vec3(0.26, 0.52, 0.90)) < 0.1 ? 1.0 : 0.0);
    color += nodeGlow(uv, detective, vec3(0.92, 0.19, 0.12), length(u_active - vec3(0.92, 0.19, 0.12)) < 0.1 ? 1.0 : 0.0);

    vec2 points[4];
    points[0] = drill;
    points[1] = scene;
    points[2] = expedition;
    points[3] = detective;
    vec3 lineColors[4];
    lineColors[0] = vec3(0.95, 0.50, 0.16);
    lineColors[1] = vec3(0.18, 0.82, 0.65);
    lineColors[2] = vec3(0.26, 0.52, 0.90);
    lineColors[3] = vec3(0.92, 0.19, 0.12);
    for (int i = 0; i < 4; i++) {
      vec2 pa = coreUv;
      vec2 ba = points[i];
      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      float segmentDistance = length(pa - ba * h);
      float dash = step(0.52, fract(h * 18.0 - t * 0.08));
      color += lineColors[i] * (1.0 - smoothstep(0.002, 0.006, segmentDistance)) * dash * 0.13;
    }

    float vignette = 1.0 - smoothstep(0.65, 1.65, length(uv * vec2(0.78, 1.0)));
    color *= 0.52 + vignette * 0.64;
    float noise = hash21(frag + mod(t, 17.0)) - 0.5;
    color += noise * 0.018;
    color = pow(color, vec3(0.88));
    gl_FragColor = vec4(color, 1.0);
  }
`

const compileShader = (gl, type, source) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(message || 'Shader compilation failed')
  }
  return shader
}

const showFallback = (container) => {
  container.className = 'world-fallback'
  container.innerHTML = '<span class="fallback-orbit fallback-orbit--one"></span><span class="fallback-orbit fallback-orbit--two"></span><span class="fallback-core"></span>'
  return { status: 'fallback', setActiveMode() {}, destroy() {} }
}

const createWebglWorld = (container) => {
  const canvas = document.createElement('canvas')
  canvas.className = 'world-canvas'
  canvas.style.pointerEvents = 'none'
  container.className = 'world-mount'
  container.appendChild(canvas)

  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance',
  })

  if (!gl) {
    return showFallback(container)
  }

  const program = gl.createProgram()
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'Program link failed')
  }
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  )
  const position = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const uniforms = {
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    pointer: gl.getUniformLocation(program, 'u_pointer'),
    time: gl.getUniformLocation(program, 'u_time'),
    active: gl.getUniformLocation(program, 'u_active'),
  }

  const palette = {
    drill: [0.95, 0.5, 0.16],
    scene: [0.18, 0.82, 0.65],
    expedition: [0.26, 0.52, 0.9],
    detective: [0.92, 0.19, 0.12],
  }
  let active = palette.detective
  let targetPointer = [0, 0]
  let pointer = [0, 0]
  let frame = 0
  let startedAt = performance.now()
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
    const width = Math.floor(window.innerWidth * ratio)
    const height = Math.floor(window.innerHeight * ratio)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      gl.viewport(0, 0, width, height)
    }
  }

  const handlePointer = (event) => {
    targetPointer = [event.clientX / window.innerWidth - 0.5, 0.5 - event.clientY / window.innerHeight]
  }

  const render = (now) => {
    resize()
    pointer[0] += (targetPointer[0] - pointer[0]) * 0.025
    pointer[1] += (targetPointer[1] - pointer[1]) * 0.025
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
    gl.uniform2f(uniforms.pointer, pointer[0], pointer[1])
    gl.uniform1f(uniforms.time, reducedMotion ? 0 : (now - startedAt) / 1000)
    gl.uniform3f(uniforms.active, active[0], active[1], active[2])
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    frame = requestAnimationFrame(render)
  }

  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('pointermove', handlePointer, { passive: true })
  frame = requestAnimationFrame(render)

  return {
    status: 'online',
    setActiveMode(mode) {
      active = palette[mode] || palette.detective
      startedAt = performance.now() - 250
    },
    destroy() {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointer)
      gl.deleteBuffer(buffer)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteProgram(program)
      canvas.remove()
    },
  }
}

export const createWorld = (container) => {
  try {
    return createWebglWorld(container)
  } catch (error) {
    console.warn('WebGL initialization failed; using the 2D fallback.', error)
    return showFallback(container)
  }
}

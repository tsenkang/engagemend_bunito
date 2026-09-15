'use client';

import { useEffect, useRef } from 'react';

import { prefersReducedMotion } from '@/lib/animations';

/**
 * Campo de curvas de nível vivo, em WebGL.
 *
 * Um shader de ~60 linhas no lugar de uma biblioteca 3D: o efeito é o
 * mesmo e o custo é de alguns kB em vez de 600. O relevo escoa devagar,
 * afunda sob o cursor e desliza com o scroll — é a rampa da marca virada
 * paisagem.
 *
 * Uma tela fixa atrás de tudo, um contexto só. As seções claras são
 * transparentes e deixam ela aparecer; as escuras e a mostarda pintam
 * por cima.
 *
 * Desliga sozinho quando: não há cursor (celular e tablet), o visitante
 * pede menos movimento, a aba sai de foco, ou o navegador não tem
 * WebGL2 — e aí o fundo é a cor lisa, que já é o estado sem JavaScript.
 */
export function ContourField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    /**
     * Só onde existe cursor. Decisão do Benjamin, 2026-09-14, e ela tem
     * duas razões que se somam:
     *
     * - **Metade do efeito não existe no toque.** O relevo afunda sob o
     *   ponteiro; num celular não há ponteiro, então o que sobra é uma
     *   textura escoando devagar, que a `texture.svg` já dá de graça.
     * - **Os 3 pontos.** Medido: com o campo a Home fica em 89 de
     *   Performance no Lighthouse mobile, sem ele em 92 — e a meta do
     *   briefing é 90. Adiar a subida do shader e cortar os quadros pela
     *   metade foram tentados e não mudaram nada; o custo é o contexto
     *   WebGL em si. E um shader em laço contínuo também é bateria de
     *   quem está no celular.
     *
     * O `canvas` continua no documento sem nunca pintar, então o fundo é
     * a cor lisa do `body` — o mesmo estado de quem pede menos movimento
     * ou não tem WebGL2. Nada quebra, nada pula.
     *
     * Mesma consulta que o `Cursor` usa, e pelo mesmo motivo.
     */
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    /**
     * O campo só começa depois que a página pintou e o navegador ficou
     * ocioso. Compilar o shader durante o carregamento disputava a
     * thread principal com a primeira pintura e custava meio segundo de
     * LCP — o visitante via o relevo aparecer, mas o texto demorava.
     */
    let cancelled = false;
    let teardown: (() => void) | null = null;

    const idle =
      window.requestIdleCallback ??
      ((callback: IdleRequestCallback) => window.setTimeout(() => callback({} as IdleDeadline), 1));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;

    const handle = idle(
      () => {
        if (!cancelled) teardown = init(canvas);
      },
      { timeout: 2000 },
    );

    return () => {
      cancelled = true;
      cancelIdle(handle as number);
      teardown?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="field" aria-hidden="true" />;
}

/** Sobe o shader e devolve a função que o derruba. */
function init(canvas: HTMLCanvasElement): (() => void) | null {
  {
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    });
    if (!gl) return null;

    const vertex = `#version 300 es
      in vec2 a_position;
      void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
    `;

    const fragment = `#version 300 es
      precision highp float;
      out vec4 outColor;

      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_pointer;
      uniform float u_scroll;
      uniform vec3 u_base;
      uniform vec3 u_ink;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.02;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        vec2 p = uv * vec2(u_res.x / u_res.y, 1.0) * 2.4;

        // O relevo sobe da esquerda para a direita, como a rampa da marca.
        p.y += u_scroll * 0.45 - uv.x * 0.55;

        float field = fbm(p + vec2(u_time * 0.014, u_time * -0.009));

        // O cursor afunda o relevo e as curvas se apertam em volta dele.
        float d = distance(uv * vec2(u_res.x / u_res.y, 1.0),
                           u_pointer * vec2(u_res.x / u_res.y, 1.0));
        field += 0.075 * exp(-d * d * 9.0);

        float scaled = field * 11.0;
        float band = abs(fract(scaled) - 0.5);
        float w = fwidth(scaled) * 1.1;
        float line = 1.0 - smoothstep(0.0, w, band);

        // As curvas somem de leve para as bordas, para não virar papel de parede.
        float fade = 0.55 + 0.45 * smoothstep(1.0, 0.15, length(uv - 0.5));

        outColor = vec4(mix(u_base, u_ink, line * 0.16 * fade), 1.0);
      }
    `;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, vertex);
    const fs = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uPointer = gl.getUniformLocation(program, 'u_pointer');
    const uScroll = gl.getUniformLocation(program, 'u_scroll');

    const styles = getComputedStyle(document.documentElement);
    const readColor = (name: string) => {
      const raw = styles.getPropertyValue(name).trim().split(/\s+/).map(Number);
      return [(raw[0] ?? 0) / 255, (raw[1] ?? 0) / 255, (raw[2] ?? 0) / 255];
    };
    const base = readColor('--base-rgb');
    const ink = readColor('--ink-rgb');
    gl.uniform3f(gl.getUniformLocation(program, 'u_base'), base[0]!, base[1]!, base[2]!);
    gl.uniform3f(gl.getUniformLocation(program, 'u_ink'), ink[0]!, ink[1]!, ink[2]!);

    // Metade da resolução: são curvas suaves, ninguém vê a diferença, e
    // o custo por quadro cai a um quarto.
    const SCALE = 0.5;
    const resize = () => {
      const w = Math.round(window.innerWidth * SCALE);
      const h = Math.round(window.innerHeight * SCALE);
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onPointer = (event: PointerEvent) => {
      pointer.tx = event.clientX / window.innerWidth;
      pointer.ty = 1 - event.clientY / window.innerHeight;
    };

    let scroll = 0;
    let raf = 0;
    let running = true;
    const start = performance.now();

    const frame = (now: number) => {
      if (!running) return;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      scroll = window.scrollY / Math.max(1, window.innerHeight);

      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      const visible = document.visibilityState === 'visible';
      if (visible && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!visible) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }
}

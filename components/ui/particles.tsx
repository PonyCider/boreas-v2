"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";

export interface ParticlesProps {
  particleColors?: string[];
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleBaseSize?: number;
  moveParticlesOnHover?: boolean;
  alphaParticles?: boolean;
  disableRotation?: boolean;
  pixelRatio?: number;
  className?: string;
}

export default function Particles({
  particleColors = ["#ffffff"],
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleBaseSize = 100,
  moveParticlesOnHover = true,
  alphaParticles = false,
  disableRotation = false,
  pixelRatio = 1,
  className = "",
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      alpha: true,
      depth: false,
      dpr: Math.min(window.devicePixelRatio || 1, pixelRatio || 2),
    });

    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, 20);

    function resize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    }
    window.addEventListener("resize", resize);
    resize();

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);

    const hexToRgb = (hex: string): [number, number, number] => {
      const cleanHex = hex.replace("#", "");
      const num = parseInt(cleanHex, 16);
      return [
        ((num >> 16) & 255) / 255,
        ((num >> 8) & 255) / 255,
        (num & 255) / 255,
      ];
    };

    const palette = particleColors.map(hexToRgb);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * particleSpread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * particleSpread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * particleSpread;

      randoms[i * 4 + 0] = Math.random();
      randoms[i * 4 + 1] = Math.random();
      randoms[i * 4 + 2] = Math.random();
      randoms[i * 4 + 3] = Math.random();

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3 + 0] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });

    const vertexShader = /* glsl */ `
      attribute vec3 position;
      attribute vec4 random;
      attribute vec3 color;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;
      uniform float uBaseSize;
      uniform vec2 uMouse;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = color;
        vec3 pos = position;

        pos.x += sin(uTime * ${speed.toFixed(3)} + random.x * 6.28) * 0.2;
        pos.y += cos(uTime * ${speed.toFixed(3)} + random.y * 6.28) * 0.2;
        pos.z += sin(uTime * ${speed.toFixed(3)} + random.z * 6.28) * 0.2;

        if (${moveParticlesOnHover ? "true" : "false"}) {
          pos.x += uMouse.x * 0.5;
          pos.y += uMouse.y * 0.5;
        }

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        gl_PointSize = (uBaseSize / -mvPosition.z) * (0.8 + random.w * 0.5);
        vAlpha = ${alphaParticles ? "0.3 + 0.7 * random.w" : "1.0"};
      }
    `;

    const fragmentShader = /* glsl */ `
      precision highp float;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec2 uv = gl_PointCoord.xy - vec2(0.5);
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
        gl_FragColor = vec4(vColor, alpha);
      }
    `;

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBaseSize: { value: particleBaseSize },
        uMouse: { value: [0, 0] },
      },
      transparent: true,
      depthTest: false,
    });

    const particlesMesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = -y * 2;
    };

    if (moveParticlesOnHover) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    let animationFrameId: number;
    function update(t: number) {
      animationFrameId = requestAnimationFrame(update);
      const time = t * 0.001;
      program.uniforms.uTime.value = time;
      program.uniforms.uMouse.value[0] += (mouseX - program.uniforms.uMouse.value[0]) * 0.05;
      program.uniforms.uMouse.value[1] += (mouseY - program.uniforms.uMouse.value[1]) * 0.05;

      if (!disableRotation) {
        particlesMesh.rotation.y = time * 0.05;
      }

      renderer.render({ scene: particlesMesh, camera });
    }

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      if (moveParticlesOnHover) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
      if (container && gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
    };
  }, [
    particleColors,
    particleCount,
    particleSpread,
    speed,
    particleBaseSize,
    moveParticlesOnHover,
    alphaParticles,
    disableRotation,
    pixelRatio,
  ]);

  return <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`} />;
}

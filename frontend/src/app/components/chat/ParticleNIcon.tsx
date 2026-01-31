"use client";

import { useRef, useEffect, useCallback } from "react";

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  ease: number;
  friction: number;
  flicker: number;
}

interface ParticleNIconProps {
  size?: number;
  className?: string;
}

/**
 * ParticleNIcon - Interactive particle-based "N" logo animation
 * Particles react to mouse movement and return to form the letter
 */
export default function ParticleNIcon({ size = 56, className = "" }: ParticleNIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 20 });
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Create a particle
  const createParticle = useCallback((x: number, y: number, color: string): Particle => ({
    originX: x,
    originY: y,
    x,
    y,
    vx: 0,
    vy: 0,
    size: size > 50 ? 1.8 : 1.4, // Adjust particle size based on container size
    color,
    ease: 0.1,
    friction: 0.9,
    flicker: Math.random() * 0.3 + 0.7,
  }), [size]);

  // Initialize particles from the "N" letter
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;
    particlesRef.current = [];

    // Render "N" to get pixel data
    ctx.fillStyle = "white";
    const fontSize = Math.floor(size * 0.7);
    ctx.font = `900 ${fontSize}px "Arial Black", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("N", canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sample pixels and create particles
    const step = size > 50 ? 2.2 : 1.8; // Adjust density based on size
    const leftBound = size * 0.22;
    const rightBound = size * 0.78;

    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const index = (Math.floor(y) * 4 * canvas.width) + (Math.floor(x) * 4) + 3;
        if (imageData.data[index] > 128) {
          // Calculate relative position for coloring
          const relativeX = (x - leftBound) / (rightBound - leftBound);

          let color: string;
          if (relativeX < 0.28) {
            color = "#EF4444"; // Red (Left Stem)
          } else if (relativeX > 0.72) {
            color = "#FFFFFF"; // White (Right Stem)
          } else {
            color = "#3B82F6"; // Blue (Diagonal)
          }

          particlesRef.current.push(createParticle(x, y, color));
        }
      }
    }
  }, [size, createParticle]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "screen";

    const mouse = mouseRef.current;
    const currentTime = Date.now();

    particlesRef.current.forEach((p) => {
      // Mouse interaction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        p.vx -= Math.cos(angle) * force * 4;
        p.vy -= Math.sin(angle) * force * 4;
      }

      // Return to origin with easing
      p.vx += (p.originX - p.x) * p.ease;
      p.vy += (p.originY - p.y) * p.ease;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.x += p.vx;
      p.y += p.vy;

      // Flicker effect
      p.flicker = Math.sin((currentTime - startTimeRef.current) * 0.008 + p.originX) * 0.15 + 0.85;

      // Draw particle
      ctx.globalAlpha = p.flicker;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouseRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height);
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
  }, []);

  // Initialize and start animation
  useEffect(() => {
    initParticles();
    startTimeRef.current = Date.now();
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initParticles, animate]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      initParticles();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initParticles]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Subtle glow background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)",
        }}
      />
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="relative z-10"
        style={{ width: size, height: size }}
      />
    </div>
  );
}

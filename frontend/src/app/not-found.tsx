'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  opacity: number;
}

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 250 });
  const animationFrameRef = useRef<number | null>(null);

  // Grid configuration
  const gap = 35;
  const friction = 0.92;
  const ease = 0.08;

  const createParticle = useCallback((x: number, y: number): Particle => ({
    x,
    y,
    originX: x,
    originY: y,
    vx: 0,
    vy: 0,
    opacity: Math.random() * 0.5 + 0.2,
  }), []);

  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particles: Particle[] = [];
    for (let y = 0; y < canvas.height + gap; y += gap) {
      for (let x = 0; x < canvas.width + gap; x += gap) {
        particles.push(createParticle(x, y));
      }
    }
    particlesRef.current = particles;
  }, [createParticle, gap]);

  const updateParticle = useCallback((particle: Particle) => {
    const mouse = mouseRef.current;
    const dx = mouse.x - particle.x;
    const dy = mouse.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      const force = (mouse.radius - distance) / mouse.radius;
      const angle = Math.atan2(dy, dx);
      const push = force * 8;

      particle.vx -= Math.cos(angle) * push;
      particle.vy -= Math.sin(angle) * push;
    }

    // Smooth return to grid
    particle.vx += (particle.originX - particle.x) * ease;
    particle.vy += (particle.originY - particle.y) * ease;

    particle.vx *= friction;
    particle.vy *= friction;

    particle.x += particle.vx;
    particle.y += particle.vy;
  }, [ease, friction]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    const cols = Math.ceil(canvas.width / gap) + 1;

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      updateParticle(particle);

      // Draw particle
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      ctx.beginPath();
      ctx.fillRect(particle.x, particle.y, 1.2, 1.2);

      // Calculate distance to mouse for line color
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius * 1.5) {
        ctx.strokeStyle = `rgba(66, 133, 244, ${0.15 * (1 - dist / (mouse.radius * 1.5))})`;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      }

      // Draw horizontal line to next particle
      if ((i + 1) % cols !== 0 && i + 1 < particles.length) {
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particles[i + 1].x, particles[i + 1].y);
        ctx.stroke();
      }

      // Draw vertical line to particle below
      if (i + cols < particles.length) {
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particles[i + cols].x, particles[i + cols].y);
        ctx.stroke();
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [gap, updateParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Handle touch events for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    // Initialize
    handleResize();
    animate();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate, initParticles]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Canvas for animated grid */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-1"
      />

      {/* Content overlay */}
      <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center h-screen text-center">
        {/* Large 404 background text */}
        <h1 
          className="text-[12rem] md:text-[20rem] font-black text-white leading-none tracking-tighter opacity-[0.03] select-none"
          style={{ textShadow: '0 0 50px rgba(66, 133, 244, 0.2)' }}
        >
          404
        </h1>

        {/* Main content */}
        <div className="-mt-16 md:-mt-24 px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            System Offline.
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
            The coordinates you entered do not exist. <br />
            The grid is distorting.
          </p>
          <Link
            href="/"
            className="pointer-events-auto inline-block px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-[#4285F4] hover:text-white transition-all duration-500 transform hover:scale-105"
            style={{ boxShadow: '0 0 30px rgba(255, 255, 255, 0.1)' }}
          >
            Return to Surface
          </Link>
        </div>
      </div>
    </div>
  );
}

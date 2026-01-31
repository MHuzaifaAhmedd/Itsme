"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import ChatDrawer from "./ChatDrawer";
import ParticleNIcon from "./ParticleNIcon";

// Client-side mount detection using useSyncExternalStore (avoids setState in effect)
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * ChatWidget - Floating particle N icon that opens the chat drawer
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const containerRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const closeIconRef = useRef<SVGSVGElement>(null);

  // Mount check (using useSyncExternalStore to avoid setState in effect)
  const isMounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  // Listen for heroLoaded event from the main page
  useEffect(() => {
    if (!isMounted) return;

    const handleHeroLoaded = () => {
      setHeroLoaded(true);
    };

    // Check if hero already loaded (in case event fired before listener was attached)
    // For pages without a hero section (like case study pages), show after a timeout
    const fallbackTimer = setTimeout(() => {
      setHeroLoaded(true);
    }, 3000); // Fallback after 3s for pages without heroLoaded event

    window.addEventListener("heroLoaded", handleHeroLoaded);
    
    return () => {
      window.removeEventListener("heroLoaded", handleHeroLoaded);
      clearTimeout(fallbackTimer);
    };
  }, [isMounted]);

  // Entrance animation - only triggers after hero has loaded
  useEffect(() => {
    if (!containerRef.current || !isMounted || !heroLoaded) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(containerRef.current, { opacity: 1, scale: 1 });
      return;
    }

    // Initial state (already set via CSS, but ensure it's set)
    gsap.set(containerRef.current, { opacity: 0, scale: 0.8 });

    // Entrance animation - no additional delay needed since we wait for heroLoaded
    gsap.to(containerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      delay: 0.1, // Small delay for visual polish
      ease: "back.out(1.7)",
    });
  }, [isMounted, heroLoaded]);

  // Icon swap animation
  useEffect(() => {
    if (!iconRef.current || !closeIconRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(iconRef.current, { opacity: isOpen ? 0 : 1, rotate: 0 });
      gsap.set(closeIconRef.current, { opacity: isOpen ? 1 : 0, rotate: 0 });
      return;
    }

    if (isOpen) {
      gsap.to(iconRef.current, {
        opacity: 0,
        rotate: 90,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(closeIconRef.current, {
        opacity: 1,
        rotate: 0,
        duration: 0.2,
        delay: 0.1,
        ease: "power2.out",
      });
    } else {
      gsap.to(closeIconRef.current, {
        opacity: 0,
        rotate: -90,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(iconRef.current, {
        opacity: 1,
        rotate: 0,
        duration: 0.2,
        delay: 0.1,
        ease: "power2.out",
      });
    }
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Keyboard shortcut (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Don't render until both mounted and hero has loaded
  // This prevents any flicker during the loading animation
  if (!isMounted || !heroLoaded) return null;

  return (
    <>
      {/* Floating Particle N - No background, just particles */}
      <button
        ref={containerRef}
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-transparent border-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-950 rounded-lg opacity-0"
        style={{ width: 64, height: 64 }}
        aria-label={isOpen ? "Close chat" : "Open chat with NEXI"}
        aria-expanded={isOpen}
        aria-controls="nexi-chat-drawer"
      >
        {/* Particle N Icon - visible when chat is closed */}
        <div
          ref={iconRef}
          className="absolute inset-0 flex items-center justify-center transition-transform hover:scale-110"
          aria-hidden="true"
        >
          <ParticleNIcon size={64} />
        </div>

        {/* Close Icon - visible when chat is open */}
        <svg
          ref={closeIconRef}
          className="absolute h-8 w-8 opacity-0 text-white drop-shadow-lg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Chat Drawer Portal */}
      {createPortal(
        <ChatDrawer isOpen={isOpen} onClose={handleClose} />,
        document.body
      )}
    </>
  );
}

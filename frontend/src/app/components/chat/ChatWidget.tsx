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
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const closeIconRef = useRef<SVGSVGElement>(null);

  // Mount check (using useSyncExternalStore to avoid setState in effect)
  const isMounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current || !isMounted) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(containerRef.current, { opacity: 1, scale: 1 });
      return;
    }

    // Initial state
    gsap.set(containerRef.current, { opacity: 0, scale: 0.8 });

    // Entrance animation with slight delay
    gsap.to(containerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      delay: 1, // Wait for page to settle
      ease: "back.out(1.7)",
    });
  }, [isMounted]);

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

  if (!isMounted) return null;

  return (
    <>
      {/* Floating Particle Icon Button */}
      <button
        ref={containerRef as React.RefObject<HTMLButtonElement>}
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 shadow-lg shadow-black/50 transition-all hover:border-neutral-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-950 md:h-16 md:w-16"
        aria-label={isOpen ? "Close chat" : "Open chat with NEXI"}
        aria-expanded={isOpen}
        aria-controls="nexi-chat-drawer"
      >
        {/* Particle N Icon */}
        <div
          ref={iconRef}
          className="absolute flex items-center justify-center"
          aria-hidden="true"
        >
          <ParticleNIcon size={48} />
        </div>

        {/* Close Icon */}
        <svg
          ref={closeIconRef}
          className="absolute h-6 w-6 opacity-0 md:h-7 md:w-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
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

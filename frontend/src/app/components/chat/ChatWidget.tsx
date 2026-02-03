"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import ChatDrawer from "./ChatDrawer";
import ParticleNIcon from "./ParticleNIcon";
import { playNexiVoiceGreetingIfFirstTime } from "./nexiVoiceGreeting";

// Client-side mount detection using useSyncExternalStore (avoids setState in effect)
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * ChatWidget - Floating particle N icon that opens the chat drawer.
 * Shows "Ask NEXI AI" pill on load, synced with N entrance; optional soft glow around N.
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const closeIconRef = useRef<SVGSVGElement>(null);
  const arrowLoopRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);

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

  // Entrance animation - wrapper + N + pill, synced; only after hero has loaded
  useEffect(() => {
    if (!wrapperRef.current || !isMounted || !heroLoaded) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(wrapperRef.current, { opacity: 1 });
      gsap.set(containerRef.current, { opacity: 1, scale: 1 });
      if (pillRef.current) gsap.set(pillRef.current, { opacity: 1, y: 0 });
      if (arrowRef.current) gsap.set(arrowRef.current, { scaleY: 0, height: 0, overflow: "hidden" });
      return;
    }

    // Initial state: wrapper and pill hidden, N scaled down, arrow collapsed
    gsap.set(wrapperRef.current, { opacity: 0 });
    gsap.set(containerRef.current, { opacity: 1, scale: 0.8 });
    if (pillRef.current) gsap.set(pillRef.current, { opacity: 0, y: -8 });
    if (arrowRef.current) gsap.set(arrowRef.current, { scaleY: 0, transformOrigin: "top center", overflow: "hidden" });

    const tl = gsap.timeline({ delay: 0.1 });
    tl.to(wrapperRef.current, {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    });
    tl.to(
      containerRef.current,
      {
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
      "-=0.2"
    );
    tl.to(
      pillRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.35"
    );
    // Arrow: first draw (extend down toward N) - then loop continues in arrowLoopRef
    tl.to(
      arrowRef.current,
      {
        scaleY: 1,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.15"
    );
  }, [isMounted, heroLoaded]);

  // Arrow continuous loop: draw → hold → close → reset → repeat
  useEffect(() => {
    if (!arrowRef.current || !heroLoaded || !isMounted) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const arrow = arrowRef.current;
    const holdDuration = 1.8;
    const startDelay = 2500; // Start loop after first "point" (entrance + hold)

    const t = setTimeout(() => {
      if (!arrowRef.current) return;

      const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });
      // Hold (arrow already visible from entrance)
      loop.to({}, { duration: holdDuration });
      // Close: retract upward
      loop.to(arrow, {
        scaleY: 0,
        opacity: 0,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        margin: 0,
        duration: 0.4,
        ease: "power2.in",
        overflow: "hidden",
      });
      // Reset for next cycle
      loop.set(arrow, {
        height: 28,
        opacity: 1,
        paddingTop: "",
        paddingBottom: "",
        margin: "",
      });
      // Draw: extend down toward N
      loop.to(arrow, {
        scaleY: 1,
        duration: 0.35,
        ease: "power2.out",
      });

      arrowLoopRef.current = loop;
    }, startDelay);

    return () => {
      clearTimeout(t);
      arrowLoopRef.current?.kill();
      arrowLoopRef.current = null;
    };
  }, [isMounted, heroLoaded]);

  // Icon swap animation + pill visibility (hide pill when drawer open)
  useEffect(() => {
    if (!iconRef.current || !closeIconRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (pillRef.current) {
      gsap.to(pillRef.current, {
        opacity: isOpen ? 0 : 1,
        duration: 0.25,
        ease: "power2.out",
      });
    }

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
    const willOpen = !isOpen;
    if (willOpen) {
      playNexiVoiceGreetingIfFirstTime();
    }
    setIsOpen(willOpen);
  }, [isOpen]);

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
      {/* Wrapper: pill above N + arrow to N, entrance synced */}
      <div
        ref={wrapperRef}
        className="nexi-widget-wrapper fixed bottom-6 right-6 z-50 flex flex-col items-center gap-0 opacity-0"
        aria-hidden="true"
      >
        {/* Callout: pill + arrow (both hide when drawer opens) */}
        <div ref={pillRef} className="nexi-callout flex flex-col items-center">
          {/* "Ask NEXI AI" bubble - glassmorphic, floating */}
          <div
            className="nexi-ask-bubble pointer-events-none flex items-center justify-center rounded-[1.25rem] px-4 py-2.5 text-xs font-semibold tracking-tight text-white/95 backdrop-blur-xl sm:text-[13px]"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.12), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            Ask NEXI AI
          </div>
          {/* Arrow: draws down toward N, then closes (retracts upward) */}
          <div
            ref={arrowRef}
            className="nexi-arrow pointer-events-none flex h-7 shrink-0 items-center justify-center overflow-hidden py-0.5"
            aria-hidden="true"
            style={{ minHeight: 28 }}
          >
            <svg
              width="16"
              height="22"
              viewBox="0 0 16 22"
              fill="none"
              className="text-white/40"
            >
              <line
                x1="8"
                y1="0"
                x2="8"
                y2="12"
                stroke="currentColor"
                strokeOpacity="0.5"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
              <path
                d="M8 22L2 13h12L8 22z"
                fill="currentColor"
                fillOpacity="0.7"
              />
            </svg>
          </div>
        </div>

        {/* N button with optional soft glow */}
        <div className="nexi-n-glow relative flex items-center justify-center rounded-xl">
          <button
            ref={containerRef}
            onClick={handleToggle}
            className="flex h-16 w-16 items-center justify-center rounded-xl border-none bg-transparent cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
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
        </div>
      </div>

      {/* Chat Drawer Portal */}
      {createPortal(
        <ChatDrawer isOpen={isOpen} onClose={handleClose} />,
        document.body
      )}
    </>
  );
}

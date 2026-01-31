"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import ChatDrawer from "./ChatDrawer";

// Client-side mount detection using useSyncExternalStore (avoids setState in effect)
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * ChatWidget - Floating chat bubble that opens the chat drawer
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const closeIconRef = useRef<SVGSVGElement>(null);

  // Mount check for portal (using useSyncExternalStore to avoid setState in effect)
  const isMounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  // Entrance animation
  useEffect(() => {
    if (!buttonRef.current || !isMounted) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(buttonRef.current, { opacity: 1, scale: 1 });
      return;
    }

    // Initial state
    gsap.set(buttonRef.current, { opacity: 0, scale: 0.8 });

    // Entrance animation with slight delay
    gsap.to(buttonRef.current, {
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
    if (hasNewMessage) setHasNewMessage(false);
  }, [hasNewMessage]);

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
      {/* Floating Chat Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-950 md:h-16 md:w-16"
        aria-label={isOpen ? "Close chat" : "Open chat with NEXI"}
        aria-expanded={isOpen}
        aria-controls="nexi-chat-drawer"
      >
        {/* Chat Icon */}
        <svg
          ref={iconRef}
          className="absolute h-6 w-6 md:h-7 md:w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>

        {/* Close Icon */}
        <svg
          ref={closeIconRef}
          className="absolute h-6 w-6 opacity-0 md:h-7 md:w-7"
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

        {/* New Message Indicator */}
        {hasNewMessage && !isOpen && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
            1
          </span>
        )}
      </button>

      {/* Chat Drawer Portal */}
      {createPortal(
        <ChatDrawer isOpen={isOpen} onClose={handleClose} />,
        document.body
      )}
    </>
  );
}

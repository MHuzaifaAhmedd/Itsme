"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";

interface AnimatedHeadlineProps {
  text: string;
  subtitle?: string;
  className?: string;
}

export interface AnimatedHeadlineRef {
  startAnimation: () => void;
}

const AnimatedHeadline = forwardRef<AnimatedHeadlineRef, AnimatedHeadlineProps>(
  ({ text, subtitle, className = "" }, ref) => {
    const [displayText, setDisplayText] = useState("");
    const [subtitleText, setSubtitleText] = useState("");
    const [showCursor, setShowCursor] = useState(false);
    const [showSubtitleCursor, setShowSubtitleCursor] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const subtitleCursorRef = useRef<HTMLSpanElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    const startAnimation = () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Reset state
      setDisplayText("");
      setSubtitleText("");
      setShowCursor(false);
      setShowSubtitleCursor(false);

      const timeline = gsap.timeline();

      // Fade in container
      timeline.to(containerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      // Show cursor immediately for headline
      timeline.call(() => {
        setShowCursor(true);
      });

      // Typewriter effect for headline (faster)
      for (let i = 0; i <= text.length; i++) {
        timeline.call(() => {
          setDisplayText(text.slice(0, i));
        }, undefined, i * 0.03);
      }

      // Hide headline cursor
      timeline.call(() => {
        setShowCursor(false);
      });

      // If subtitle exists, animate it after a brief pause
      if (subtitle) {
        timeline.to({}, { duration: 0.3 });

        // Show subtitle cursor
        timeline.call(() => {
          setShowSubtitleCursor(true);
        });

        // Typewriter effect for subtitle (slower)
        for (let i = 0; i <= subtitle.length; i++) {
          timeline.call(() => {
            setSubtitleText(subtitle.slice(0, i));
          }, undefined, i * 0.08);
        }

        // Hide subtitle cursor at end
        timeline.call(() => {
          setShowSubtitleCursor(false);
        });
      }

      timelineRef.current = timeline;
    };

    useImperativeHandle(ref, () => ({
      startAnimation,
    }));

    // Blinking cursor effect for headline
    useEffect(() => {
      if (!showCursor || !cursorRef.current) return;

      // Set initial opacity
      gsap.set(cursorRef.current, { opacity: 1 });

      const cursorAnimation = gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      return () => {
        cursorAnimation.kill();
      };
    }, [showCursor]);

    // Blinking cursor effect for subtitle
    useEffect(() => {
      if (!showSubtitleCursor || !subtitleCursorRef.current) return;

      // Set initial opacity
      gsap.set(subtitleCursorRef.current, { opacity: 1 });

      const cursorAnimation = gsap.to(subtitleCursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      return () => {
        cursorAnimation.kill();
      };
    }, [showSubtitleCursor]);

    // Initial state
    useEffect(() => {
      if (containerRef.current) {
        gsap.set(containerRef.current, {
          opacity: 0,
          y: -20,
        });
      }
    }, []);

    return (
      <div
        ref={containerRef}
        className={`${className} flex flex-col`}
      >
        <h2
          ref={textRef}
          className="text-3xl md:text-4xl lg:text-5xl font-normal text-neutral-100 tracking-[0.06em] leading-tight font-mono"
        >
          {displayText}
          {showCursor && (
            <span
              ref={cursorRef}
              className="inline-block w-0.5 h-[1em] bg-neutral-200 ml-1 align-middle"
            />
          )}
        </h2>
        {subtitle && (
          <p
            ref={subtitleRef}
            className="mt-4 text-sm md:text-base lg:text-lg font-normal text-neutral-300 tracking-[0.06em] leading-relaxed font-mono"
          >
            {subtitleText}
            {showSubtitleCursor && (
              <span
                ref={subtitleCursorRef}
                className="inline-block w-0.5 h-[1em] bg-neutral-400 ml-1 align-middle"
              />
            )}
          </p>
        )}
      </div>
    );
  }
);

AnimatedHeadline.displayName = "AnimatedHeadline";

export default AnimatedHeadline;

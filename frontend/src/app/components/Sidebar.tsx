"use client";

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const emptySubscribe = () => () => {};
function useClientMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "#home", icon: "⌂" },
  { label: "About Me", href: "#about", icon: "◐" },
  { label: "Projects", href: "#projects", icon: "◉" },
  { label: "Testimonials", href: "#testimonials", icon: "◈" },
  { label: "Footer", href: "#footer", icon: "▾" },
];

const OPEN_DURATION = 0.9;
const CLOSE_DURATION = 0.6;
const STAGGER_DELAY = 0.06;
const EASE_OPEN = "power4.out";
const EASE_CLOSE = "power4.in";

/** Sidebar slide uses CSS (no GSAP) so it always renders visibly. Overlay, content push, nav stagger, hamburger use GSAP. */
export interface SidebarProps {
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

export default function Sidebar({ contentRef }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const mounted = useClientMounted();
  const prevOpenRef = useRef<boolean | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);
  const bar1Ref = useRef<HTMLSpanElement>(null);
  const bar2Ref = useRef<HTMLSpanElement>(null);
  const bar3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      const sections = ["#home", "#about", "#projects", "#testimonials", "#footer"];

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.querySelector(section);
        if (element) {
          const { offsetTop } = element as HTMLElement;
          if (scrollPosition >= offsetTop - 100) {
            setActiveSection(section);
            return;
          }
        }
      }
      setActiveSection("#home");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (href === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setIsOpen(false);
    },
    []
  );

  useEffect(() => {
    const overlay = overlayRef.current;
    const navList = navListRef.current;
    const bar1 = bar1Ref.current;
    const bar2 = bar2Ref.current;
    const bar3 = bar3Ref.current;
    const content = contentRef?.current;

    if (!overlay || !navList || !bar1 || !bar2 || !bar3) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile =
      typeof window !== "undefined" && window.innerWidth < 768;

    const durationOpen = prefersReducedMotion ? 0.3 : OPEN_DURATION;
    const durationClose = prefersReducedMotion ? 0.2 : CLOSE_DURATION;
    const stagger = prefersReducedMotion ? 0 : STAGGER_DELAY;
    const easeOpen = prefersReducedMotion ? "power2.out" : EASE_OPEN;
    const easeClose = prefersReducedMotion ? "power2.in" : EASE_CLOSE;
    const applyPush = !isMobile && !!content;

    const navItemsEls = Array.from(navList.children) as HTMLElement[];

    if (prevOpenRef.current === null) {
      gsap.set(overlay, { opacity: 0 });
      gsap.set(navItemsEls, { opacity: 0, y: 12 });
      gsap.set(bar1, { y: 0, rotate: 0 });
      gsap.set(bar2, { opacity: 1 });
      gsap.set(bar3, { y: 0, rotate: 0 });
      if (content) gsap.set(content, { scale: 1, xPercent: 0 });
      prevOpenRef.current = false;
      return;
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";

      const tl = gsap.timeline({ defaults: { ease: easeOpen } });

      tl.to(overlay, {
        opacity: 1,
        duration: durationOpen * 0.4,
      });

      if (applyPush && content) {
        tl.to(
          content,
          {
            scale: 0.97,
            xPercent: -4,
            duration: durationOpen,
            ease: "expo.out",
            overwrite: true,
            force3D: true,
          },
          0
        );
      }

      tl.fromTo(
        navItemsEls,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: durationOpen * 0.5,
          stagger,
          ease: "power3.out",
          overwrite: true,
        },
        0.15
      );

      tl.to(
        bar1,
        { y: 8, rotate: 45, duration: durationOpen * 0.4, ease: "power3.out" },
        0
      );
      tl.to(
        bar2,
        { opacity: 0, duration: durationOpen * 0.2, ease: "power2.out" },
        0
      );
      tl.to(
        bar3,
        { y: -8, rotate: -45, duration: durationOpen * 0.4, ease: "power3.out" },
        0
      );
    } else {
      const tl = gsap.timeline({
        defaults: { ease: easeClose },
        onComplete: () => {
          document.body.style.overflow = "";
        },
      });

      tl.to(overlay, {
        opacity: 0,
        duration: durationClose * 0.6,
      });

      if (applyPush && content) {
        tl.to(
          content,
          {
            scale: 1,
            xPercent: 0,
            duration: durationClose,
            ease: "power4.in",
            overwrite: true,
            force3D: true,
          },
          0
        );
      }

      tl.to(
        bar1,
        { y: 0, rotate: 0, duration: durationClose * 0.5, ease: "power3.in" },
        0
      );
      tl.to(
        bar2,
        { opacity: 1, duration: durationClose * 0.4, delay: durationClose * 0.2 },
        0
      );
      tl.to(
        bar3,
        { y: 0, rotate: 0, duration: durationClose * 0.5, ease: "power3.in" },
        0
      );
    }

    prevOpenRef.current = isOpen;

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, contentRef, mounted]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handleOverlayClick = useCallback(() => setIsOpen(false), []);
  const handleToggle = useCallback(() => setIsOpen((o) => !o), []);

  const overlayAndSidebar = (
    <>
      <div
        ref={overlayRef}
        role="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={handleOverlayClick}
        className="fixed inset-0 z-[9998] cursor-default bg-neutral-950/50 opacity-0 backdrop-blur-[20px]"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      />

      <aside
        ref={sidebarRef}
        className={`fixed right-0 top-0 z-[9999] h-full w-full min-w-0 border-l border-neutral-800/50 bg-neutral-950/90 shadow-[-20px_0_60px_rgba(0,0,0,0.35)] backdrop-blur-[20px] md:w-[40vw] md:min-w-[280px] md:max-w-[420px] md:rounded-l-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(18,18,18,0.95) 0%, rgba(10,10,10,0.98) 100%)",
          transition: isOpen
            ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)"
            : "transform 0.6s cubic-bezier(0.33, 0, 0.2, 1)",
        }}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-neutral-800/50 p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-linear-to-br from-neutral-800 to-neutral-900">
                <span className="text-lg">◉</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-100">
                  Portfolio
                </h2>
                <p className="text-xs text-neutral-500">Studio</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-6">
            <ul ref={navListRef} className="space-y-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-neutral-900/80 text-neutral-100"
                          : "text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-neutral-200" />
                      )}
                      {item.icon && (
                        <span className="text-base opacity-60">{item.icon}</span>
                      )}
                      <span>{item.label}</span>
                      <span
                        className={`ml-auto h-1.5 w-1.5 rounded-full bg-neutral-200 transition-opacity ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-neutral-800/50 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span>New York</span>
                <span className="h-1 w-1 rounded-full bg-neutral-600" />
                <span>Remote</span>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 text-neutral-400 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200"
                  aria-label="GitHub"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 text-neutral-400 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200"
                  aria-label="LinkedIn"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="mailto:hello@studio.com"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 text-neutral-400 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200"
                  aria-label="Email"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );

  return (
    <>
      <button
        onClick={handleToggle}
        className="fixed top-6 right-6 z-[10000] flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950/90 backdrop-blur-sm transition-colors hover:border-neutral-700 hover:bg-neutral-900/90"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <div className="relative h-5 w-5 overflow-hidden">
          <span
            ref={bar1Ref}
            className="absolute left-0 top-0 h-0.5 w-5 origin-center bg-neutral-200"
          />
          <span
            ref={bar2Ref}
            className="absolute left-0 top-2 h-0.5 w-5 bg-neutral-200"
          />
          <span
            ref={bar3Ref}
            className="absolute left-0 top-4 h-0.5 w-5 origin-center bg-neutral-200"
          />
        </div>
      </button>

      {mounted && typeof document !== "undefined" && createPortal(overlayAndSidebar, document.body)}
    </>
  );
}

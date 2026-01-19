"use client";

import { useEffect, useState } from "react";

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

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      const sections = ["#home", "#about", "#projects", "#testimonials", "#footer"];

      // Check sections in reverse order (bottom to top) to get the most relevant one
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.querySelector(section);
        if (element) {
          const { offsetTop, offsetHeight } = element as HTMLElement;
          if (scrollPosition >= offsetTop - 100) {
            setActiveSection(section);
            return;
          }
        }
      }
      
      // Fallback: if no section matches, default to home
      setActiveSection("#home");
    };

    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Menu Button - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-100 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950/80 backdrop-blur-sm transition-all hover:border-neutral-700 hover:bg-neutral-900/90"
        aria-label="Toggle menu"
      >
        <div className="relative h-5 w-5">
          <span
            className={`absolute left-0 top-0 h-0.5 w-5 bg-neutral-200 transition-all ${
              isOpen ? "top-2 rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-2 h-0.5 w-5 bg-neutral-200 transition-all ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-4 h-0.5 w-5 bg-neutral-200 transition-all ${
              isOpen ? "top-2 -rotate-45" : ""
            }`}
          />
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-90 bg-neutral-950/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Right side, hidden by default */}
      <aside
        className={`fixed right-0 top-0 z-95 h-full w-72 transform border-l border-neutral-900 bg-neutral-950/95 backdrop-blur-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand Section */}
          <div className="border-b border-neutral-900 p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-linear-to-br from-neutral-800 to-neutral-900">
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

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-neutral-900 text-neutral-100"
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

          {/* Footer Section */}
          <div className="border-t border-neutral-900 p-6">
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
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="mailto:hello@studio.com"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 text-neutral-400 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200"
                  aria-label="Email"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
}

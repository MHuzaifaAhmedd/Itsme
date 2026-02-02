import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidgetWrapper from "./components/chat/ChatWidgetWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Muhammad Huzaifa Ahmed - Full Stack Developer",
  description: "Portfolio of Muhammad Huzaifa Ahmed — Software Engineer & Full Stack Developer. MERN, Next.js, Django, AWS. Karachi, Pakistan. Open to remote.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Force scroll to top IMMEDIATELY on page load - before React hydrates
              // This prevents browser from restoring scroll position on reload
              if (typeof window !== 'undefined') {
                window.history.scrollRestoration = 'manual';
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                
                // Also handle DOMContentLoaded to catch any late scroll restoration attempts
                document.addEventListener('DOMContentLoaded', function() {
                  window.scrollTo(0, 0);
                  document.documentElement.scrollTop = 0;
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* NEXI AI Chatbot - Lazy loaded */}
        <ChatWidgetWrapper />
      </body>
    </html>
  );
}

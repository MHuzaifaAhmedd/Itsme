import type { NextConfig } from "next";

// Standalone output uses chunk filenames with '[' and ']', which are invalid on Windows.
// Only enable standalone on non-Windows (e.g. Docker/Linux) where it's used for deployment.
const nextConfig: NextConfig = {
  ...(process.platform !== "win32" && { output: "standalone" }),
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

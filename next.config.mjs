/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow access from local network IP for testing on other devices (like your phone)
  experimental: {
    allowedDevOrigins: ["10.28.225.28", "localhost"],
  },
};

export default nextConfig;

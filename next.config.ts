import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@react-pdf/renderer',
    '@react-pdf/font',
    '@react-pdf/layout',
    '@react-pdf/pdfkit',
    '@react-pdf/render',
    '@react-pdf/primitives',
    '@react-pdf/reconciler',
    '@react-pdf/fns',
  ],
};

export default nextConfig;

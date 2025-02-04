/** @type {import('next').NextConfig} */
const nextConfig = {
    serverComponentsExternalPackages: [
      'puppeteer-core',
      '@sparticuz/chromium-min',
    ],
};

export default nextConfig;

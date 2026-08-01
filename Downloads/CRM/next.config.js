/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore build-time errors on JSX files during type checking
    tsconfigPath: './tsconfig.json',
  },
};

module.exports = nextConfig;

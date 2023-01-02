/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "@codemirror/lang-html",
  "@codemirror/lang-javascript",
]);

const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
});

module.exports = nextConfig;

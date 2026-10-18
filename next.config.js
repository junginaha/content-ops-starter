/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    trailingSlash: true,
    reactStrictMode: true,
    allowedDevOrigins: [
        '192.168.1.84'
    ]
};

module.exports = nextConfig;

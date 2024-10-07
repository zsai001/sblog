/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        });
        return config;
    },
}

module.exports = nextConfig
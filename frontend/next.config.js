/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    // except for webpack, other parts are left as generated
    webpack: (config, context) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        }
        return config
    },
    images: {
        unoptimized: true
    }
}

module.exports = nextConfig

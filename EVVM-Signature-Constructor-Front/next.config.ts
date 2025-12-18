import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer, webpack }) => {
    // Externalize Node.js specific packages
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    
    // Ignore test dependencies from thread-stream that aren't installed
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(tap|tape|desm|fastbench|why-is-node-running|pino-elasticsearch)$/,
      })
    )
    
    // Exclude test directories from being processed
    config.module.rules.push({
      test: /\.(js|mjs)$/,
      include: /node_modules[\\/]thread-stream[\\/](test|bench)/,
      use: 'null-loader',
    })
    
    // Resolve fallbacks for browser environment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        worker_threads: false,
      }
    }
    
    return config
  },
  turbopack: {},
  serverExternalPackages: [
    'pino-pretty',
    'lokijs',
    'encoding',
    'thread-stream',
    'pino',
  ],
}

export default nextConfig

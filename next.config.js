/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Handle canvas dependency
    config.externals = [...(config.externals || []), { canvas: "canvas" }];

    // Handle PDF.js worker
    config.resolve.alias.canvas = false;
    
    return config;
  },
  // Add headers for PDF viewer
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 
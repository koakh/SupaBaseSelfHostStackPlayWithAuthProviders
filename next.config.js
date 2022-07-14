module.exports = {
  images: {
    domains: [],
  },
  // required for docker image
  output: 'standalone',
  // required to fix oryhydra provider type problem
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

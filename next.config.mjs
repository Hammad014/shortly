/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // Allows all domains
          port: '',
          pathname: '**',
        },
      ],
    },
  };
  
  export default nextConfig;
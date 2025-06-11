/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "m.media-amazon.com",  // ✅ ici tu ajoutes ce domaine
      "firebasestorage.googleapis.com" ,
      "lh3.googleusercontent.com" 
    ],
  },
};

module.exports = nextConfig;

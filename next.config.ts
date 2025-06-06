/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "m.media-amazon.com",  // ✅ ici tu ajoutes ce domaine
      "firebasestorage.googleapis.com"  // si tu utilises Firebase aussi
    ],
  },
};

module.exports = nextConfig;

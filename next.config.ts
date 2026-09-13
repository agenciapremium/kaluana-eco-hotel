import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
  },
  experimental: {
    // Currículo de até 4 MB (lib/curriculo.ts). O padrão das server actions é 1 MB, que
    // derrubava com erro 500 qualquer PDF acima disso. A Vercel limita o corpo a 4,5 MB.
    serverActions: { bodySizeLimit: "4.5mb" },
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        // O endereço *.vercel.app do deploy de produção é público e duplicaria o domínio no
        // índice. A Vercel já marca noindex nos deploys de pré-visualização; esta regra cobre o
        // de produção (docs/decisoes.md, etapa 6).
        source: "/(.*)",
        has: [{ type: "host", value: "(?<projeto>.+)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;

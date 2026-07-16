import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // 1. Racine de l'application unifiée (déploiement à la racine de ton domaine)
  base: "/",

  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons.svg"],
      manifest: {
        name: "Champion",
        short_name: "Champion",
        description: "N'oublie jamais que tu es un champion",
        theme_color: "#1E1E1E",
        background_color: "#1E1E1E",
        display: "standalone",
        orientation: "portrait",
        categories: ["utilities", "lifestyle"],

        start_url: "/app?source=pwa",

        dir: "ltr",
        lang: "fr-FR",

        // 3. CORRECTION : Accès direct aux icônes dans public/icons/
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icons-512-e.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],

        screenshots: [
          {
            src: "/screenshots/desktop1.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/screenshots/desktop2.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/screenshots/mobile1.png",
            sizes: "750x1334",
            type: "image/png",
            form_factor: "narrow",
          },
          {
            src: "/screenshots/mobile2.png",
            sizes: "750x1334",
            type: "image/png",
            form_factor: "narrow",
          },
        ],
      },
      workbox: {
        // Cible tous les fichiers compilés pour les mettre en cache hors-ligne
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff,woff2,ttf}"],
        maximumFileSizeToCacheInBytes: 3000000,
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
});

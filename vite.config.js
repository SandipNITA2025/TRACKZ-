import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Trackz",
        short_name: "Trackz",
        description:
          "",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/96.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/96.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});

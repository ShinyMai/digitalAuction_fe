import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["auctiondigital.mooo.com", "localhost"],
    port: 5173,
  },
  // Ensure environment variables are loaded properly
  envPrefix: "VITE_",
});

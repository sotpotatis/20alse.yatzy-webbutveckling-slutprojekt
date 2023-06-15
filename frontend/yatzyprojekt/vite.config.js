import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // Used to be: base: "/yatzy/" // Ändra så att hemsidan går att komma på på /yatzy
  base: "/yatzy",
  plugins: [react()],
  build: { // Had to change this to work with the hosting provider, Deta.space
    outDir: "./build",
    emptyOutDir: true
  }
});

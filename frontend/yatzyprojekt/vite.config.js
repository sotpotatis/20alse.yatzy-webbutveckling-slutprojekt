import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/yatzy/", // Ändra så att hemsidan går att komma på på /yatzy
  plugins: [react()],
});

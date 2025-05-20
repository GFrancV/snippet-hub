// @ts-check
import node from "@astrojs/node";
import clerk from "@clerk/astro";
import { dark } from "@clerk/themes";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://snippet-hub-psi.vercel.app",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    clerk({
      appearance: {
        baseTheme: dark,
      },
    }),
    react(),
  ],
  adapter: node({ mode: "standalone" }),
  output: "server",
});

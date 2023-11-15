import { defineConfig } from "vite";
import rakkas from "rakkasjs/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import { isoImport } from "vite-plugin-iso-import";

export default defineConfig({
  plugins: [tsconfigPaths(), rakkas(), isoImport()],
});

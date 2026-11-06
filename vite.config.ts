import { defineConfig, type Plugin } from "vite";

// Endereço público da extensão. O Owlbear não aceita caminhos relativos no
// manifest (falha com "Invalid URL"), então os endereços precisam ser completos.
const SITE_URL = process.env.SITE_URL ?? "https://igordigitos.github.io/caldronis-owlbear/";
const DEV_PORT = 5173;

function manifest(baseUrl: string) {
  const url = (path: string) => new URL(path, baseUrl).href;
  return {
    name: "Caldronis Owlbear",
    version: "0.0.1",
    manifest_version: 1,
    author: "IgorDigitos",
    description: "Ficha automática e rolagens no padrão Caldronis Dice.",
    homepage_url: "https://github.com/IgorDigitos/caldronis-owlbear",
    icon: url("icon.svg"),
    action: {
      title: "Caldronis",
      icon: url("icon.svg"),
      popover: url("index.html"),
      width: 360,
      height: 520,
    },
  };
}

function owlbearManifest(): Plugin {
  return {
    name: "owlbear-manifest",
    configureServer(server) {
      server.middlewares.use("/manifest.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(manifest(`http://localhost:${DEV_PORT}/`), null, 2));
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: JSON.stringify(manifest(SITE_URL), null, 2),
      });
    },
  };
}

export default defineConfig({
  // Caminhos relativos: o site funciona na raiz local e no subcaminho do GitHub Pages.
  base: "./",
  plugins: [owlbearManifest()],
  server: {
    port: DEV_PORT,
    strictPort: true,
    // O Owlbear carrega a extensão de outra origem.
    cors: true,
  },
});

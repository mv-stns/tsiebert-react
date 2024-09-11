import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import utwm from "unplugin-tailwindcss-mangle/vite";
// import dotenv from "dotenv";
// dotenv.config();

// https://vitejs.dev/config/
const _plugins = [];
_plugins.unshift(react());
_plugins.unshift(utwm());
export default defineConfig({
	plugins: _plugins,
	define: {
		"process.env": process.env,
	},
	resolve: {
		alias: {
			// eslint-disable-next-line no-undef
			"@": path.resolve(__dirname, "./src"),
			// resolve @views to src/views
			"@views": path.resolve(__dirname, "./src/views"),
			"@app": "./src/app",
			"@assets": "./src/assets",
			"@components": "./src/components",
			"@styles": "./src/styles",
			"@utils": "./src/utils",
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});

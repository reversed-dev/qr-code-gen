import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { VitePWA } from "vite-plugin-pwa"; // Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueJsx(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate", // Automatically update the service worker when new content is available
			includeAssets: [
				"favicon.ico",
				"apple-touch-icon.png",
				"masked-icon.svg",
				"example_qr.jpeg",
			], // Include assets to be cached
			manifest: {
				name: "QR Code Generator",
				short_name: "QRGen",
				description: "A Free and easy to use QR Code Generator",
				theme_color: "#ffffff", // Set a theme color
				background_color: "#ffffff", // Set a background color
				display: "standalone",
				scope: "/",
				start_url: "/",
				icons: [
					{
						src: "example_qr.jpeg", // Placeholder for maskable icon
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
			filename: "sw.js", // Service worker file name
			devOptions: {
				enabled: true, // Enable PWA in development mode
			}
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});

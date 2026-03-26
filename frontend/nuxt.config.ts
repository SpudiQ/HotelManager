// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	vite: {
		server: {
			watch: {
				usePolling: true, // NOTE: для Docker на Windows/Mac
				interval: 1000,
			},
			hmr: {
				protocol: "ws",
				host: "localhost",
				port: 24678,
			},
		},
	},
});

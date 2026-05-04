// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	runtimeConfig: {
		public: {
			apiBase: "http://localhost:3010/api",
		},
	},
	devtools: { enabled: true },
	css: ["~/assets/scss/main.scss"],
	app: {
		head: {
			link: [
				{ rel: "preconnect", href: "https://fonts.googleapis.com" },
				{ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap",
				},
			],
		},
	},
	components: [
		{ path: "~/components", pathPrefix: false },
		{ path: "~/modules/booking/components", pathPrefix: false },
		{ path: "~/modules/auth/components", pathPrefix: false },
		{ path: "~/modules/admin/components", pathPrefix: false },
	],
	// imports: { // выдает ошибку IPC connection closed
	// 	dirs: ["modules/booking/composables"],
	// },
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
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `
						@use "~/assets/scss/_colors.scss" as *;
						@use "~/assets/scss/_typography.scss" as *;
						@use "~/assets/scss/_mixins.scss" as *;
					`,
				},
			},
		},
	},
});

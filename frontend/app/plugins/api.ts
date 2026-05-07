import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(() => {
	const authStore = useAuthStore();
	const { token } = storeToRefs(authStore);

	const api = $fetch.create({
		baseURL: useRuntimeConfig().public.apiBase,

		onRequest({ options }) {
			if (token.value) {
				options.headers = {
					...options.headers,
					// @ts-ignore
					Authorization: `Bearer ${token.value}`,
				};
			}
		},
	});

	return { provide: { api } };
});

declare module "#app" {
	interface NuxtApp {
		$api: ReturnType<typeof $fetch.create>;
	}
}

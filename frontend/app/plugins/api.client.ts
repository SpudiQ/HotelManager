import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { useSnackbarStore } from "~/stores/snackbar";

export default defineNuxtPlugin(() => {
	const authStore = useAuthStore();
	const { token } = storeToRefs(authStore);
	const snackbar = useSnackbarStore();

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

		onResponseError({ response }) {
			const data = response._data as Record<string, unknown> | undefined;
			const message = (typeof data?.message === "string" ? data.message : null) ?? "Произошла ошибка";
			snackbar.show(message, "error");
		},
	});

	return { provide: { api } };
});

declare module "#app" {
	interface NuxtApp {
		$api: ReturnType<typeof $fetch.create>;
	}
}

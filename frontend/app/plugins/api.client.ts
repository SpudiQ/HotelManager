import { useAuth } from "~/modules/auth/composables/useAuth";
import { useSnackbar } from "~/composables/useSnackbar";

export default defineNuxtPlugin(() => {
	const { token } = useAuth();
	const { show } = useSnackbar();

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
			show(message, "error");
		},
	});

	return { provide: { api } };
});

declare module "#app" {
	interface NuxtApp {
		$api: ReturnType<typeof $fetch.create>;
	}
}

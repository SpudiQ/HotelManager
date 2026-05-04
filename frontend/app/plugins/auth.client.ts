import { useAuth } from "~/modules/auth/composables/useAuth";

export default defineNuxtPlugin(async () => {
	const { restore } = useAuth();
	await restore();
});

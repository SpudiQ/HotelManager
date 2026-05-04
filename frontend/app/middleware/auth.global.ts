import { useAuth } from "~/modules/auth/composables/useAuth";
import { isStaff } from "~/modules/auth/utils/roles";

export default defineNuxtRouteMiddleware((to) => {
	if (import.meta.server) return;

	const { isAuthenticated, role } = useAuth();
	const path = to.path;

	if (path.startsWith("/admin") && !isStaff(role.value)) {
		return navigateTo("/profile");
	}

	if (path === "/login" && isAuthenticated.value) {
		return navigateTo(isStaff(role.value) ? "/admin" : "/profile");
	}
});

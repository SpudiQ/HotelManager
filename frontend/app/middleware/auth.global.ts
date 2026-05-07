import { useAuthStore } from "~/stores/auth";
import { isStaff } from "~/modules/auth/utils/roles";

export default defineNuxtRouteMiddleware((to) => {
	const auth = useAuthStore();
	const path = to.path;

	if (path.startsWith("/admin") && !isStaff(auth.role)) {
		return navigateTo("/profile");
	}

	if (path === "/login" && auth.isAuthenticated) {
		return navigateTo(isStaff(auth.role) ? "/admin" : "/profile");
	}
});

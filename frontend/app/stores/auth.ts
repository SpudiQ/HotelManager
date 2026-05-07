import { defineStore } from "pinia";
import { type LoginCredentials, type User, Role } from "~/modules/auth/types/auth";
import { fetchMe, login as loginRequest, logout as logoutRequest } from "~/modules/auth/api/auth";

const AUTH_TOKEN_COOKIE = "hm_auth_token";
const AUTH_USER_COOKIE = "hm_auth_user";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const isTokenExpired = (token: string): boolean => {
	try {
		const part = token.split(".")[1];
		if (!part) return true;
		const payload = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
		return (payload.exp as number) * 1000 < Date.now();
	} catch {
		return true;
	}
};

export const useAuthStore = defineStore("auth", () => {
	const token = useCookie<string | null>(AUTH_TOKEN_COOKIE, {
		default: () => null,
		sameSite: "lax",
		maxAge: COOKIE_MAX_AGE,
	});
	const user = useCookie<User | null>(AUTH_USER_COOKIE, {
		default: () => null,
		sameSite: "lax",
		maxAge: COOKIE_MAX_AGE,
	});
	const isLoading = ref(false);

	if (token.value && isTokenExpired(token.value)) {
		token.value = null;
		user.value = null;
	}

	const role = computed<Role>(() => user.value?.role ?? Role.GUEST);
	const isAuthenticated = computed(() => !!user.value && !!token.value);

	async function login(credentials: LoginCredentials): Promise<void> {
		isLoading.value = true;
		try {
			const { access_token } = await loginRequest(credentials);
			token.value = access_token;
			user.value = await fetchMe();
		} finally {
			isLoading.value = false;
		}
	}

	async function logout(): Promise<void> {
		isLoading.value = true;
		try {
			await logoutRequest();
		} finally {
			token.value = null;
			user.value = null;
			isLoading.value = false;
		}
	}

	function clearSession(): void {
		token.value = null;
		user.value = null;
	}

	return { token, user, isLoading, role, isAuthenticated, login, logout, clearSession };
});

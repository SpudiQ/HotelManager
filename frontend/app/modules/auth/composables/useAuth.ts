import { type LoginCredentials, type User, Role } from "../types/auth";
import { makeAuthApi } from "../api/authApi";
import { clearToken, clearUser, readToken, readUser, writeToken, writeUser } from "../utils/storage";

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

export const useAuth = () => {
	const user = useState<User | null>("auth:user", () => null);
	const token = useState<string | null>("auth:token", () => null);
	const isLoading = useState<boolean>("auth:loading", () => false);

	const role = computed<Role>(() => user.value?.role ?? Role.GUEST);
	const isAuthenticated = computed<boolean>(() => !!user.value && !!token.value);

	const authApi = makeAuthApi(useNuxtApp().$api);

	const applySession = (nextUser: User, nextToken: string) => {
		user.value = nextUser;
		token.value = nextToken;
		writeToken(nextToken);
		writeUser(nextUser);
	};

	const clearSession = () => {
		user.value = null;
		token.value = null;
		clearToken();
		clearUser();
	};

	const login = async (credentials: LoginCredentials): Promise<void> => {
		isLoading.value = true;
		try {
			const { access_token } = await authApi.login(credentials);
			const me = await authApi.me(access_token);
			applySession(me, access_token);
		} finally {
			isLoading.value = false;
		}
	};

	const logout = async (): Promise<void> => {
		isLoading.value = true;
		try {
			await authApi.logout();
		} finally {
			clearSession();
			isLoading.value = false;
		}
	};

	const restore = async (): Promise<void> => {
		const storedToken = readToken();
		const storedUser = readUser();
		if (!storedToken || !storedUser) return;
		if (isTokenExpired(storedToken)) {
			clearSession();
			return;
		}
		user.value = storedUser;
		token.value = storedToken;
	};

	return {
		user,
		token,
		role,
		isAuthenticated,
		isLoading,
		login,
		logout,
		restore,
	};
};

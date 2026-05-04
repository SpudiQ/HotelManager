import type { User, LoginCredentials } from "../types/auth";

type ApiFetch = ReturnType<typeof $fetch.create>;

export const makeAuthApi = ($api: ApiFetch) => ({
	login: (credentials: LoginCredentials) =>
		$api<{ access_token: string }>("/auth/login", {
			method: "POST",
			body: credentials,
		}),

	me: (token: string) =>
		$api<User>("/auth/me", {
			headers: { Authorization: `Bearer ${token}` },
		}),

	logout: (): Promise<void> => Promise.resolve(),
});

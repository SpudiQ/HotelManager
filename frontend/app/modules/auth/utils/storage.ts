import type { User } from "../types/auth";

export const AUTH_TOKEN_KEY = "hm_auth_token";
const AUTH_USER_KEY = "hm_auth_user";

export function readToken(): string | null {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function writeToken(token: string): void {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearToken(): void {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function readUser(): User | null {
	if (typeof window === "undefined") return null;
	const raw = window.localStorage.getItem(AUTH_USER_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as User;
	} catch {
		return null;
	}
}

export function writeUser(user: User): void {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearUser(): void {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(AUTH_USER_KEY);
}

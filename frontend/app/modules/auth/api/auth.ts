import { useApi } from "~/composables/useApi";
import type { LoginCredentials, User } from "../types/auth";

export const login = (credentials: LoginCredentials) =>
	useApi()<{ access_token: string }>("/auth/login", {
		method: "POST",
		body: credentials,
	});

export const fetchMe = () => useApi()<User>("/auth/me");

export const logout = (): Promise<void> => Promise.resolve();

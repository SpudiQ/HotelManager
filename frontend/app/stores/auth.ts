import { defineStore } from "pinia";
import { type LoginCredentials, type User, Role } from "~/modules/auth/types/auth";
import { fetchMe, login as loginRequest, logout as logoutRequest } from "~/modules/auth/api/auth";
import {
	clearToken,
	clearUser,
	readToken,
	readUser,
	writeToken,
	writeUser,
} from "~/modules/auth/utils/storage";

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

interface AuthState {
	user: User | null;
	token: string | null;
	isLoading: boolean;
}

export const useAuthStore = defineStore("auth", {
	state: (): AuthState => ({
		user: null,
		token: null,
		isLoading: false,
	}),

	getters: {
		role: (state): Role => state.user?.role ?? Role.GUEST,
		isAuthenticated: (state): boolean => !!state.user && !!state.token,
	},

	actions: {
		applySession(nextUser: User, nextToken: string) {
			this.user = nextUser;
			this.token = nextToken;
			writeToken(nextToken);
			writeUser(nextUser);
		},

		clearSession() {
			this.user = null;
			this.token = null;
			clearToken();
			clearUser();
		},

		async login(credentials: LoginCredentials): Promise<void> {
			this.isLoading = true;
			try {
				const { access_token } = await loginRequest(credentials);
				this.token = access_token;
				const me = await fetchMe();
				this.applySession(me, access_token);
			} finally {
				this.isLoading = false;
			}
		},

		async logout(): Promise<void> {
			this.isLoading = true;
			try {
				await logoutRequest();
			} finally {
				this.clearSession();
				this.isLoading = false;
			}
		},

		async restore(): Promise<void> {
			const storedToken = readToken();
			const storedUser = readUser();
			if (!storedToken || !storedUser) return;
			if (isTokenExpired(storedToken)) {
				this.clearSession();
				return;
			}
			this.user = storedUser;
			this.token = storedToken;
		},
	},
});

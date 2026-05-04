export enum Role {
	GUEST = "guest",
	MANAGER = "manager",
	ADMIN = "admin",
	SUPERADMIN = "superadmin",
}

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: Role;
	workspaceId: string | null;
}

export interface AuthSession {
	user: User;
	token: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

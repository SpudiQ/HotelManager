import { Role } from "../types/auth";

const ROLE_LEVEL: Record<Role, number> = {
	[Role.GUEST]: 0,
	[Role.MANAGER]: 1,
	[Role.ADMIN]: 2,
	[Role.SUPERADMIN]: 3,
};

export function roleLevel(role: Role): number {
	return ROLE_LEVEL[role];
}

export function hasMinRole(role: Role, min: Role): boolean {
	return roleLevel(role) >= roleLevel(min);
}

export function isStaff(role: Role): boolean {
	return hasMinRole(role, Role.MANAGER);
}

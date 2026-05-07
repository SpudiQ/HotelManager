export type PropertyType =
	| "hotel"
	| "resort"
	| "hostel"
	| "glamping"
	| "apartment"
	| "guesthouse";

export interface Property {
	id: string;
	name: string;
	slug: string;
	type: PropertyType;
	address?: string | null;
	description?: string | null;
	isActive: boolean;
	workspaceId: string;
	createdAt: string;
	updatedAt: string;
}

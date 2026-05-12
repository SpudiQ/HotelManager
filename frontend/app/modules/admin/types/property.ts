export type PropertyType =
	| "hotel"
	| "resort"
	| "hostel"
	| "glamping"
	| "apartment"
	| "guesthouse";

export interface PropertyContacts {
	email?: string;
	phone?: string;
	telegram?: string;
	whatsapp?: string;
}

export interface Property {
	id: string;
	name: string;
	slug: string;
	type: PropertyType;
	address?: string | null;
	description?: string | null;
	contacts?: PropertyContacts | null;
	settings?: Record<string, unknown> | null;
	isActive: boolean;
	workspaceId: string;
	createdAt: string;
	updatedAt: string;
}

export type UpdatePropertyDto = Partial<{
	name: string;
	slug: string;
	type: PropertyType;
	address: string | null;
	description: string | null;
	contacts: PropertyContacts | null;
	settings: Record<string, unknown> | null;
	isActive: boolean;
}>;

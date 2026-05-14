import type { PhotoMeta } from "~/types/photo";

export type UnitType = "room" | "house" | "apartment" | "place" | "tent";

export type UnitPriceMode = "night" | "month" | "both";

export type UnitAmenity =
	| "wifi"
	| "ac"
	| "tv"
	| "kitchen"
	| "bathroom_private"
	| "breakfast"
	| "parking"
	| "pool"
	| "heating"
	| "workspace"
	| "washer"
	| "balcony"
	| "pets_allowed"
	| "smoking_allowed";

export interface Unit {
	id: string;
	propertyId: string;
	name: string;
	slug: string;
	type: UnitType;
	description?: string | null;
	maxGuests: number;
	childrenAllowed: boolean;
	maxChildren: number | null;
	amenities: UnitAmenity[];
	pricePerNight: number | null;
	pricePerMonth: number | null;
	priceMode: UnitPriceMode;
	photos: PhotoMeta[];
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateUnitDto {
	propertyId: string;
	name: string;
	slug: string;
	type: UnitType;
	description?: string | null;
	maxGuests: number;
	childrenAllowed: boolean;
	maxChildren: number | null;
	amenities: UnitAmenity[];
	pricePerNight: number | null;
	pricePerMonth: number | null;
	priceMode: UnitPriceMode;
	photos: PhotoMeta[];
	isActive: boolean;
}

export type UpdateUnitDto = Partial<Omit<CreateUnitDto, "propertyId">>;

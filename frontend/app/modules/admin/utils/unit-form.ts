import type {
	Unit,
	UnitAmenity,
	UnitPriceMode,
	UnitType,
	UpdateUnitDto,
} from "~/modules/admin/types/unit";
import type { PhotoMeta } from "~/types/photo";

export interface FormState {
	name: string;
	slug: string;
	type: UnitType;
	description: string;
	maxGuests: number;
	childrenAllowed: boolean;
	maxChildren: number | null;
	amenities: UnitAmenity[];
	priceMode: UnitPriceMode;
	pricePerNight: number | null;
	pricePerMonth: number | null;
	photos: PhotoMeta[];
	isActive: boolean;
}

export const emptyForm = (): FormState => ({
	name: "",
	slug: "",
	type: "room",
	description: "",
	maxGuests: 2,
	childrenAllowed: false,
	maxChildren: null,
	amenities: [],
	priceMode: "night",
	pricePerNight: null,
	pricePerMonth: null,
	photos: [],
	isActive: true,
});

export const buildForm = (u: Unit): FormState => ({
	name: u.name,
	slug: u.slug,
	type: u.type,
	description: u.description ?? "",
	maxGuests: u.maxGuests,
	childrenAllowed: u.childrenAllowed,
	maxChildren: u.maxChildren,
	amenities: [...u.amenities],
	priceMode: u.priceMode,
	pricePerNight: u.pricePerNight,
	pricePerMonth: u.pricePerMonth,
	photos: [...u.photos],
	isActive: u.isActive,
});

type Payload = Required<Omit<UpdateUnitDto, "description" | "maxChildren" | "pricePerNight" | "pricePerMonth">> & {
	description: string | null;
	maxChildren: number | null;
	pricePerNight: number | null;
	pricePerMonth: number | null;
};

export const buildPayload = (f: FormState): Payload => ({
	name: f.name.trim(),
	slug: f.slug.trim(),
	type: f.type,
	description: f.description.trim() === "" ? null : f.description,
	maxGuests: f.maxGuests,
	childrenAllowed: f.childrenAllowed,
	maxChildren: f.childrenAllowed ? f.maxChildren : null,
	amenities: f.amenities,
	priceMode: f.priceMode,
	pricePerNight: f.priceMode === "month" ? null : f.pricePerNight,
	pricePerMonth: f.priceMode === "night" ? null : f.pricePerMonth,
	photos: f.photos,
	isActive: f.isActive,
});

export const isFormValid = (f: FormState): boolean => {
	if (f.name.trim() === "" || f.slug.trim() === "") return false;
	if (!Number.isFinite(f.maxGuests) || f.maxGuests < 1) return false;
	if (f.childrenAllowed && f.maxChildren !== null && f.maxChildren < 0) {
		return false;
	}
	const needsNight = f.priceMode === "night" || f.priceMode === "both";
	const needsMonth = f.priceMode === "month" || f.priceMode === "both";
	if (needsNight && (f.pricePerNight === null || f.pricePerNight < 0)) {
		return false;
	}
	if (needsMonth && (f.pricePerMonth === null || f.pricePerMonth < 0)) {
		return false;
	}
	return true;
};

const numberFormatter = new Intl.NumberFormat("ru-RU", {
	maximumFractionDigits: 2,
});

export const formatUnitPrice = (u: Pick<Unit, "priceMode" | "pricePerNight" | "pricePerMonth">): string => {
	const night = u.pricePerNight !== null ? `${numberFormatter.format(u.pricePerNight)} ₽/ночь` : "";
	const month = u.pricePerMonth !== null ? `${numberFormatter.format(u.pricePerMonth)} ₽/мес` : "";
	if (u.priceMode === "night") return night || "—";
	if (u.priceMode === "month") return month || "—";
	return [night, month].filter(Boolean).join(" · ") || "—";
};

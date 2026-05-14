import {
	Wifi01Icon,
	SnowIcon,
	TvSmartIcon,
	ChefHatIcon,
	Bathtub01Icon,
	Coffee01Icon,
	ParkingAreaSquareIcon,
	SwimmingIcon,
	FireIcon,
	Briefcase01Icon,
	WashingMachineIcon,
	Home05Icon,
	Bone01Icon,
	CigaretteIcon,
} from "@hugeicons/core-free-icons";
import type { UnitAmenity, UnitPriceMode, UnitType } from "../types/unit";

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
	room: "Номер",
	house: "Дом",
	apartment: "Апартаменты",
	place: "Место",
	tent: "Палатка",
};

export const UNIT_TYPE_OPTIONS = (
	Object.keys(UNIT_TYPE_LABELS) as UnitType[]
).map((value) => ({ value, label: UNIT_TYPE_LABELS[value] }));

export const UNIT_PRICE_MODE_LABELS: Record<UnitPriceMode, string> = {
	night: "За ночь",
	month: "За месяц",
	both: "За ночь и за месяц",
};

export const UNIT_PRICE_MODE_OPTIONS = (
	Object.keys(UNIT_PRICE_MODE_LABELS) as UnitPriceMode[]
).map((value) => ({ value, label: UNIT_PRICE_MODE_LABELS[value] }));

export interface AmenityOption {
	value: UnitAmenity;
	label: string;
	icon: unknown;
}

export const UNIT_AMENITY_OPTIONS: AmenityOption[] = [
	{ value: "wifi", label: "Wi-Fi", icon: Wifi01Icon },
	{ value: "ac", label: "Кондиционер", icon: SnowIcon },
	{ value: "tv", label: "Телевизор", icon: TvSmartIcon },
	{ value: "kitchen", label: "Кухня", icon: ChefHatIcon },
	{ value: "bathroom_private", label: "Свой санузел", icon: Bathtub01Icon },
	{ value: "breakfast", label: "Завтрак", icon: Coffee01Icon },
	{ value: "parking", label: "Парковка", icon: ParkingAreaSquareIcon },
	{ value: "pool", label: "Бассейн", icon: SwimmingIcon },
	{ value: "heating", label: "Отопление", icon: FireIcon },
	{ value: "workspace", label: "Рабочее место", icon: Briefcase01Icon },
	{ value: "washer", label: "Стиральная машина", icon: WashingMachineIcon },
	{ value: "balcony", label: "Балкон/терраса", icon: Home05Icon },
	{ value: "pets_allowed", label: "Можно с животными", icon: Bone01Icon },
	{ value: "smoking_allowed", label: "Можно курить", icon: CigaretteIcon },
];

export const UNIT_AMENITY_LABELS: Record<UnitAmenity, string> = Object.fromEntries(
	UNIT_AMENITY_OPTIONS.map((o) => [o.value, o.label]),
) as Record<UnitAmenity, string>;

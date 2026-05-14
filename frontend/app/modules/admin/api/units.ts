import { useApi } from "~/composables/useApi";
import type {
	CreateUnitDto,
	Unit,
	UpdateUnitDto,
} from "../types/unit";

export const fetchUnits = (propertyId: string) =>
	useApi()<Unit[]>("/units", { query: { propertyId } });

export const fetchUnit = (id: string) => useApi()<Unit>(`/units/${id}`);

export const createUnit = (dto: CreateUnitDto) =>
	useApi()<Unit>("/units", { method: "POST", body: dto });

export const updateUnit = (id: string, dto: UpdateUnitDto) =>
	useApi()<Unit>(`/units/${id}`, { method: "PATCH", body: dto });

export const deleteUnit = (id: string) =>
	useApi()<void>(`/units/${id}`, { method: "DELETE" });

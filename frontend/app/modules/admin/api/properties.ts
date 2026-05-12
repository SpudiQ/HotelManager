import { useApi } from "~/composables/useApi";
import type { Property, UpdatePropertyDto } from "../types/property";

export const fetchProperties = (workspaceId: string) =>
	useApi()<Property[]>("/properties", { query: { workspaceId } });

export const fetchProperty = (id: string) =>
	useApi()<Property>(`/properties/${id}`);

export const updateProperty = (id: string, dto: UpdatePropertyDto) =>
	useApi()<Property>(`/properties/${id}`, { method: "PATCH", body: dto });

export const deleteProperty = (id: string) =>
	useApi()<void>(`/properties/${id}`, { method: "DELETE" });

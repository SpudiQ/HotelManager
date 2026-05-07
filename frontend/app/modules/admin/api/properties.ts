import { useApi } from "~/composables/useApi";
import type { Property } from "../types/property";

export const fetchProperties = (workspaceId: string) =>
	useApi()<Property[]>("/properties", { query: { workspaceId } });

export const deleteProperty = (id: string) =>
	useApi()<void>(`/properties/${id}`, { method: "DELETE" });

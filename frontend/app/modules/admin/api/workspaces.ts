import { useApi } from "~/composables/useApi";
import type {
	CreateWorkspaceDto,
	UpdateWorkspaceDto,
	Workspace,
} from "../types/workspace";

export const fetchWorkspaces = () => useApi()<Workspace[]>("/workspaces");

export const fetchWorkspace = (id: string) =>
	useApi()<Workspace>(`/workspaces/${id}`);

export const createWorkspace = (dto: CreateWorkspaceDto) =>
	useApi()<Workspace>("/workspaces", { method: "POST", body: dto });

export const updateWorkspace = (id: string, dto: UpdateWorkspaceDto) =>
	useApi()<Workspace>(`/workspaces/${id}`, { method: "PATCH", body: dto });

export const deleteWorkspace = (id: string) =>
	useApi()<void>(`/workspaces/${id}`, { method: "DELETE" });

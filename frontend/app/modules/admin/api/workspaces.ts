import { useApi } from "~/composables/useApi";
import type { Workspace } from "../types/workspace";

export const fetchWorkspaces = () => useApi()<Workspace[]>("/workspaces");

export const fetchWorkspace = (id: string) =>
	useApi()<Workspace>(`/workspaces/${id}`);

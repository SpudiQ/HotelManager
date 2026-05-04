import type { Workspace } from "../types/workspace";

type ApiFetch = ReturnType<typeof $fetch.create>;

interface BackendWorkspace {
	id: string;
	name: string;
	slug: string;
	properties: unknown[];
}

const toWorkspace = (w: BackendWorkspace): Workspace => ({
	id: w.id,
	name: w.name,
	slug: w.slug,
	propertyCount: w.properties?.length ?? 0,
});

export const makeWorkspaceApi = ($api: ApiFetch) => ({
	getAll: async (): Promise<Workspace[]> => {
		const items = await $api<BackendWorkspace[]>("/workspaces");
		return items.map(toWorkspace);
	},

	getById: async (id: string): Promise<Workspace> => {
		const item = await $api<BackendWorkspace>(`/workspaces/${id}`);
		return toWorkspace(item);
	},
});

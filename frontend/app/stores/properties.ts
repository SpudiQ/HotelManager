import { defineStore } from "pinia";
import type { Property } from "~/modules/admin/types/property";
import { deleteProperty, fetchProperties } from "~/modules/admin/api/properties";

interface PropertiesState {
	items: Property[];
	currentWorkspaceId: string | null;
	isLoading: boolean;
}

export const usePropertiesStore = defineStore("properties", {
	state: (): PropertiesState => ({
		items: [],
		currentWorkspaceId: null,
		isLoading: false,
	}),

	actions: {
		async fetchByWorkspace(workspaceId: string): Promise<void> {
			this.currentWorkspaceId = workspaceId;
			this.isLoading = true;
			try {
				this.items = await fetchProperties(workspaceId);
			} finally {
				this.isLoading = false;
			}
		},

		async remove(id: string): Promise<void> {
			await deleteProperty(id);
			this.items = this.items.filter((p) => p.id !== id);
		},
	},
});

import { defineStore } from "pinia";
import type { Workspace } from "~/modules/admin/types/workspace";
import { fetchWorkspace, fetchWorkspaces } from "~/modules/admin/api/workspaces";

interface WorkspacesState {
	items: Workspace[];
	current: Workspace | null;
	isLoading: boolean;
}

export const useWorkspacesStore = defineStore("workspaces", {
	state: (): WorkspacesState => ({
		items: [],
		current: null,
		isLoading: false,
	}),

	actions: {
		async fetchAll(): Promise<void> {
			this.isLoading = true;
			try {
				this.items = await fetchWorkspaces();
			} finally {
				this.isLoading = false;
			}
		},

		async fetchOne(id: string): Promise<void> {
			const cached = this.items.find((w) => w.id === id);
			if (cached) {
				this.current = cached;
				return;
			}
			this.isLoading = true;
			try {
				this.current = await fetchWorkspace(id);
			} finally {
				this.isLoading = false;
			}
		},
	},
});

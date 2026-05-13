import { defineStore } from "pinia";
import type {
	CreateWorkspaceDto,
	UpdateWorkspaceDto,
	Workspace,
} from "~/modules/admin/types/workspace";
import {
	createWorkspace,
	deleteWorkspace,
	fetchWorkspace,
	fetchWorkspaces,
	updateWorkspace,
} from "~/modules/admin/api/workspaces";

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

		async create(dto: CreateWorkspaceDto): Promise<Workspace> {
			const created = await createWorkspace(dto);
			this.items = [...this.items, created];
			return created;
		},

		async update(id: string, dto: UpdateWorkspaceDto): Promise<void> {
			const updated = await updateWorkspace(id, dto);
			this.current = updated;
			const idx = this.items.findIndex((w) => w.id === id);
			if (idx !== -1) this.items[idx] = updated;
		},

		async remove(id: string): Promise<void> {
			await deleteWorkspace(id);
			this.items = this.items.filter((w) => w.id !== id);
			if (this.current?.id === id) this.current = null;
		},
	},
});

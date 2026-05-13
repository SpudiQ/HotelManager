import { defineStore } from "pinia";
import type {
	CreatePropertyDto,
	Property,
	UpdatePropertyDto,
} from "~/modules/admin/types/property";
import {
	createProperty,
	deleteProperty,
	fetchProperties,
	fetchProperty,
	updateProperty,
} from "~/modules/admin/api/properties";

interface PropertiesState {
	items: Property[];
	current: Property | null;
	currentWorkspaceId: string | null;
	isLoading: boolean;
}

export const usePropertiesStore = defineStore("properties", {
	state: (): PropertiesState => ({
		items: [],
		current: null,
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

		async fetchOne(id: string): Promise<void> {
			const cached = this.items.find((p) => p.id === id);
			if (cached) {
				this.current = cached;
				return;
			}
			this.isLoading = true;
			try {
				this.current = await fetchProperty(id);
			} finally {
				this.isLoading = false;
			}
		},

		async create(dto: CreatePropertyDto): Promise<Property> {
			const created = await createProperty(dto);
			if (this.currentWorkspaceId === dto.workspaceId) {
				this.items = [...this.items, created];
			}
			return created;
		},

		async update(id: string, dto: UpdatePropertyDto): Promise<void> {
			const updated = await updateProperty(id, dto);
			this.current = updated;
			const idx = this.items.findIndex((p) => p.id === id);
			if (idx !== -1) this.items[idx] = updated;
		},

		async remove(id: string): Promise<void> {
			await deleteProperty(id);
			this.items = this.items.filter((p) => p.id !== id);
			if (this.current?.id === id) this.current = null;
		},
	},
});

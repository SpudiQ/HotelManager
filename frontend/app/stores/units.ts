import { defineStore } from "pinia";
import type {
	CreateUnitDto,
	Unit,
	UpdateUnitDto,
} from "~/modules/admin/types/unit";
import {
	createUnit,
	deleteUnit,
	fetchUnit,
	fetchUnits,
	updateUnit,
} from "~/modules/admin/api/units";

interface UnitsState {
	items: Unit[];
	current: Unit | null;
	currentPropertyId: string | null;
	isLoading: boolean;
}

export const useUnitsStore = defineStore("units", {
	state: (): UnitsState => ({
		items: [],
		current: null,
		currentPropertyId: null,
		isLoading: false,
	}),

	actions: {
		async fetchByProperty(propertyId: string): Promise<void> {
			this.currentPropertyId = propertyId;
			this.isLoading = true;
			try {
				this.items = await fetchUnits(propertyId);
			} finally {
				this.isLoading = false;
			}
		},

		async fetchOne(id: string): Promise<void> {
			const cached = this.items.find((u) => u.id === id);
			if (cached) {
				this.current = cached;
				return;
			}
			this.isLoading = true;
			try {
				this.current = await fetchUnit(id);
			} finally {
				this.isLoading = false;
			}
		},

		async create(dto: CreateUnitDto): Promise<Unit> {
			const created = await createUnit(dto);
			if (this.currentPropertyId === dto.propertyId) {
				this.items = [...this.items, created];
			}
			return created;
		},

		async update(id: string, dto: UpdateUnitDto): Promise<void> {
			const updated = await updateUnit(id, dto);
			this.current = updated;
			const idx = this.items.findIndex((u) => u.id === id);
			if (idx !== -1) this.items[idx] = updated;
		},

		async remove(id: string): Promise<void> {
			await deleteUnit(id);
			this.items = this.items.filter((u) => u.id !== id);
			if (this.current?.id === id) this.current = null;
		},
	},
});

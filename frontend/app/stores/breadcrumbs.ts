import { defineStore } from "pinia";

export interface Crumb {
	label: string;
	to?: string;
}

interface BreadcrumbsState {
	crumbs: Crumb[];
}

export const useBreadcrumbsStore = defineStore("breadcrumbs", {
	state: (): BreadcrumbsState => ({
		crumbs: [],
	}),

	actions: {
		set(next: Crumb[]) {
			this.crumbs = next;
		},
		clear() {
			this.crumbs = [];
		},
	},
});

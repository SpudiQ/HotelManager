export type SortDir = "asc" | "desc";

export interface SortState {
	key: string;
	dir: SortDir;
}

export type ColPriority = "md";

export interface TableColumn {
	key: string;
	label: string;
	sortable?: boolean;
	priority?: ColPriority;
}

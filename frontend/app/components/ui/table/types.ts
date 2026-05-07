export type SortDir = "asc" | "desc";

export interface SortState {
	key: string;
	dir: SortDir;
}

export interface TableColumn {
	key: string;
	label: string;
	sortable?: boolean;
}

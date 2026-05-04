export interface Crumb {
	label: string;
	to?: string;
}

export const useBreadcrumbs = () => {
	const crumbs = useState<Crumb[]>("admin:breadcrumbs", () => []);

	const set = (next: Crumb[]) => {
		crumbs.value = next;
	};

	const clear = () => {
		crumbs.value = [];
	};

	return { crumbs, set, clear };
};

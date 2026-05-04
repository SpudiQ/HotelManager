import type { Workspace } from "../types/workspace";
import { makeWorkspaceApi } from "../api/workspaceApi";

export const useWorkspaces = () => {
	const workspaces = useState<Workspace[]>("workspaces", () => []);
	const isLoading = useState<boolean>("workspaces:loading", () => false);

	const workspaceApi = makeWorkspaceApi(useNuxtApp().$api);

	const fetch = async (): Promise<void> => {
		isLoading.value = true;
		try {
			workspaces.value = await workspaceApi.getAll();
		} finally {
			isLoading.value = false;
		}
	};

	return { workspaces, isLoading, fetch };
};

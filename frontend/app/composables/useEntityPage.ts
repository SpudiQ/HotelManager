import type { WatchSource } from "vue";
import { useSnackbarStore } from "~/stores/snackbar";

export const useEntityPage = <T>(
	key: string,
	fetcher: () => Promise<T>,
	errorMessage: string,
	options?: { watch?: WatchSource[] },
) => {
	const snackbar = useSnackbarStore();
	const asyncData = useAsyncData<T>(key, fetcher, { watch: options?.watch });

	watch(
		asyncData.error,
		(e) => {
			if (e) snackbar.show(errorMessage, "error");
		},
		{ immediate: true },
	);

	return asyncData;
};

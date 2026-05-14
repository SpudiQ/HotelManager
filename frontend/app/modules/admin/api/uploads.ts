import { useApi } from "~/composables/useApi";
import type { PhotoMeta } from "~/types/photo";

export const uploadPhotos = (
	files: File[],
	prefix = "misc",
): Promise<PhotoMeta[]> => {
	const formData = new FormData();
	formData.append("prefix", prefix);
	for (const file of files) formData.append("files", file);
	return useApi()<PhotoMeta[]>("/uploads", {
		method: "POST",
		body: formData,
	});
};

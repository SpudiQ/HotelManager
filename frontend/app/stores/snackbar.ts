import { defineStore } from "pinia";

export type SnackbarType = "error" | "success";

interface SnackbarState {
	message: string;
	type: SnackbarType;
	visible: boolean;
}

let timer: ReturnType<typeof setTimeout> | null = null;

export const useSnackbarStore = defineStore("snackbar", {
	state: (): SnackbarState => ({
		message: "",
		type: "error",
		visible: false,
	}),

	actions: {
		show(message: string, type: SnackbarType = "error") {
			if (timer) clearTimeout(timer);
			this.message = message;
			this.type = type;
			this.visible = true;
			timer = setTimeout(() => {
				this.visible = false;
			}, 4000);
		},
		hide() {
			if (timer) clearTimeout(timer);
			this.visible = false;
		},
	},
});

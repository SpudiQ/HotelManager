import { defineStore } from "pinia";

export type SnackbarType = "error" | "success";

interface SnackbarState {
	message: string;
	type: SnackbarType;
	visible: boolean;
	timer: ReturnType<typeof setTimeout> | null;
}

export const useSnackbarStore = defineStore("snackbar", {
	state: (): SnackbarState => ({
		message: "",
		type: "error",
		visible: false,
		timer: null,
	}),

	actions: {
		show(message: string, type: SnackbarType = "error") {
			if (this.timer) clearTimeout(this.timer);
			this.message = message;
			this.type = type;
			this.visible = true;
			this.timer = setTimeout(() => {
				this.visible = false;
			}, 4000);
		},
		hide() {
			if (this.timer) clearTimeout(this.timer);
			this.visible = false;
		},
	},
});

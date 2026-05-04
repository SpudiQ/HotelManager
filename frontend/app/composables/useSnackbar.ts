export type SnackbarType = "error" | "success";

interface SnackbarState {
	message: string;
	type: SnackbarType;
	visible: boolean;
}

export const useSnackbar = () => {
	const state = useState<SnackbarState>("snackbar", () => ({
		message: "",
		type: "error",
		visible: false,
	}));

	const timer = useState<ReturnType<typeof setTimeout> | null>("snackbar:timer", () => null);

	const show = (message: string, type: SnackbarType = "error") => {
		if (timer.value) clearTimeout(timer.value);
		state.value = { message, type, visible: true };
		timer.value = setTimeout(() => {
			state.value.visible = false;
		}, 4000);
	};

	const hide = () => {
		if (timer.value) clearTimeout(timer.value);
		state.value.visible = false;
	};

	return { state, show, hide };
};

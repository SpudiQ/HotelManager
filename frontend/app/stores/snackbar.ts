import { defineStore } from "pinia";

export type SnackbarType = "error" | "success";

export interface SnackbarItem {
	id: string;
	message: string;
	type: SnackbarType;
}

interface SnackbarState {
	visible: SnackbarItem[];
	queue: SnackbarItem[];
}

const MAX_VISIBLE = 3;
const AUTO_DISMISS_MS = 4000;
const timers = new Map<string, ReturnType<typeof setTimeout>>();

const createId = (): string => {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return crypto.randomUUID();
	}
	return `snk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const useSnackbarStore = defineStore("snackbar", {
	state: (): SnackbarState => ({
		visible: [],
		queue: [],
	}),

	actions: {
		show(message: string, type: SnackbarType = "error") {
			const item: SnackbarItem = { id: createId(), message, type };
			if (this.visible.length < MAX_VISIBLE) {
				this.visible.push(item);
				this.scheduleAutoDismiss(item.id);
			} else {
				this.queue.push(item);
			}
		},

		dismiss(id: string) {
			const timer = timers.get(id);
			if (timer) {
				clearTimeout(timer);
				timers.delete(id);
			}
			const index = this.visible.findIndex((i) => i.id === id);
			if (index === -1) {
				const queueIndex = this.queue.findIndex((i) => i.id === id);
				if (queueIndex !== -1) this.queue.splice(queueIndex, 1);
				return;
			}
			this.visible.splice(index, 1);
			const next = this.queue.shift();
			if (next) {
				this.visible.push(next);
				this.scheduleAutoDismiss(next.id);
			}
		},

		scheduleAutoDismiss(id: string) {
			const timer = setTimeout(() => {
				timers.delete(id);
				this.dismiss(id);
			}, AUTO_DISMISS_MS);
			timers.set(id, timer);
		},

		hide() {
			for (const timer of timers.values()) clearTimeout(timer);
			timers.clear();
			this.visible = [];
			this.queue = [];
		},
	},
});

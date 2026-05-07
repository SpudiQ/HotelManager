import type { Directive, DirectiveBinding } from "vue";

export type SkeletonType = "card" | "row" | "text" | "avatar";

export interface SkeletonBinding {
	loading: boolean;
	type?: SkeletonType;
	count?: number;
}

interface HostState {
	overlay: HTMLElement | null;
	shownAt: number | null;
	hideTimer: ReturnType<typeof setTimeout> | null;
	fadeTimer: ReturnType<typeof setTimeout> | null;
}

const STATE_KEY = "__vSkeletonState";
const MIN_DURATION_MS = 300;
const FADE_MS = 240;

const cardTemplate = () => `
	<div class="v-skel v-skel--card">
		<div class="v-skel__head">
			<span class="v-skel v-skel__icon"></span>
			<span class="v-skel v-skel__chev"></span>
		</div>
		<div class="v-skel__title v-skel"></div>
		<div class="v-skel__foot">
			<div class="v-skel v-skel__meta"></div>
		</div>
	</div>
`;

const rowTemplate = () => `<div class="v-skel v-skel--row"></div>`;
const textTemplate = () => `<div class="v-skel v-skel--text"></div>`;
const avatarTemplate = () => `<div class="v-skel v-skel--avatar"></div>`;

const TEMPLATES: Record<SkeletonType, () => string> = {
	card: cardTemplate,
	row: rowTemplate,
	text: textTemplate,
	avatar: avatarTemplate,
};

const buildOverlay = (type: SkeletonType, count: number): HTMLElement => {
	const overlay = document.createElement("div");
	overlay.className = "v-skeleton-overlay";
	const tpl = TEMPLATES[type] ?? TEMPLATES.text;
	overlay.innerHTML = Array.from({ length: count }, () => tpl()).join("");
	return overlay;
};

const ensureState = (el: HTMLElement & { [STATE_KEY]?: HostState }): HostState => {
	if (!el[STATE_KEY]) {
		el[STATE_KEY] = {
			overlay: null,
			shownAt: null,
			hideTimer: null,
			fadeTimer: null,
		};
	}
	return el[STATE_KEY]!;
};

const removeOverlay = (el: HTMLElement, state: HostState) => {
	if (state.overlay && state.overlay.parentNode === el) {
		el.removeChild(state.overlay);
	}
	state.overlay = null;
	state.shownAt = null;
	el.classList.remove("v-skeleton-host");
	el.classList.add("v-skeleton-fade-in");
	if (state.fadeTimer) clearTimeout(state.fadeTimer);
	state.fadeTimer = setTimeout(() => {
		el.classList.remove("v-skeleton-fade-in");
		state.fadeTimer = null;
	}, FADE_MS);
};

const showSkeleton = (
	el: HTMLElement,
	state: HostState,
	type: SkeletonType,
	count: number,
) => {
	if (state.hideTimer) {
		clearTimeout(state.hideTimer);
		state.hideTimer = null;
	}
	if (state.fadeTimer) {
		clearTimeout(state.fadeTimer);
		state.fadeTimer = null;
	}
	el.classList.remove("v-skeleton-fade-in");
	el.classList.add("v-skeleton-host");
	if (state.overlay) {
		el.removeChild(state.overlay);
	}
	state.overlay = buildOverlay(type, count);
	el.appendChild(state.overlay);
	state.shownAt = Date.now();
};

const scheduleHide = (el: HTMLElement, state: HostState) => {
	if (!state.shownAt) {
		removeOverlay(el, state);
		return;
	}
	const elapsed = Date.now() - state.shownAt;
	const remaining = Math.max(0, MIN_DURATION_MS - elapsed);
	if (state.hideTimer) clearTimeout(state.hideTimer);
	if (remaining === 0) {
		removeOverlay(el, state);
		return;
	}
	state.hideTimer = setTimeout(() => {
		state.hideTimer = null;
		removeOverlay(el, state);
	}, remaining);
};

const apply = (el: HTMLElement, binding: DirectiveBinding<SkeletonBinding>) => {
	const value = binding.value ?? ({ loading: false } as SkeletonBinding);
	const loading = !!value.loading;
	const type: SkeletonType = value.type ?? "text";
	const count = Math.max(1, value.count ?? 1);
	const state = ensureState(el);

	if (loading) {
		const needsRebuild =
			!state.overlay ||
			state.overlay.dataset.type !== type ||
			Number(state.overlay.dataset.count) !== count;
		if (needsRebuild) {
			showSkeleton(el, state, type, count);
			if (state.overlay) {
				state.overlay.dataset.type = type;
				state.overlay.dataset.count = String(count);
			}
		}
	} else if (state.overlay || state.hideTimer) {
		scheduleHide(el, state);
	}
};

export const skeletonDirective: Directive<HTMLElement, SkeletonBinding> = {
	mounted(el, binding) {
		apply(el, binding);
	},
	updated(el, binding) {
		apply(el, binding);
	},
	unmounted(el) {
		const state = (el as HTMLElement & { [STATE_KEY]?: HostState })[STATE_KEY];
		if (!state) return;
		if (state.hideTimer) clearTimeout(state.hideTimer);
		if (state.fadeTimer) clearTimeout(state.fadeTimer);
		if (state.overlay && state.overlay.parentNode === el) {
			el.removeChild(state.overlay);
		}
	},
};

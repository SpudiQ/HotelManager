<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

interface Props {
	open: boolean;
	title: string;
	message?: string;
	confirmPhrase?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: "danger" | "default";
	busy?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	message: "",
	confirmPhrase: "",
	confirmLabel: "Удалить",
	cancelLabel: "Отмена",
	variant: "danger",
	busy: false,
});

const emit = defineEmits<{
	confirm: [];
	cancel: [];
}>();

const inputValue = ref("");
const inputEl = ref<HTMLInputElement | null>(null);

const phraseRequired = computed(() => props.confirmPhrase.length > 0);
const phraseMatches = computed(
	() => !phraseRequired.value || inputValue.value === props.confirmPhrase,
);
const confirmDisabled = computed(() => props.busy || !phraseMatches.value);

const onBackdropClick = () => {
	if (props.busy) return;
	emit("cancel");
};

const onCancel = () => {
	if (props.busy) return;
	emit("cancel");
};

const onConfirm = () => {
	if (confirmDisabled.value) return;
	emit("confirm");
};

const onKeydown = (event: KeyboardEvent) => {
	if (!props.open) return;
	if (event.key === "Escape") {
		event.preventDefault();
		onCancel();
	} else if (event.key === "Enter" && phraseRequired.value && phraseMatches.value) {
		event.preventDefault();
		onConfirm();
	}
};

watch(
	() => props.open,
	async (isOpen) => {
		if (isOpen) {
			inputValue.value = "";
			document.addEventListener("keydown", onKeydown);
			await nextTick();
			inputEl.value?.focus();
		} else {
			document.removeEventListener("keydown", onKeydown);
		}
	},
);

onBeforeUnmount(() => {
	document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
	<Teleport to="body">
		<Transition name="dialog">
			<div v-if="open" class="dialog" role="dialog" aria-modal="true">
				<div class="dialog__backdrop" @click="onBackdropClick" />
				<div class="dialog__card" :class="{ 'dialog__card--danger': variant === 'danger' }">
					<h3 class="dialog__title">{{ title }}</h3>
					<p v-if="message" class="dialog__message">{{ message }}</p>

					<div v-if="phraseRequired" class="dialog__phrase">
						<label class="dialog__label">
							Введите
							<code class="dialog__code">{{ confirmPhrase }}</code>
							для подтверждения
						</label>
						<input
							ref="inputEl"
							v-model="inputValue"
							class="dialog__input"
							type="text"
							autocomplete="off"
							spellcheck="false"
							:disabled="busy"
						/>
					</div>

					<div class="dialog__actions">
						<button
							type="button"
							class="dialog__btn dialog__btn--ghost"
							:disabled="busy"
							@click="onCancel"
						>
							{{ cancelLabel }}
						</button>
						<button
							type="button"
							class="dialog__btn"
							:class="variant === 'danger' ? 'dialog__btn--danger' : 'dialog__btn--primary'"
							:disabled="confirmDisabled"
							@click="onConfirm"
						>
							{{ confirmLabel }}
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style lang="scss" scoped>
.dialog {
	position: fixed;
	inset: 0;
	z-index: 100;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16px;
}

.dialog__backdrop {
	position: absolute;
	inset: 0;
	background: rgba(19, 19, 19, 0.45);
}

.dialog__card {
	position: relative;
	width: 100%;
	max-width: 460px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 24px;
	background: $surface;
	border: 1px solid $border;
	@include soft-shadow;
}

.dialog__title {
	@include h3-bold;
	color: $text;
}

.dialog__message {
	@include text-2;
	color: $text-muted;
}

.dialog__phrase {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.dialog__label {
	@include text-2;
	color: $text-muted;
}

.dialog__code {
	display: inline-block;
	padding: 1px 6px;
	font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	font-size: 13px;
	color: $text;
	background: $bg;
	border: 1px solid $border;
}

.dialog__input {
	@include text-2;
	width: 100%;
	padding: 10px 12px;
	background: $surface;
	color: $text;
	border: 1px solid $border;
	transition: border-color 0.15s ease;

	&:hover:not(:disabled) {
		border-color: $border-hover;
	}

	&:focus-visible {
		@include focus-ring;
	}

	&:disabled {
		color: $text-subtle;
		cursor: not-allowed;
	}
}

.dialog__actions {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	margin-top: 8px;
}

.dialog__btn {
	@include text-2-medium;
	padding: 9px 16px;
	border: 1px solid $border;
	background: $surface;
	color: $text;
	cursor: pointer;
	transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;

	&:hover:not(:disabled) {
		border-color: $text;
	}

	&:focus-visible {
		@include focus-ring;
	}

	&:disabled {
		color: $text-subtle;
		border-color: $border;
		cursor: not-allowed;
	}
}

.dialog__btn--ghost {
	background: transparent;
}

.dialog__btn--primary:not(:disabled) {
	background: $text;
	color: $surface;
	border-color: $text;
}

.dialog__btn--danger:not(:disabled) {
	background: $text;
	color: $surface;
	border-color: $text;
}

.dialog-enter-active,
.dialog-leave-active {
	transition: opacity 0.18s ease;

	.dialog__card {
		transition: transform 0.18s ease, opacity 0.18s ease;
	}
}

.dialog-enter-from,
.dialog-leave-to {
	opacity: 0;

	.dialog__card {
		transform: translateY(8px);
		opacity: 0;
	}
}
</style>

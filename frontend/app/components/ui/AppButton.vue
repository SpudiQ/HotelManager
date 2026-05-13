<script setup lang="ts">
interface Props {
	variant?: "default" | "primary" | "ghost" | "danger";
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	loading?: boolean;
}

withDefaults(defineProps<Props>(), {
	variant: "default",
	type: "button",
	disabled: false,
	loading: false,
});
</script>

<template>
	<button
		:type="type"
		:disabled="disabled || loading"
		class="btn"
		:class="[`btn--${variant}`, { 'btn--loading': loading }]"
	>
		<span class="btn__content"><slot /></span>
		<span v-if="loading" class="btn__spinner" aria-hidden="true" />
	</button>
</template>

<style lang="scss" scoped>
.btn {
	@include text-2-medium;
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
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

.btn--ghost {
	background: transparent;
}

.btn--primary:not(:disabled) {
	background: $text;
	color: $surface;
	border-color: $text;
}

.btn--danger:not(:disabled) {
	background: $text;
	color: $surface;
	border-color: $text;
}

.btn--loading {
	cursor: progress;
}

.btn--loading .btn__content {
	visibility: hidden;
}

.btn__spinner {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 16px;
	height: 16px;
	margin: -8px 0 0 -8px;
	border: 2px solid currentColor;
	border-right-color: transparent;
	border-radius: 50%;
	opacity: 0.85;
	animation: btn-spin 0.7s linear infinite;
}

.btn--primary.btn--loading .btn__spinner,
.btn--danger.btn--loading .btn__spinner {
	color: $surface;
}

@keyframes btn-spin {
	to {
		transform: rotate(360deg);
	}
}
</style>

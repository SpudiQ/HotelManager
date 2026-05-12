<script setup lang="ts">
interface Props {
	variant?: "default" | "primary" | "ghost" | "danger";
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
	variant: "default",
	type: "button",
	disabled: false,
});
</script>

<template>
	<button
		:type="type"
		:disabled="disabled"
		class="btn"
		:class="`btn--${variant}`"
	>
		<slot />
	</button>
</template>

<style lang="scss" scoped>
.btn {
	@include text-2-medium;
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
</style>

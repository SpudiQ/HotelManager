<script setup lang="ts">
import { HugeiconsIcon } from "@hugeicons/vue";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { storeToRefs } from "pinia";
import { useSnackbarStore } from "~/stores/snackbar";

const snackbar = useSnackbarStore();
const { message, type, visible } = storeToRefs(snackbar);
</script>

<template>
	<Transition name="snackbar">
		<div
			v-if="visible"
			class="snackbar"
			:class="`snackbar--${type}`"
			role="alert"
			aria-live="assertive"
		>
			<span class="snackbar__msg">{{ message }}</span>
			<button type="button" class="snackbar__close" aria-label="Закрыть" @click="snackbar.hide">
				<HugeiconsIcon :icon="Cancel01Icon" :size="16" :stroke-width="1.5" />
			</button>
		</div>
	</Transition>
</template>

<style lang="scss" scoped>
.snackbar {
	position: fixed;
	bottom: 24px;
	right: 24px;
	z-index: 9999;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	background: $surface;
	color: $text;
	border: 1px solid $border;
	max-width: 400px;
	@include soft-shadow;

	&--error {
		border-left: 3px solid $danger;
	}

	&--success {
		border-left: 3px solid $success;
	}
}

.snackbar__msg {
	@include text-2;
	flex: 1;
}

.snackbar__close {
	flex-shrink: 0;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: transparent;
	border: 0;
	color: $text-muted;
	cursor: pointer;
	opacity: 0.7;
	transition: opacity 0.12s ease, color 0.12s ease;

	&:hover {
		opacity: 1;
		color: $text;
	}
}

.snackbar-enter-active,
.snackbar-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.snackbar-enter-from,
.snackbar-leave-to {
	opacity: 0;
	transform: translateY(8px);
}
</style>

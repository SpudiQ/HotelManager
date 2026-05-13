<script setup lang="ts">
import { computed, ref } from "vue";
import type { FormAction, FormActionVariant } from "./types";

interface Props {
	actions: FormAction[];
}
const props = defineProps<Props>();

const activeKey = ref<string | null>(null);
const isLoading = computed(() => activeKey.value !== null);

const runAction = async (action: FormAction) => {
	if (isLoading.value) return;
	const result = action.onClick?.();
	if (result instanceof Promise) {
		activeKey.value = action.key;
		try {
			await result;
		} finally {
			activeKey.value = null;
		}
	}
};

const onFormSubmit = () => {
	const submit = props.actions.find((a) => a.type === "submit");
	if (submit) void runAction(submit);
};

const defaultVariant = (a: FormAction): FormActionVariant =>
	a.variant ?? (a.type === "submit" ? "primary" : "ghost");

const isDisabled = (a: FormAction): boolean =>
	(isLoading.value && activeKey.value !== a.key) || Boolean(a.disabled);
</script>

<template>
	<form class="form" @submit.prevent="onFormSubmit">
		<slot :loading="isLoading" />

		<div class="form__actions">
			<AppButton
				v-for="a in actions"
				:key="a.key"
				:type="a.type === 'submit' ? 'submit' : 'button'"
				:variant="defaultVariant(a)"
				:disabled="isDisabled(a)"
				:loading="activeKey === a.key"
				@click="a.type === 'submit' ? undefined : runAction(a)"
			>
				{{ a.label }}
			</AppButton>
		</div>
	</form>
</template>

<style lang="scss" scoped>
.form {
	display: flex;
	flex-direction: column;
	gap: 24px;
	padding: 24px;
	background: $surface;
	border: 1px solid $border;
}

.form__actions {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	flex-wrap: wrap;
}

:slotted(.form__section) {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

:slotted(.form__section--full) {
	gap: 8px;
}

:slotted(.form__section-head) {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

:slotted(.form__section-title) {
	@include h3-bold;
	color: $text;
}

:slotted(.form__section-hint) {
	@include text-2;
	color: $text-muted;
}

:slotted(.form__grid) {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 16px;

	@media (max-width: 720px) {
		grid-template-columns: 1fr;
	}
}

:slotted(.form__row) {
	display: flex;
	align-items: center;
	gap: 16px;
	flex-wrap: wrap;
}

:slotted(.form__label) {
	@include text-2-medium;
	color: $text;
}
</style>

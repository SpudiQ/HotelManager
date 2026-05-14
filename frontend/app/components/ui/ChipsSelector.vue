<script setup lang="ts" generic="T extends string">
import { computed } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";

interface ChipOption {
	value: T;
	label: string;
	icon?: unknown;
}

interface Props {
	modelValue: T[];
	options: ChipOption[];
	disabled?: boolean;
	label?: string;
}

const props = withDefaults(defineProps<Props>(), {
	disabled: false,
	label: "",
});

const emit = defineEmits<{
	"update:modelValue": [value: T[]];
}>();

const selected = computed<Set<T>>(() => new Set(props.modelValue));

const onToggle = (value: T) => {
	if (props.disabled) return;
	const next = new Set(selected.value);
	if (next.has(value)) next.delete(value);
	else next.add(value);
	emit(
		"update:modelValue",
		props.options.map((o) => o.value).filter((v) => next.has(v)),
	);
};
</script>

<template>
	<div class="chips" :class="{ 'chips--disabled': disabled }">
		<span v-if="label" class="chips__label">{{ label }}</span>
		<div class="chips__grid" role="group" :aria-label="label || undefined">
			<button
				v-for="option in options"
				:key="option.value"
				type="button"
				class="chip"
				:class="{ 'chip--active': selected.has(option.value) }"
				:aria-pressed="selected.has(option.value)"
				:disabled="disabled"
				@click="onToggle(option.value)"
			>
				<HugeiconsIcon
					v-if="option.icon"
					:icon="option.icon"
					:size="16"
					:stroke-width="1.5"
				/>
				<span>{{ option.label }}</span>
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.chips {
	display: flex;
	flex-direction: column;
	gap: 8px;
	min-width: 0;
}

.chips--disabled {
	opacity: 0.6;
}

.chips__label {
	@include text-2-medium;
	color: $text;
}

.chips__grid {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.chip {
	@include text-2;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 8px 12px;
	background: $surface-alt;
	color: $text;
	border: 1px solid $border;
	cursor: pointer;
	transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

	&:hover:not(:disabled):not(.chip--active) {
		background: $surface-alt;
		color: $text;
		border-color: $border-hover;
	}

	&:focus-visible {
		@include focus-ring;
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
}

.chip--active {
	background: $text;
	color: $surface;
	border-color: $text;
}
</style>

<script setup lang="ts">
import { useId } from "vue";

interface Option {
	value: string;
	label: string;
}

interface Props {
	modelValue: string;
	options: Option[];
	label?: string;
	disabled?: boolean;
	required?: boolean;
}

withDefaults(defineProps<Props>(), {
	label: "",
	disabled: false,
	required: false,
});

const emit = defineEmits<{
	"update:modelValue": [value: string];
}>();

const selectId = useId();

const onChange = (event: Event) => {
	const target = event.target as HTMLSelectElement;
	emit("update:modelValue", target.value);
};
</script>

<template>
	<div class="field">
		<label v-if="label" :for="selectId" class="field__label">
			{{ label }}
			<span v-if="required" class="field__required" aria-hidden="true">*</span>
		</label>
		<select
			:id="selectId"
			:value="modelValue"
			:disabled="disabled"
			:required="required"
			class="field__select"
			@change="onChange"
		>
			<option v-for="o in options" :key="o.value" :value="o.value">
				{{ o.label }}
			</option>
		</select>
	</div>
</template>

<style lang="scss" scoped>
.field {
	display: flex;
	flex-direction: column;
	gap: 6px;
	min-width: 0;
}

.field__label {
	@include text-2-medium;
	color: $text;
}

.field__required {
	color: $danger;
	margin-left: 2px;
}

.field__select {
	@include text-2;
	width: 100%;
	padding: 10px 12px;
	background: $surface;
	color: $text;
	border: 1px solid $border;
	cursor: pointer;
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
</style>

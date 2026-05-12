<script setup lang="ts">
import { computed, ref, useId } from "vue";

interface Props {
	modelValue: string;
	type?: "text" | "email" | "tel" | "url" | "number" | "search";
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
	mask?: string;
	error?: string;
	prefix?: string;
	autocomplete?: string;
	spellcheck?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	type: "text",
	label: "",
	placeholder: "",
	disabled: false,
	required: false,
	mask: "",
	error: "",
	prefix: "",
	autocomplete: "off",
	spellcheck: true,
});

const emit = defineEmits<{
	"update:modelValue": [value: string];
}>();

const inputId = useId();
const inputEl = ref<HTMLInputElement | null>(null);

const onInput = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit("update:modelValue", target.value);
};

const hasPrefix = computed(() => props.prefix.length > 0);

defineExpose({
	focus: () => inputEl.value?.focus(),
	select: () => inputEl.value?.select(),
});
</script>

<template>
	<div class="field">
		<label v-if="label" :for="inputId" class="field__label">
			{{ label }}
			<span v-if="required" class="field__required" aria-hidden="true">*</span>
		</label>
		<div class="field__control" :class="{ 'field__control--prefixed': hasPrefix }">
			<span v-if="hasPrefix" class="field__prefix">{{ prefix }}</span>
			<input
				v-if="mask"
				:id="inputId"
				ref="inputEl"
				v-maska="mask"
				:value="modelValue"
				:type="type"
				:placeholder="placeholder"
				:disabled="disabled"
				:required="required"
				:autocomplete="autocomplete"
				:spellcheck="spellcheck"
				class="field__input"
				:class="{ 'field__input--invalid': !!error }"
				@input="onInput"
			/>
			<input
				v-else
				:id="inputId"
				ref="inputEl"
				:value="modelValue"
				:type="type"
				:placeholder="placeholder"
				:disabled="disabled"
				:required="required"
				:autocomplete="autocomplete"
				:spellcheck="spellcheck"
				class="field__input"
				:class="{ 'field__input--invalid': !!error }"
				@input="onInput"
			/>
		</div>
		<span v-if="error" class="field__error">{{ error }}</span>
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

.field__control {
	position: relative;
	display: flex;
	align-items: stretch;
}

.field__prefix {
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	@include text-2;
	color: $text-muted;
	pointer-events: none;
}

.field__control--prefixed .field__input {
	padding-left: 24px;
}

.field__input {
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

.field__input--invalid {
	border-color: $danger;
}

.field__error {
	@include caption-medium;
	color: $danger;
}
</style>

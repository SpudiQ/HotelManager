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
	toggleable?: boolean;
	enabled?: boolean;
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
	toggleable: false,
	enabled: true,
});

const emit = defineEmits<{
	"update:modelValue": [value: string];
	"update:enabled": [value: boolean];
}>();

const inputId = useId();
const inputEl = ref<HTMLInputElement | null>(null);

const onInput = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit("update:modelValue", target.value);
};

const hasPrefix = computed(() => props.prefix.length > 0);
const effectiveDisabled = computed(
	() => props.disabled || (props.toggleable && !props.enabled),
);

const onToggle = () => {
	if (props.disabled) return;
	emit("update:enabled", !props.enabled);
};

const onToggleKeydown = (event: KeyboardEvent) => {
	if (props.disabled) return;
	if (event.key === " " || event.key === "Enter") {
		event.preventDefault();
		emit("update:enabled", !props.enabled);
	}
};

defineExpose({
	focus: () => inputEl.value?.focus(),
	select: () => inputEl.value?.select(),
});
</script>

<template>
	<div class="field">
		<label
			v-if="label && !toggleable"
			:for="inputId"
			class="field__label"
		>
			{{ label }}
			<span v-if="required" class="field__required" aria-hidden="true">*</span>
		</label>
		<div
			v-else-if="label && toggleable"
			class="field__label field__label--toggleable"
			:class="{ 'field__label--off': !enabled, 'field__label--disabled': disabled }"
			role="switch"
			tabindex="0"
			:aria-checked="enabled"
			:aria-disabled="disabled"
			@click="onToggle"
			@keydown="onToggleKeydown"
		>
			<span class="field__label-text">
				{{ label }}
				<span v-if="required" class="field__required" aria-hidden="true">*</span>
			</span>
			<span
				class="field__mini-switch"
				:class="{ 'field__mini-switch--on': enabled }"
				aria-hidden="true"
			>
				<span
					class="field__mini-switch-thumb"
					:class="{ 'field__mini-switch-thumb--on': enabled }"
				/>
			</span>
		</div>
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
				:disabled="effectiveDisabled"
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
				:disabled="effectiveDisabled"
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

.field__label--toggleable {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	user-select: none;
	width: fit-content;
	outline: none;

	&:focus-visible {
		@include focus-ring;
	}
}

.field__label--off {
	color: $text-muted;
}

.field__label--disabled {
	cursor: not-allowed;
	opacity: 0.6;
}

.field__label-text {
	display: inline-flex;
	align-items: center;
}

.field__mini-switch {
	position: relative;
	display: inline-block;
	width: 26px;
	height: 14px;
	border-radius: 999px;
	background: $border;
	border: 1px solid $border-hover;
	transition: background 0.15s ease, border-color 0.15s ease;
	flex-shrink: 0;
}

.field__mini-switch--on {
	background: $text;
	border-color: $text;
}

.field__mini-switch-thumb {
	position: absolute;
	top: 1px;
	left: 1px;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: $surface;
	transition: transform 0.18s ease;
}

.field__mini-switch-thumb--on {
	transform: translateX(12px);
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
	padding-left: 28px;
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
		opacity: 0.6;
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

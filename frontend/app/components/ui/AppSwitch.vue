<script setup lang="ts">
interface Props {
	modelValue: boolean;
	label?: string;
	disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	label: "",
	disabled: false,
});

const emit = defineEmits<{
	"update:modelValue": [value: boolean];
}>();

const onToggle = () => {
	if (props.disabled) return;
	emit("update:modelValue", !props.modelValue);
};

const onKeydown = (event: KeyboardEvent) => {
	if (props.disabled) return;
	if (event.key === " " || event.key === "Enter") {
		event.preventDefault();
		emit("update:modelValue", !props.modelValue);
	}
};
</script>

<template>
	<label class="switch" :class="{ 'switch--disabled': disabled }">
		<button
			type="button"
			role="switch"
			class="switch__track"
			:class="{ 'switch__track--on': modelValue }"
			:aria-checked="modelValue"
			:disabled="disabled"
			@click="onToggle"
			@keydown="onKeydown"
		>
			<span class="switch__thumb" :class="{ 'switch__thumb--on': modelValue }" />
		</button>
		<span v-if="label" class="switch__label">{{ label }}</span>
	</label>
</template>

<style lang="scss" scoped>
.switch {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	user-select: none;
}

.switch--disabled {
	cursor: not-allowed;
	opacity: 0.6;
}

.switch__track {
	position: relative;
	width: 40px;
	height: 22px;
	padding: 0;
	border-radius: 999px;
	background: $border;
	border: 1px solid $border-hover;
	cursor: pointer;
	transition: background 0.15s ease, border-color 0.15s ease;

	&:disabled {
		cursor: not-allowed;
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.switch__track--on {
	background: $text;
	border-color: $text;
}

.switch__thumb {
	position: absolute;
	top: 2px;
	left: 2px;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: $surface;
	transition: transform 0.18s ease;
}

.switch__thumb--on {
	transform: translateX(18px);
}

.switch__label {
	@include text-2;
	color: $text;
}
</style>

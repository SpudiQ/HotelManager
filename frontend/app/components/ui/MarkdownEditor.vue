<script setup lang="ts">
import "@toast-ui/editor/dist/toastui-editor.css";
import type EditorClass from "@toast-ui/editor";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

interface Props {
	modelValue: string;
	height?: string;
	placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
	height: "360px",
	placeholder: "",
});

const emit = defineEmits<{
	"update:modelValue": [value: string];
}>();

const containerEl = ref<HTMLDivElement | null>(null);
let editor: InstanceType<typeof EditorClass> | null = null;
let suppressEmit = false;

onMounted(async () => {
	if (!import.meta.client || !containerEl.value) return;

	const { default: Editor } = await import("@toast-ui/editor");

	editor = new Editor({
		el: containerEl.value,
		height: props.height,
		initialValue: props.modelValue ?? "",
		previewStyle: "tab",
		initialEditType: "markdown",
		usageStatistics: false,
		placeholder: props.placeholder,
		hideModeSwitch: false,
	});

	editor.on("change", () => {
		if (suppressEmit || !editor) return;
		emit("update:modelValue", editor.getMarkdown());
	});
});

watch(
	() => props.modelValue,
	(value) => {
		if (!editor) return;
		const current = editor.getMarkdown();
		if (current === value) return;
		suppressEmit = true;
		editor.setMarkdown(value ?? "");
		suppressEmit = false;
	},
);

onBeforeUnmount(() => {
	if (editor) {
		editor.destroy();
		editor = null;
	}
});
</script>

<template>
	<div ref="containerEl" class="md-editor" :style="{ minHeight: height }" />
</template>

<style lang="scss" scoped>
.md-editor {
	border: 1px solid $border;
	background: $surface;
}
</style>

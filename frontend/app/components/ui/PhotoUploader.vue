<script setup lang="ts">
import { computed, ref } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import {
	CloudUploadIcon,
	Delete02Icon,
	ArrowLeft02Icon,
	ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { uploadPhotos } from "~/modules/admin/api/uploads";
import { useSnackbarStore } from "~/stores/snackbar";
import type { PhotoMeta } from "~/types/photo";
import { resolvePhotoUrl } from "~/utils/photo";

interface Props {
	modelValue: PhotoMeta[];
	prefix?: string;
	maxCount?: number;
	maxSizeMB?: number;
	accept?: string;
	disabled?: boolean;
	label?: string;
}

const props = withDefaults(defineProps<Props>(), {
	prefix: "misc",
	maxCount: 10,
	maxSizeMB: 5,
	accept: "image/jpeg,image/png,image/webp",
	disabled: false,
	label: "",
});

const emit = defineEmits<{
	"update:modelValue": [value: PhotoMeta[]];
}>();

const snackbar = useSnackbarStore();
const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const isDragging = ref(false);

const remainingSlots = computed(() =>
	Math.max(0, props.maxCount - props.modelValue.length),
);
const canUpload = computed(
	() => !props.disabled && !isUploading.value && remainingSlots.value > 0,
);

const validate = (files: File[]): File[] => {
	const acceptedTypes = props.accept.split(",").map((s) => s.trim());
	const maxBytes = props.maxSizeMB * 1024 * 1024;
	const accepted: File[] = [];
	for (const file of files) {
		if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
			snackbar.show(`Файл "${file.name}": неподдерживаемый тип`, "error");
			continue;
		}
		if (file.size > maxBytes) {
			snackbar.show(`Файл "${file.name}" больше ${props.maxSizeMB} МБ`, "error");
			continue;
		}
		accepted.push(file);
	}
	if (accepted.length > remainingSlots.value) {
		snackbar.show(`Можно загрузить не больше ${props.maxCount} фото`, "error");
		return accepted.slice(0, remainingSlots.value);
	}
	return accepted;
};

const upload = async (files: File[]) => {
	const valid = validate(files);
	if (valid.length === 0) return;
	isUploading.value = true;
	try {
		const uploaded = await uploadPhotos(valid, props.prefix);
		emit("update:modelValue", [...props.modelValue, ...uploaded]);
	} catch {
		snackbar.show("Не удалось загрузить файлы", "error");
	} finally {
		isUploading.value = false;
	}
};

const onPickClick = () => {
	if (!canUpload.value) return;
	fileInput.value?.click();
};

const onFileChange = async (event: Event) => {
	const input = event.target as HTMLInputElement;
	const files = input.files ? Array.from(input.files) : [];
	input.value = "";
	if (files.length > 0) await upload(files);
};

const onDrop = async (event: DragEvent) => {
	isDragging.value = false;
	if (!canUpload.value) return;
	const files = event.dataTransfer?.files
		? Array.from(event.dataTransfer.files)
		: [];
	if (files.length > 0) await upload(files);
};

const onDragOver = () => {
	if (!canUpload.value) return;
	isDragging.value = true;
};

const onDragLeave = () => {
	isDragging.value = false;
};

const onRemove = (index: number) => {
	if (props.disabled) return;
	const next = [...props.modelValue];
	next.splice(index, 1);
	emit("update:modelValue", next);
};

const move = (index: number, dir: -1 | 1) => {
	const target = index + dir;
	if (target < 0 || target >= props.modelValue.length) return;
	const next = [...props.modelValue];
	const [item] = next.splice(index, 1);
	next.splice(target, 0, item);
	emit("update:modelValue", next);
};
</script>

<template>
	<div class="uploader" :class="{ 'uploader--disabled': disabled }">
		<span v-if="label" class="uploader__label">{{ label }}</span>

		<div
			class="uploader__drop"
			:class="{
				'uploader__drop--active': isDragging,
				'uploader__drop--disabled': !canUpload,
			}"
			@click="onPickClick"
			@dragover.prevent="onDragOver"
			@dragleave.prevent="onDragLeave"
			@drop.prevent="onDrop"
		>
			<HugeiconsIcon :icon="CloudUploadIcon" :size="20" :stroke-width="1.5" />
			<div class="uploader__drop-text">
				<span class="uploader__drop-title">
					{{
						isUploading
							? "Загрузка..."
							: "Перетащите фото или нажмите для выбора"
					}}
				</span>
				<span class="uploader__drop-hint">
					До {{ maxCount }} файлов, JPEG/PNG/WebP, не более {{ maxSizeMB }} МБ
				</span>
			</div>
			<input
				ref="fileInput"
				type="file"
				multiple
				:accept="accept"
				class="uploader__input"
				:disabled="!canUpload"
				@change="onFileChange"
			/>
		</div>

		<ul v-if="modelValue.length" class="uploader__list">
			<li v-for="(photo, idx) in modelValue" :key="photo.key" class="thumb">
				<img
					:src="resolvePhotoUrl(photo)"
					:alt="`Фото ${idx + 1}`"
					class="thumb__img"
				/>
				<div class="thumb__bar">
					<button
						type="button"
						class="thumb__btn"
						aria-label="Сдвинуть влево"
						:disabled="disabled || idx === 0"
						@click="move(idx, -1)"
					>
						<HugeiconsIcon
							:icon="ArrowLeft02Icon"
							:size="14"
							:stroke-width="2"
						/>
					</button>
					<button
						type="button"
						class="thumb__btn"
						aria-label="Сдвинуть вправо"
						:disabled="disabled || idx === modelValue.length - 1"
						@click="move(idx, 1)"
					>
						<HugeiconsIcon
							:icon="ArrowRight02Icon"
							:size="14"
							:stroke-width="2"
						/>
					</button>
					<button
						type="button"
						class="thumb__btn thumb__btn--danger"
						aria-label="Удалить"
						:disabled="disabled"
						@click="onRemove(idx)"
					>
						<HugeiconsIcon
							:icon="Delete02Icon"
							:size="14"
							:stroke-width="2"
						/>
					</button>
				</div>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
.uploader {
	display: flex;
	flex-direction: column;
	gap: 8px;
	min-width: 0;
}

.uploader--disabled {
	opacity: 0.6;
}

.uploader__label {
	@include text-2-medium;
	color: $text;
}

.uploader__drop {
	position: relative;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 16px;
	background: $surface-alt;
	border: 1px dashed $border;
	cursor: pointer;
	transition: border-color 0.15s ease, background 0.15s ease;
	color: $text-muted;

	&:hover:not(.uploader__drop--disabled) {
		border-color: $text;
		color: $text;
	}
}

.uploader__drop--active {
	border-color: $text;
	background: $surface-alt;
	color: $text;
}

.uploader__drop--disabled {
	cursor: not-allowed;
}

.uploader__drop-text {
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.uploader__drop-title {
	@include text-2-medium;
	color: $text;
}

.uploader__drop-hint {
	@include caption-medium;
	color: $text-subtle;
}

.uploader__input {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	cursor: pointer;

	&:disabled {
		cursor: not-allowed;
	}
}

.uploader__list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	gap: 8px;
	list-style: none;
	margin: 0;
	padding: 0;
}

.thumb {
	position: relative;
	aspect-ratio: 1 / 1;
	overflow: hidden;
	background: $surface-alt;
	border: 1px solid $border;
}

.thumb__img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.thumb__bar {
	position: absolute;
	right: 4px;
	bottom: 4px;
	display: flex;
	gap: 4px;
}

.thumb__btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	background: $surface;
	color: $text;
	border: 1px solid $border;
	cursor: pointer;
	transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

	&:hover:not(:disabled) {
		background: $surface-alt;
		color: $text;
	}

	&:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.thumb__btn--danger:hover:not(:disabled) {
	color: $danger;
	border-color: $danger;
}
</style>

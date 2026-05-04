<script setup lang="ts">
import { HugeiconsIcon } from "@hugeicons/vue";
import {
	// BoneIcon,
	ChildIcon,
	MinusSignIcon,
	PlusSignIcon,
	UserIcon,
} from "@hugeicons/core-free-icons";

type GuestKey = "adults" | "children" | "pets";
type GuestCounts = Record<GuestKey, number>;

type RowConfig = {
	key: GuestKey;
	label: string;
	hint?: string;
	icon: typeof UserIcon;
	min: number;
	max: number;
};

const props = defineProps<{
	modelValue: GuestCounts;
	config?: RowConfig[];
}>();

const emit = defineEmits<{
	"update:modelValue": [value: GuestCounts];
}>();

const defaultConfig: RowConfig[] = [
	{
		key: "adults",
		label: "Взрослые",
		icon: UserIcon,
		min: 1,
		max: 12,
	},
	{
		key: "children",
		label: "Дети",
		hint: "до 18 лет",
		icon: ChildIcon,
		min: 0,
		max: 8,
	},
	// { key: "pets", label: "Питомцы", icon: BoneIcon, min: 0, max: 4 }, // NOTE: пока неизвестно, нужен ли функционал питомцев, на будущее оставлю
];

const rows = computed<RowConfig[]>(() => props.config ?? defaultConfig);

const update = (key: GuestKey, delta: number) => {
	const row = rows.value.find((rowConfig) => rowConfig.key === key);
	if (!row) return;
	const next = Math.max(
		row.min,
		Math.min(row.max, props.modelValue[key] + delta),
	);
	if (next === props.modelValue[key]) return;
	emit("update:modelValue", { ...props.modelValue, [key]: next });
};
</script>

<template>
	<div class="guest-counter">
		<div
			v-for="row in rows"
			:key="row.key"
			class="row"
		>
			<div class="info">
				<HugeiconsIcon
					:icon="row.icon"
					:size="20"
					:stroke-width="1.5"
					class="icon"
				/>
				<div class="text">
					<span class="label">{{ row.label }}</span>
					<span
						v-if="row.hint"
						class="hint"
						>{{ row.hint }}</span
					>
				</div>
			</div>
			<div class="stepper">
				<button
					type="button"
					class="btn"
					:disabled="modelValue[row.key] <= row.min"
					:aria-label="`Уменьшить ${row.label}`"
					@click="update(row.key, -1)"
				>
					<HugeiconsIcon
						:icon="MinusSignIcon"
						:size="14"
						:stroke-width="2"
					/>
				</button>
				<span class="value">{{ modelValue[row.key] }}</span>
				<button
					type="button"
					class="btn"
					:disabled="modelValue[row.key] >= row.max"
					:aria-label="`Увеличить ${row.label}`"
					@click="update(row.key, 1)"
				>
					<HugeiconsIcon
						:icon="PlusSignIcon"
						:size="14"
						:stroke-width="2"
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.guest-counter {
	display: flex;
	flex-direction: column;
}

.row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 14px 0;

	& + .row {
		border-top: 1px solid $border;
	}
}

.info {
	display: flex;
	align-items: center;
	gap: 12px;
	min-width: 0;
}

.icon {
	color: $text;
	flex-shrink: 0;
}

.text {
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.label {
	@include text-2-medium;
	color: $text;
}

.hint {
	@include caption;
	color: $text-muted;
}

.stepper {
	display: flex;
	align-items: center;
	gap: 4px;
	flex-shrink: 0;
}

.btn {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	border: 1px solid $border;
	display: flex;
	align-items: center;
	justify-content: center;
	color: $text;
	transition:
		border-color 0.15s ease,
		color 0.15s ease,
		background 0.15s ease;

	&:not(:disabled):hover {
		border-color: $text;
		background: $surface;
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

.value {
	@include text-2-medium;
	color: $text;
	min-width: 24px;
	text-align: center;
	font-variant-numeric: tabular-nums;
}
</style>

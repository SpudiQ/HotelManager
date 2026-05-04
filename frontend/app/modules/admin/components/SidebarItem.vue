<script setup lang="ts">
import { HugeiconsIcon } from "@hugeicons/vue";
import type { IconArray } from "@hugeicons/vue";

interface Props {
	icon: IconArray;
	tooltip: string;
	to?: string;
	active?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ click: [event: MouseEvent] }>();

const onClick = (event: MouseEvent) => {
	emit("click", event);
};
</script>

<template>
	<NuxtLink
		:to="props.to"
		:type="props.to ? undefined : 'button'"
		class="item"
		:class="{ 'item--active': props.active }"
		@click="onClick"
	>
		<HugeiconsIcon :icon="props.icon" :size="20" :stroke-width="1.5" />
		<span class="tip">{{ props.tooltip }}</span>
	</NuxtLink>
</template>

<style lang="scss" scoped>
.item {
	position: relative;
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: transparent;
	border: 1px solid transparent;
	color: $text-muted;
	cursor: pointer;
	transition: color 0.12s ease, background 0.12s ease, border-color 0.12s ease;

	&:hover {
		color: $text;
		background: $surface-alt;

		.tip {
			opacity: 1;
			transform: translate(0, -50%);
		}
	}

	&:focus-visible {
		@include focus-ring;
	}

	&--active {
		color: $text;
		background: $surface-alt;
		border-color: $border;
	}
}

.tip {
	position: absolute;
	left: calc(100% + 10px);
	top: 50%;
	transform: translate(-4px, -50%);
	padding: 4px 8px;
	background: $text;
	color: $surface;
	@include caption-medium;
	white-space: nowrap;
	pointer-events: none;
	opacity: 0;
	transition: opacity 0.12s ease, transform 0.12s ease;
	z-index: 60;
}
</style>

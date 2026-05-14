<script setup lang="ts">
import { computed } from "vue";

interface Props {
	cols: string;
	colsMd?: string;
	colsSm?: string;
	loading?: boolean;
	empty?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	colsMd: undefined,
	colsSm: undefined,
	loading: false,
	empty: false,
});

const styles = computed(() => ({
	"--table-cols": props.cols,
	"--table-cols-md": props.colsMd ?? props.cols,
	"--table-cols-sm": props.colsSm ?? props.cols,
}));
</script>

<template>
	<div class="table" :style="styles">
		<slot name="header" />

		<div class="table__body">
			<div v-if="loading" class="row-skeleton" aria-hidden="true" />
			<slot v-else />
		</div>

		<slot v-if="empty && !loading" name="empty" />
	</div>
</template>

<style lang="scss" scoped>
.table {
	display: flex;
	flex-direction: column;
	background: $surface;
	border: 1px solid $border;
}

.table__body {
	display: flex;
	flex-direction: column;
}

.row-skeleton {
	height: 48px;
	background: linear-gradient(90deg, $bg 0%, $border 50%, $bg 100%);
	background-size: 200% auto;
	animation: v-skel-shimmer 1.8s linear infinite;
}

@media (max-width: 639px) {
	.table {
		background: transparent;
		border: 0;
	}

	.table__body {
		gap: 12px;
	}
}
</style>

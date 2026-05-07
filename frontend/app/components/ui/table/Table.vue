<script setup lang="ts">
interface Props {
	cols: string;
	loading?: boolean;
	empty?: boolean;
}

withDefaults(defineProps<Props>(), {
	loading: false,
	empty: false,
});
</script>

<template>
	<div class="table" :style="{ '--table-cols': cols }">
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
</style>

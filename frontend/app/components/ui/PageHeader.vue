<script setup lang="ts">
interface Props {
	title: string;
	subtitle?: string;
}
defineProps<Props>();
</script>

<template>
	<header class="page-header">
		<div class="page-header__text">
			<h1 class="page-header__title">{{ title }}</h1>
			<p v-if="subtitle" class="page-header__sub">{{ subtitle }}</p>
		</div>
		<div v-if="$slots.actions" class="page-header__actions">
			<slot name="actions" />
		</div>
	</header>
</template>

<style lang="scss" scoped>
.page-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16px;
	flex-wrap: wrap;
}

.page-header__text {
	display: flex;
	flex-direction: column;
	gap: 6px;
	min-width: 0;
}

.page-header__title {
	@include h1-bold;
	color: $text;
}

.page-header__sub {
	@include text-2;
	color: $text-muted;
}

.page-header__actions {
	display: flex;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
}
</style>

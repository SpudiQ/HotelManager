<script setup lang="ts">
interface Props {
	name: string;
	description?: string;
}
withDefaults(defineProps<Props>(), { description: "" });
</script>

<template>
	<div class="cell">
		<span class="name">{{ name }}</span>
		<span v-if="description" class="description">{{ description }}</span>
	</div>
</template>

<style lang="scss" scoped>
.cell {
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.name {
	@include text-2-medium;
	color: $text;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.description {
	@include caption;
	color: $text-subtle;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>

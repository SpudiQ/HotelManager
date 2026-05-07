<script setup lang="ts">
interface Props {
	active: boolean;
	activeLabel?: string;
	inactiveLabel?: string;
}
withDefaults(defineProps<Props>(), {
	activeLabel: "Активен",
	inactiveLabel: "Неактивен",
});
</script>

<template>
	<div class="cell">
		<span class="status" :class="active ? 'status--success' : 'status--danger'">
			{{ active ? activeLabel : inactiveLabel }}
		</span>
	</div>
</template>

<style lang="scss" scoped>
.cell {
	min-width: 0;
}

.status {
	@include caption-medium;
	display: inline-block;
	padding: 2px 8px;
	border: 1px solid currentColor;
}

.status--success {
	color: $success;
}

.status--danger {
	color: $danger;
}
</style>

<script setup lang="ts"></script>

<template>
	<div class="actions">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.actions {
	display: flex;
	justify-content: flex-end;
	gap: 4px;
	min-width: 0;
}
</style>

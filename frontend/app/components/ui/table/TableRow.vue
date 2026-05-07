<script setup lang="ts"></script>

<template>
	<div class="row">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.row {
	display: grid;
	grid-template-columns: var(--table-cols);
	gap: 12px;
	align-items: center;
	padding: 12px 16px;
	transition: background 0.12s ease;

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background: $surface-alt;
	}
}
</style>

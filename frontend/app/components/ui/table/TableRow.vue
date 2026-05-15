<script setup lang="ts">
defineProps<{ clickable?: boolean }>();
</script>

<template>
	<div class="row" :class="{ 'row--clickable': clickable }">
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

.row--clickable {
	cursor: pointer;
}

@media (max-width: 1023px) {
	.row {
		grid-template-columns: var(--table-cols-md, var(--table-cols));
	}

	:deep([data-priority="md"]) {
		display: none;
	}
}

@media (max-width: 639px) {
	.row {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 12px;
		padding: 16px;
		background: $surface;
		border: 1px solid $border;

		&:hover {
			background: $surface;
		}
	}

	:deep([data-priority="md"]) {
		display: block;
	}

	:deep([data-card-label])::before {
		content: attr(data-card-label);
		display: block;
		@include caption-medium;
		color: $text-muted;
		margin-bottom: 4px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
}
</style>

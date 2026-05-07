<script setup lang="ts">
import { HugeiconsIcon } from "@hugeicons/vue";
import { ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import type { SortState, TableColumn } from "./types";

interface Props {
	columns: TableColumn[];
	sort?: SortState | null;
}

const props = withDefaults(defineProps<Props>(), {
	sort: null,
});

const emit = defineEmits<{
	"update:sort": [value: SortState | null];
}>();

const onHeaderClick = (column: TableColumn) => {
	if (!column.sortable) return;
	const current = props.sort;
	if (!current || current.key !== column.key) {
		emit("update:sort", { key: column.key, dir: "asc" });
		return;
	}
	if (current.dir === "asc") {
		emit("update:sort", { key: column.key, dir: "desc" });
		return;
	}
	emit("update:sort", null);
};
</script>

<template>
	<div class="head">
		<div
			v-for="column in columns"
			:key="column.key"
			class="cell"
			:class="{ 'cell--sortable': column.sortable, 'cell--active': sort?.key === column.key }"
			:role="column.sortable ? 'button' : undefined"
			:tabindex="column.sortable ? 0 : undefined"
			@click="onHeaderClick(column)"
			@keydown.enter.prevent="onHeaderClick(column)"
			@keydown.space.prevent="onHeaderClick(column)"
		>
			<span class="label">{{ column.label }}</span>
			<HugeiconsIcon
				v-if="column.sortable && sort?.key === column.key"
				:icon="sort.dir === 'asc' ? ArrowUp01Icon : ArrowDown01Icon"
				:size="12"
				:stroke-width="2"
				class="arrow"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.head {
	display: grid;
	grid-template-columns: var(--table-cols);
	gap: 12px;
	align-items: center;
	padding: 12px 16px;
	background: $surface-alt;
	border-bottom: 1px solid $border;
}

.cell {
	@include caption-medium;
	display: inline-flex;
	align-items: center;
	gap: 4px;
	min-width: 0;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: $text-muted;
	user-select: none;
}

.cell--sortable {
	cursor: pointer;
	transition: color 0.12s ease;

	&:hover,
	&.cell--active {
		color: $text;
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.label {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.arrow {
	flex-shrink: 0;
}
</style>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import { Edit02Icon, Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Property } from "../types/property";
import { PROPERTY_TYPE_LABELS } from "../constants/property-labels";
import { usePropertiesStore } from "~/stores/properties";
import { useSnackbarStore } from "~/stores/snackbar";
import type { SortState, TableColumn } from "~/components/ui/table/types";

interface Props {
	workspaceId: string;
}
const props = defineProps<Props>();

const propertiesStore = usePropertiesStore();
const snackbar = useSnackbarStore();
const { items, isLoading } = storeToRefs(propertiesStore);

const dialogOpen = ref(false);
const dialogBusy = ref(false);
const target = ref<Property | null>(null);
const sort = ref<SortState | null>(null);

const workspaceIdRef = computed(() => props.workspaceId);
const { error } = await useAsyncData(
	`properties-${props.workspaceId}`,
	() => propertiesStore.fetchByWorkspace(workspaceIdRef.value),
	{ watch: [workspaceIdRef] },
);
onMounted(() => {
	if (error.value) snackbar.show("Не удалось загрузить properties", "error");
});
watch(error, (e) => {
	if (e) snackbar.show("Не удалось загрузить properties", "error");
});

const columns: TableColumn[] = [
	{ key: "name", label: "Имя", sortable: true },
	{ key: "type", label: "Тип", sortable: true },
	{ key: "address", label: "Адрес", sortable: true },
	{ key: "isActive", label: "Статус", sortable: true },
	{ key: "actions", label: "Действия" },
];

const COLS = "minmax(220px, 2fr) minmax(120px, 1fr) minmax(160px, 1.4fr) minmax(120px, 0.8fr) 96px";

const sortedItems = computed<Property[]>(() => {
	if (!sort.value) return items.value;
	const { key, dir } = sort.value;
	const factor = dir === "asc" ? 1 : -1;
	const list = [...items.value];
	list.sort((a, b) => {
		const av = (a as unknown as Record<string, unknown>)[key];
		const bv = (b as unknown as Record<string, unknown>)[key];
		if (typeof av === "boolean" && typeof bv === "boolean") {
			return (Number(av) - Number(bv)) * factor;
		}
		const as = av == null ? "" : String(av);
		const bs = bv == null ? "" : String(bv);
		return as.localeCompare(bs, "ru") * factor;
	});
	return list;
});

const isEmpty = computed(() => !isLoading.value && items.value.length === 0);

const onCreateClick = () => {
	snackbar.show("Создание property в разработке", "success");
};

const onEditClick = (_p: Property) => {
	snackbar.show("Редактирование в разработке", "success");
};

const onDeleteClick = (p: Property) => {
	target.value = p;
	dialogOpen.value = true;
};

const onDialogCancel = () => {
	if (dialogBusy.value) return;
	dialogOpen.value = false;
	target.value = null;
};

const onDialogConfirm = async () => {
	if (!target.value) return;
	dialogBusy.value = true;
	try {
		await propertiesStore.remove(target.value.id);
		snackbar.show("Property удалена", "success");
		dialogOpen.value = false;
		target.value = null;
	} catch {
		snackbar.show("Не удалось удалить property", "error");
	} finally {
		dialogBusy.value = false;
	}
};
</script>

<template>
	<section class="properties">
		<header class="properties__head">
			<div class="properties__heading">
				<h2 class="properties__title">Properties</h2>
				<span class="properties__count">{{ items.length }}</span>
			</div>
			<button type="button" class="properties__create" @click="onCreateClick">
				<HugeiconsIcon :icon="PlusSignIcon" :size="16" :stroke-width="2" />
				<span>Создать</span>
			</button>
		</header>

		<Table :cols="COLS" :loading="isLoading" :empty="isEmpty">
			<template #header>
				<TableHeader
					:columns="columns"
					:sort="sort"
					@update:sort="sort = $event"
				/>
			</template>

			<TableRow v-for="p in sortedItems" :key="p.id">
				<TableCellName :name="p.name" :description="p.slug" />
				<div class="cell">{{ PROPERTY_TYPE_LABELS[p.type] ?? p.type }}</div>
				<div class="cell cell--muted">{{ p.address || "—" }}</div>
				<TableCellStatus :active="p.isActive" />
				<TableActions>
					<button
						type="button"
						class="iconbtn"
						aria-label="Редактировать"
						@click="onEditClick(p)"
					>
						<HugeiconsIcon :icon="Edit02Icon" :size="18" :stroke-width="1.5" />
					</button>
					<button
						type="button"
						class="iconbtn"
						aria-label="Удалить"
						@click="onDeleteClick(p)"
					>
						<HugeiconsIcon :icon="Delete02Icon" :size="18" :stroke-width="1.5" />
					</button>
				</TableActions>
			</TableRow>

			<template #empty>
				<div class="empty">Properties не найдены</div>
			</template>
		</Table>

		<ConfirmDialog
			:open="dialogOpen"
			title="Удалить property"
			message="Это действие нельзя отменить. Property и связанные данные будут удалены."
			:confirm-phrase="target?.name ?? ''"
			confirm-label="Удалить"
			cancel-label="Отмена"
			variant="danger"
			:busy="dialogBusy"
			@confirm="onDialogConfirm"
			@cancel="onDialogCancel"
		/>
	</section>
</template>

<style lang="scss" scoped>
.properties {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.properties__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.properties__heading {
	display: flex;
	align-items: baseline;
	gap: 10px;
}

.properties__title {
	@include h3-bold;
	color: $text;
}

.properties__count {
	@include caption-medium;
	color: $text-muted;
}

.properties__create {
	@include text-2-medium;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 8px 14px;
	background: $surface;
	color: $text;
	border: 1px solid $border;
	cursor: pointer;
	transition: border-color 0.15s ease;

	&:hover {
		border-color: $text;
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.cell {
	@include text-2;
	color: $text;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.cell--muted {
	color: $text-muted;
}

.iconbtn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	background: transparent;
	color: $text-muted;
	border: 1px solid transparent;
	cursor: pointer;
	transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;

	&:hover {
		border-color: $border;
		color: $text;
		background: $surface;
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.empty {
	@include text-2;
	padding: 48px;
	text-align: center;
	color: $text-subtle;
	background: $surface;
	border-top: 1px dashed $border;
}
</style>

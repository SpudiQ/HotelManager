<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import {
	Edit02Icon,
	Delete02Icon,
	PlusSignIcon,
} from "@hugeicons/core-free-icons";
import type { Unit } from "../types/unit";
import { UNIT_TYPE_LABELS } from "../constants/unit-labels";
import { formatUnitPrice } from "../utils/unit-form";
import { useUnitsStore } from "~/stores/units";
import { useSnackbarStore } from "~/stores/snackbar";
import type { SortState, TableColumn } from "~/components/ui/table/types";

interface Props {
	propertyId: string;
}
const props = defineProps<Props>();

const unitsStore = useUnitsStore();
const snackbar = useSnackbarStore();
const { items, isLoading } = storeToRefs(unitsStore);

const dialogOpen = ref(false);
const dialogBusy = ref(false);
const target = ref<Unit | null>(null);
const sort = ref<SortState | null>(null);

const propertyIdRef = computed(() => props.propertyId);
const { error } = await useAsyncData(
	`units-${props.propertyId}`,
	() => unitsStore.fetchByProperty(propertyIdRef.value),
	{ watch: [propertyIdRef] },
);
onMounted(() => {
	if (error.value) snackbar.show("Не удалось загрузить юниты", "error");
});
watch(error, (e) => {
	if (e) snackbar.show("Не удалось загрузить юниты", "error");
});

const columns: TableColumn[] = [
	{ key: "name", label: "Имя", sortable: true },
	{ key: "type", label: "Тип", sortable: true, priority: "md" },
	{ key: "maxGuests", label: "Гостей", sortable: true, priority: "md" },
	{ key: "price", label: "Цена" },
	{ key: "isActive", label: "Статус", sortable: true },
	{ key: "actions", label: "Действия" },
];

const COLS =
	"minmax(200px, 2fr) minmax(120px, 1fr) minmax(80px, 0.6fr) minmax(160px, 1.2fr) minmax(110px, 0.8fr) 96px";
const COLS_MD = "minmax(200px, 2fr) minmax(160px, 1.2fr) minmax(110px, 0.8fr) 96px";

const sortedItems = computed<Unit[]>(() => {
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
		if (typeof av === "number" && typeof bv === "number") {
			return (av - bv) * factor;
		}
		const as = av == null ? "" : String(av);
		const bs = bv == null ? "" : String(bv);
		return as.localeCompare(bs, "ru") * factor;
	});

	return list;
});

const isEmpty = computed(() => !isLoading.value && items.value.length === 0);

const onCreateClick = () => {
	navigateTo(`/admin/properties/${props.propertyId}/units/create`);
};

const onEditClick = (u: Unit) => {
	navigateTo(`/admin/properties/${props.propertyId}/units/${u.id}`);
};

const onDeleteClick = (u: Unit) => {
	target.value = u;
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
		await unitsStore.remove(target.value.id);
		snackbar.show("Юнит удалён", "success");
		dialogOpen.value = false;
		target.value = null;
	} catch {
		snackbar.show("Не удалось удалить юнит", "error");
	} finally {
		dialogBusy.value = false;
	}
};
</script>

<template>
	<section class="units">
		<header class="units__head">
			<div class="units__heading">
				<h2 class="units__title">Юниты</h2>
				<span class="units__count">{{ items.length }}</span>
			</div>
			<button type="button" class="units__create" @click="onCreateClick">
				<HugeiconsIcon :icon="PlusSignIcon" :size="16" :stroke-width="2" />
				<span>Создать</span>
			</button>
		</header>

		<Table :cols="COLS" :cols-md="COLS_MD" :loading="isLoading" :empty="isEmpty">
			<template #header>
				<TableHeader
					:columns="columns"
					:sort="sort"
					@update:sort="sort = $event"
				/>
			</template>

			<TableRow v-for="u in sortedItems" :key="u.id">
				<TableCellName :name="u.name" :description="u.slug" data-card-label="Имя" />
				<div class="cell" data-priority="md" data-card-label="Тип">
					{{ UNIT_TYPE_LABELS[u.type] ?? u.type }}
				</div>
				<div class="cell cell--muted" data-priority="md" data-card-label="Гостей">
					{{ u.maxGuests }}
				</div>
				<div class="cell" data-card-label="Цена">{{ formatUnitPrice(u) }}</div>
				<TableCellStatus :active="u.isActive" data-card-label="Статус" />
				<TableActions>
					<button
						type="button"
						class="iconbtn"
						aria-label="Редактировать"
						@click="onEditClick(u)"
					>
						<HugeiconsIcon :icon="Edit02Icon" :size="18" :stroke-width="1.5" />
					</button>
					<button
						type="button"
						class="iconbtn"
						aria-label="Удалить"
						@click="onDeleteClick(u)"
					>
						<HugeiconsIcon :icon="Delete02Icon" :size="18" :stroke-width="1.5" />
					</button>
				</TableActions>
			</TableRow>

			<template #empty>
				<div class="empty">Юниты не найдены</div>
			</template>
		</Table>

		<ConfirmDialog
			:open="dialogOpen"
			title="Удалить юнит"
			message="Это действие нельзя отменить. Юнит будет удалён вместе с фотографиями."
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
.units {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.units__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.units__heading {
	display: flex;
	align-items: baseline;
	gap: 10px;
}

.units__title {
	@include h3-bold;
	color: $text;
}

.units__count {
	@include caption-medium;
	color: $text-muted;
}

.units__create {
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

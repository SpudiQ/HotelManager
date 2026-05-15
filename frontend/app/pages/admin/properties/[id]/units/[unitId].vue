<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, watch, watchEffect } from "vue";
import type { FormAction } from "~/components/ui/form/types";
import {
	buildForm,
	buildPayload,
	isFormValid,
	type FormState,
} from "~/modules/admin/utils/unit-form";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";
import { usePropertiesStore } from "~/stores/properties";
import { useSnackbarStore } from "~/stores/snackbar";
import { useUnitsStore } from "~/stores/units";
import { useWorkspacesStore } from "~/stores/workspaces";

definePageMeta({ layout: "admin" });

const route = useRoute();
const router = useRouter();
const propertyId = computed(() => String(route.params.id));
const unitId = computed(() => String(route.params.unitId));

const unitsStore = useUnitsStore();
const propertiesStore = usePropertiesStore();
const workspacesStore = useWorkspacesStore();
const breadcrumbs = useBreadcrumbsStore();
const snackbar = useSnackbarStore();

const { current } = storeToRefs(unitsStore);

const { error } = await useAsyncData(
	`unit-${unitId.value}`,
	() => unitsStore.fetchOne(unitId.value),
	{ watch: [unitId] },
);
onMounted(() => {
	if (error.value) snackbar.show("Не удалось загрузить юнит", "error");
});
watch(error, (e) => {
	if (e) snackbar.show("Не удалось загрузить юнит", "error");
});

await useAsyncData(
	`property-${propertyId.value}`,
	() => propertiesStore.fetchOne(propertyId.value),
	{ watch: [propertyId] },
);

const property = computed(() => {
	return (
		propertiesStore.items.find((p) => p.id === propertyId.value) ??
		(propertiesStore.current?.id === propertyId.value ? propertiesStore.current : null)
	);
});

watch(
	() => property.value?.workspaceId,
	(wsId) => {
		if (wsId) workspacesStore.fetchOne(wsId);
	},
	{ immediate: true },
);

const workspace = computed(() => {
	const wsId = property.value?.workspaceId;
	if (!wsId) return null;
	return (
		workspacesStore.items.find((w) => w.id === wsId) ??
		(workspacesStore.current?.id === wsId ? workspacesStore.current : null)
	);
});

watchEffect(() => {
	if (router.currentRoute.value.params.unitId !== unitId.value) return;
	const wsId = property.value?.workspaceId;
	breadcrumbs.set([
		{ label: "Пространства", to: "/admin/workspaces" },
		...(wsId
			? [{ label: workspace.value?.name ?? wsId, to: `/admin/workspaces/${wsId}` }]
			: []),
		{
			label: property.value?.name ?? propertyId.value,
			to: `/admin/properties/${propertyId.value}`,
		},
		{ label: "Юниты", to: `/admin/properties/${propertyId.value}/units` },
		{ label: current.value?.name ?? unitId.value },
	]);
});

const form = ref<FormState | null>(null);

watch(
	current,
	(value) => {
		if (value && value.id === unitId.value && form.value === null) {
			form.value = buildForm(value);
		}
	},
	{ immediate: true },
);

const canSave = computed(() => Boolean(form.value) && isFormValid(form.value!));

const onReset = () => {
	if (current.value) form.value = buildForm(current.value);
};

const onCancel = () => {
	navigateTo(`/admin/properties/${propertyId.value}/units`);
};

const onSubmit = async () => {
	if (!form.value || !current.value) return;
	if (!isFormValid(form.value)) return;
	try {
		await unitsStore.update(current.value.id, buildPayload(form.value));
		if (current.value) form.value = buildForm(current.value);
		snackbar.show("Юнит сохранён", "success");
	} catch {
		snackbar.show("Не удалось сохранить юнит", "error");
	}
};

const actions = computed<FormAction[]>(() => [
	{ key: "cancel", label: "Отмена", onClick: onCancel },
	{ key: "reset", label: "Сбросить", onClick: onReset },
	{
		key: "submit",
		label: "Сохранить",
		type: "submit",
		disabled: !canSave.value,
		onClick: onSubmit,
	},
]);
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1
				class="page__title"
				v-skeleton="{ loading: !current, type: 'text', count: 1 }"
			>
				{{ current?.name ?? unitId }}
			</h1>
		</header>

		<UnitForm v-if="form" v-model="form" :actions="actions" />
	</section>
</template>

<style lang="scss" scoped>
.page {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.page__head {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.page__title {
	@include h1-bold;
	color: $text;
}
</style>

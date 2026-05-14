<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import type { FormAction } from "~/components/ui/form/types";
import {
	buildPayload,
	emptyForm,
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

const unitsStore = useUnitsStore();
const propertiesStore = usePropertiesStore();
const workspacesStore = useWorkspacesStore();
const breadcrumbs = useBreadcrumbsStore();
const snackbar = useSnackbarStore();

const { error } = await useAsyncData(
	`property-${propertyId.value}`,
	() => propertiesStore.fetchOne(propertyId.value),
	{ watch: [propertyId] },
);
onMounted(() => {
	if (error.value) snackbar.show("Не удалось загрузить объект", "error");
});
watch(error, (e) => {
	if (e) snackbar.show("Не удалось загрузить объект", "error");
});

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
	if (router.currentRoute.value.params.id !== propertyId.value) return;
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
		{ label: "Создание юнита" },
	]);
});

const form = ref<FormState>(emptyForm());
const canSave = computed(() => isFormValid(form.value));

const onCancel = () => navigateTo(`/admin/properties/${propertyId.value}`);
const onReset = () => {
	form.value = emptyForm();
};
const onSubmit = async () => {
	if (!canSave.value) return;
	try {
		await unitsStore.create({
			propertyId: propertyId.value,
			...buildPayload(form.value),
		});
		snackbar.show("Юнит создан", "success");
		navigateTo(`/admin/properties/${propertyId.value}`);
	} catch {
		snackbar.show("Не удалось создать юнит", "error");
	}
};

const actions = computed<FormAction[]>(() => [
	{ key: "cancel", label: "Отмена", onClick: onCancel },
	{ key: "reset", label: "Сбросить", onClick: onReset },
	{
		key: "submit",
		label: "Создать",
		type: "submit",
		disabled: !canSave.value,
		onClick: onSubmit,
	},
]);
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">Создание юнита</h1>
		</header>

		<UnitForm v-model="form" :actions="actions" />
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

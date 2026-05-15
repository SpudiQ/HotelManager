<script setup lang="ts">
import { computed, watch, watchEffect } from "vue";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";
import { usePropertiesStore } from "~/stores/properties";
import { useSnackbarStore } from "~/stores/snackbar";
import { useWorkspacesStore } from "~/stores/workspaces";

definePageMeta({ layout: "admin" });

const route = useRoute();
const router = useRouter();
const propertyId = computed(() => String(route.params.id));

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
		{ label: "Юниты" },
	]);
});
</script>

<template>
	<section class="page">
		<UnitTable v-if="property" :property-id="property.id" />
	</section>
</template>

<style lang="scss" scoped>
.page {
	display: flex;
	flex-direction: column;
	gap: 24px;
}
</style>

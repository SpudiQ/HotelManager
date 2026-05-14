<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";
import { useWorkspacesStore } from "~/stores/workspaces";
import { useEntityPage } from "~/composables/useEntityPage";

definePageMeta({ layout: "admin" });

const route = useRoute();
const router = useRouter();
const wsId = computed(() => String(route.params.id));

const workspacesStore = useWorkspacesStore();
const { current: workspace } = storeToRefs(workspacesStore);

await useEntityPage(
	`workspace-${wsId.value}`,
	() => workspacesStore.fetchOne(wsId.value),
	"Не удалось загрузить пространство",
	{ watch: [wsId] },
);

const breadcrumbs = useBreadcrumbsStore();
watchEffect(() => {
	if (router.currentRoute.value.params.id !== wsId.value) return;
	breadcrumbs.set([
		{ label: "Пространства", to: "/admin/workspaces" },
		{ label: workspace.value?.name ?? wsId.value },
	]);
});
</script>

<template>
	<section class="page">
		<PageHeader :title="workspace?.name ?? wsId" />
		<PropertyTable :workspace-id="wsId" />
	</section>
</template>

<style lang="scss" scoped>
.page {
	display: flex;
	flex-direction: column;
	gap: 24px;
}
</style>

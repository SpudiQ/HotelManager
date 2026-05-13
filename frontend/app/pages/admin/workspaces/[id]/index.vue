<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";
import { useSnackbarStore } from "~/stores/snackbar";
import { useWorkspacesStore } from "~/stores/workspaces";

definePageMeta({ layout: "admin" });

const route = useRoute();
const router = useRouter();
const wsId = computed(() => String(route.params.id));

const workspacesStore = useWorkspacesStore();
const snackbar = useSnackbarStore();
const { current: workspace } = storeToRefs(workspacesStore);

const { error } = await useAsyncData(
	`workspace-${wsId.value}`,
	() => workspacesStore.fetchOne(wsId.value),
	{ watch: [wsId] },
);
onMounted(() => {
	if (error.value) snackbar.show("Не удалось загрузить workspace", "error");
});
watch(error, (e) => {
	if (e) snackbar.show("Не удалось загрузить workspace", "error");
});

const breadcrumbs = useBreadcrumbsStore();
watchEffect(() => {
	if (router.currentRoute.value.params.id !== wsId.value) return;
	breadcrumbs.set([
		{ label: "Workspaces", to: "/admin/workspaces" },
		{ label: workspace.value?.name ?? wsId.value },
	]);
});
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">{{ workspace?.name ?? wsId }}</h1>
		</header>

		<PropertyTable :workspace-id="wsId" />
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

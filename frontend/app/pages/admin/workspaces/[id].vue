<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";
import { useWorkspacesStore } from "~/stores/workspaces";

definePageMeta({ layout: "admin" });

const route = useRoute();
const wsId = computed(() => String(route.params.id));

const workspacesStore = useWorkspacesStore();
const { current: workspace, isLoading } = storeToRefs(workspacesStore);

onMounted(async () => {
	try {
		await workspacesStore.fetchOne(wsId.value);
	} catch {
		// NOTE: ошибка показана через snackbar-интерцептор
	}
});

const breadcrumbs = useBreadcrumbsStore();
watchEffect(() => {
	breadcrumbs.set([
		{ label: "Workspaces", to: "/admin/workspaces" },
		{ label: workspace.value?.name ?? wsId.value },
	]);
});
</script>

<template>
	<section class="page">
		<header
			class="page__head"
			v-skeleton="{ loading: isLoading, type: 'text', count: 2 }"
		>
			<h1 class="page__title">{{ workspace?.name ?? wsId }}</h1>
			<p class="page__sub">
				Здесь будет список Properties выбранного workspace'а. Раздел в разработке.
			</p>
		</header>

		<div class="placeholder">Properties (TBD)</div>
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

.page__sub {
	@include text-2;
	color: $text-muted;
}

.placeholder {
	@include text-2;
	padding: 48px;
	text-align: center;
	color: $text-subtle;
	background: $surface;
	border: 1px dashed $border;
}
</style>

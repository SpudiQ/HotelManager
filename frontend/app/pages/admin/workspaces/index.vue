<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";
import { useWorkspacesStore } from "~/stores/workspaces";

definePageMeta({ layout: "admin" });

useBreadcrumbsStore().set([{ label: "Workspaces" }]);

const workspacesStore = useWorkspacesStore();
const { items: workspaces, isLoading } = storeToRefs(workspacesStore);
onMounted(workspacesStore.fetchAll);
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">Workspaces</h1>
			<p class="page__sub">Список ваших пространств. Откройте, чтобы перейти к объектам.</p>
		</header>

		<div class="grid" v-skeleton="{ loading: isLoading, type: 'card', count: 1 }">
			<WorkspaceCard
				v-for="ws in workspaces"
				:key="ws.id"
				:workspace="ws"
			/>
		</div>
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

.grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
	gap: 16px;
}
</style>

<script setup lang="ts">
import { useBreadcrumbs } from "~/modules/admin/composables/useBreadcrumbs";
import { useWorkspaces } from "~/modules/admin/composables/useWorkspaces";

definePageMeta({ layout: "admin" });

const { set } = useBreadcrumbs();
set([{ label: "Workspaces" }]);

const { workspaces, isLoading, fetch } = useWorkspaces();
onMounted(fetch);
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">Workspaces</h1>
			<p class="page__sub">Список ваших пространств. Откройте, чтобы перейти к объектам.</p>
		</header>

		<div class="grid">
			<template v-if="isLoading">
				<WorkspaceCardSkeleton v-for="n in 4" :key="n" />
			</template>
			<template v-else>
				<WorkspaceCard
					v-for="ws in workspaces"
					:key="ws.id"
					:workspace="ws"
				/>
			</template>
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

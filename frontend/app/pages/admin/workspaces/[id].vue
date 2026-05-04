<script setup lang="ts">
import { makeWorkspaceApi } from "~/modules/admin/api/workspaceApi";
import { useBreadcrumbs } from "~/modules/admin/composables/useBreadcrumbs";
import type { Workspace } from "~/modules/admin/types/workspace";

definePageMeta({ layout: "admin" });

const route = useRoute();
const wsId = computed(() => String(route.params.id));

const workspace = ref<Workspace | null>(null);
const isLoading = ref(true);
const workspaceApi = makeWorkspaceApi(useNuxtApp().$api);

const { set } = useBreadcrumbs();

onMounted(async () => {
	try {
		workspace.value = await workspaceApi.getById(wsId.value);
	} catch {
		// NOTE: ошибка показана через snackbar-интерцептор
	} finally {
		isLoading.value = false;
	}
});

watchEffect(() => {
	set([
		{ label: "Workspaces", to: "/admin/workspaces" },
		{ label: workspace.value?.name ?? wsId.value },
	]);
});
</script>

<template>
	<section class="page">
		<header class="page__head">
			<template v-if="isLoading">
				<div class="skel skel--title"></div>
				<div class="skel skel--sub"></div>
			</template>
			<template v-else>
				<h1 class="page__title">{{ workspace?.name ?? wsId }}</h1>
				<p class="page__sub">
					Здесь будет список Properties выбранного workspace'а. Раздел в разработке.
				</p>
			</template>
		</header>

		<div class="placeholder">Properties (TBD)</div>
	</section>
</template>

<style lang="scss" scoped>
@keyframes skel-shimmer {
	0% { background-position: -200% center; }
	100% { background-position: 200% center; }
}

.skel {
	display: block;
	background: linear-gradient(90deg, $bg 0%, $border 50%, $bg 100%);
	background-size: 200% auto;
	animation: skel-shimmer 1.8s linear infinite;
}

.skel--title {
	height: 32px;
	width: 40%;
}

.skel--sub {
	height: 16px;
	width: 65%;
	margin-top: 2px;
}

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

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Workspace } from "~/modules/admin/types/workspace";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";
import { useSnackbarStore } from "~/stores/snackbar";
import { useWorkspacesStore } from "~/stores/workspaces";
import { useEntityPage } from "~/composables/useEntityPage";

definePageMeta({ layout: "admin" });

useBreadcrumbsStore().set([{ label: "Workspaces" }]);

const workspacesStore = useWorkspacesStore();
const snackbar = useSnackbarStore();
const { items: workspaces, isLoading } = storeToRefs(workspacesStore);

await useEntityPage(
	"workspaces",
	() => workspacesStore.fetchAll(),
	"Не удалось загрузить workspaces",
);

const dialogOpen = ref(false);
const dialogBusy = ref(false);
const target = ref<Workspace | null>(null);

const onCreate = () => navigateTo("/admin/workspaces/create");
const onEdit = (ws: Workspace) => navigateTo(`/admin/workspaces/${ws.id}/edit`);

const onDelete = (ws: Workspace) => {
	target.value = ws;
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
		await workspacesStore.remove(target.value.id);
		snackbar.show("Workspace удалён", "success");
		dialogOpen.value = false;
		target.value = null;
	} catch {
		snackbar.show("Не удалось удалить workspace", "error");
	} finally {
		dialogBusy.value = false;
	}
};

const dialogPhrase = computed(() => target.value?.name ?? "");
</script>

<template>
	<section class="page">
		<PageHeader
			title="Workspaces"
			subtitle="Список ваших пространств. Откройте, чтобы перейти к объектам."
		>
			<template #actions>
				<button type="button" class="page__create" @click="onCreate">
					<HugeiconsIcon :icon="PlusSignIcon" :size="16" :stroke-width="2" />
					<span>Создать</span>
				</button>
			</template>
		</PageHeader>

		<div class="grid" v-skeleton="{ loading: isLoading, type: 'card', count: 1 }">
			<WorkspaceCard
				v-for="ws in workspaces"
				:key="ws.id"
				:workspace="ws"
				@edit="onEdit"
				@delete="onDelete"
			/>
		</div>

		<ConfirmDialog
			:open="dialogOpen"
			title="Удалить workspace"
			message="Это действие нельзя отменить. Workspace и связанные данные будут удалены."
			:confirm-phrase="dialogPhrase"
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
.page {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
	gap: 16px;
}

.page__create {
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
</style>

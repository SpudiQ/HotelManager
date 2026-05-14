<script setup lang="ts">
import { computed, ref } from "vue";
import type { FormAction } from "~/components/ui/form/types";
import {
	buildPayload,
	emptyForm,
	type FormState,
} from "~/modules/admin/utils/workspace-form";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";
import { useSnackbarStore } from "~/stores/snackbar";
import { useWorkspacesStore } from "~/stores/workspaces";

definePageMeta({ layout: "admin" });

useBreadcrumbsStore().set([
	{ label: "Пространства", to: "/admin/workspaces" },
	{ label: "Создание пространства" },
]);

const workspacesStore = useWorkspacesStore();
const snackbar = useSnackbarStore();

const form = ref<FormState>(emptyForm());
const canSave = computed(
	() => form.value.name.trim() !== "" && form.value.slug.trim() !== "",
);

const onCancel = () => navigateTo("/admin/workspaces");
const onReset = () => {
	form.value = emptyForm();
};
const onSubmit = async () => {
	if (!canSave.value) return;
	try {
		await workspacesStore.create(buildPayload(form.value));
		snackbar.show("Пространство создано", "success");
		navigateTo("/admin/workspaces");
	} catch {
		snackbar.show("Не удалось создать пространство", "error");
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
		<PageHeader title="Создание пространства" />
		<WorkspaceForm v-model="form" :actions="actions" />
	</section>
</template>

<style lang="scss" scoped>
.page {
	display: flex;
	flex-direction: column;
	gap: 24px;
}
</style>

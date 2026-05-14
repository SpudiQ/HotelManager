<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, watch, watchEffect } from "vue";
import type { FormAction } from "~/components/ui/form/types";
import {
	buildForm,
	buildPayload,
	type FormState,
} from "~/modules/admin/utils/workspace-form";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";
import { useSnackbarStore } from "~/stores/snackbar";
import { useWorkspacesStore } from "~/stores/workspaces";
import { useEntityPage } from "~/composables/useEntityPage";

definePageMeta({ layout: "admin" });

const route = useRoute();
const router = useRouter();
const id = computed(() => String(route.params.id));

const workspacesStore = useWorkspacesStore();
const snackbar = useSnackbarStore();
const breadcrumbs = useBreadcrumbsStore();

const { current } = storeToRefs(workspacesStore);

await useEntityPage(
	`workspace-${id.value}`,
	() => workspacesStore.fetchOne(id.value),
	"Не удалось загрузить пространство",
	{ watch: [id] },
);

watchEffect(() => {
	if (router.currentRoute.value.params.id !== id.value) return;
	breadcrumbs.set([
		{ label: "Пространства", to: "/admin/workspaces" },
		{
			label: current.value?.name ?? id.value,
			to: `/admin/workspaces/${id.value}`,
		},
		{ label: "Редактирование" },
	]);
});

const form = ref<FormState | null>(null);

watch(
	current,
	(value) => {
		if (value && value.id === id.value && form.value === null) {
			form.value = buildForm(value);
		}
	},
	{ immediate: true },
);

const canSave = computed(
	() =>
		Boolean(form.value) &&
		form.value!.name.trim() !== "" &&
		form.value!.slug.trim() !== "",
);

const onCancel = () => navigateTo(`/admin/workspaces/${id.value}`);
const onReset = () => {
	if (current.value) form.value = buildForm(current.value);
};
const onSubmit = async () => {
	if (!form.value || !current.value) return;
	try {
		await workspacesStore.update(
			current.value.id,
			buildPayload(form.value, current.value.settings),
		);
		if (current.value) form.value = buildForm(current.value);
		snackbar.show("Пространство сохранено", "success");
	} catch {
		snackbar.show("Не удалось сохранить пространство", "error");
	}
};

const actions = computed<FormAction[]>(() => [
	{ key: "cancel", label: "Отмена", onClick: onCancel },
	{ key: "reset", label: "Сбросить", onClick: onReset },
	{
		key: "submit",
		label: "Сохранить",
		type: "submit",
		disabled: !canSave.value,
		onClick: onSubmit,
	},
]);
</script>

<template>
	<section class="page">
		<PageHeader :title="current?.name ?? 'Пространство'" />
		<WorkspaceForm v-if="form" v-model="form" :actions="actions" />
	</section>
</template>

<style lang="scss" scoped>
.page {
	display: flex;
	flex-direction: column;
	gap: 24px;
}
</style>

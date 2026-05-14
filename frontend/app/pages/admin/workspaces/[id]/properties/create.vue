<script setup lang="ts">
import { computed, ref } from "vue";
import type { FormAction } from "~/components/ui/form/types";
import {
	buildPayload,
	emptyForm,
	type FormState,
} from "~/modules/admin/utils/property-form";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";
import { usePropertiesStore } from "~/stores/properties";
import { useSnackbarStore } from "~/stores/snackbar";
import { useWorkspacesStore } from "~/stores/workspaces";

definePageMeta({ layout: "admin" });

const route = useRoute();
const router = useRouter();
const wsId = computed(() => String(route.params.id));

const propertiesStore = usePropertiesStore();
const workspacesStore = useWorkspacesStore();
const breadcrumbs = useBreadcrumbsStore();
const snackbar = useSnackbarStore();

const { error } = await useAsyncData(
	`workspace-${wsId.value}`,
	() => workspacesStore.fetchOne(wsId.value),
	{ watch: [wsId] },
);
onMounted(() => {
	if (error.value) snackbar.show("Не удалось загрузить пространство", "error");
});
watch(error, (e) => {
	if (e) snackbar.show("Не удалось загрузить пространство", "error");
});

const workspace = computed(() => {
	return (
		workspacesStore.items.find((w) => w.id === wsId.value) ??
		(workspacesStore.current?.id === wsId.value ? workspacesStore.current : null)
	);
});

watchEffect(() => {
	if (router.currentRoute.value.params.id !== wsId.value) return;
	breadcrumbs.set([
		{ label: "Пространства", to: "/admin/workspaces" },
		{ label: workspace.value?.name ?? wsId.value, to: `/admin/workspaces/${wsId.value}` },
		{ label: "Создание объекта" },
	]);
});

const form = ref<FormState>(emptyForm());
const canSave = computed(
	() => form.value.name.trim() !== "" && form.value.slug.trim() !== "",
);

const onCancel = () => navigateTo(`/admin/workspaces/${wsId.value}`);
const onReset = () => {
	form.value = emptyForm();
};
const onSubmit = async () => {
	if (!canSave.value) return;
	try {
		await propertiesStore.create({
			workspaceId: wsId.value,
			...buildPayload(form.value),
		});
		snackbar.show("Объект создан", "success");
		navigateTo(`/admin/workspaces/${wsId.value}`);
	} catch {
		snackbar.show("Не удалось создать объект", "error");
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
		<header class="page__head">
			<h1 class="page__title">Создание объекта</h1>
			<!-- <p v-if="workspace" class="page__meta">
				<span class="page__meta-item">{{ workspace.name }}</span>
			</p> -->
		</header>

		<PropertyForm v-model="form" :actions="actions" />
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

.page__meta {
	display: flex;
	align-items: center;
	gap: 8px;
	@include text-2;
	color: $text-muted;
}
</style>

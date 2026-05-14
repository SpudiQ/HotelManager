<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, watch, watchEffect } from "vue";
import type { FormAction } from "~/components/ui/form/types";
import {
	buildForm,
	buildPayload,
	type FormState,
} from "~/modules/admin/utils/property-form";
import { PROPERTY_TYPE_LABELS } from "~/modules/admin/constants/property-labels";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";
import { usePropertiesStore } from "~/stores/properties";
import { useSnackbarStore } from "~/stores/snackbar";
import { useWorkspacesStore } from "~/stores/workspaces";

definePageMeta({ layout: "admin" });

const route = useRoute();
const router = useRouter();
const id = computed(() => String(route.params.id));

const propertiesStore = usePropertiesStore();
const workspacesStore = useWorkspacesStore();
const snackbar = useSnackbarStore();
const breadcrumbs = useBreadcrumbsStore();

const { current, isLoading } = storeToRefs(propertiesStore);

const { error } = await useAsyncData(
	`property-${id.value}`,
	() => propertiesStore.fetchOne(id.value),
	{ watch: [id] },
);
onMounted(() => {
	if (error.value) snackbar.show("Не удалось загрузить объект", "error");
});
watch(error, (e) => {
	if (e) snackbar.show("Не удалось загрузить объект", "error");
});

watch(
	() => current.value?.workspaceId,
	(wsId) => {
		if (wsId) workspacesStore.fetchOne(wsId);
	},
	{ immediate: true },
);

const workspace = computed(() => {
	const wsId = current.value?.workspaceId;
	if (!wsId) return null;
	return (
		workspacesStore.items.find((w) => w.id === wsId) ??
		(workspacesStore.current?.id === wsId ? workspacesStore.current : null)
	);
});

watchEffect(() => {
	if (router.currentRoute.value.params.id !== id.value) return;
	const wsId = current.value?.workspaceId;
	const wsCrumb = workspace.value?.name ?? wsId ?? "";
	breadcrumbs.set([
		{ label: "Пространства", to: "/admin/workspaces" },
		...(wsId
			? [{ label: wsCrumb, to: `/admin/workspaces/${wsId}` }]
			: []),
		{ label: current.value?.name ?? id.value },
	]);
});

const form = ref<FormState | null>(null);

watch(
	current,
	(value) => {
		if (value && form.value === null) {
			form.value = buildForm(value);
		}
	},
	{ immediate: true },
);

const canSave = computed(() => Boolean(form.value));

const onReset = () => {
	if (current.value) form.value = buildForm(current.value);
};

const onCancel = () => {
	const wsId = current.value?.workspaceId;
	if (wsId) navigateTo(`/admin/workspaces/${wsId}`);
	else navigateTo("/admin/workspaces");
};

const onPreview = () => {
	snackbar.show("Предпросмотр в разработке", "success");
};

const onSubmit = async () => {
	if (!form.value || !current.value) return;
	try {
		await propertiesStore.update(current.value.id, buildPayload(form.value));
		if (current.value) form.value = buildForm(current.value);
		snackbar.show("Объект сохранен", "success");
	} catch {
		snackbar.show("Не удалось сохранить объект", "error");
	}
};

const actions = computed<FormAction[]>(() => [
	{ key: "cancel", label: "Отмена", onClick: onCancel },
	{ key: "reset", label: "Сбросить", onClick: onReset },
	{ key: "preview", label: "Предпросмотр", onClick: onPreview },
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
		<header class="page__head">
			<!-- <h1
				class="page__title"
				v-skeleton="{ loading: isLoading && !current, type: 'text', count: 1 }"
			>
				{{ current?.name ?? id }}
			</h1> -->
			<!-- <div v-if="current" class="page__meta">
				<span class="page__meta-item">{{ PROPERTY_TYPE_LABELS[current.type] ?? current.type }}</span>
				<span class="page__meta-dot">•</span>
				<span class="page__meta-item">{{ current.slug }}</span>
			</div> -->
		</header>

		<PropertyForm v-if="form" v-model="form" :actions="actions" />
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

.page__meta-dot {
	color: $text-subtle;
}
</style>

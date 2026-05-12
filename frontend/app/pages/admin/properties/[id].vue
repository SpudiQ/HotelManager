<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, watch, watchEffect } from "vue";
import type {
	Property,
	PropertyContacts,
	PropertyType,
	UpdatePropertyDto,
} from "~/modules/admin/types/property";
import { PROPERTY_TYPE_LABELS } from "~/modules/admin/constants/property-labels";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";
import { usePropertiesStore } from "~/stores/properties";
import { useSnackbarStore } from "~/stores/snackbar";
import { useWorkspacesStore } from "~/stores/workspaces";

definePageMeta({ layout: "admin" });

const route = useRoute();
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
	if (error.value) snackbar.show("Не удалось загрузить property", "error");
});
watch(error, (e) => {
	if (e) snackbar.show("Не удалось загрузить property", "error");
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
	const wsId = current.value?.workspaceId;
	const wsCrumb = workspace.value?.name ?? wsId ?? "";
	breadcrumbs.set([
		{ label: "Workspaces", to: "/admin/workspaces" },
		...(wsId
			? [{ label: wsCrumb, to: `/admin/workspaces/${wsId}` }]
			: []),
		{ label: current.value?.name ?? id.value },
	]);
});

interface FormState {
	name: string;
	slug: string;
	type: PropertyType;
	address: string;
	description: string;
	isActive: boolean;
	email: string;
	phone: string;
	telegram: string;
	whatsapp: string;
}

const TYPE_OPTIONS = (
	[
		"hotel",
		"resort",
		"hostel",
		"glamping",
		"apartment",
		"guesthouse",
	] as PropertyType[]
).map((value) => ({ value, label: PROPERTY_TYPE_LABELS[value] }));

const stripTelegramPrefix = (value: string): string => {
	let v = value.trim();
	v = v.replace(/^https?:\/\/(t|telegram)\.me\//i, "");
	v = v.replace(/^tg:\/\/resolve\?domain=/i, "");
	v = v.replace(/^@+/, "");
	return v;
};

const buildForm = (p: Property): FormState => ({
	name: p.name,
	slug: p.slug,
	type: p.type,
	address: p.address ?? "",
	description: p.description ?? "",
	isActive: p.isActive,
	email: p.contacts?.email ?? "",
	phone: p.contacts?.phone ?? "",
	telegram: p.contacts?.telegram ? stripTelegramPrefix(p.contacts.telegram) : "",
	whatsapp: p.contacts?.whatsapp ?? "",
});

const form = ref<FormState | null>(null);
const isSaving = ref(false);

watch(
	current,
	(value) => {
		if (value && form.value === null) {
			form.value = buildForm(value);
		}
	},
	{ immediate: true },
);

const canSave = computed(() => Boolean(form.value) && !isSaving.value);

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

const buildContacts = (f: FormState): PropertyContacts | null => {
	const out: PropertyContacts = {};
	const email = f.email.trim();
	const phone = f.phone.trim();
	const telegram = stripTelegramPrefix(f.telegram);
	const whatsapp = f.whatsapp.trim();
	if (email) out.email = email;
	if (phone) out.phone = phone;
	if (telegram) out.telegram = `@${telegram}`;
	if (whatsapp) out.whatsapp = whatsapp;
	return Object.keys(out).length ? out : null;
};

const onSubmit = async () => {
	if (!form.value || !current.value || !canSave.value) return;
	const f = form.value;
	const dto: UpdatePropertyDto = {
		name: f.name.trim(),
		slug: f.slug.trim(),
		type: f.type,
		address: f.address.trim() === "" ? null : f.address.trim(),
		description: f.description.trim() === "" ? null : f.description,
		contacts: buildContacts(f),
		isActive: f.isActive,
	};

	isSaving.value = true;
	try {
		await propertiesStore.update(current.value.id, dto);
		if (current.value) form.value = buildForm(current.value);
		snackbar.show("Property сохранена", "success");
	} catch {
		snackbar.show("Не удалось сохранить property", "error");
	} finally {
		isSaving.value = false;
	}
};
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1
				class="page__title"
				v-skeleton="{ loading: isLoading && !current, type: 'text', count: 1 }"
			>
				{{ current?.name ?? id }}
			</h1>
			<div v-if="current" class="page__meta">
				<span class="page__meta-item">{{ PROPERTY_TYPE_LABELS[current.type] ?? current.type }}</span>
				<span class="page__meta-dot">•</span>
				<span class="page__meta-item">{{ current.slug }}</span>
			</div>
		</header>

		<form v-if="form" class="form" @submit.prevent="onSubmit">
			<section class="form__section">
				<div class="form__grid">
					<AppInput
						v-model="form.name"
						label="Название"
						required
						:disabled="isSaving"
					/>
					<AppInput
						v-model="form.slug"
						label="Slug"
						required
						:disabled="isSaving"
					/>
					<AppSelect
						v-model="form.type"
						label="Тип"
						:options="TYPE_OPTIONS"
						:disabled="isSaving"
					/>
					<AppInput
						v-model="form.address"
						label="Адрес"
						:disabled="isSaving"
					/>
				</div>

				<div class="form__row">
					<span class="form__label">Активен для брони</span>
					<AppSwitch
						v-model="form.isActive"
						:label="form.isActive ? 'Да' : 'Нет'"
						:disabled="isSaving"
					/>
				</div>
			</section>

			<section class="form__section">
				<header class="form__section-head">
					<h2 class="form__section-title">Контакты для заселения</h2>
					<p class="form__section-hint">
						Контакты, которые увидят гости и операторы при бронировании.
					</p>
				</header>
				<div class="form__grid">
					<AppInput
						v-model="form.email"
						type="email"
						label="Email"
						placeholder="example@hotel.ru"
						autocomplete="email"
						:disabled="isSaving"
					/>
					<AppInput
						v-model="form.phone"
						type="tel"
						label="Телефон"
						mask="+7 (###) ###-##-##"
						placeholder="+7 (___) ___-__-__"
						autocomplete="tel"
						:disabled="isSaving"
					/>
					<AppInput
						v-model="form.telegram"
						label="Telegram"
						prefix="@"
						placeholder="username"
						autocomplete="off"
						:spellcheck="false"
						:disabled="isSaving"
					/>
					<AppInput
						v-model="form.whatsapp"
						type="tel"
						label="WhatsApp"
						mask="+# (###) ###-##-##"
						placeholder="+_ (___) ___-__-__"
						autocomplete="tel"
						:disabled="isSaving"
					/>
				</div>
			</section>

			<section class="form__section form__section--full">
				<span class="form__label">Описание</span>
				<MarkdownEditor v-model="form.description" />
			</section>

			<div class="form__actions">
				<AppButton variant="ghost" :disabled="isSaving" @click="onCancel">
					Отмена
				</AppButton>
				<AppButton variant="ghost" :disabled="isSaving" @click="onReset">
					Сбросить
				</AppButton>
				<AppButton :disabled="isSaving" @click="onPreview">
					Предпросмотр
				</AppButton>
				<AppButton type="submit" variant="primary" :disabled="!canSave">
					Сохранить
				</AppButton>
			</div>
		</form>
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

.form {
	display: flex;
	flex-direction: column;
	gap: 24px;
	padding: 24px;
	background: $surface;
	border: 1px solid $border;
}

.form__section {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.form__section--full {
	gap: 8px;
}

.form__section-head {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding-bottom: 4px;
	border-bottom: 1px solid $border;
}

.form__section-title {
	@include h3-bold;
	color: $text;
}

.form__section-hint {
	@include text-2;
	color: $text-muted;
}

.form__grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 16px;

	@media (max-width: 720px) {
		grid-template-columns: 1fr;
	}
}

.form__row {
	display: flex;
	align-items: center;
	gap: 16px;
	flex-wrap: wrap;
}

.form__label {
	@include text-2-medium;
	color: $text;
}

.form__actions {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	flex-wrap: wrap;
}
</style>

<script setup lang="ts">
import { computed } from "vue";
import type { FormAction } from "~/components/ui/form/types";
import { TYPE_OPTIONS, type FormState } from "~/modules/admin/utils/property-form";

interface Props {
	modelValue: FormState;
	actions: FormAction[];
}
const props = defineProps<Props>();

const emit = defineEmits<{
	"update:modelValue": [value: FormState];
}>();

const model = computed<FormState>({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});
</script>

<template>
	<FormShell :actions="actions">
		<template #default="{ loading }">
			<section class="form__section">
				<div class="form__grid">
					<AppInput
						v-model="model.name"
						label="Название"
						required
						:disabled="loading"
					/>
					<AppInput
						v-model="model.slug"
						label="Slug"
						required
						:disabled="loading"
					/>
					<AppSelect
						v-model="model.type"
						label="Тип"
						:options="TYPE_OPTIONS"
						:disabled="loading"
					/>
					<AppInput
						v-model="model.address"
						label="Адрес"
						:disabled="loading"
					/>
				</div>

				<div class="form__row">
					<span class="form__label">Активен для брони</span>
					<AppSwitch
						v-model="model.isActive"
						:label="model.isActive ? 'Да' : 'Нет'"
						:disabled="loading"
					/>
				</div>
			</section>

			<section class="form__section form__section--full">
				<span class="form__label">Описание</span>
				<MarkdownEditor v-model="model.description" />
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
						v-model="model.email"
						type="email"
						label="Email"
						placeholder="example@hotel.ru"
						autocomplete="email"
						:disabled="loading"
					/>
					<AppInput
						v-model="model.phone"
						type="tel"
						label="Телефон"
						mask="+7 (###) ###-##-##"
						placeholder="+7 (___) ___-__-__"
						autocomplete="tel"
						:disabled="loading"
					/>
					<AppInput
						v-model="model.telegram"
						label="Telegram"
						prefix="@"
						placeholder="username"
						autocomplete="off"
						:spellcheck="false"
						:disabled="loading"
					/>
					<AppInput
						v-model="model.whatsapp"
						type="tel"
						label="WhatsApp"
						mask="+# (###) ###-##-##"
						placeholder="+_ (___) ___-__-__"
						autocomplete="tel"
						:disabled="loading"
					/>
				</div>
			</section>
		</template>
	</FormShell>
</template>

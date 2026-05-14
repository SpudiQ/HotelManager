<script setup lang="ts">
import { computed } from "vue";
import type { FormAction } from "~/components/ui/form/types";
import type { FormState } from "~/modules/admin/utils/unit-form";
import {
	UNIT_AMENITY_OPTIONS,
	UNIT_PRICE_MODE_OPTIONS,
	UNIT_TYPE_OPTIONS,
} from "~/modules/admin/constants/unit-labels";

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

const showNight = computed(
	() => model.value.priceMode === "night" || model.value.priceMode === "both",
);
const showMonth = computed(
	() => model.value.priceMode === "month" || model.value.priceMode === "both",
);

const onMaxGuestsInput = (value: string) => {
	const n = Number(value);
	model.value.maxGuests = Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
};

const onMaxChildrenInput = (value: string) => {
	if (value === "") {
		model.value.maxChildren = null;
		return;
	}
	const n = Number(value);
	model.value.maxChildren = Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
};

const onPriceNightInput = (value: string) => {
	if (value === "") {
		model.value.pricePerNight = null;
		return;
	}
	const n = Number(value);
	model.value.pricePerNight = Number.isFinite(n) && n >= 0 ? n : null;
};

const onPriceMonthInput = (value: string) => {
	if (value === "") {
		model.value.pricePerMonth = null;
		return;
	}
	const n = Number(value);
	model.value.pricePerMonth = Number.isFinite(n) && n >= 0 ? n : null;
};
</script>

<template>
	<FormShell :actions="actions">
		<template #default="{ loading }">
			<section class="form__section">
				<div class="form__grid">
					<AppInput
						v-model="model.name"
						label="Название"
						placeholder="№ 101 / Сосновый домик"
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
						:options="UNIT_TYPE_OPTIONS"
						:disabled="loading"
					/>
					<div class="form__row">
						<span class="form__label">Активен для брони</span>
						<AppSwitch
							v-model="model.isActive"
							:label="model.isActive ? 'Да' : 'Нет'"
							:disabled="loading"
						/>
					</div>
				</div>
			</section>

			<section class="form__section form__section--full">
				<span class="form__label">Описание</span>
				<MarkdownEditor v-model="model.description" />
			</section>

			<section class="form__section">
				<header class="form__section-head">
					<h2 class="form__section-title">Гости</h2>
					<p class="form__section-hint">
						Сколько гостей помещается и условия для детей.
					</p>
				</header>
				<div class="form__grid">
					<AppInput
						type="number"
						:model-value="String(model.maxGuests)"
						label="Максимум гостей"
						required
						:disabled="loading"
						@update:model-value="onMaxGuestsInput"
					/>
					<AppInput
						v-model:enabled="model.childrenAllowed"
						type="number"
						:model-value="model.maxChildren === null ? '' : String(model.maxChildren)"
						label="Максимум детей"
						placeholder="Без ограничения"
						toggleable
						:disabled="loading"
						@update:model-value="onMaxChildrenInput"
					/>
				</div>
			</section>

			<section class="form__section">
				<header class="form__section-head">
					<h2 class="form__section-title">Цена</h2>
					<p class="form__section-hint">
						Какая модель тарификации действует для этого юнита.
					</p>
				</header>
				<div class="form__grid">
					<AppSelect
						v-model="model.priceMode"
						label="Режим"
						:options="UNIT_PRICE_MODE_OPTIONS"
						:disabled="loading"
					/>
					<AppInput
						v-if="showNight"
						type="number"
						:model-value="model.pricePerNight === null ? '' : String(model.pricePerNight)"
						label="Цена за ночь (₽)"
						required
						:disabled="loading"
						@update:model-value="onPriceNightInput"
					/>
					<AppInput
						v-if="showMonth"
						type="number"
						:model-value="model.pricePerMonth === null ? '' : String(model.pricePerMonth)"
						label="Цена за месяц (₽)"
						required
						:disabled="loading"
						@update:model-value="onPriceMonthInput"
					/>
				</div>
			</section>

			<section class="form__section form__section--full">
				<ChipsSelector
					v-model="model.amenities"
					label="Удобства"
					:options="UNIT_AMENITY_OPTIONS"
					:disabled="loading"
				/>
			</section>

			<section class="form__section form__section--full">
				<PhotoUploader
					v-model="model.photos"
					label="Фотографии"
					prefix="units"
					:disabled="loading"
				/>
			</section>
		</template>
	</FormShell>
</template>

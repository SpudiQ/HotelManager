<script setup lang="ts">
import { computed } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import type { FormAction } from "~/components/ui/form/types";
import type { FormState } from "~/modules/admin/utils/workspace-form";
import { WORKSPACE_ICON_OPTIONS } from "~/modules/admin/constants/workspace-icons";

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
				</div>
			</section>

			<section class="form__section">
				<header class="form__section-head">
					<h2 class="form__section-title">Иконка</h2>
					<p class="form__section-hint">
						Используется на карточке и в боковой панели для быстрой идентификации workspace.
					</p>
				</header>
				<div class="icon-grid" role="radiogroup" aria-label="Иконка workspace">
					<button
						v-for="opt in WORKSPACE_ICON_OPTIONS"
						:key="opt.value"
						type="button"
						class="icon-tile"
						:class="{ 'icon-tile--active': model.icon === opt.value }"
						role="radio"
						:aria-checked="model.icon === opt.value"
						:aria-label="opt.label"
						:title="opt.label"
						:disabled="loading"
						@click="model = { ...model, icon: opt.value }"
					>
						<HugeiconsIcon :icon="opt.icon" :size="22" :stroke-width="1.5" />
					</button>
				</div>
			</section>
		</template>
	</FormShell>
</template>

<style lang="scss" scoped>
.icon-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
	gap: 8px;
}

.icon-tile {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	aspect-ratio: 1 / 1;
	background: $surface;
	color: $text-muted;
	border: 1px solid $border;
	cursor: pointer;
	transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;

	&:hover:not(:disabled) {
		border-color: $text;
		color: $text;
	}

	&:focus-visible {
		@include focus-ring;
	}

	&:disabled {
		cursor: not-allowed;
		color: $text-subtle;
	}
}

.icon-tile--active {
	border-color: $text;
	color: $surface;
	background: $text;

	&:hover:not(:disabled) {
		border-color: $text;
		color: $surface;
	}
}
</style>

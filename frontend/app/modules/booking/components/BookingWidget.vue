<script setup lang="ts">
import { useBookingForm } from '../composables/useBookingForm';

const { form, isValid } = useBookingForm();

const submit = () => {
	if (!isValid.value) return;
	// V0: backend not yet wired
	// eslint-disable-next-line no-console
	console.log("Booking submit:", JSON.parse(JSON.stringify(form)));
};
</script>

<template>
	<section class="widget">
		<div class="profile-slot">
			<ProfileButton />
		</div>
		<header class="head">
			<h2 class="title">Найти номер</h2>
			<p class="subtitle">Выберите даты и количество гостей</p>
		</header>

		<div class="field">
			<DateRangePicker v-model="form.range" />
		</div>

		<div class="field">
			<div class="field-label">Гости</div>
			<div class="field-card">
				<GuestCounter v-model="form.counts" />
			</div>
		</div>

		<button type="button" class="submit" :disabled="!isValid" @click="submit">
			Забронировать
		</button>
	</section>
</template>

<style lang="scss" scoped>
.widget {
	position: relative;
	width: 100%;
	max-width: 480px;
	background: $surface;
	border: 1px solid $border;
	border-radius: 20px;
	padding: 32px;
	@include soft-shadow;
	@include noise-overlay(0.04);

	display: flex;
	flex-direction: column;
	gap: 20px;
}

.profile-slot {
	position: absolute;
	top: 16px;
	right: 16px;
	z-index: 2;
}

.head {
	display: flex;
	flex-direction: column;
	gap: 6px;
	margin-bottom: 4px;
}

.title {
	@include h2-bold;
	color: $text;
}

.subtitle {
	@include text-2;
	color: $text-muted;
}

.field {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.field-label {
	@include caption-medium;
	color: $text-muted;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	padding-left: 4px;
}

.field-card {
	background: $surface;
	border: 1px solid $border;
	border-radius: 12px;
	padding: 4px 16px;
}

.submit {
	@include text-1-medium;
	background: $text;
	color: $surface;
	padding: 16px 24px;
	border-radius: 12px;
	margin-top: 4px;
	transition: background 0.15s ease, transform 0.05s ease;

	&:not(:disabled):hover {
		background: #000;
	}

	&:not(:disabled):active {
		transform: translateY(1px);
	}

	&:focus-visible {
		@include focus-ring;
	}

	&:disabled {
		background: $border;
		color: $text-subtle;
		cursor: not-allowed;
	}
}

@media (max-width: 540px) {
	.widget {
		padding: 24px 20px;
		border-radius: 16px;
	}
	.title {
		@include h3-bold;
	}
}
</style>

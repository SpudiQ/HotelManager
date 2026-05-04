<script setup lang="ts">
import { HugeiconsIcon } from "@hugeicons/vue";
import { Folder01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { Workspace } from "../types/workspace";

interface Props {
	workspace: Workspace;
}
defineProps<Props>();
</script>

<template>
	<NuxtLink :to="`/admin/workspaces/${workspace.id}`" class="card">
		<div class="card__head">
			<span class="card__icon">
				<HugeiconsIcon :icon="Folder01Icon" :size="22" :stroke-width="1.5" />
			</span>
			<HugeiconsIcon :icon="ArrowRight01Icon" :size="18" :stroke-width="1.5" class="card__chev" />
		</div>

		<div class="card__body">
			<h3 class="card__title">{{ workspace.name }}</h3>
		</div>

		<div class="card__foot">
			<span class="card__meta">Объектов: {{ workspace.propertyCount }}</span>
		</div>
	</NuxtLink>
</template>

<style lang="scss" scoped>
.card {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 20px;
	background: $surface;
	border: 1px solid $border;
	color: $text;
	transition: border-color 0.15s ease, transform 0.05s ease;

	&:hover {
		border-color: $text;

		.card__chev {
			transform: translateX(2px);
		}
	}

	&:active {
		transform: translateY(1px);
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.card__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: $text-muted;
}

.card__icon {
	width: 40px;
	height: 40px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: 1px solid $border;
	color: $text;
}

.card__chev {
	transition: transform 0.15s ease;
}

.card__body {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.card__title {
	@include h3-bold;
	color: $text;
}

.card__desc {
	@include text-2;
	color: $text-muted;
}

.card__foot {
	margin-top: auto;
	padding-top: 12px;
	border-top: 1px solid $border;
}

.card__meta {
	@include caption-medium;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: $text-muted;
}
</style>

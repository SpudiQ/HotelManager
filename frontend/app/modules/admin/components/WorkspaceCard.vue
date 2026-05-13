<script setup lang="ts">
import { HugeiconsIcon } from "@hugeicons/vue";
import { Edit02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import type { Workspace } from "../types/workspace";
import { getWorkspaceIcon } from "../constants/workspace-icons";

interface Props {
	workspace: Workspace;
}
const props = defineProps<Props>();

const emit = defineEmits<{
	edit: [workspace: Workspace];
	delete: [workspace: Workspace];
}>();

const onOpen = () => navigateTo(`/admin/workspaces/${props.workspace.id}`);
const onKeydown = (event: KeyboardEvent) => {
	if (event.key === "Enter" || event.key === " ") {
		event.preventDefault();
		onOpen();
	}
};
</script>

<template>
	<article
		class="card"
		role="button"
		tabindex="0"
		@click="onOpen"
		@keydown="onKeydown"
	>
		<div class="card__head">
			<span class="card__icon">
				<HugeiconsIcon
					:icon="getWorkspaceIcon(workspace.settings?.icon)"
					:size="22"
					:stroke-width="1.5"
				/>
			</span>
			<div class="card__actions">
				<button
					type="button"
					class="card__action"
					aria-label="Редактировать"
					@click.stop="emit('edit', workspace)"
				>
					<HugeiconsIcon :icon="Edit02Icon" :size="16" :stroke-width="1.5" />
				</button>
				<button
					type="button"
					class="card__action"
					aria-label="Удалить"
					@click.stop="emit('delete', workspace)"
				>
					<HugeiconsIcon :icon="Delete02Icon" :size="16" :stroke-width="1.5" />
				</button>
			</div>
		</div>

		<div class="card__body">
			<h3 class="card__title">{{ workspace.name }}</h3>
		</div>

		<div class="card__foot">
			<span class="card__meta">Объектов: {{ workspace.propertyCount }}</span>
		</div>
	</article>
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
	cursor: pointer;
	transition: border-color 0.15s ease, transform 0.05s ease;

	&:hover {
		border-color: $text;
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

.card__actions {
	display: flex;
	align-items: center;
	gap: 4px;
}

.card__action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	padding: 0;
	background: transparent;
	color: $text-muted;
	border: 0;
	cursor: pointer;
	opacity: 0;
	transition:
		opacity 0.12s ease,
		background 0.12s ease,
		color 0.12s ease;

	.card:hover &,
	.card:focus-within & {
		opacity: 1;
	}

	&:hover {
		background: $surface-alt;
		color: $text;
	}

	&:focus-visible {
		opacity: 1;
		@include focus-ring;
	}
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

.card__meta {
	@include caption-medium;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: $text-muted;
}
</style>

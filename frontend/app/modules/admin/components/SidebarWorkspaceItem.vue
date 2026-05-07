<script setup lang="ts">
import { HugeiconsIcon } from "@hugeicons/vue";
import { Folder01Icon } from "@hugeicons/core-free-icons";
import { storeToRefs } from "pinia";
import { useWorkspacesStore } from "~/stores/workspaces";

const workspacesStore = useWorkspacesStore();
const { items: workspaces } = storeToRefs(workspacesStore);
onMounted(() => {
	if (!workspaces.value.length) workspacesStore.fetchAll();
});

const open = ref(false);
const wrapper = ref<HTMLElement | null>(null);

const menuItems = [
	{ label: "Перейти в раздел", to: "/admin/workspaces" },
];

const toggle = () => {
	open.value = !open.value;
};

const close = () => {
	open.value = false;
};

const onDocClick = (event: MouseEvent) => {
	if (!open.value) return;
	if (wrapper.value && !wrapper.value.contains(event.target as Node)) close();
};

onMounted(() => document.addEventListener("click", onDocClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocClick));
</script>

<template>
	<div ref="wrapper" class="ws">
		<button
			type="button"
			class="parent"
			:class="{ 'parent--open': open }"
			:aria-expanded="open"
			@click="toggle"
		>
			<HugeiconsIcon :icon="Folder01Icon" :size="20" :stroke-width="1.5" />
			<span class="tip">Workspaces</span>
		</button>

		<Transition name="expand">
			<div v-if="open" class="children">
				<NuxtLink
					v-for="workspace in workspaces"
					:key="workspace.id"
					:to="`/admin/workspaces/${workspace.id}`"
					class="child"
					@click="close"
				>
					<span class="child__avatar">{{ workspace.name.charAt(0) }}</span>
					<span class="child__tip">{{ workspace.name }}</span>
				</NuxtLink>
			</div>
		</Transition>

		<SidebarContextMenu :items="menuItems" :open="open" @close="close" />
	</div>
</template>

<style lang="scss" scoped>
.ws {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
}

.parent {
	position: relative;
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: transparent;
	border: 1px solid transparent;
	color: $text-muted;
	cursor: pointer;
	transition: color 0.12s ease, background 0.12s ease, border-color 0.12s ease;

	&:hover,
	&--open {
		color: $text;
		background: $surface-alt;
	}

	&--open {
		border-color: $border;
	}

	&:hover .tip {
		opacity: 1;
		transform: translate(0, -50%);
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.tip {
	position: absolute;
	left: calc(100% + 10px);
	top: 50%;
	transform: translate(-4px, -50%);
	padding: 4px 8px;
	background: $text;
	color: $surface;
	@include caption-medium;
	white-space: nowrap;
	pointer-events: none;
	opacity: 0;
	transition: opacity 0.12s ease, transform 0.12s ease;
	z-index: 60;
}

.parent--open .tip {
	opacity: 0;
}

.children {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	padding: 4px 0 8px;
}

.child {
	position: relative;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: $surface;
	border: 1px solid $border;
	color: $text-muted;
	cursor: pointer;
	@include caption-medium;
	transition: border-color 0.12s ease, color 0.12s ease;

	&:hover {
		border-color: $text;
		color: $text;

		.child__tip {
			opacity: 1;
			transform: translate(0, -50%);
		}
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.child__avatar {
	user-select: none;
}

.child__tip {
	position: absolute;
	left: calc(100% + 10px);
	top: 50%;
	transform: translate(-4px, -50%);
	padding: 4px 8px;
	background: $text;
	color: $surface;
	@include caption-medium;
	white-space: nowrap;
	pointer-events: none;
	opacity: 0;
	transition: opacity 0.12s ease, transform 0.12s ease;
	z-index: 60;
}

.expand-enter-active,
.expand-leave-active {
	transition: opacity 0.15s ease, max-height 0.15s ease;
	overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
	opacity: 0;
	max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
	opacity: 1;
	max-height: 320px;
}
</style>

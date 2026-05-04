<script setup lang="ts">
interface MenuItem {
	label: string;
	to?: string;
	action?: () => void;
}

interface Props {
	items: MenuItem[];
	open: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();

const selectMenuItem = (item: MenuItem) => {
	item.action?.();
	emit("close");
};
</script>

<template>
	<Transition name="menu">
		<div v-if="props.open" class="menu" role="menu">
			<template v-for="item in props.items" :key="item.label">
				<NuxtLink
					v-if="item.to"
					:to="item.to"
					class="menu__item"
					role="menuitem"
					@click="selectMenuItem(item)"
				>
					{{ item.label }}
				</NuxtLink>
				<button
					v-else
					type="button"
					class="menu__item"
					role="menuitem"
					@click="selectMenuItem(item)"
				>
					{{ item.label }}
				</button>
			</template>
		</div>
	</Transition>
</template>

<style lang="scss" scoped>
.menu {
	position: absolute;
	left: calc(100% + 8px);
	top: 0;
	min-width: 200px;
	background: $surface;
	border: 1px solid $border;
	padding: 6px;
	display: flex;
	flex-direction: column;
	gap: 2px;
	z-index: 55;
	@include soft-shadow;
}

.menu__item {
	@include text-2;
	display: block;
	width: 100%;
	text-align: left;
	padding: 8px 10px;
	color: $text;
	background: transparent;
	border: 0;
	cursor: pointer;
	transition: background 0.12s ease;

	&:hover {
		background: $surface-alt;
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.menu-enter-active,
.menu-leave-active {
	transition: opacity 0.12s ease, transform 0.12s ease;
}
.menu-enter-from,
.menu-leave-to {
	opacity: 0;
	transform: translateX(-4px);
}
</style>

<script setup lang="ts">
import { HugeiconsIcon } from "@hugeicons/vue";
import { DashboardSquare01Icon, Login03Icon, Logout03Icon, UserIcon } from "@hugeicons/core-free-icons";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { isStaff } from "../utils/roles";

const auth = useAuthStore();
const { user, isAuthenticated, role } = storeToRefs(auth);
const router = useRouter();

const isAdminPage = router.currentRoute.value.fullPath.includes("admin");
const showAdminLink = computed(() => isStaff(role.value) && !isAdminPage);

const open = ref(false);
const rootEl = ref<HTMLElement | null>(null);

const displayName = computed(() =>
	user.value ? `${user.value.firstName} ${user.value.lastName}`.trim() : "",
);
const initial = computed(() => displayName.value.charAt(0).toUpperCase() || "?");

const toggle = () => {
	if (!isAuthenticated.value) return;
	open.value = !open.value;
};

const close = () => {
	open.value = false;
};

const handleLogout = async () => {
	close();
	await auth.logout();
	await router.push("/");
};

const onDocClick = (event: MouseEvent) => {
	if (!open.value) return;
	const root = rootEl.value;
	if (root && !root.contains(event.target as Node)) close();
};

onMounted(() => document.addEventListener("click", onDocClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocClick));
</script>

<template>
	<div ref="rootEl" class="profile">
		<NuxtLink
			v-if="!isAuthenticated"
			to="/login"
			class="trigger trigger--guest"
			aria-label="Войти"
		>
			<HugeiconsIcon :icon="Login03Icon" :size="20" :stroke-width="1.5" />
		</NuxtLink>

		<button
			v-else
			type="button"
			class="trigger trigger--user"
			:aria-expanded="open"
			:aria-label="`Профиль (${user?.email})`"
			@click="toggle"
		>
			<span class="avatar">{{ initial }}</span>
		</button>

		<div v-if="open && isAuthenticated" class="popover" role="menu">
			<div class="popover__head">
				<div class="popover__name">{{ displayName }}</div>
				<div class="popover__email">{{ user?.email }}</div>
			</div>
			<NuxtLink
				v-if="showAdminLink"
				to="/admin"
				class="popover__item"
				role="menuitem"
				@click="close"
			>
				<HugeiconsIcon :icon="DashboardSquare01Icon" :size="16" :stroke-width="1.5" />
				<span>В админку</span>
			</NuxtLink>
			<NuxtLink to="/profile" class="popover__item" role="menuitem" @click="close">
				<HugeiconsIcon :icon="UserIcon" :size="16" :stroke-width="1.5" />
				<span>В профиль</span>
			</NuxtLink>
			<button type="button" class="popover__item popover__item--danger" role="menuitem" @click="handleLogout">
				<HugeiconsIcon :icon="Logout03Icon" :size="16" :stroke-width="1.5" />
				<span>Выйти</span>
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.profile {
	position: relative;
	display: inline-block;
}

.trigger {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: $text;
	background: $surface;
	border: 1px solid $border;
	cursor: pointer;
	transition: border-color 0.15s ease, transform 0.05s ease;

	&:hover {
		border-color: $text;
	}

	&:active {
		transform: scale(0.96);
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.avatar {
	@include text-2-medium;
	color: $text;
	user-select: none;
}

.popover {
	position: absolute;
	top: calc(100% + 8px);
	right: 0;
	min-width: 220px;
	background: $surface;
	border: 1px solid $border;
	padding: 8px;
	display: flex;
	flex-direction: column;
	gap: 2px;
	z-index: 50;
	@include soft-shadow;
}

.popover__head {
	padding: 8px 10px 10px;
	border-bottom: 1px solid $border;
	margin-bottom: 4px;
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.popover__name {
	@include text-2-medium;
	color: $text;
}

.popover__email {
	@include caption;
	color: $text-muted;
}

.popover__item {
	@include text-2;
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 10px;
	color: $text;
	background: transparent;
	border: 0;
	text-align: left;
	cursor: pointer;
	transition: background 0.12s ease;

	&:hover {
		background: $surface-alt;
	}

	&--danger {
		color: $text;

		&:hover {
			background: rgba(220, 80, 80, 0.08);
			color: #b13b3b;
		}
	}
}
</style>

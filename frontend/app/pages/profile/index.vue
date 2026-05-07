<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { isStaff } from "~/modules/auth/utils/roles";

const auth = useAuthStore();
const { user, isAuthenticated, role } = storeToRefs(auth);
const router = useRouter();

const canEnterAdmin = computed(() => isStaff(role.value));

async function handleLogout() {
	await auth.logout();
	await router.push("/");
}
</script>

<template>
	<section class="profile-page">
		<header class="profile-page__head">
			<h1 class="profile-page__title">Профиль</h1>
			<nav class="profile-page__nav">
				<NuxtLink v-if="canEnterAdmin" to="/admin" class="profile-page__link">
					← В админку
				</NuxtLink>
				<NuxtLink to="/" class="profile-page__link">← На главную</NuxtLink>
			</nav>
		</header>

		<div v-if="isAuthenticated" class="card">
			<div class="row">
				<span class="row__key">Имя</span>
				<span class="row__val">{{ user ? `${user.firstName} ${user.lastName}`.trim() : "" }}</span>
			</div>
			<div class="row">
				<span class="row__key">Email</span>
				<span class="row__val">{{ user?.email }}</span>
			</div>
			<div class="row">
				<span class="row__key">Роль</span>
				<span class="row__val">{{ role }}</span>
			</div>

			<button type="button" class="logout" @click="handleLogout">Выйти</button>
		</div>

		<div v-else class="card card--empty">
			<p class="empty">Вы не вошли.</p>
			<NuxtLink to="/login" class="login-link">Войти</NuxtLink>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.profile-page {
	max-width: 560px;
	margin: 64px auto;
	padding: 0 24px;
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.profile-page__head {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.profile-page__title {
	@include h1-bold;
	color: $text;
}

.profile-page__nav {
	display: flex;
	align-items: center;
	gap: 16px;
}

.profile-page__link {
	@include text-2;
	color: $text-muted;

	&:hover {
		color: $text;
	}
}

.card {
	background: $surface;
	border: 1px solid $border;
	padding: 24px;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.card--empty {
	align-items: flex-start;
	gap: 16px;
}

.row {
	display: flex;
	justify-content: space-between;
	gap: 16px;
	padding: 8px 0;
	border-bottom: 1px solid $border;

	&:last-of-type {
		border-bottom: 0;
	}
}

.row__key {
	@include caption-medium;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: $text-muted;
}

.row__val {
	@include text-2;
	color: $text;
}

.logout {
	margin-top: 12px;
	@include text-1-medium;
	background: $text;
	color: $surface;
	padding: 12px 18px;
	border: 1px solid $text;
	cursor: pointer;
	transition: background 0.12s ease, transform 0.05s ease;
	align-self: flex-start;

	&:hover {
		background: #000;
	}

	&:active {
		transform: translateY(1px);
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.empty {
	@include text-1;
	color: $text-muted;
}

.login-link {
	@include text-2-medium;
	padding: 10px 16px;
	border: 1px solid $border;
	color: $text;

	&:hover {
		border-color: $text;
	}
}
</style>

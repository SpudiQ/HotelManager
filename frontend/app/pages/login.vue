<script setup lang="ts">
import { useAuth } from "~/modules/auth/composables/useAuth";
import { isStaff } from "~/modules/auth/utils/roles";

definePageMeta({ layout: "landing" });

const { login, isLoading, role } = useAuth();
const router = useRouter();

const email = ref("");
const password = ref("");

async function submit() {
	if (isLoading.value) return;
	try {
		await login({ email: email.value, password: password.value });
		await router.push(isStaff(role.value) ? "/admin" : "/profile");
	} catch {
		// NOTE: ошибка уже показана через snackbar-интерцептор
	}
}
</script>

<template>
	<section class="login">
		<header class="login__head">
			<h1 class="login__title">Вход</h1>
			<p class="login__sub">Введите email и пароль для входа в систему.</p>
		</header>

		<form class="login__form" @submit.prevent="submit">
			<div class="field">
				<label class="field__label" for="email">Email</label>
				<input
					id="email"
					v-model="email"
					type="email"
					class="field__input"
					placeholder="admin@hotel.local"
					autocomplete="email"
					required
					:disabled="isLoading"
				/>
			</div>

			<div class="field">
				<label class="field__label" for="password">Пароль</label>
				<input
					id="password"
					v-model="password"
					type="password"
					class="field__input"
					autocomplete="current-password"
					required
					:disabled="isLoading"
				/>
			</div>

			<button type="submit" class="btn" :disabled="isLoading">
				{{ isLoading ? "…" : "Войти" }}
			</button>
		</form>
	</section>
</template>

<style lang="scss" scoped>
.login {
	width: 100%;
	max-width: 440px;
	background: $surface;
	border: 1px solid $border;
	padding: 32px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	@include soft-shadow;
}

.login__head {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.login__title {
	@include h2-bold;
	color: $text;
}

.login__sub {
	@include text-2;
	color: $text-muted;
}

.login__form {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.field {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.field__label {
	@include caption-medium;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: $text-muted;
}

.field__input {
	@include text-2;
	width: 100%;
	padding: 10px 12px;
	background: $surface;
	border: 1px solid $border;
	color: $text;
	outline: none;
	transition: border-color 0.15s ease;

	&::placeholder {
		color: $text-subtle;
	}

	&:hover:not(:disabled) {
		border-color: $border-hover;
	}

	&:focus {
		border-color: $text;
	}

	&:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
}

.btn {
	@include text-1-medium;
	padding: 12px 18px;
	background: $text;
	color: $surface;
	border: 1px solid $text;
	cursor: pointer;
	transition: background 0.12s ease, transform 0.05s ease;
	align-self: flex-start;

	&:hover:not(:disabled) {
		background: #000;
	}

	&:active:not(:disabled) {
		transform: translateY(1px);
	}

	&:focus-visible {
		@include focus-ring;
	}

	&:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
}
</style>

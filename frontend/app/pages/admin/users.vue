<script setup lang="ts">
import { Role } from "~/modules/auth/types/auth";
import { useAuth } from "~/modules/auth/composables/useAuth";
import { useBreadcrumbs } from "~/modules/admin/composables/useBreadcrumbs";

definePageMeta({ layout: "admin" });

const { role } = useAuth();
const { set } = useBreadcrumbs();
set([{ label: "Пользователи" }]);

if (role.value !== Role.SUPERADMIN) {
	await navigateTo("/admin");
}
</script>

<template>
	<section class="page">
		<h1 class="title">Пользователи</h1>
		<div class="placeholder">Управление пользователями в разработке</div>
	</section>
</template>

<style lang="scss" scoped>
.page {
	display: flex;
	flex-direction: column;
	gap: 16px;
}
.title {
	@include h1-bold;
	color: $text;
}
.placeholder {
	@include text-2;
	padding: 48px;
	text-align: center;
	color: $text-subtle;
	background: $surface;
	border: 1px dashed $border;
}
</style>

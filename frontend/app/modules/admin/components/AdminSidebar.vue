<script setup lang="ts">
import { Analytics01Icon, UserMultipleIcon, Settings01Icon } from "@hugeicons/core-free-icons";
import { Role } from "~/modules/auth/types/auth";
import { useAuth } from "~/modules/auth/composables/useAuth";

const { role } = useAuth();
const route = useRoute();

const isActive = (prefix: string) => route.path.startsWith(prefix);

const showUsers = computed(() => role.value === Role.SUPERADMIN);
</script>

<template>
	<nav class="sb">
		<div class="sb__top">
			<SidebarWorkspaceItem />

			<SidebarItem
				:icon="Analytics01Icon"
				tooltip="Аналитика"
				to="/admin/analytics"
				:active="isActive('/admin/analytics')"
			/>

			<SidebarItem
				v-if="showUsers"
				:icon="UserMultipleIcon"
				tooltip="Пользователи"
				to="/admin/users"
				:active="isActive('/admin/users')"
			/>
		</div>

		<div class="sb__bottom">
			<SidebarItem
				:icon="Settings01Icon"
				tooltip="Настройки"
				to="/admin/settings"
				:active="isActive('/admin/settings')"
			/>
		</div>
	</nav>
</template>

<style lang="scss" scoped>
.sb {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 12px 0;
}

.sb__top,
.sb__bottom {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
}
</style>

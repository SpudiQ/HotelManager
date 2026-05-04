<template>
	<div class="admin-layout">
		<aside class="sidebar">
			<AdminSidebar />
		</aside>
		<header class="upperbar">
			<AdminUpperbar />
		</header>
		<main class="content">
			<slot />
		</main>
	</div>
</template>

<style lang="scss" scoped>
.admin-layout {
	display: grid;
	grid-template-columns: 64px 1fr;
	grid-template-rows: 56px 1fr;
	grid-template-areas:
		"sidebar upperbar"
		"sidebar content";
	height: 100vh;
	background: $bg;
}

.sidebar {
	grid-area: sidebar;
	background: $surface;
	border-right: 1px solid $border;
	overflow: visible;
}

.upperbar {
	grid-area: upperbar;
	background: $surface;
	border-bottom: 1px solid $border;
}

.content {
	grid-area: content;
	overflow-y: auto;
	padding: 24px 28px;
}
</style>

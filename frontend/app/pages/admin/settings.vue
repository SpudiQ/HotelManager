<script setup lang="ts">
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";

definePageMeta({ layout: "admin" });

useBreadcrumbsStore().set([{ label: "Настройки" }]);
</script>

<template>
	<section class="page">
		<h1 class="title">Настройки</h1>
		<div class="placeholder">Раздел настроек в разработке</div>
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

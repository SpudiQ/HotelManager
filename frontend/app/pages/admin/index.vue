<script setup lang="ts">
definePageMeta({
	layout: "admin",
	middleware: [() => navigateTo("/admin/workspaces", { replace: true })],
});
</script>

<template>
	<div></div>
</template>

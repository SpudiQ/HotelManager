<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";

const { crumbs } = storeToRefs(useBreadcrumbsStore());
</script>

<template>
	<nav v-if="crumbs.length" class="bc" aria-label="Хлебные крошки">
		<template v-for="crumb in crumbs" :key="crumb.to ?? crumb.label">
			<NuxtLink v-if="crumb.to" :to="crumb.to" class="bc__link">
				{{ crumb.label }}
			</NuxtLink>
			<span v-else class="bc__current">{{ crumb.label }}</span>
			<span v-if="crumb.to" class="bc__sep">/</span>
		</template>
	</nav>
	<span v-else class="bc bc--empty"></span>
</template>

<style lang="scss" scoped>
.bc {
	display: flex;
	align-items: center;
	gap: 8px;
	@include text-2;
	color: $text-muted;
}

.bc__link {
	color: $text-muted;

	&:hover {
		color: $text;
	}
}

.bc__current {
	color: $text;
	@include text-2-medium;
}

.bc__sep {
	color: $text-subtle;
}

.bc--empty {
	display: block;
}
</style>

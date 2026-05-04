<template>
	<div class="ub">
		<div class="ub__left">
			<AdminBreadcrumbs />
		</div>
		<div class="ub__right">
			<ProfileButton />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.ub {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20px;
}

.ub__left,
.ub__right {
	display: flex;
	align-items: center;
}
</style>

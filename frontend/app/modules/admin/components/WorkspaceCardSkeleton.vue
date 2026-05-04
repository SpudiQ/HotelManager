<template>
	<div class="card">
		<div class="card__head">
			<span class="card__icon skel"></span>
			<span class="skel skel--chev"></span>
		</div>

		<div class="card__body">
			<div class="skel skel--title"></div>
		</div>

		<div class="card__foot">
			<div class="skel skel--meta"></div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@keyframes skel-shimmer {
	0% { background-position: -200% center; }
	100% { background-position: 200% center; }
}

.skel {
	display: block;
	background: linear-gradient(90deg, $bg 0%, $border 50%, $bg 100%);
	background-size: 200% auto;
	animation: skel-shimmer 1.8s linear infinite;
}

.card {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 20px;
	background: $surface;
	border: 1px solid $border;
}

.card__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.card__icon {
	width: 40px;
	height: 40px;
}

.skel--chev {
	width: 18px;
	height: 18px;
}

.card__body {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.skel--title {
	height: 20px;
	width: 55%;
}

.card__foot {
	margin-top: auto;
	padding-top: 12px;
	border-top: 1px solid $border;
}

.skel--meta {
	height: 12px;
	width: 40%;
}
</style>

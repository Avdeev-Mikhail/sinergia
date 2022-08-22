<template>
	<div class="couples__item" :class="{ 'couples__item--active': isActive }">
		{{ title }}
	</div>
</template>

<script>
	export default {
		name: "Item",
		props: {
			title: String,
			left: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isActive: false,
			}
		},
	}
</script>
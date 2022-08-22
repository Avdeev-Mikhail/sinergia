<template>
	<main class="main">
		<div class="main__container">
			<Sidebar />
			<router-view/>
		</div>
	</main>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";

export default {
	components: { Sidebar },
}

</script>

<style lang="scss">
// @import "@/assets/scss/vars.scss";

* {
	box-sizing: border-box;
}

html,
body {
	margin: 0;
	padding: 0;
	height: 100%;
}

body.lock {
	overflow: hidden;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	height: 100%;
	display: flex;
	flex-direction: column;
}

[class*=__container] {
	max-width: rem($max-width-container + 30);
	margin: 0 auto;
	padding: 0 rem(15);
	display: flex;
	flex: 1 1 auto;
}

.main {
	flex: 1 1 auto;

	&__container {
		display: flex;
		align-items: flex-start;
		height: 100%;
	}

	&__aside {
		padding: rem(15) rem(30) rem(15) rem(0);
		@media (min-width: 575.8px) {
			flex: 0 0 rem(200);
		}
		@media (max-width: 575.8px) {
			padding-right: rem(15);
		}
	}

	&__content {
		border-left: rem(1) solid #eee;
		padding: rem(15) rem(0) rem(15) rem(30);
		flex: 1 1 auto;
		height: 100%;
		@media (max-width: 575.8px) {
			padding-left: rem(15);
		}
	}

	body.lock &__content {
		padding-left: rem(60);
	}

	&__title {
		font-size: 1.3rem;
		&:not(:last-child) {
			margin-bottom: 1rem;
		}
	}

	&__hint {
		font-weight: bold;
		&:not(:last-child) {
			margin-bottom: 2rem;
		}
	}
}

.task-list {
	display: flex;
	flex-direction: column;
	margin: rem(-8) 0;

	&__item {
		margin: rem(8) 0;
	}
}

@media (max-width: 767.8px) {
	html, body {
		font-size: 12px;
	}
}

</style>

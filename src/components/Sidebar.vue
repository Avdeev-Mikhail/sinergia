<template>
	<aside class="main__aside aside" :class="{ 'active': sidebar }">
		<div @click="toggleSidebar" class="menu-icon" :class="{ 'menu-icon--active': sidebar }">
			<span></span>
		</div>
		<nav ref="nav">
			<ul>
				<li :class="{ active: this.$route.name == 'TaskList' }">
					<router-link :to="{ name: 'TaskList' }">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z" /></svg>
						<span>Онлайн-курсы</span>
					</router-link>
				</li>
				<li :class="{ active: this.$route.name == 'Admin' }">
					<router-link :to="{ name: 'Admin' }">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"/></svg>
						<span>Админ-панель</span>
					</router-link>
				</li>
			</ul>
		</nav>
	</aside>
</template>

<script>

export default {
	name: "Sidebar",
	data() {
		return {
			sidebar: false,
		}
	},
	methods: {
		toggleSidebar: function(event) {
			this.sidebar = !this.sidebar;
			document.body.classList.toggle('lock');
			if (this.sidebar) {
				let backdrop = document.createElement('div');
				backdrop.classList.add('backdrop');
				document.body.append(backdrop);
				backdrop.addEventListener("click", () => {
					this.toggleSidebar();
				});
			} else {
				document.querySelector('.backdrop').remove();
			}
		}
	}
}

</script>

<style lang="scss" scoped="scoped">

aside {
	position: sticky;
	top: 0;
}

nav {
	a {
		font-weight: bold;
		color: #2c3e50;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
}


ul {
	list-style: none;
	margin: 0;
	padding: 0;

	li {
		margin: rem(15) 0;
		display: flex;
		justify-content: center;
		a {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		@media (max-width: 575.8px) {
			justify-content: center;
			margin: rem(30) 0;
			a span {
				display: none;
			}
		}
	}

	li.active a {
		color: #7676f3;
	}

	li.active svg {
		fill: #7676f3;
	}

	svg {
		width: 1rem;
		@media (min-width: 575.8px) {
			margin-right: rem(10);
		}
	}
}


@media (max-width: 575.8px) {
	.aside.active {
		position: fixed;
		background-color: #fff;
		z-index: 99;
		height: 100vh;
		overflow: auto;
		border-right: rem(1) solid #eee;
		padding-left: rem(15);
		left: 0;

		ul li a span {
			display: block;
		}

		ul li svg {
			margin-right: rem(10);
		}
	}
}

</style>

<style lang="scss">

@media (min-width: 575.8px) {
	.menu-icon {
		display: none;
	}
}

@media (max-width: 575.8px) {
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0 0 0 / 50%);
	}

	.menu-icon {
		z-index: 5;
		display: block;
		position: relative;
		cursor: pointer;
		width: rem(30);
		height: rem(18);
		& span,
		&::before,
		&::after {
			position: absolute;
			left: 0;
			height: 10%;
			width: 100%;
			transition: all 0.3s ease 0s;
			background-color: #000;
		}
		&::before,
		&::after {
			content: "";
		}
		& span {
			top: 50%;
			transform: scale(1) translate(0, -50%);
		}
		&::before {
			top: 0;
		}
		&::after {
			bottom: 0;
		}
		&--active::before {
			top: 50%;
			transform: rotate(-45deg) translate(0, -50%);
		}
		&--active::after {
			bottom: 50%;
			transform: rotate(45deg) translate(0, 50%);
		}
		&--active span {
			transform: scale(0);
		}
	}
}

</style>
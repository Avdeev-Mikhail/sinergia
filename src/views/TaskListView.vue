<template>
	<div class="main__content">
		<div class="main__title">Онлайн-курсы</div>
		<div class="main__task-list task-list" v-if="tasks.length > 0">
			<router-link
			class="task-list__item"
			v-for="el in tasks"
			:key="el.id"
			:to="{ name: 'TaskDetail', params: { taskId: el.id } }">
				Задание {{ el.id }}. {{ el.description }}
			</router-link>
		</div>
		<div v-else class="text-secondary">Заданий не найдено</div>
	</div>
</template>

<script>

import Modal from "@/components/Modal.vue";

export default {
	components: { Modal },
	data() {
		return {
			tasks: null,
		}
	},
	created() {
		if (!localStorage.tasks) localStorage.tasks = JSON.stringify([]);
		this.tasks = JSON.parse(localStorage.tasks);
	},
}

</script>

<style lang="scss">

</style>

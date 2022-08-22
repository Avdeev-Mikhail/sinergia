<template>
	<div class="main__content">
		<div class="main__title">Здесь вы можете добавить / изменить задания</div>
		<a class="btn btn-success mb-3" href="#" data-bs-toggle="modal" data-bs-target="#addTaskModal">Добавить задание</a>
		<div class="main__task-list task-list" v-if="tasks.length > 0">
			<a
			@click="openEditTaskModal(index)"
			class="task-list__item"
			v-for="(el, index) in tasks"
			:key="el.id"
			data-bs-toggle="modal"
			data-bs-target="#editTaskModal"
			href="#">
				Задание {{ el.id }}. {{ el.description }}
			</a>
		</div>
		<div v-else class="text-secondary">Заданий не найдено</div>
		<Modal @formSubmit="addTask" id="addTask" title="Добавление нового задания" button="Добавить задание">
			<input v-model="newTask.description" class="form-control" type="text" placeholder="Описание задания">
			<div class="add-task-list">
				<div class="add-task-list__item mt-3" v-for="el in newTask.questions">
					<input v-model="el.question" class="form-control" type="text" placeholder="Вопрос">
					<input v-model="el.answer" class="form-control" type="text" placeholder="Ответ">
				</div>
			</div>
			<a @click="addQuestion(this.newTask)" class="btn btn-primary mt-3" href="#">Добавить вопрос</a>
		</Modal>
		<Modal @formSubmit="editTask(editableTask.id)" id="editTask" title="Редактирование задания" button="Сохранить">
			<input v-model="editableTask.description" class="form-control" type="text" placeholder="Описание задания">
			<div class="add-task-list">
				<div class="add-task-list__item mt-3" v-for="el in editableTask.questions">
					<input v-model="el.question" class="form-control" type="text" placeholder="Вопрос">
					<input v-model="el.answer" class="form-control" type="text" placeholder="Ответ">
				</div>
			</div>
			<a @click="addQuestion(this.editableTask)" class="btn btn-primary mt-3" href="#">Добавить вопрос</a>
		</Modal>
		
	</div>
</template>

<script>

import Modal from "@/components/Modal.vue";

export default {
	components: { Modal },
	data() {
		return {
			tasks: null,
			newTask: {
				id: 1,
				description: "",
				questions: [
					{
						question: "",
						answer: "",
					},
				]
			},
			editableTask: {},
		}
	},
	created() {
		if (!localStorage.tasks) localStorage.tasks = JSON.stringify([]);
		this.tasks = JSON.parse(localStorage.tasks);
		if (this.tasks.length > 0) this.newTask.id = this.tasks[this.tasks.length - 1].id + 1;
	},
	methods: {
		addQuestion(object) {
			object.questions.push({
				question: "",
				answer: "",
			});
		},
		addTask() {
			this.tasks.push(this.newTask);
			this.updateLocalStorage();
		},
		editTask(id) {
			let index = this.tasks.findIndex(task => task.id == id);
			this.tasks[index] = this.editableTask;
			this.updateLocalStorage();
		},
		openEditTaskModal(index) {
			this.editableTask = this.tasks[index];
		},
		updateLocalStorage() {
			localStorage.tasks = JSON.stringify(this.tasks);
		}
	}
}

</script>

<style lang="scss">

.add-task-list {
	display: flex;
	flex-direction: column;

	&__item {
		margin: 0 rem(-2.5);
		display: flex;
	}

	&__item input {
		margin: 0 rem(2.5);
	}
}

</style>

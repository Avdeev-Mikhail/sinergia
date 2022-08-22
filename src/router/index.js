import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/tasks/',
		name: 'TaskList',
		component: () => import('@/views/TaskListView.vue'),
	},
	{
		path: '/tasks/:taskId',
		name: 'TaskDetail',
		component: () => import('@/views/TaskView.vue'),
	},
	{
		path: '/admin',
		name: 'Admin',
		component: () => import('@/views/AdminView.vue'),
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router

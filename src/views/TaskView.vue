<template>
	<div class="main__content" @mousemove="onMouseMove">
		<div class="main__title">
			Пары соответствий
		</div>
		<div class="main__hint">
			{{ description }}
		</div>
		<div class="main__couples couples" ref="couples">
			<div class="couples__column">
				<div class="couples__list">
					<template v-for="el in leftColumn" :key="el.id">
						<Item
						:class="{ 'couples__item--active': leftId == el.id }"
						@click="onClick($event, 'left' + el.id)"
						:title="el.title"
						@mouseenter="onMouseEnter($event, 'left' + el.id)"
						@mouseleave="onMouseLeave"
						:left="true"
						:ref="'left' + el.id" />
					</template>
				</div>
			</div>
			<div class="couples__column couples__column--2">
				<div class="couples__list">
					<template v-for="el in rightColumn" :key="el.id">
						<Item
						:class="{ 'couples__item--active': rightId == el.id }"
						@click="onClick($event, 'right' + el.id)"
						@mouseenter="onMouseEnter($event, 'right' + el.id)"
						@mouseleave="onMouseLeave"
						:title="el.title"
						:ref="'right' + el.id" />
					</template>
				</div>
			</div>
		</div>
		<a @click="sendAnswer" href="#" class="btn btn-primary mt-5">Отправить</a>
	</div>
</template>

<script>
import Item from '@/components/Item.vue';

export default {
	name: 'App',
	components: {
		Item
	},
	data() {
		return {
			width: null,
			height: null,
			description: null,
			leftColumn: [
				
			],
			rightColumn: [
				
			],
			relations: null,
			leftId: null,
			rightId: null,
			isDrag: false,
			mousePos: {
				x: null,
				y: null,
			},
			rightAnswersCount: 0,
		}
	},
	created() {
		if (!localStorage.relations) localStorage.relations = JSON.stringify([]);
		this.relations = JSON.parse(localStorage.relations);
		let tasks = JSON.parse(localStorage.tasks);
		let task = tasks.find(task => task.id == this.$route.params.taskId);
		this.description = task.description;
		task.questions.forEach((question, index) => {
			this.leftColumn.push({
				id: index + 1,
				title: question.question
			});
			this.rightColumn.push({
				id: index + 1,
				title: question.answer
			});
		});
		this.shuffleArray(this.leftColumn);
		this.shuffleArray(this.rightColumn);
	},
	mounted() {
		this.init();
		window.addEventListener('resize', () => {
			this.init();
		});
	},
	methods: {
		init() {
			this.width = this.$refs.couples.offsetWidth;
			this.height = this.$refs.couples.offsetHeight;
			this.relations.forEach(relation => {
				this.moveItemInArray(relation.left, relation.right);
			});
			setTimeout(() => {
				this.updateLines();
			}, 0)
		},
		onMouseMove: function(event) {
			if (!this.isDrag) return;
			this.mousePos.x = event.clientX;
			this.mousePos.y = event.clientY;
			if (this.leftId) this.updateLine('left' + this.leftId);
			else this.updateLine('right' + this.rightId);
			document.body.classList.add('movable');
		},
		onMouseEnter: function(event, name) {
			if (!this.leftId && !this.rightId) return;
			if (this.rightId && name.substr(0, 4) == 'left' || this.leftId && name.substr(0, 5) == 'right') {
				this.isDrag = false;
				let itemName = 'right' + this.rightId;
				if (this.leftId) itemName = 'left' + this.leftId;
				this.updateLine(itemName, name);
			}
		},
		onMouseLeave: function(event) {
			if (!this.leftId && !this.rightId) return;
			this.isDrag = true;
		},
		onClick: function(event, name) {
			let allow = true;
			document.body.classList.remove('movable');
			if (name.substr(0, 4) == "left") {
				let leftId = parseInt(name.substr(4, name.length - 1));
				if (this.checkRelations(leftId, -1)) this.$refs[name][0].isActive = true;
				this.leftId = leftId;
				if (this.rightId == null) allow = false;
			} else {
				let rightId = parseInt(name.substr(5, name.length - 1));
				if (this.checkRelations(-1, rightId)) this.$refs[name][0].isActive = true;
				this.rightId = rightId;
				if (this.leftId == null) allow = false;
			}

			this.isDrag = !allow;
			if (allow) {
				this.addRelation(this.leftId, this.rightId);
			}
		},
		sendAnswer() {
			this.relations.forEach(relation => {
				if (relation.left == relation.right) {
					this.rightAnswersCount++;
				}
			});
			alert('Правильных ответов: ' + this.rightAnswersCount);
			this.rightAnswersCount = 0;
		},
		moveItemInArray(left, right, first) {
			let index = this.rightColumn.findIndex(x => x.id == right);
			let rightItem = this.rightColumn[index];
			this.rightColumn.splice(index, 1);
			if (first) this.rightColumn.unshift(rightItem);
			else this.rightColumn.push(rightItem);
			index = this.leftColumn.findIndex(x => x.id == left);
			let leftItem = this.leftColumn[index];
			this.leftColumn.splice(index, 1);
			if (first) this.leftColumn.unshift(leftItem);
			else this.leftColumn.push(leftItem);
		},
		moveItem(left, right) {
			let leftItem = this.$refs['left' + left][0].$el,
				rightItem = this.$refs['right' + right][0].$el;
			leftItem.style.transform = "translateY(0px)";
			rightItem.style.transform = "translateY(0px)";
				let leftElem = leftItem.getBoundingClientRect(),
				rightElem = rightItem.getBoundingClientRect(),
				leftTop = leftElem.top,
				diff;
			if (leftItem.closest('.couples__list').offsetHeight < rightItem.closest('.couples__list').offsetHeight) {
				diff = rightElem.top - leftElem.top;
				if (leftElem.height < rightElem.height) {
					diff += rightElem.height / 2 - leftElem.height / 2;
				}
				leftItem.style.transform = `translateY(${diff + "px"})`;
			} else {
				diff = leftElem.top - rightElem.top;
				if (rightElem.height < leftElem.height) {
					diff += leftElem.height / 2 - rightElem.height / 2;
				}
				rightItem.style.transform = `translateY(${diff + "px"})`;
			}
		},
		addRelation(left, right) {
			this.checkRelations(left, right, true);
			document.querySelector('div.movable').remove();
			let relation = {
				left: left,
				right: right,
			}
			this.relations.push(relation);
			localStorage.relations = JSON.stringify(this.relations);
			this.moveItemInArray(left, right);
			setTimeout(() => {
				this.updateLines();
			}, 1);
		},
		removeRelation(left, right) {
			let index = this.relations.findIndex(x => x.left == left & x.right == right);
			this.relations.splice(index, 1);
			this.removeLine(left, right);
			let leftName = 'left' + left,
				rightName = 'right' + right;
			this.$refs[leftName][0].isActive = false;
			this.$refs[rightName][0].isActive = false;
			this.$refs[leftName][0].$el.style.transform = "translateY(0px)";
			this.$refs[rightName][0].$el.style.transform = "translateY(0px)";
			this.moveItemInArray(left, right, true);
			setTimeout(() => {
				this.updateLines();
			}, 0)
		},
		checkRelations(left, right, remove) {
			let relations = this.relations.filter(x => x.left == left || x.right == right);
			if (relations.length > 0) {
				if (remove) {
					relations.forEach(relation => {
						this.removeRelation(relation.left, relation.right);
					});
				}
				return true;
			}
		},
		updateLines() {
			let lines = this.$refs.couples.querySelectorAll('div.line');
			lines.forEach(line => {
				line.remove();
			});
			this.relations.forEach(relation => {
				this.moveItem(relation.left, relation.right);
				this.drawLine(relation.left, relation.right);
			});
		},
		drawLine(left, right) {
			let leftName = 'left' + left,
				rightName = 'right' + right,
				parent = this.$refs.couples.getBoundingClientRect(),
				firstElem = this.$refs[leftName][0].$el.getBoundingClientRect(),
				secondElem = this.$refs[rightName][0].$el.getBoundingClientRect(),
				firstTop = firstElem.top - parent.top,
				firstLeft = firstElem.left - parent.left,
				secondTop = secondElem.top - parent.top,
				x1 = firstLeft + firstElem.width,
				y1 = firstTop + firstElem.height / 2,
				x2 = secondElem.left - parent.left,
				y2 = secondTop + secondElem.height / 2,
				lineName = 'line' + left + right;
			this.changeLine(x1, y1, x2, y2, lineName, false, left, right);
			this.$refs[leftName][0].isActive = true;
			this.$refs[rightName][0].isActive = true;
			this.leftId = null;
			this.rightId = null;
		},
		updateLine(itemName, itemName2) {
			let oldLine = document.querySelector('div.movable');
			if (oldLine) oldLine.remove();
			let item = this.getItemObject(itemName),
				parent = this.$refs.couples.getBoundingClientRect(),
				firstElem = this.$refs[item.name + item.id][0].$el.getBoundingClientRect(),
				x1, x2, y1, y2;
			if (item.name == "left") {
				x1 = (firstElem.left - parent.left) + firstElem.width;
				y1 = (firstElem.top - parent.top) + firstElem.height / 2;
				x2 = this.mousePos.x - parent.left;
				y2 = this.mousePos.y - parent.top;
			} else {
				x1 = this.mousePos.x - parent.left;
				y1 = this.mousePos.y - parent.top;
				x2 = (firstElem.left - parent.left);
				y2 = (firstElem.top - parent.top) + firstElem.height / 2;
			}
			if (itemName2) {
				let item2 = this.getItemObject(itemName2),
					secondElem = this.$refs[item2.name + item2.id][0].$el.getBoundingClientRect();
				if (item2.name == "left") {
					x1 = (secondElem.left - parent.left) + secondElem.width;
					y1 = (secondElem.top - parent.top) + secondElem.height / 2;
				} else {
					x2 = (secondElem.left - parent.left);
					y2 = (secondElem.top - parent.top) + secondElem.height / 2;
				}
			}
			this.changeLine(x1, y1, x2, y2, 'line' + item.id, true);
		},
		changeLine(x1, y1, x2, y2, lineName, movable, left, right) {
			let div = document.createElement('div'),
				h = y1 - y2,
				l = x2 - x1,
				rotate = Math.atan(-h / l) * 180 / Math.PI;

			if (l < 0) {
				rotate += 180;
			}
			if (!document.getElementById(lineName)) {
				div.id = lineName;
				this.$refs.couples.append(div);
				div.append(document.createElement('span'));
			} else {
				div = document.getElementById(lineName);
			}
			div.classList.add('line');
			if (movable) div.classList.add('movable');
			div.addEventListener("click", () => {
				this.removeRelation(left, right);
			});
			div.style.left = x1 + "px";
			div.style.transform = `rotate(${rotate}deg)`;
			div.style.width = Math.sqrt(h**2 + l**2) + "px";
			div.style.top = y1 - div.offsetHeight / 2 + "px";
		},
		removeLine(left, right) {
			document.getElementById('line' + left + right).remove();
		},
		getItemObject(itemName) {
			let name, id;
			if (itemName.substr(0, 4) == "left") {
				id = parseInt(itemName.substr(4, itemName.length - 1));
				name = "left";
			} else {
				id = parseInt(itemName.substr(5, itemName.length - 1));
				name = "right";
			}
			return {
				id: id,
				name: name,
			}
		},
		shuffleArray(array) {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
		},
	}
}
</script>

<style lang="scss">

.line {
	position: absolute;
	padding: rem(8) 0;
	span {
		display: block;
		background-color: #00f;
		height: rem(2);
		width: 100%;
	}
	cursor: pointer;
	transform-origin: 0 center;

	&:hover::after {
		content: "";
		border-radius: 50%;
		border: 1px solid #00f;
		background-color: #fff;
	}

	&:hover::before {
		content: "";
		color: #00f;
		background: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512' fill='%2300f'%3e%3cpath d='M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z'/%3e%3c/svg%3e");
		background-position: center;
		background-repeat: no-repeat;
		background-size: 1rem 1rem;
		z-index: 1;
	}

	&:hover::before,
	&:hover::after {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 2rem;
		height: 2rem;
	}
}

.movable .line {
	pointer-events: none;
}

.couples {
	position: relative;
	display: flex;
	justify-content: space-between;
	max-width: rem(800);

	&__list {
		display: flex;
		flex-direction: column;
		margin: -0.5rem 0;
	}

	&__item {
		box-sizing: border-box;
		margin: 0.5rem 0;
		padding: 1rem;
		text-align: center;
		border: rem(1) solid #000;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background-color .3s, color .3s, border-color .3s ease 0s;
		position: relative;
		@media (max-width: 575.8px) {
			max-width: rem(110, 12);
		}
	}

	&__item::after {
		content: "";
		position: absolute;
		top: 50%;
		right: -0.3rem;
		width: 0.3rem;
		height: 0.3rem;
		background-color: #999;
		border-radius: 50%;
		transform: translate(0, -50%);
	}

	&__item:hover {
		color: #00f;
		border-color: #00f;
	}

	&__item--active {
		color: #00f;
		border-color: #00f;
		background-color: #ececf9;
	}

	&__item--active::after {
		background-color: #00f;
	}

	&__column--2 {
		.couples__item::after {
			left: -0.3rem;
		}
	}
}

</style>
<script setup lang="ts">
import { ref } from 'vue'

type Item = {
  id: number
  title: string
  categoryId: number
  difficulty?: string
  description?: string
  usersId?: number[]
}
type Category = {
  id: number
  title: string
}
type User = {
  id: number
  name: string
  email: string
}
const items = ref<Item[]>([
  {
    id: 0,
    title: 'BMW',
    categoryId: 0,
    difficulty: 'low',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    usersId: [0, 1, 0, 1, 1]
  },
  {
    id: 1,
    title: 'AUDI',
    categoryId: 0,
    difficulty: 'high',
    usersId: [0]
  },
  {
    id: 2,
    title: 'TOM',
    categoryId: 1,
    difficulty: 'medium',
    usersId: [1]
  }
])
const categories = ref<Category[]>([
  {
    id: 0,
    title: 'To Do'
  },
  {
    id: 1,
    title: 'In Progress'
  },
  {
    id: 2,
    title: 'Done'
  }
])
const users = ref<User[]>([
  {
    id: 0,
    name: 'Andrei',
    email: 'andreipiatra@gmail.com'
  },
  {
    id: 1,
    name: 'Ana',
    email: 'ana@gmail.com'
  }
])
const taskTitle = ref<string>('')
const showAddTaskForm = ref<boolean>(false)

const getQuantityInCategory = (categoryId: number): number => {
  return items.value.reduce(
    (acc: number, item: Item) => (acc += item.categoryId === categoryId ? 1 : 0),
    0
  )
}

const getUserById = (id: number): User | undefined => {
  return users.value.find((user) => user.id === id)
}

const ondragstart = (event: DragEvent, item: Item): void => {
  if (event.dataTransfer === null) return
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('itemId', item.id.toString())
}
const onDrop = (event: DragEvent, categoryId: number): void => {
  if (event.dataTransfer === null) return
  const itemId = parseInt(event.dataTransfer.getData('itemId'))
  items.value = items.value.map((x) => {
    if (x.id === itemId) {
      x.categoryId = categoryId
    }
    return x
  })
}

const addTask = (categoryId: number): void | undefined => {
  if (taskTitle.value === '') return
  items.value.push({
    id: Math.floor(Math.random() * 1000),
    title: taskTitle.value,
    categoryId: categoryId
  })
  taskTitle.value = ''
}

const openTaskForm = () => {
  showAddTaskForm.value = true
}
const closeTaskForm = () => {
  showAddTaskForm.value = false
  taskTitle.value = ''
}
</script>

<template>
  <div class="wrapper">
    <div class="bar">
      <nav class="nav">
        <ul>
          <li>Dashboard</li>
          <li>Order</li>
          <li>Kanban</li>
        </ul>
      </nav>
    </div>
    <div class="main">
      <div class="header">header</div>
      <div class="board">
        <div class="col" v-for="category in categories" :key="category.id">
          <div class="col-header">
            <h2>{{ category.title }}</h2>
            <span>{{ getQuantityInCategory(category.id) }}</span>
          </div>

          <div>
            <button v-if="!showAddTaskForm" @click="openTaskForm" class="add-task">
              <img src="./assets/plus.svg" alt="add button" /> <span>Add new task</span>
            </button>
            <form
              v-if="showAddTaskForm"
              class="add-task-form"
              @submit.prevent="addTask(category.id)"
            >
              <textarea v-model="taskTitle" name="textarea"></textarea>
              <div class="add-task-buttons">
                <button type="sumbit" class="add-task-btn">Add new task</button>
                <button @click="closeTaskForm" type="button" class="close-task-btn">
                  <svg
                    width="24"
                    height="24"
                    role="presentation"
                    focusable="false"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>
          <ul @dragover.prevent @dragenter.prevent @drop="onDrop($event, category.id)" class="list">
            <div
              class="list-item"
              draggable="true"
              @dragstart="ondragstart($event, item)"
              :key="item.id"
              v-for="item in items.filter((item) => item.categoryId === category.id)"
            >
              <span :class="`difficulty difficulty-${item.difficulty}`">{{ item.difficulty }}</span>
              <h4>{{ item.title }}</h4>
              <p class="description">{{ item.description }}</p>
              <div v-if="item.usersId" class="users-list">
                <div
                  :title="user?.name"
                  class="item-user"
                  :key="user?.id"
                  v-for="user in item.usersId.map(getUserById)"
                >
                  <img v-if="user?.id === 0" src="/src/assets/user-0.png" alt="" />
                  <img v-else src="/src/assets/user-1.png" alt="" />
                </div>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 1320px;
  padding: 0px 10px;
  margin: 0 auto;
  display: flex;
  height: 100%;
}
.nav ul li {
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;
  color: #111827;
}
.bar {
  width: 20%;
  background: rgba(255, 0, 0, 0.212);
  color: white;
}
.main {
  width: 80%;
}
.header {
  background: whitesmoke;
  border-bottom: 1px solid #666;
  height: 10%;
}
.board {
  width: 100%;
  background: whitesmoke;
  display: flex;
  overflow-x: auto;
  height: 100%;
}
.col {
  padding: 30px 10px 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  width: clamp(300px, 100%, 300px);
  border-right: 1px solid #666;
}

.col-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.col-header span {
  padding: 2px;
  font-weight: 600;
  font-size: 20px;
}
h2 {
  text-align: center;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #ebecf0;
  flex: 1;
  overflow-y: auto;
}

.list-item {
  border: 1px solid #666;
  border-radius: 4px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
}
.list-item:hover {
  box-shadow: 0 3px 0 0 #b2b8c4;
}
.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* difficulty */
.difficulty {
  font-weight: 500;
  line-height: 133%;
  padding: 5px 10px;
  border-radius: 15px;
  width: max-content;
}
.difficulty-low {
  background: #d1fae5;
  color: #065f46;
  border: 0.7px solid #6ee7b7;
}
.difficulty-high {
  color: #991b1b;
  background: #fee2e2;
  border: 0.7px solid #fca5a5;
}
.difficulty-medium {
  color: #92400e;
  background: #fef3c7;
  border: 0.7px solid #fcd34d;
}

/*  */
.users-list {
  display: flex;
  justify-content: end;
}
.item-user {
  width: 45px;
  height: 45px;
  position: relative;
  transition: all 0.2s ease-in-out;
}
.item-user:hover {
  scale: 1.05;
  z-index: 1;
}
.item-user:not(:last-child) {
  margin-right: -10px;
}

/* add task */
.add-task {
  border: none;
  width: 100%;
  display: flex;
  gap: 20px;
  align-items: center;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 15px;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgb(211, 208, 208);
  transition:
    background-color 0.4s ease,
    scale 0.3s ease;
}
.add-task:hover {
  background-color: rgb(224, 224, 224);
}
.add-task img {
  width: 20px;
  height: 20px;
}

.add-task span {
  font-size: 20px;
}
.add-task-form {
  margin-bottom: 15px;
}
.add-task-form textarea {
  width: 100%;
  resize: none;
  margin: 0;
  padding: 8px 12px;
  overflow: hidden;
  overflow-y: auto;
  border: none;
  border-radius: 8px;
  background-color: var(--ds-surface-raised, #ffffff);
  box-shadow: var(--ds-shadow-raised, 0px 1px 1px #091e4240, 0px 0px 1px #091e424f);
  resize: none;
  overflow-wrap: break-word;
}
.add-task-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
}
.add-task-btn {
  padding: 10px;
  background: #6ee7b7;
  border-radius: 8px;
  border: none;
}
.close-task-btn {
  height: 24px;
  width: 24px;
  padding: 0;
  border: none;
}
</style>

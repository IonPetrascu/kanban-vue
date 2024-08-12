<script setup lang="ts">
import { provide, ref } from 'vue'
import TheBoard from './components/TheBoard.vue'
import TaskPopup from './components/TaskPopup.vue'
import type { Item, Category, User, Difficulty } from './types'

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
  },
  {
    id: 2,
    name: 'Diva',
    email: 'divaSaya@gmail.com'
  }
])
const difficulties = ref<Difficulty[]>(['low', 'medium', 'high'])

const isVisibleTaskPopup = ref<boolean>(false)
const currentTaskInPopup = ref<Item | null>(null)

const quantityTasksInBoard = (categoryId: number): number => {
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

const addTask = (categoryId: number, title: string): void | undefined => {
  items.value.push({
    id: Math.floor(Math.random() * 1000),
    title: title,
    categoryId: categoryId
  })
}

const openTaskPopup = (taskId: number): void => {
  const findTask = items.value.find((el) => el.id === taskId)
  if (findTask) {
    currentTaskInPopup.value = findTask
    isVisibleTaskPopup.value = true
  }
}

const closeTaskPopup = (): void => {
  isVisibleTaskPopup.value = false
  currentTaskInPopup.value = null
}

const getTaskMembers = (usersId: number[]): User[] => {
  return users.value.filter((user) => usersId.includes(user.id))
}

const addUserToTask = (userId: number): void => {
  if (!currentTaskInPopup.value) return

  const existingUsers = currentTaskInPopup.value.usersId || []
  if (!existingUsers.includes(userId)) {
    currentTaskInPopup.value.usersId = [...existingUsers, userId]
  }
}

const removeUserFromTask = (userId: number): void => {
  if (currentTaskInPopup.value) {
    currentTaskInPopup.value.usersId = currentTaskInPopup.value.usersId?.filter(
      (id) => id !== userId
    )
  }
}

const updateCategory = (categoryId: number): void => {
  if (currentTaskInPopup.value) {
    currentTaskInPopup.value.categoryId = categoryId
  }
}

const updateTitle = (title: string): void => {
  if (currentTaskInPopup.value) currentTaskInPopup.value.title = title
}

const updateDescription = (description: string): void => {
  if (currentTaskInPopup.value) currentTaskInPopup.value.description = description
}

const changeDifficultyOfTask = (difficulty: Difficulty): void => {
  const task = currentTaskInPopup.value
  if (!task) return

  task.difficulty = task.difficulty === difficulty ? ('' as Difficulty) : difficulty
}

const changeTaskTitle = (columnID: number, newTitle: string): void => {
  const findCategory = categories.value.find((el) => el.id === columnID)
  console.log(categories.value.find((el) => el.id === columnID))

  if (!findCategory) {
    console.log('error')

    return
  }
  findCategory.title = newTitle ? newTitle : findCategory.title
}

const createNewColumn = () => {
  const date = new Date()
  const id = date.getTime()
  categories.value = [...categories.value, { id: id, title: 'New column' }]
}
provide('users', users)
provide('items', items)
provide('categories', categories)
provide('difficulties', difficulties)
provide('quantityTasksInBoard', quantityTasksInBoard)
provide('changeDifficultyOfTask', changeDifficultyOfTask)
provide('getTaskMembers', getTaskMembers)
provide('openTaskPopup', openTaskPopup)
provide('changeTaskTitle', changeTaskTitle)
provide('getUserById', getUserById)
provide('ondragstart', ondragstart)
provide('addTask', addTask)
provide('onDrop', onDrop)
</script>

<template>
  <div class="wrapper">
    <div class="bar">
      <div class="bar-header">
        <img src="/src/assets/logo.png" alt="kanban logo" />
        <span>kanban</span>
      </div>
      <nav class="nav">
        <ul>
          <li class="active-board">
            <button class="dashboard-btn">
              <img src="/src/assets/layout.svg" alt="layout" />
              <span>Dashboard 1</span>
            </button>
          </li>
          <li>
            <button class="dashboard-btn">
              <img src="/src/assets/layout.svg" alt="layout" /> <span>Dashboard 2</span>
            </button>
          </li>
          <li>
            <button class="dashboard-btn">
              <img src="/src/assets/layout.svg" alt="layout" /> <span>Dashboard 3</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
    <div class="main">
      <div class="header">Dashboard 1</div>
      <TheBoard :categories="categories" />
    </div>
  </div>
  <TaskPopup
    :users="users"
    :task="currentTaskInPopup"
    :isVisible="isVisibleTaskPopup"
    @close-popup="closeTaskPopup"
    @get-user-by-id="getUserById"
    @remove-user-from-task="removeUserFromTask"
    @add-user-to-task="addUserToTask"
    @update-category="updateCategory"
    @update-title="updateTitle"
    @update-description="updateDescription"
  />
  <button @click="createNewColumn" class="add-col-btn">
    <img src="/src/assets/plus.svg" alt="plus" />
  </button>
</template>

<style scoped>
.wrapper {
  margin: 0 auto;
  display: flex;
  height: 100%;
}
.nav {
  padding-block: 10px;
}
.nav ul {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-right: 20px;
}
.nav ul li {
  padding: 15px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  cursor: pointer;
}
.nav ul li:hover {
  background-color: var(--color-3);
}
.nav ul .active-board {
  background-color: var(--color-3);
}
.dashboard-btn {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
}
.dashboard-btn span {
  color: var(--white);
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;
}
.dashboard-btn img {
  width: 30px;
}

.bar {
  width: 20%;
  background: var(--color-1);
  border-right: 3px solid var(--color-4);
}
.main {
  width: 80%;
  display: flex;
  flex-direction: column;
  background: url('./assets/bg-1.jpg') center / cover no-repeat;
}
.header {
  background: var(--color-1);
  border-bottom: 3px solid var(--color-4);
  height: 10%;
  font-size: 30px;
  color: var(--white);
  display: flex;
  align-items: center;
  padding-inline: 20px;
}
.bar-header {
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: start;
  padding-left: 20px;
  gap: 7px;
}
.bar-header span {
  font-size: 30px;
  color: var(--white);
  font-weight: 600;
}
.bar-header img {
  width: 40px;
  height: 40px;
}
.add-col-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-3);
  border: none;
  width: 50px;
  height: 50px;
  padding: 10px;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  cursor: pointer;
}
.add-col-btn:hover img {
  transform: scale(1.19);
}
.add-col-btn img {
  width: 100%;
}
</style>

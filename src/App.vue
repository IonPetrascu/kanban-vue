<script setup lang="ts">
import { provide, ref } from 'vue'
import TheBoard from './components/TheBoard.vue'
import TaskPopup from './components/TaskPopup.vue'
import type { Item, Category, User } from './types'

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

const addUserToTask = (userId: number) => {
  if (currentTaskInPopup.value) {
    currentTaskInPopup.value.usersId?.push(userId)
  }
}

const removeUserFromTask = (userId: number) => {
  if (currentTaskInPopup.value) {
    currentTaskInPopup.value.usersId = currentTaskInPopup.value.usersId?.filter(
      (id) => id !== userId
    )
  }
}

provide('users', users)
provide('items', items)
provide('quantityTasksInBoard', quantityTasksInBoard)
provide('getTaskMembers', getTaskMembers)
provide('openTaskPopup', openTaskPopup)
provide('getUserById', getUserById)
provide('ondragstart', ondragstart)
provide('addTask', addTask)
provide('onDrop', onDrop)
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
  />
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
</style>

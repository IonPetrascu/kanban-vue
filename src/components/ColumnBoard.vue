<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue'
import TaskList from './TaskList.vue'
import type { Category } from '../types'

const props = defineProps<{
  category: Category
}>()

const showAddTaskForm = ref<boolean>(false)
const taskTitle = ref<string>('')
const changeTitle = ref<boolean>(false)
const currentTitle = ref<string>('')

onMounted(() => {
  currentTitle.value = props.category.title
})

const openTaskForm = (): void => {
  showAddTaskForm.value = true
}

const closeTaskForm = (): void => {
  showAddTaskForm.value = false
  taskTitle.value = ''
}

const addNewTask = (): void => {
  if (taskTitle.value === '') return
  addTask(props.category.id, taskTitle.value)
  taskTitle.value = ''
}

const showInputForChangeTitle = (): void => {
  changeTitle.value = true
}

const hideInputForChangeTitle = (): void => {
  if (changeTaskTitle) changeTaskTitle(props.category.id, currentTitle.value)
  changeTitle.value = false
}

const addTask = inject('addTask')
const changeTaskTitle = inject<(columnID: number, newTitle: string) => void>('changeTaskTitle')
const quantityTasksInBoard = inject('quantityTasksInBoard')
</script>
<template>
  <div class="col">
    <div class="col-header">
      <div class="title-wrapper">
        <button @click="showInputForChangeTitle" v-if="!changeTitle">
          <span>{{ category.title }}</span>
        </button>

        <input @blur="hideInputForChangeTitle" v-model.trim="currentTitle" v-else type="text" />
      </div>

      <span class="count-tasks">( {{ quantityTasksInBoard(category.id) }} )</span>
      <button v-if="!showAddTaskForm" @click="openTaskForm" class="add-task">
        <img src="/src/assets/plus.svg" alt="add button" />
      </button>
    </div>
    <div>
      <form v-if="showAddTaskForm" class="add-task-form" @submit.prevent="addNewTask">
        <input v-model="taskTitle" name="input" />
        <div class="add-task-buttons">
          <button type="sumbit" class="add-task-btn">Add New Task</button>
          <button @click="closeTaskForm" type="button" class="close-task-btn">
            <img src="/src/assets/close.svg" alt="close" />
          </button>
        </div>
      </form>
    </div>
    <TaskList :categoryId="category.id" />
  </div>
</template>
<style scoped>
.col {
  padding: 30px 10px 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  width: 300px;
  min-width: 300px;
  background-color: var(--color-2);
}

.col-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.count-tasks {
  padding: 2px;
  font-weight: 600;
  font-size: 20px;
  color: var(--white);
}
.title-wrapper input {
  padding: 1px 0px;
  width: 140px;
  font-weight: 400;
  font-size: 20px;
}
.title-wrapper button {
  background: none;
  border: none;
  cursor: pointer;
  max-width: 150px;
  overflow: hidden;
}
.title-wrapper span {
  color: var(--white);
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* add task */
.add-task {
  border: none;
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: 20px;
  padding: 7px;
  cursor: pointer;
  background: var(--color-3);
  transition:
    background-color 0.4s ease,
    scale 0.3s ease;
  margin-left: auto;
  transition: transform 0.2s ease;
}
.add-task:hover {
  transform: scale(1.1);
}
.add-task img {
  width: 20px;
  height: 20px;
}

.add-task span {
  font-size: 20px;
  color: var(--white);
}
.add-task-form {
  margin-bottom: 15px;
}
.add-task-form input {
  overflow-wrap: break-word;
  padding: 10px 8px;
  background-color: var(--color-2);
  border: none;
  color: var(--white);
  border: 1px solid var(--white);
  border-radius: 10px;
  width: 100%;
  resize: none;
  overflow-y: auto;
  font-size: 16px;
}

.add-task-form input:focus {
  outline: 1px solid var(--white);
  outline-offset: 3px;
  background-color: var(--color-1);
}

.add-task-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
}
.add-task-btn {
  padding: 10px 15px;
  background: var(--color-3);
  color: var(--white);
  border-radius: 20px;
  border: none;
  cursor: pointer;
}
.close-task-btn {
  width: 34px;
  height: 34px;
  padding: 7px;
  border: none;
  cursor: pointer;
  background-color: var(--color-3);
  border-radius: 50%;
}
.close-task-btn img {
  width: 100%;
  height: 100%;
}
</style>

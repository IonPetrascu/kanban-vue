<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import TaskList from './TaskList.vue'
import type { Category } from '../types'

const props = defineProps<{
  category: Category
}>()

const showAddTaskForm = ref<boolean>(false)
const taskTitle = ref<string>('')

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

const addTask = inject('addTask')
const quantityTasksInBoard = inject('quantityTasksInBoard')
</script>
<template>
  <div class="col">
    <div class="col-header">
      <h2>{{ category.title }}</h2>
      <span>{{ quantityTasksInBoard(category.id) }}</span>
    </div>
    <div>
      <button v-if="!showAddTaskForm" @click="openTaskForm" class="add-task">
        <img src="/src/assets/plus.svg" alt="add button" /> <span>Add new task</span>
      </button>
      <form v-if="showAddTaskForm" class="add-task-form" @submit.prevent="addNewTask">
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
    <TaskList :categoryId="category.id" />
  </div>
</template>
<style scoped>
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

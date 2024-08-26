<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useDashboardStore } from '../stores/dashboardStore'
import type { Column } from '../types'
import TaskList from './TaskList.vue'

const props = defineProps<{
  column: Column
}>()

const isEditingColumnTitle = ref<boolean>(false)
const isVisibleTaskForm = ref<boolean>(false)
const columnTitle = ref<string>(props.column.title)
const newTitle = ref<string>(props.column.title)
const titleOfNewTask = ref<string>('')

const route = useRoute()

const dashboardStore = useDashboardStore()

const showAddTaskForm = (): void => {
  isVisibleTaskForm.value = true
}
const closeTaskForm = (): void => {
  isVisibleTaskForm.value = false
  columnTitle.value = newTitle.value
}

const startEditing = (): void => {
  isEditingColumnTitle.value = true
  columnTitle.value = props.column.title
  newTitle.value = props.column.title
}

const endEditing = (): void => {
  if (route.params.id && columnTitle.value.trim()) {
    columnTitle.value = newTitle.value
    dashboardStore.updateColumnTitle(props.column.id, columnTitle.value)
    isEditingColumnTitle.value = false
  }
}

const createNewTask = (): void => {
  const date = new Date()
  const newId = date.getTime()

  const newTask = { id: newId, title: titleOfNewTask.value }
  dashboardStore.addNewTask(props.column.id, newTask)

  titleOfNewTask.value = ''
  isVisibleTaskForm.value = false
}
</script>
<template>
  <div class="col">
    <div class="col-header">
      <div class="title-wrapper">
        <button v-if="!isEditingColumnTitle" @click="startEditing">
          <span>{{ column.title }}</span>
        </button>
        <input v-else @blur="endEditing" v-model.trim="newTitle" type="text" />
      </div>
      <span class="count-tasks">( {{ column.tasks?.length }} )</span>
      <button v-if="!isVisibleTaskForm" @click="showAddTaskForm" class="add-task">
        <img src="/src/assets/plus.svg" alt="add button" />
      </button>
    </div>
    <div v-if="isVisibleTaskForm">
      <form @submit.prevent="createNewTask" class="add-task-form">
        <input v-model="titleOfNewTask" name="input" />
        <div class="add-task-buttons">
          <button type="submit" class="add-task-btn">Add New Task</button>
          <button @click="closeTaskForm" type="button" class="close-task-btn">
            <img src="/src/assets/close.svg" alt="close" />
          </button>
        </div>
      </form>
    </div>
    <TaskList :columnId="column.id" :tasks="column.tasks" />
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
  background: var(--color-6);
  animation-name: animationColumn;
  animation-duration: 1s;
}

@keyframes animationColumn {
  0% {
    transform: translateX(100px);
  }
  100% {
    transform: translateX(0px);
  }
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
  color: var(--color-1);
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

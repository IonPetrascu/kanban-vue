<script lang="ts" setup>
import type { Task, User, Column, Difficulty } from '../types'
import { onBeforeMount, ref, watch, computed } from 'vue'
import { useDashboardStore } from '../stores/dashboardStore'

const props = defineProps<{
  task: Task
  isVisible: boolean
  usersDashboard: User[]
  currentColumnId: number
  columns: Column[]
  difficulties: Difficulty[]
}>()

const newTitle = ref<string>('')
const newDescription = ref<string>('')
const isVisibleBoardMembers = ref<boolean>(true)
const filterUsersByName = ref<string>('')
const oldColumnId = ref<number | null>(null)

const filteredUsers = computed((): User[] => {
  if (!filterUsersByName.value) {
    return props.usersDashboard ?? []
  } else {
    const regEx = new RegExp(filterUsersByName.value, 'i')
    return props.usersDashboard?.filter(({ name }) => regEx.test(name)) ?? []
  }
})

onBeforeMount(() => {
  newTitle.value = props.task.title
  newDescription.value = props.task.description ?? ''
  oldColumnId.value = props.currentColumnId
})

const dashboardStore = useDashboardStore()

const changeTaskDescription = (): void => {
  dashboardStore.changeDescription(newDescription.value)
}

const toggleBoardMembers = (): void => {
  isVisibleBoardMembers.value = !isVisibleBoardMembers.value
}

const isMemberOfTask = (userId: number): boolean => {
  if (!props.task.usersId) return false
  return props.task.usersId.includes(userId)
}

watch(
  () => props.task,
  () => {
    newTitle.value = props.task.title
    newDescription.value = props.task.description ?? ''
    oldColumnId.value = props.currentColumnId
  }
)

const changeColumn = (e: Event): void => {
  if (oldColumnId.value === null) return
  const select = e.target as HTMLInputElement

  dashboardStore.changeColumnOfTask(oldColumnId.value, +select.value)
  oldColumnId.value = +select.value
  dashboardStore.setCurrentColumnId(+select.value)
}

watch(newDescription, () => {
  changeTaskDescription()
})

watch(newTitle, () => {
  dashboardStore.changeTaskTitle(newTitle.value)
})

const emit = defineEmits([
  'closeTaskEdior',
  'addUserToTask',
  'removeUserFromTask',
  'changeDifficulty'
])
</script>
<template>
  <div class="wrapper-popup" :class="{ active: isVisible, hidden: !isVisible }">
    <div>
      <div class="header">
        <button @click="emit('closeTaskEdior')" class="close-btn">
          <img src="/src/assets/close.svg" alt="close" />
        </button>
        <h3 class="task-title">Edit task</h3>
      </div>
      <div class="container">
        <div class="row">
          <label for="title"></label>
          <input name="title" v-model="newTitle" class="input" type="text" />
        </div>
        <div class="row">
          <label for="description">Description</label>
          <textarea v-model="newDescription" name="description" class="description"></textarea>
        </div>
        <div class="users-wrapper">
          <span class="user-title">Task member</span>
          <ul class="user-list" v-if="task.usersId">
            <li :key="user?.id" v-for="user in task.usersId.map(dashboardStore.getUserInTask)">
              <button class="user">
                <img
                  class="user-img"
                  v-if="user?.id === 0"
                  src="/src/assets/user-0.png"
                  alt="user photo"
                />
                <img class="user-img" v-else src="/src/assets/user-1.png" alt="user photo" />
                {{ user?.name }}
              </button>
            </li>
          </ul>
          <button class="user-btn" @click="toggleBoardMembers">
            {{ isVisibleBoardMembers ? 'Close' : 'Open' }} Board members
          </button>
          <div v-if="isVisibleBoardMembers" class="users-popup">
            <div class="users-popup-wrapper">
              <input
                class="input"
                v-model="filterUsersByName"
                placeholder="Search users..."
                type="text"
              />
              <ul class="user-list-board" v-if="filteredUsers.length > 0">
                <li :key="user.id" v-for="user in filteredUsers">
                  <button
                    :class="{ 'user-is-member': isMemberOfTask(user.id) }"
                    @click="
                      isMemberOfTask(user.id)
                        ? emit('removeUserFromTask', user.id)
                        : emit('addUserToTask', user.id)
                    "
                  >
                    <img v-if="user.id === 0" src="/src/assets/user-0.png" />
                    <img v-else src="/src/assets/user-1.png" />
                    <span>{{ user.name }}</span>
                  </button>
                </li>
              </ul>
              <span class="empty-list" v-else>No results :(</span>
            </div>
          </div>
        </div>
        <div class="select-wrapper">
          <h4 class="title">Status</h4>
          <select @change="changeColumn" class="select">
            <option
              :selected="column.id === currentColumnId"
              class="option"
              :key="column.id"
              :value="column.id"
              v-for="column in columns"
            >
              {{ column.title }}
            </option>
          </select>
        </div>
        <div class="difficulty-wrapper">
          <h4 data-v-096e9cac="" class="title">Difficulty</h4>
          <ul>
            <li :key="difficulty" v-for="difficulty in difficulties">
              <button
                @click="emit('changeDifficulty', difficulty)"
                :class="['difficulty-btn', { 'difficulty-active': difficulty === task.difficulty }]"
              >
                {{ difficulty }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper-popup {
  position: absolute;
  top: 0;
  right: 0;
  max-width: 400px;
  width: 400px;
  height: 100%;
  background-color: var(--color-2);
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
  border-left: 3px solid var(--color-4);
  overflow: hidden;
}
.wrapper-popup > div {
  height: 100%;
}
.active {
  transform: translateX(0%);
  opacity: 1;
  z-index: 2;
}
.hidden {
  transform: translateX(100%);
  opacity: 0;
}

.header {
  display: flex;
  gap: 20px;
  padding: 10px 20px;
  position: fixed;
  top: 0px;
  background: var(--color-2);
  width: 100%;
}
.close-btn {
  width: 34px;
  height: 34px;
  padding: 7px;
  border: none;
  background: transparent;
  cursor: pointer;
  background-color: var(--color-3);
  border-radius: 50%;
}
.close-btn img {
  width: 100%;
  height: 100%;
}
.task-title {
  color: var(--color-3);
  font-size: 24px;
  font-weight: 500;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 20px;
  margin-top: 50px;
  padding-inline: 20px;
}
.row {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
label {
  color: var(--white);
}
.input {
  padding: 10px 8px;
  background-color: var(--color-2);
  border: none;
  color: var(--white);
  border: 1px solid var(--white);
  border-radius: 10px;
  width: 100%;
}
.input:focus {
  outline: none;
  background-color: var(--color-1);
}

.description {
  padding: 10px 8px;
  background-color: var(--color-2);
  border: none;
  color: var(--white);
  border: 1px solid var(--white);
  border-radius: 10px;
  height: 150px;
  width: 100%;
  resize: none;
  overflow-y: auto;
  font-size: 16px;
}
.description:focus {
  outline: none;
  background-color: var(--color-1);
}

.users-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.user-title,
.title {
  color: var(--white);
  font-weight: 400;
}
.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 65px;
}
.user-list .user {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user:focus {
  outline: none;
}
.user:focus > .user-img {
  outline: 1px solid var(--white);
  outline-offset: 3px;
}
.user-img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-bottom: 5px;
}

.user-btn {
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: var(--color-3);
  color: var(--white);
  cursor: pointer;
}
.user-btn:focus {
  outline: 1px solid var(--white);
  outline-offset: 3px;
}

.users-popup {
  border: 1px solid var(--white);
  border-top: none;
  border-radius: 10px;
  box-shadow: 0px -5px 0px var(--color-3);
  margin-top: -5px;
  overflow-y: auto;
}
.users-popup-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  gap: 10px;
  height: 200px;
}
.users-popup-wrapper .input {
  width: 200px;
  height: max-content;
}
.user-list-board {
  justify-content: end;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-left: 5px;
  align-content: baseline;
}
.user-list-board li,
.user-list-board button {
  width: 100%;
  margin-right: 10px;
  border-radius: 10px;
}
.user-list-board button {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 15px;
  border: none;
  padding: 5px;
  cursor: pointer;
}
.user-list-board span {
  color: var(--color-1);
}
.user-list-board button:focus {
  outline: 1px solid var(--white);
  outline-offset: 1px;
}
.user-is-member {
  background: var(--color-3);
  position: relative;
}
.user-is-member::after {
  content: '\2713';
  position: absolute;
  right: 0;
  font-size: 13px;
  top: 0px;
  width: min-content;
  padding: 0 4px;
  border-radius: 50%;
  background-color: var(--white);
  color: var(--color-3);
}
.empty-list {
  color: var(--white);
  display: flex;
  align-items: center;
  height: min-content;
  margin-top: 10px;
}
.user-list-board img {
  width: 40px;
  height: 40px;
}

.select-wrapper {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.select {
  appearance: none;
  outline: none;
  cursor: pointer;
  color: var(--white);
  background-color: var(--color-3);
  padding: 10px;
  width: 100%;
  text-align: center;
  border-radius: 10px;
}
.select:focus {
  outline: 1px solid var(--white);
  outline-offset: 3px;
}
.option {
  background: var(--white);
  padding: 5px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-3);
}
.difficulty-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.difficulty-wrapper ul {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.difficulty-btn {
  color: var(--white);
  background: none;
  border: none;
  padding: 10px;
  border-radius: 20px;
  background: var(--color-1);
  cursor: pointer;
}
.difficulty-btn:hover {
  background-color: var(--color-3);
}
.difficulty-active {
  background-color: var(--color-3);
}
</style>

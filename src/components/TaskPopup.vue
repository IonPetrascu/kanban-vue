<script lang="ts" setup>
import { computed, inject, ref, watch } from 'vue'
import type { Item, User, Category, Difficulty } from '../types'

// Props
const props = defineProps<{
  isVisible: Boolean
  task: Item | null
  users: User[]
}>()

// Reactive References
const showUsersList = ref<boolean>(false)
const filteredListMembers = ref<string>('')
const currentCategory = ref<number>(0)
const currentTile = ref<string>('')
const currentDescription = ref<string>('')

// Computed Properties
const filteredUsers = computed((): User[] => {
  if (!filteredListMembers.value) {
    return props.users ?? []
  } else {
    const regEx = new RegExp(filteredListMembers.value, 'i')
    return props.users?.filter(({ name }) => regEx.test(name)) ?? []
  }
})

// Functions
const isMemberOfTask = (userId: number): boolean => {
  if (!props.task || !props.task.usersId) return false
  return Object.values(props.task.usersId).includes(userId)
}

const toggleUsersList = (): void => {
  showUsersList.value = !showUsersList.value
}

// Watchers
watch(
  () => props.task,
  (newTask) => {
    if (newTask === null) return

    if (newTask.categoryId !== undefined) {
      currentCategory.value = newTask.categoryId
    }

    currentTile.value = newTask.title
    currentDescription.value = newTask.description ?? ''
  },
  { immediate: true }
)

watch(currentCategory, () => emit('updateCategory', currentCategory.value))
watch(currentTile, () => emit('updateTitle', currentTile.value))
watch(currentDescription, () => emit('updateDescription', currentDescription.value))

// Injected Dependencies
const getUserById = inject<(id: number) => User | undefined>('getUserById')
const changeDifficultyOfTask = inject<(id: string) => void>('changeDifficultyOfTask')
const categories = inject<Category[]>('categories')
const difficulties = inject<Difficulty[]>('difficulties')

if (!getUserById) {
  throw new Error('getUserById injection is missing')
}

// Emits
const emit = defineEmits([
  'closePopup',
  'addUserToTask',
  'removeUserFromTask',
  'updateCategory',
  'updateTitle',
  'updateDescription'
])
</script>
<template>
  <div class="wrapper-popup" :class="{ active: isVisible, hidden: !isVisible }">
    <div v-if="task !== null">
      <div class="header">
        <button class="close-btn" @click="emit('closePopup')">
          <img src="/src/assets/close.svg" alt="close" />
        </button>
        <h3 class="task-title">Edit task</h3>
      </div>
      <div class="container">
        <div class="row">
          <label for="title">Title</label>
          <input name="title" v-model="currentTile" class="input" type="text" />
        </div>
        <div class="row">
          <label for="description">Description</label>
          <textarea name="description" class="description" v-model="currentDescription"></textarea>
        </div>

        <div v-if="getUserById" class="users-wrapper">
          <span class="user-title">Task member</span>
          <ul class="user-list" v-if="task.usersId">
            <li :key="user?.id" v-for="user in task.usersId.map(getUserById)">
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
          <button class="user-btn" @click="toggleUsersList">
            {{ showUsersList ? 'Close' : 'Open' }} Board members
          </button>
          <div v-if="showUsersList" class="users-popup">
            <div class="users-popup-wrapper">
              <input
                class="input"
                v-model="filteredListMembers"
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
          <select class="select" v-model="currentCategory">
            <option
              class="option"
              :key="category.id"
              :value="category.id"
              v-for="category in categories"
            >
              {{ category.title }}
              {{ currentCategory }}
            </option>
          </select>
        </div>
        <div class="difficulty-wrapper">
          <h4 data-v-096e9cac="" class="title">Difficulty</h4>
          <ul>
            <li :key="difficulty" v-for="difficulty in difficulties">
              <button
                @click="changeDifficultyOfTask && changeDifficultyOfTask(difficulty)"
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

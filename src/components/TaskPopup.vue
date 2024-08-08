<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import type { Item, User } from '../types'

const props = defineProps<{
  isVisible: Boolean
  task: Item | null
  users: User[]
}>()

const showUsersList = ref<boolean>(false)
const filteredListMembers = ref<string>('')

const isMemberOfTask = (userId: number) => {
  if (!props.task || !props.task.usersId) return false
  return Object.values(props.task.usersId).includes(userId)
}

const filteredUsers = computed((): User[] => {
  if (!filteredListMembers.value) {
    return props.users ?? []
  } else {
    const regEx = new RegExp(filteredListMembers.value, 'i')
    return props.users?.filter(({ name }) => regEx.test(name)) ?? []
  }
})

const toggleUsersList = (): void => {
  showUsersList.value = !showUsersList.value
}

const emit = defineEmits(['closePopup', 'addUserToTask', 'removeUserFromTask'])
const getUserById = inject<(id: number) => User | undefined>('getUserById')

if (!getUserById) {
  throw new Error('getUserById injection is missing')
}
</script>
<template>
  <div class="wrapper" :class="{ active: isVisible, hidden: !isVisible }">
    <div v-if="task !== null">
      <button @click="emit('closePopup')">close</button>
      <input :value="task.title" class="title" type="text" />
      <textarea class="description" :value="task.description"></textarea>
      <div class="users-wrapper">
        <ul class="user-list" v-if="task.usersId">
          <li :key="user?.id" v-for="user in task.usersId.map(getUserById)">
            <div class="user">
              <img
                class="user-img"
                v-if="user?.id === 0"
                src="/src/assets/user-0.png"
                alt="user photo"
              />
              <img class="user-img" v-else src="/src/assets/user-1.png" alt="user photo" />
              {{ user?.name }}
            </div>
          </li>
        </ul>
        <button @click="toggleUsersList">Members</button>
        <div v-if="showUsersList" class="users-popup">
          <div>
            <div class="head">Board members</div>
            <input v-model="filteredListMembers" placeholder="Search users..." type="text" />
            <ul v-if="filteredUsers">
              <li :key="user.id" v-for="user in filteredUsers">
                <button
                  :class="{ 'user-is-meneber': isMemberOfTask(user.id) }"
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
            <span v-else>empty list</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  position: absolute;
  top: 0;
  right: 0;
  max-width: 400px;
  height: 100%;
  background-color: white;
  transition: transform 0.4s ease-in-out;
  overflow: hidden;
}
.active {
  transform: translateX(0%);
}
.hidden {
  transform: translateX(100%);
}
.user {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.user-img {
  width: 45px;
  height: 45px;
}
.user-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.user-is-meneber {
  background: green;
}
.description {
  width: 100%;
  height: 100px;
}
</style>

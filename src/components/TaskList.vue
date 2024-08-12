<script lang="ts" setup>
import { inject } from 'vue'
import type { Item } from '../types'
defineProps({
  categoryId: Number
})

const items = inject<Item[]>('items')
const getUserById = inject('getUserById')
const ondragstart = inject('ondragstart')
const onDrop = inject('onDrop')
const openTaskPopup = inject('openTaskPopup')
</script>
<template>
  <ul
    v-if="items"
    @dragover.prevent
    @dragenter.prevent
    @drop="onDrop($event, categoryId)"
    class="list"
  >
    <div
      class="list-item"
      draggable="true"
      @dragstart="ondragstart($event, item)"
      :key="item.id"
      v-for="item in items.filter((item) => item.categoryId === categoryId)"
    >
      <span v-if="item.difficulty" :class="`difficulty difficulty-${item.difficulty}`">{{
        item.difficulty
      }}</span>
      <h4 class="title">{{ item.title }}</h4>
      <p class="description">{{ item.description }}</p>
      <button class="open-popup-btn" @click="openTaskPopup(item.id)">
        <img src="/src/assets/edit.svg" alt="edit" />
      </button>
      <div v-if="item.usersId" class="users-list">
        <div
          :title="user?.name"
          class="item-user"
          :key="user?.id"
          v-for="user in item.usersId.map(getUserById)"
        >
          <img v-if="user?.id === 0" src="/src/assets/user-0.png" alt="user photo" />
          <img v-else src="/src/assets/user-1.png" alt="user photo" />
        </div>
      </div>
    </div>
  </ul>
</template>
<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  overflow-y: auto;
}
.title {
  color: var(--white);
  font-weight: 500;
  font-size: 20px;
}
.list-item {
  border-radius: 10px;
  padding: 7px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  background: var(--color-1);
  position: relative;
  animation-name: animation;
  animation-duration: 0.2s;
}

@keyframes animation {
  0% {
    transform: translateY(50px);
  }
  100% {
    transform: translateY(0px);
  }
}
.list-item:hover {
  box-shadow: 0 3px 0 0 var(--color-4);
}
.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--white);
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

.open-popup-btn {
  width: 24px;
  height: 24px;
  position: absolute;
  right: 5px;
  top: 5px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
}
.open-popup-btn:focus {
  outline: 1px solid var(--white);
  outline-offset: 3px;
}
.open-popup-btn img {
  width: 100%;
  height: 100%;
}
.open-popup-btn:hover img {
  transform: scale(1.1);
}
</style>

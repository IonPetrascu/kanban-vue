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
      <span :class="`difficulty difficulty-${item.difficulty}`">{{ item.difficulty }}</span>
      <h4>{{ item.title }}</h4>
      <p class="description">{{ item.description }}</p>
      <button @click="openTaskPopup(item.id)">open</button>
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
</style>

<script lang="ts" setup>
import ColumnBoard from './ColumnBoard.vue'
import type { Category } from '../types'

defineProps<{
  categories: Category[]
}>()
</script>
<template>
  <div class="board">
    <ColumnBoard :category="category" v-for="category in categories" :key="category.id" />
  </div>
</template>
<style scoped>
.board {
  width: 100%;
  background: var(--color-2);
  display: flex;
  overflow-x: auto;
  flex: 1;
  padding-inline: 20px;
}
</style>

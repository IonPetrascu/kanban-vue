<script lang="ts" setup>
import ColumnBoard from './ColumnBoard.vue'
import type { Category } from '../types'

const props = defineProps<{
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
  background: whitesmoke;
  display: flex;
  overflow-x: auto;
  height: 100%;
}
</style>

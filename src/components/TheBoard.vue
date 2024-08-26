<script lang="ts" setup>
import type { Column } from '../types'
import ColumnBoard from './ColumnBoard.vue'

defineProps<{
  columns: Column[]
}>()
</script>
<template>
  <div class="board">
    <ColumnBoard :column="column" v-for="column in columns" :key="column.id" />
  </div>
</template>
<style scoped>
.board {
  width: 100%;
  display: flex;
  overflow-x: auto;
  flex: 1;
  padding-inline: 10px;
  gap: 10px;
  padding-top: 10px;
}
</style>

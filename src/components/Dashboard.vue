<script lang="ts" setup>
import { provide, watch } from 'vue'
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDashboardStore } from '../stores/dashboardStore'
import TaskEditorSidebar from './TaskEditorSidebar.vue'
import TheBoard from './TheBoard.vue'

const route = useRoute()
const dashboardId = computed(() => Number(route.params.id))
const dashboardStore = useDashboardStore()
const dashboard = computed(() => dashboardStore.dashboards.find((d) => d.id === dashboardId.value))
const showTaskEditor = ref<boolean>(false)

const isVisibleTaskEditor = computed(() => dashboardStore.currentTask !== null)

watch(
  () => dashboardId.value,
  () => {
    dashboardStore.setCurrentDashboardId(Number(dashboardId.value))
    closeTaskEdior()
  }
)
onMounted(() => {
  dashboardStore.setCurrentDashboardId(Number(dashboardId.value))
})

const closeTaskEdior = (): void => {
  dashboardStore.currentTask = null
  showTaskEditor.value = false
}

const openTaskEditor = (): void => {
  showTaskEditor.value = true
}

provide('openTaskEditor', openTaskEditor)
</script>
<template>
  <div class="main">
    <div class="header">{{ dashboard?.title }}</div>
    <TheBoard :columns="Object.values(dashboard.columns)" />
    <TaskEditorSidebar
      v-if="dashboardStore.currentTask && showTaskEditor"
      :isVisible="isVisibleTaskEditor"
      :task="dashboardStore.currentTask"
      :usersDashboard="dashboard.users"
      :columns="Object.values(dashboard.columns)"
      :currentColumnId="dashboardStore.currentColumnId ?? 0"
      :difficulties="dashboard.difficulty"
      @add-user-to-task="dashboardStore.addUserToTask"
      @remove-user-from-task="dashboardStore.removeUserFromTask"
      @change-difficulty="dashboardStore.changeDifficulty"
      @close-task-edior="closeTaskEdior"
    />
    <button @click="dashboardStore.createNewColumn" class="add-col-btn">
      <img src="/src/assets/plus.svg" alt="plus" />
    </button>
  </div>
</template>
<style scoped>
.main {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: url('../assets/bg-1.jpg') center / cover no-repeat;
  position: relative;
}
.header {
  background: var(--color-1);
  border-bottom: 3px solid var(--color-4);
  height: 10%;
  font-size: 30px;
  color: var(--white);
  display: flex;
  align-items: center;
  padding-inline: 20px;
}

.add-col-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-3);
  border: none;
  width: 50px;
  height: 50px;
  padding: 10px;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  cursor: pointer;
}
.add-col-btn:hover img {
  transform: scale(1.19);
}
.add-col-btn img {
  width: 100%;
}
</style>

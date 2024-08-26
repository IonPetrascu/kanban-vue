<script lang="ts" setup>
import { provide, watch } from 'vue'
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDashboardStore } from '../stores/dashboardStore'
import TaskEditorSidebar from './TaskEditorSidebar.vue'
import TheBoard from './TheBoard.vue'
import type { HexColor } from '@/types'

const route = useRoute()
const dashboardId = computed(() => Number(route.params.id))
const dashboardStore = useDashboardStore()
const dashboard = computed(() => dashboardStore.dashboards.find((d) => d.id === dashboardId.value))
const showTaskEditor = ref<boolean>(false)
const isVisibleTaskEditor = computed(() => dashboardStore.currentTask !== null)
const colorBoard = ref<HexColor>('#2b2b36')
const showSettings = ref<boolean>(false)
const isEditingTitleOfDashboard = ref<boolean>(false)
const newDashboardTitle = ref<string>('')

watch(
  () => dashboardId.value,
  () => {
    dashboardStore.setCurrentDashboardId(Number(dashboardId.value))
    closeTaskEdior()
    colorBoard.value = dashboard.value?.background ?? colorBoard.value
    showSettings.value = false
    newDashboardTitle.value = dashboard.value?.title ?? ''
    isEditingTitleOfDashboard.value = false
  }
)

watch(newDashboardTitle, () => dashboardStore.changeDashboardTitle(newDashboardTitle.value))
onMounted(() => {
  dashboardStore.setCurrentDashboardId(Number(dashboardId.value))
  colorBoard.value = dashboard.value?.background ?? colorBoard.value
  newDashboardTitle.value = dashboard.value?.title ?? ''
})

const closeTaskEdior = (): void => {
  dashboardStore.currentTask = null
  showTaskEditor.value = false
}

const openTaskEditor = (): void => {
  showTaskEditor.value = true
}

const toggleSettingsDashboard = () => {
  showSettings.value = !showSettings.value
}

const changeColor = (): void => {
  if (!dashboard.value) return
  dashboard.value.background = colorBoard.value
}

const toggleTitleEditing = (): void => {
  isEditingTitleOfDashboard.value = true
}
const stopEditingTitleOfDashboard = () => {
  isEditingTitleOfDashboard.value = false
}
provide('openTaskEditor', openTaskEditor)
</script>
<template>
  <div
    :style="{
      background: dashboard?.useColorForBg ? colorBoard : `url('/src/assets/bg-1.jpg')`
    }"
    class="main"
  >
    <div :class="{ activeHeader: showSettings }" class="header">
      <div class="header-top">
        <div class="title-wrapper">
          <h2 v-if="!isEditingTitleOfDashboard">
            {{ dashboard?.title }}
          </h2>
          <input
            @blur="stopEditingTitleOfDashboard"
            v-else
            v-model="newDashboardTitle"
            type="text"
          />
          <button @click="toggleTitleEditing" class="title-edit-btn">
            <img src="/src/assets/edit.svg" alt="edit" />
          </button>
        </div>

        <div>
          <button class="setting-btn" @click="toggleSettingsDashboard">
            <img src="/src/assets/settings.svg" alt="settings" />
          </button>
        </div>
      </div>
      <div v-show="showSettings" class="header-bottom">
        <div v-if="dashboard">
          <div>
            <label>
              <input v-model="dashboard.useColorForBg" type="checkbox" />Use color for
              background?</label
            >
          </div>
          <div v-if="dashboard.useColorForBg">
            <label for="color">Change color of board:</label>
            <input
              @change="changeColor"
              class="color-picker"
              name="color"
              type="color"
              v-model="colorBoard"
            />
          </div>
        </div>
      </div>
    </div>
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
  display: flex;
  align-items: self-start;
  flex-direction: column;
  padding-inline: 20px;
  transition: all 0.4s ease-in-out;
  overflow: hidden;
  padding-top: 30px;
  gap: 40px;
}
.header-top {
  display: flex;
  align-items: self-start;
  justify-content: space-between;
  width: 100%;
}
header h2 {
  font-size: 30px;
  color: var(--white);
}
.activeHeader {
  height: 40%;
}
.color-picker {
  padding: 0;
  border: none;
  margin: 0;
  outline: none;
}
.setting-btn {
  background: var(--color-3);
  border: none;
  height: 34px;
  width: 34px;
  border-radius: 50%;
  cursor: pointer;
  padding: 5px;
}
.setting-btn img {
  width: 100%;
  transform: rotate(0deg);
  transition: transform 0.4s ease-in-out;
}
.setting-btn:hover img {
  transform: rotate(90deg);
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
.title-wrapper {
  display: flex;
  gap: 10px;
}
.title-wrapper h2 {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.title-wrapper input {
  padding: 10px 8px;
  background-color: var(--color-2);
  border: none;
  color: var(--white);
  border: 1px solid var(--white);
  border-radius: 10px;
  width: 100%;
  font-size: 18px;
}

.title-edit-btn {
  background: transparent;
  border: none;
  cursor: pointer;
}
.title-edit-btn img {
  transition: all 0.2s ease;
}
.title-edit-btn:hover img {
  scale: 1.06;
  transform: rotate(-8deg);
}
</style>

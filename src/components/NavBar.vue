<script lang="ts" setup>
import { useRoute } from 'vue-router'
import type { Dashboard } from '../types'
import { useDashboardStore } from '@/stores/dashboardStore'

defineProps<{
  dashboardList: Dashboard[]
}>()

const dashboardStore = useDashboardStore()

const route = useRoute()
</script>
<template>
  <div class="bar">
    <div class="bar-header">
      <img src="/src/assets/logo.png" alt="kanban logo" />
      <router-link class="logo-link" to="/">
        <span>kanban</span>
      </router-link>

      <button @click="dashboardStore.createNewDashboard" class="add-dashboard">
        <img src="/src/assets/plus.svg" alt="add button" />
      </button>
    </div>
    <nav class="nav">
      <ul>
        <li
          v-for="{ id, title } in dashboardList"
          :key="id"
          :class="{ 'active-board': id === Number(route.params.id) }"
        >
          <router-link class="link dashboard-btn" :to="`/dashboard/${id}`">
            <img src="/src/assets/layout.svg" alt="layout" />
            <span> {{ title }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
<style scoped>
.nav {
  padding-block: 10px;
}
.nav ul {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-right: 20px;
}
.logo-link {
  text-decoration: none;
}
.link {
  cursor: pointer;
  display: block;
  padding: 10px;
  text-decoration: none;
}
.nav ul li {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  cursor: pointer;
  overflow: hidden;
  background: linear-gradient(to right, var(--color-3) 50%, transparent 50%);
  background-size: 200% 100%;
  background-position: 100% 0;
  transition: background-position 0.2s ease-in-out;
}
.nav ul li:hover {
  background-position: 0% 0;
}
.nav ul .active-board {
  background-color: var(--color-3);
}
.dashboard-btn {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
}
.dashboard-btn span {
  color: var(--white);
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;
}
.dashboard-btn img {
  width: 30px;
}

.bar {
  min-width: 250px;
  max-width: 250px;
  background: var(--color-1);
  border-right: 3px solid var(--color-4);
}

.bar-header {
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-left: 20px;
  gap: 7px;
}
.bar-header span {
  font-size: 30px;
  color: var(--white);
  font-weight: 600;
}
.bar-header img {
  width: 40px;
  height: 40px;
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

.add-dashboard {
  border: none;
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: 20px;
  padding: 7px;
  cursor: pointer;
  background: var(--color-3);
  transition:
    background-color 0.4s ease,
    scale 0.3s ease;
  transition: transform 0.2s ease;
}
.add-dashboard:hover {
  transform: scale(1.1);
}
.add-dashboard img {
  width: 20px;
  height: 20px;
}
</style>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import { useDashboardStore } from './stores/dashboardStore'
const dashboard = useDashboardStore()
</script>

<template>
  <div class="wrapper">
    <NavBar :dashboardList="dashboard.dashboards" />
    <RouterView />
  </div>
</template>

<style scoped>
.wrapper {
  margin: 0 auto;
  display: flex;
  height: 100%;
}
</style>

<script lang="ts" setup></script>

<template>
  <div class="welcome-page">
    <div class="wrapper">
      <h1>404</h1>
      <p>Page Not Found</p>
    </div>
  </div>
</template>

<style scoped>
.welcome-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--color-1);
  text-align: center;
  padding: 20px;
  width: 80%;
}
.wrapper {
  margin: 0 auto;
  max-width: 1000px;
}
h1 {
  font-size: 3rem;
  color: var(--white);
}

p {
  font-size: 1.5rem;
  color: var(--white);
  margin-top: 20px;
}
</style>

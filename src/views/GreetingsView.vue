<script lang="ts" setup></script>

<template>
  <div class="welcome-page">
    <div class="wrapper">
      <h1>Welcome to Kanban</h1>
      <p>
        Hi, I'm Petrascu Ion, a beginner front-end developer. This is my Kanban project built with
        Vue.js. Here, you can manage your tasks and workflow efficiently. I hope you find it useful
        and easy to use!
      </p>
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

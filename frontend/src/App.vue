<template>
  <div class="app-layout">
    <AppSidebar v-if="isLoggedIn" />
    <div class="main-area" :class="{ 'no-sidebar': !isLoggedIn }">
      <AppTopbar v-if="isLoggedIn" />
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'

const isLoggedIn = true
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'DM Sans', sans-serif;
  background: #EEF2F8;
  overflow: hidden;
}

.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #EEF2F8;
  min-width: 0;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
}
</style>
<template>
  <div class="app-layout">
    <AppSidebar v-if="isLoggedIn" />
    <div class="main-area">
      <AppTopbar v-if="isLoggedIn" />
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import { useTheme } from './composables/useTheme.js'

const isLoggedIn = true
const { initTheme } = useTheme()
onMounted(() => initTheme())
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');

:root {
  --bg-page:        #EEF2F8;
  --bg-card:        #FFFFFF;
  --bg-card-hover:  #F8FAFC;
  --bg-input:       #F8FAFC;
  --border:         #E2E8F0;
  --border-card:    #E8EDF5;
  --text-1:         #0F172A;
  --text-2:         #334155;
  --text-3:         #64748B;
  --text-4:         #94A3B8;
  --brand:          #1A2B4A;
  --brand-mid:      #243859;
  --accent:         #3B82F6;
  --accent-soft:    rgba(59,130,246,0.10);
  --sidebar-bg:     #1A2B4A;
  --sidebar-text:   rgba(210,220,240,0.85);
  --sidebar-muted:  rgba(180,196,224,0.5);
  --sidebar-hover:  rgba(255,255,255,0.06);
  --sidebar-border: rgba(255,255,255,0.07);
  --success:        #10B981;
  --danger:         #EF4444;
  --warning:        #F59E0B;
}

[data-theme="dark"] {
  --bg-page:        #0F172A;
  --bg-card:        #1E293B;
  --bg-card-hover:  #263348;
  --bg-input:       #263348;
  --border:         #334155;
  --border-card:    #2D3F55;
  --text-1:         #F1F5F9;
  --text-2:         #CBD5E1;
  --text-3:         #94A3B8;
  --text-4:         #64748B;
  --accent:         #60A5FA;
  --accent-soft:    rgba(96,165,250,0.12);
  --sidebar-bg:     #111827;
  --sidebar-border: rgba(255,255,255,0.06);
  --sidebar-hover:  rgba(255,255,255,0.05);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg-page);
  color: var(--text-1);
  transition: background 0.25s, color 0.25s;
}

.app-layout { display: flex; height: 100vh; width: 100vw; overflow: hidden; }

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-page);
  min-width: 0;
  transition: background 0.25s;
}

.content-area { flex: 1; overflow-y: auto; padding: 28px; }
</style>

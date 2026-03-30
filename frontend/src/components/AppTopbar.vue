<template>
  <div class="topbar">
    <div class="breadcrumb">
      <span class="bc-root">Integratech</span>
      <span class="bc-sep">›</span>
      <span class="bc-current">{{ currentPageTitle }}</span>
    </div>

    <div class="topbar-actions">
      <!-- Dark mode toggle -->
      <button class="icon-btn" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <svg v-if="isDark" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3.5" stroke="currentColor" stroke-width="1.3"/>
          <path d="M8 1V2.5M8 13.5V15M1 8H2.5M13.5 8H15M3.1 3.1L4.2 4.2M11.8 11.8L12.9 12.9M3.1 12.9L4.2 11.8M11.8 4.2L12.9 3.1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13.5 10.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 8 8z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Notifications -->
      <button class="icon-btn notif-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6V9.5L2 11H14L12.5 9.5V6C12.5 3.5 10.5 1.5 8 1.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
          <path d="M6.5 11C6.5 11.83 7.17 12.5 8 12.5C8.83 12.5 9.5 11.83 9.5 11" stroke="currentColor" stroke-width="1.3"/>
        </svg>
        <span class="notif-dot"></span>
      </button>

      <!-- User avatar -->
      <div class="user-pill">
        <div class="user-av">AD</div>
        <span class="user-nm">Admin</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme.js'

const route = useRoute()
const { isDark, toggleTheme } = useTheme()

const pageTitles = {
  '/':           'Dashboard',
  '/accounts':   'Accounts',
  '/sales':      'Sales',
  '/inventory':  'Inventory',
  '/hr':         'HR & Payroll',
  '/projects':   'Projects',
  '/settings':   'Settings',
  '/permissions':'Permissions',
}

const currentPageTitle = computed(() => pageTitles[route.path] || 'Dashboard')
</script>

<style scoped>
.topbar {
  height: 56px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  flex-shrink: 0;
  transition: background 0.25s, border-color 0.25s;
}

.breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.bc-root { color: var(--text-4); }
.bc-sep  { color: var(--border); font-size: 11px; }
.bc-current { color: var(--text-1); font-weight: 500; }

.topbar-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }

.icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-3);
  transition: all 0.15s;
  position: relative;
}

.icon-btn:hover {
  background: var(--bg-card-hover);
  color: var(--text-1);
  border-color: var(--accent);
}

.notif-btn { }
.notif-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 6px;
  height: 6px;
  background: #EF4444;
  border-radius: 50%;
  border: 1.5px solid var(--bg-card);
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 10px 0 4px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text-3);
}

.user-pill:hover { background: var(--bg-card-hover); color: var(--text-1); }

.user-av {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: linear-gradient(135deg, #0EA5E9, #3B82F6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.user-nm { font-size: 12.5px; font-weight: 500; color: var(--text-2); }
</style>

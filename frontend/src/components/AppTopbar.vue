<template>
  <div class="topbar">
    <div class="topbar-breadcrumb">
      <span class="breadcrumb-root">Integratech</span>
      <span class="breadcrumb-sep">›</span>
      <span class="breadcrumb-current">{{ currentPageTitle }}</span>
    </div>
    <div class="topbar-actions">
      <button class="topbar-btn">
        <svg viewBox="0 0 13 13" fill="none" width="13" height="13">
          <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" stroke-width="1.3"/>
          <path d="M9 9L11 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        Filter
      </button>
      <button class="topbar-btn primary" @click="$emit('new')">+ New Document</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitles = {
  '/': 'Dashboard',
  '/accounts': 'Accounts',
  '/sales': 'Sales',
  '/inventory': 'Inventory',
  '/hr': 'HR & Payroll',
  '/projects': 'Projects',
  '/settings': 'Settings',
  '/permissions': 'Permissions',
}

const currentPageTitle = computed(() => pageTitles[route.path] || route.name || 'Dashboard')
</script>

<style scoped>
.topbar {
  height: 56px;
  background: white;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  flex-shrink: 0;
}

.topbar-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.breadcrumb-root { color: #94A3B8; }
.breadcrumb-sep { color: #CBD5E1; font-size: 11px; }
.breadcrumb-current { color: #1E293B; font-weight: 500; }

.topbar-actions { margin-left: auto; display: flex; gap: 8px; }

.topbar-btn {
  height: 32px;
  padding: 0 14px;
  border-radius: 7px;
  border: 1px solid #E2E8F0;
  background: white;
  font-size: 12.5px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
}

.topbar-btn:hover { background: #F8FAFC; }

.topbar-btn.primary {
  background: #1A2B4A;
  color: white;
  border-color: #1A2B4A;
}

.topbar-btn.primary:hover { background: #243859; }
</style>
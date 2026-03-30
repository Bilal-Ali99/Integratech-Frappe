<template>
  <div class="sidebar">
    <!-- Logo Bar -->
    <div class="logo-bar">
      <div class="logo-mark">
        <svg viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
          <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
          <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
          <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
        </svg>
      </div>
      <span class="logo-name">Integratech</span>
      <span class="logo-tag">ERP</span>
    </div>

    <!-- Workspace -->
    <div class="workspace" @click="$router.push('/')">
      <div class="ws-avatar">IT</div>
      <div class="ws-info">
        <div class="ws-name">Integratech</div>
        <div class="ws-role">Production</div>
      </div>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="color:var(--sidebar-muted);flex-shrink:0">
        <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <circle cx="5.5" cy="5.5" r="4" stroke="rgba(180,196,224,0.5)" stroke-width="1.3"/>
        <path d="M9 9L11 11" stroke="rgba(180,196,224,0.5)" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
      <span>Quick search...</span>
      <span class="search-kbd">⌘K</span>
    </div>

    <!-- Nav -->
    <nav class="nav-scroll">
      <div class="nav-section">
        <div class="nav-label">Overview</div>
        <router-link to="/" custom v-slot="{ isActive, navigate }">
          <div class="nav-item" :class="{ active: isActive }" @click="navigate">
            <div class="nav-icon"><svg viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.2" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.2" fill="currentColor" opacity="0.5"/><rect x="1" y="9" width="6" height="6" rx="1.2" fill="currentColor" opacity="0.5"/><rect x="9" y="9" width="6" height="6" rx="1.2" fill="currentColor"/></svg></div>
            <span class="nav-text">Dashboard</span>
          </div>
        </router-link>
      </div>

      <div class="nav-divider"></div>

      <div class="nav-section">
        <div class="nav-label">Modules</div>

        <router-link to="/accounts" custom v-slot="{ isActive, navigate }">
          <div class="nav-item" :class="{ active: isActive }" @click="navigate">
            <div class="nav-icon"><svg viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M5 4V3.5C5 2.67 5.67 2 6.5 2H9.5C10.33 2 11 2.67 11 3.5V4" stroke="currentColor" stroke-width="1.3"/><path d="M2 8H14" stroke="currentColor" stroke-width="1.3"/></svg></div>
            <span class="nav-text">Accounts</span>
            <span class="nav-badge alert">3</span>
          </div>
        </router-link>

        <router-link to="/sales" custom v-slot="{ isActive, navigate }">
          <div class="nav-item" :class="{ active: isActive }" @click="navigate">
            <div class="nav-icon"><svg viewBox="0 0 16 16" fill="none"><path d="M2 3H14V13H2V3Z" stroke="currentColor" stroke-width="1.3"/><path d="M5 7H11M5 10H9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></div>
            <span class="nav-text">Sales</span>
            <span class="nav-badge">12</span>
          </div>
        </router-link>

        <router-link to="/inventory" custom v-slot="{ isActive, navigate }">
          <div class="nav-item" :class="{ active: isActive }" @click="navigate">
            <div class="nav-icon"><svg viewBox="0 0 16 16" fill="none"><path d="M4 2H12L14 6H2L4 2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><rect x="2" y="6" width="12" height="8" rx="1" stroke="currentColor" stroke-width="1.3"/><path d="M6 10H10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></div>
            <span class="nav-text">Inventory</span>
          </div>
        </router-link>

        <router-link to="/hr" custom v-slot="{ isActive, navigate }">
          <div class="nav-item" :class="{ active: isActive }" @click="navigate">
            <div class="nav-icon"><svg viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" stroke-width="1.3"/><path d="M2 13C2 10.8 3.8 9 6 9C8.2 9 10 10.8 10 13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M11 7C12.1 7 13 7.9 13 9C13 10.1 12.1 11 11 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></div>
            <span class="nav-text">HR & Payroll</span>
          </div>
        </router-link>

        <!-- Projects collapsible -->
        <div class="nav-item" @click="projectsOpen = !projectsOpen">
          <div class="nav-icon"><svg viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M5 3.5V2.5C5 2 5.5 1.5 6 1.5H10C10.5 1.5 11 2 11 2.5V3.5" stroke="currentColor" stroke-width="1.3"/></svg></div>
          <span class="nav-text">Projects</span>
          <span class="nav-chevron" :class="{ open: projectsOpen }">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3.5 7.5L6.5 5L3.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
          </span>
        </div>
        <div class="nav-children" v-show="projectsOpen">
          <div class="nav-item child" @click="$router.push('/projects/active')"><span class="nav-text">Active Projects</span></div>
          <div class="nav-item child" @click="$router.push('/projects/timesheets')"><span class="nav-text">Timesheets</span></div>
          <div class="nav-item child" @click="$router.push('/projects/tasks')"><span class="nav-text">Task Board</span></div>
        </div>
      </div>

      <div class="nav-divider"></div>

      <div class="nav-section">
        <div class="nav-label">System</div>
        <div class="nav-item" @click="$router.push('/settings')">
          <div class="nav-icon"><svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.3"/><path d="M8 1V3M8 13V15M15 8H13M3 8H1M12.95 3.05L11.54 4.46M4.46 11.54L3.05 12.95M12.95 12.95L11.54 11.54M4.46 4.46L3.05 3.05" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></div>
          <span class="nav-text">Settings</span>
        </div>
      </div>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="user-av">AD</div>
      <div class="user-info">
        <div class="user-name">Administrator</div>
        <div class="user-status"><span class="dot"></span>Online</div>
      </div>
      <button class="footer-btn" @click="logout" title="Logout">
        <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
          <path d="M5 2H2C1.4 2 1 2.4 1 3V11C1 11.6 1.4 12 2 12H5M10 10L13 7L10 4M13 7H5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const projectsOpen = ref(true)
async function logout() {
  await fetch('/api/method/logout')
  window.location.href = '/login'
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex-shrink: 0;
  border-right: 1px solid var(--sidebar-border);
  transition: background 0.25s;
}

.logo-bar {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 10px;
  border-bottom: 1px solid var(--sidebar-border);
  flex-shrink: 0;
}

.logo-mark { width: 30px; height: 30px; background: #3B82F6; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.logo-mark svg { width: 16px; height: 16px; }
.logo-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.02em; }
.logo-tag { font-size: 10px; color: #3B82F6; background: rgba(59,130,246,0.15); padding: 2px 7px; border-radius: 20px; font-weight: 500; margin-left: auto; }

.workspace {
  margin: 14px 16px 0;
  background: var(--sidebar-hover);
  border: 1px solid var(--sidebar-border);
  border-radius: 9px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.ws-avatar { width: 28px; height: 28px; background: linear-gradient(135deg,#3B82F6,#6366F1); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: white; flex-shrink: 0; }
.ws-info { flex: 1; min-width: 0; }
.ws-name { font-size: 12.5px; font-weight: 500; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ws-role { font-size: 11px; color: var(--sidebar-muted); }

.search-bar {
  margin: 12px 16px 0;
  background: var(--sidebar-hover);
  border: 1px solid var(--sidebar-border);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: text;
}

.search-bar span { font-size: 12.5px; color: var(--sidebar-muted); }
.search-kbd { margin-left: auto; font-size: 10px; color: var(--sidebar-muted); border: 1px solid var(--sidebar-border); border-radius: 4px; padding: 1px 5px; }

.nav-scroll { flex: 1; overflow-y: auto; padding: 10px 0 8px; scrollbar-width: none; }
.nav-scroll::-webkit-scrollbar { display: none; }

.nav-section { margin-bottom: 4px; }

.nav-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sidebar-muted);
  padding: 10px 20px 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px 8px 20px;
  margin: 1px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  border: 1px solid transparent;
  position: relative;
}

.nav-item:hover { background: var(--sidebar-hover); }
.nav-item:hover .nav-text { color: #FFFFFF; }

.nav-item.active {
  background: rgba(59,130,246,0.12);
  border-color: rgba(59,130,246,0.2);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 18px;
  background: #3B82F6;
  border-radius: 0 3px 3px 0;
}

.nav-item.active .nav-text { color: #FFFFFF; font-weight: 500; }
.nav-item.child { padding-left: 40px; }

.nav-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.nav-icon svg { width: 15px; height: 15px; color: var(--sidebar-text); }
.nav-item.active .nav-icon { background: rgba(59,130,246,0.2); }
.nav-item.active .nav-icon svg { color: #60A5FA; }

.nav-text { font-size: 13px; color: var(--sidebar-text); flex: 1; }

.nav-badge { font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 20px; background: rgba(59,130,246,0.15); color: #60A5FA; }
.nav-badge.alert { background: rgba(239,68,68,0.15); color: #F87171; }

.nav-chevron { color: var(--sidebar-muted); margin-left: auto; transition: transform 0.2s; }
.nav-chevron.open { transform: rotate(90deg); }

.nav-divider { height: 1px; background: var(--sidebar-border); margin: 8px 16px; }

.sidebar-footer {
  border-top: 1px solid var(--sidebar-border);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.user-av { width: 32px; height: 32px; background: linear-gradient(135deg,#0EA5E9,#3B82F6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: white; flex-shrink: 0; }
.user-info { flex: 1; min-width: 0; }
.user-name { font-size: 12.5px; font-weight: 500; color: #FFFFFF; }
.user-status { font-size: 11px; color: var(--sidebar-muted); display: flex; align-items: center; gap: 4px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: #34D399; flex-shrink: 0; }

.footer-btn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--sidebar-border); background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--sidebar-muted); transition: all 0.15s; }
.footer-btn:hover { background: var(--sidebar-hover); color: var(--sidebar-text); }
</style>

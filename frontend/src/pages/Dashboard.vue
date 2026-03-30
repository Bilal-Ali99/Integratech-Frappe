<template>
  <div class="dashboard">

    <!-- Header -->
    <div class="page-header">
      <div>
        <div class="page-title">Good {{ greeting }}, Administrator</div>
        <div class="page-subtitle">{{ today }} · Here's what's happening at Integratech</div>
      </div>
      <button class="new-btn" @click="$router.push('/sales')">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1V12M1 6.5H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        New Document
      </button>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card" v-for="kpi in kpis" :key="kpi.label" @click="$router.push(kpi.route)">
        <div class="kpi-top">
          <div class="kpi-icon" :style="{ background: kpi.iconBg }">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" v-html="kpi.icon"></svg>
          </div>
          <span class="kpi-delta" :class="kpi.trend > 0 ? 'up' : 'down'" v-if="!loading">
            {{ kpi.trend > 0 ? '↑' : '↓' }} {{ Math.abs(kpi.trend) }}%
          </span>
        </div>
        <div class="kpi-value" v-if="!loading">{{ kpi.value }}</div>
        <div class="kpi-skeleton" v-else></div>
        <div class="kpi-label">{{ kpi.label }}</div>
        <div class="kpi-sub">{{ kpi.sub }}</div>
      </div>
    </div>

    <!-- Middle row: Module shortcuts + Recent activity -->
    <div class="mid-row">

      <!-- Module shortcuts -->
      <div class="card modules-card">
        <div class="card-header">
          <span class="card-title">Quick Access</span>
        </div>
        <div class="modules-grid">
          <div class="module-tile" v-for="mod in modules" :key="mod.label" @click="$router.push(mod.route)">
            <div class="mod-icon" :style="{ background: mod.bg }">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" v-html="mod.icon"></svg>
            </div>
            <span class="mod-label">{{ mod.label }}</span>
            <span class="mod-count" v-if="mod.count">{{ mod.count }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Sales Orders -->
      <div class="card activity-card">
        <div class="card-header">
          <span class="card-title">Recent Sales Orders</span>
          <button class="card-action" @click="$router.push('/sales')">View all →</button>
        </div>
        <div v-if="loading" class="skeleton-list">
          <div class="skeleton-row" v-for="i in 4" :key="i"></div>
        </div>
        <div v-else-if="recentOrders.length === 0" class="empty-msg">No sales orders found</div>
        <div v-else class="order-list">
          <div class="order-row" v-for="o in recentOrders" :key="o.name">
            <div class="order-info">
              <span class="order-id">{{ o.name }}</span>
              <span class="order-customer">{{ o.customer }}</span>
            </div>
            <div class="order-right">
              <span class="order-amount">{{ formatAmount(o.grand_total) }}</span>
              <span class="status-pill" :class="getStatusClass(o.status)">{{ o.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom row: Unpaid invoices + Payment entries -->
    <div class="bot-row">

      <!-- Unpaid Invoices -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Unpaid Invoices</span>
          <span class="card-badge danger" v-if="!loading">{{ unpaidInvoices.length }} pending</span>
        </div>
        <div v-if="loading" class="skeleton-list">
          <div class="skeleton-row" v-for="i in 3" :key="i"></div>
        </div>
        <div v-else-if="unpaidInvoices.length === 0" class="empty-msg">All invoices are paid</div>
        <table v-else class="mini-table">
          <thead><tr><th>Invoice</th><th>Customer</th><th>Amount</th><th>Due</th></tr></thead>
          <tbody>
            <tr v-for="inv in unpaidInvoices.slice(0,5)" :key="inv.name">
              <td class="doc-id">{{ inv.name }}</td>
              <td>{{ inv.customer }}</td>
              <td class="amount">{{ formatAmount(inv.grand_total) }}</td>
              <td><span class="status-pill" :class="inv.status === 'Overdue' ? 'overdue' : 'pending'">{{ inv.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Recent Payments -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent Payments</span>
          <button class="card-action" @click="$router.push('/accounts')">View all →</button>
        </div>
        <div v-if="loading" class="skeleton-list">
          <div class="skeleton-row" v-for="i in 3" :key="i"></div>
        </div>
        <div v-else-if="recentPayments.length === 0" class="empty-msg">No payment entries found</div>
        <table v-else class="mini-table">
          <thead><tr><th>Payment</th><th>Party</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="pay in recentPayments.slice(0,5)" :key="pay.name">
              <td class="doc-id">{{ pay.name }}</td>
              <td>{{ pay.party }}</td>
              <td class="amount">{{ formatAmount(pay.paid_amount) }}</td>
              <td><span class="status-pill" :class="pay.docstatus == 1 ? 'submitted' : 'draft'">{{ pay.docstatus == 1 ? 'Submitted' : 'Draft' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const loading = ref(true)
const recentOrders   = ref([])
const unpaidInvoices = ref([])
const recentPayments = ref([])

const counts = ref({ si: 0, pi: 0, pe: 0, unpaid: 0 })

const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
})

const today = computed(() =>
  new Date().toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
)

const kpis = computed(() => [
  {
    label: 'Sales Invoices',
    value: counts.value.si,
    sub: 'total documents',
    trend: 12,
    route: '/accounts',
    iconBg: 'rgba(59,130,246,0.12)',
    icon: '<rect x="2" y="4" width="12" height="9" rx="1.5" stroke="#3B82F6" stroke-width="1.3"/><path d="M5 4V3.5C5 2.67 5.67 2 6.5 2H9.5C10.33 2 11 2.67 11 3.5V4" stroke="#3B82F6" stroke-width="1.3"/><path d="M2 8H14" stroke="#3B82F6" stroke-width="1.3"/>',
  },
  {
    label: 'Purchase Invoices',
    value: counts.value.pi,
    sub: 'total documents',
    trend: -3,
    route: '/accounts',
    iconBg: 'rgba(99,102,241,0.12)',
    icon: '<path d="M2 3H14V13H2V3Z" stroke="#6366F1" stroke-width="1.3"/><path d="M5 7H11M5 10H9" stroke="#6366F1" stroke-width="1.3" stroke-linecap="round"/>',
  },
  {
    label: 'Payment Entries',
    value: counts.value.pe,
    sub: 'total documents',
    trend: 8,
    route: '/accounts',
    iconBg: 'rgba(16,185,129,0.12)',
    icon: '<circle cx="8" cy="8" r="6" stroke="#10B981" stroke-width="1.3"/><path d="M5.5 8H10.5M8 5.5V10.5" stroke="#10B981" stroke-width="1.3" stroke-linecap="round"/>',
  },
  {
    label: 'Unpaid Invoices',
    value: counts.value.unpaid,
    sub: 'requires attention',
    trend: -5,
    route: '/accounts',
    iconBg: 'rgba(239,68,68,0.10)',
    icon: '<path d="M8 2L14 5V9C14 12 11 14.5 8 15.5C5 14.5 2 12 2 9V5L8 2Z" stroke="#EF4444" stroke-width="1.3" stroke-linejoin="round"/>',
  },
])

const modules = ref([
  { label: 'Accounts',   route: '/accounts',  bg: 'rgba(59,130,246,0.10)',  count: 0, icon: '<rect x="2" y="4" width="12" height="9" rx="1.5" stroke="#3B82F6" stroke-width="1.3"/><path d="M2 8H14" stroke="#3B82F6" stroke-width="1.3"/>' },
  { label: 'Sales',      route: '/sales',     bg: 'rgba(16,185,129,0.10)',  count: 0, icon: '<path d="M2 3H14V13H2V3Z" stroke="#10B981" stroke-width="1.3"/><path d="M5 7H11" stroke="#10B981" stroke-width="1.3" stroke-linecap="round"/>' },
  { label: 'HR',         route: '/hr',        bg: 'rgba(99,102,241,0.10)',  count: 0, icon: '<circle cx="6" cy="5" r="2.5" stroke="#6366F1" stroke-width="1.3"/><path d="M2 13C2 10.8 3.8 9 6 9C8.2 9 10 10.8 10 13" stroke="#6366F1" stroke-width="1.3" stroke-linecap="round"/>' },
  { label: 'Inventory',  route: '/inventory', bg: 'rgba(245,158,11,0.10)',  count: 0, icon: '<path d="M4 2H12L14 6H2L4 2Z" stroke="#F59E0B" stroke-width="1.3" stroke-linejoin="round"/><rect x="2" y="6" width="12" height="8" rx="1" stroke="#F59E0B" stroke-width="1.3"/>' },
  { label: 'Projects',   route: '/projects',  bg: 'rgba(239,68,68,0.10)',   count: 0, icon: '<rect x="1.5" y="3.5" width="13" height="10" rx="1.5" stroke="#EF4444" stroke-width="1.3"/><path d="M5 3.5V2.5C5 2 5.5 1.5 6 1.5H10C10.5 1.5 11 2 11 2.5V3.5" stroke="#EF4444" stroke-width="1.3"/>' },
  { label: 'Settings',   route: '/settings',  bg: 'rgba(100,116,139,0.10)', count: 0, icon: '<circle cx="9" cy="9" r="2.5" stroke="#64748B" stroke-width="1.3"/><path d="M9 2V4M9 14V16M2 9H4M14 9H16" stroke="#64748B" stroke-width="1.3" stroke-linecap="round"/>' },
])

async function frappeGet(doctype, fields, filters = [], limit = 20) {
  const params = new URLSearchParams({
    doctype,
    fields: JSON.stringify(fields),
    filters: JSON.stringify(filters),
    limit_page_length: limit,
    order_by: 'modified desc',
  })
  const res = await fetch(`/api/resource/${encodeURIComponent(doctype)}?${params}`)
  const data = await res.json()
  return data?.data || []
}

async function frappeCount(doctype, filters = []) {
  const data = await frappeGet(doctype, ['name'], filters, 500)
  return data.length
}

function formatAmount(a) {
  if (!a && a !== 0) return '—'
  return '₨ ' + Number(a).toLocaleString('en-PK')
}

function getStatusClass(s) {
  if (s === 'Paid' || s === 'Submitted') return 'submitted'
  if (s === 'Unpaid' || s === 'Draft')   return 'pending'
  if (s === 'Overdue')                   return 'overdue'
  if (s === 'Cancelled')                 return 'cancelled'
  return 'draft'
}

onMounted(async () => {
  try {
    const [si, pi, pe, unpaid, orders, invoices, payments] = await Promise.all([
      frappeCount('Sales Invoice'),
      frappeCount('Purchase Invoice'),
      frappeCount('Payment Entry'),
      frappeCount('Sales Invoice', [['status', 'in', ['Unpaid', 'Overdue']]]),
      frappeGet('Sales Invoice', ['name', 'customer', 'grand_total', 'status'], [], 8),
      frappeGet('Sales Invoice', ['name', 'customer', 'grand_total', 'status'], [['status', 'in', ['Unpaid', 'Overdue']]], 5),
      frappeGet('Payment Entry', ['name', 'party', 'paid_amount', 'docstatus'], [], 5),
    ])
    counts.value = { si, pi, pe, unpaid }
    recentOrders.value   = orders
    unpaidInvoices.value = invoices
    recentPayments.value = payments
    modules.value[0].count = si
    modules.value[1].count = pi
  } catch(e) {
    console.error('Dashboard fetch error:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard { max-width: 1200px; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
.page-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: var(--text-1); margin-bottom: 4px; }
.page-subtitle { font-size: 12.5px; color: var(--text-3); }

.new-btn {
  display: flex; align-items: center; gap: 7px;
  height: 36px; padding: 0 16px;
  background: var(--brand); color: white;
  border: none; border-radius: 8px;
  font-size: 13px; font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: background 0.15s;
}
.new-btn:hover { background: var(--brand-mid); }

/* KPI Grid */
.kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 20px; }

.kpi-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.15s;
}
.kpi-card:hover { background: var(--bg-card-hover); transform: translateY(-1px); }

.kpi-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.kpi-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
.kpi-delta { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
.kpi-delta.up   { background: rgba(16,185,129,0.1); color: #10B981; }
.kpi-delta.down { background: rgba(239,68,68,0.1);  color: #EF4444; }

.kpi-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: var(--text-1); margin-bottom: 4px; }
.kpi-label { font-size: 13px; font-weight: 500; color: var(--text-2); }
.kpi-sub   { font-size: 11.5px; color: var(--text-4); margin-top: 2px; }
.kpi-skeleton { height: 34px; width: 60px; background: var(--border); border-radius: 6px; animation: pulse 1.5s infinite; margin-bottom: 4px; }

/* Cards */
.card { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 12px; overflow: hidden; transition: background 0.25s, border-color 0.25s; }
.card-header { padding: 14px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.card-title { font-size: 13.5px; font-weight: 600; color: var(--text-1); }
.card-action { font-size: 12px; color: var(--accent); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.card-action:hover { text-decoration: underline; }
.card-badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.card-badge.danger { background: rgba(239,68,68,0.1); color: #EF4444; }

/* Mid row */
.mid-row { display: grid; grid-template-columns: 280px 1fr; gap: 16px; margin-bottom: 16px; }

/* Modules grid */
.modules-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }

.module-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 12px;
  cursor: pointer;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
  position: relative;
}

.module-tile:hover { background: var(--bg-card-hover); }
.module-tile:nth-child(2n) { border-right: none; }
.module-tile:nth-last-child(-n+2) { border-bottom: none; }

.mod-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.mod-label { font-size: 12px; font-weight: 500; color: var(--text-2); text-align: center; }
.mod-count { position: absolute; top: 10px; right: 10px; font-size: 10px; font-weight: 600; background: rgba(59,130,246,0.12); color: var(--accent); padding: 1px 6px; border-radius: 20px; }

/* Activity card */
.order-list { padding: 4px 0; }
.order-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; border-bottom: 1px solid var(--border); transition: background 0.12s; cursor: pointer; }
.order-row:last-child { border-bottom: none; }
.order-row:hover { background: var(--bg-card-hover); }
.order-info { display: flex; flex-direction: column; gap: 2px; }
.order-id { font-family: monospace; font-size: 12px; color: var(--accent); font-weight: 500; }
.order-customer { font-size: 12px; color: var(--text-3); }
.order-right { display: flex; align-items: center; gap: 10px; }
.order-amount { font-size: 13px; font-weight: 500; color: var(--text-1); }

/* Bottom row */
.bot-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* Mini table */
.mini-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.mini-table th { text-align: left; padding: 9px 20px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-4); background: var(--bg-card-hover); border-bottom: 1px solid var(--border); }
.mini-table td { padding: 10px 20px; color: var(--text-2); border-bottom: 1px solid var(--border); }
.mini-table tr:last-child td { border-bottom: none; }
.mini-table tr:hover td { background: var(--bg-card-hover); }
.doc-id { font-family: monospace; font-size: 11.5px; color: var(--accent); font-weight: 500; }
.amount { font-weight: 500; color: var(--text-1); }

/* Status pills */
.status-pill { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 500; }
.status-pill.submitted { background: #ECFDF5; color: #059669; }
.status-pill.pending   { background: #EFF6FF; color: #2563EB; }
.status-pill.overdue   { background: #FEF2F2; color: #EF4444; }
.status-pill.cancelled { background: var(--border); color: var(--text-4); }
.status-pill.draft     { background: #FFFBEB; color: #D97706; }

/* Skeleton */
.skeleton-list { padding: 12px 20px; }
.skeleton-row { height: 40px; background: var(--border); border-radius: 6px; margin-bottom: 6px; animation: pulse 1.5s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

.empty-msg { padding: 32px 20px; text-align: center; font-size: 13px; color: var(--text-4); }
</style>

<template>
  <div class="accounts-page">

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <div class="page-title">Accounts</div>
        <div class="page-subtitle">Manage your financial documents</div>
      </div>
      <button class="new-btn" @click="openNew">+ New Document</button>
    </div>

    <!-- Summary KPI Cards -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">Sales Invoices</div>
        <div class="kpi-value" v-if="!loading.summary">{{ summary.salesInvoice }}</div>
        <div class="kpi-skeleton" v-else></div>
        <div class="kpi-sub">total documents</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Purchase Invoices</div>
        <div class="kpi-value" v-if="!loading.summary">{{ summary.purchaseInvoice }}</div>
        <div class="kpi-skeleton" v-else></div>
        <div class="kpi-sub">total documents</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Payment Entries</div>
        <div class="kpi-value" v-if="!loading.summary">{{ summary.paymentEntry }}</div>
        <div class="kpi-skeleton" v-else></div>
        <div class="kpi-sub">total documents</div>
      </div>
      <div class="kpi-card highlight">
        <div class="kpi-label">Unpaid Invoices</div>
        <div class="kpi-value" v-if="!loading.summary">{{ summary.unpaid }}</div>
        <div class="kpi-skeleton" v-else></div>
        <div class="kpi-sub alert-text">requires attention</div>
      </div>
    </div>

    <!-- Tab Bar -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
        <span class="tab-count" v-if="tab.count > 0">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Table Card -->
    <div class="table-card">
      <div class="table-toolbar">
        <div class="search-wrap">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" stroke-width="1.3"/>
            <path d="M9 9L11 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="`Search ${currentTab.label}...`"
            class="search-input"
            @input="fetchDocuments"
          />
        </div>
        <div class="toolbar-right">
          <select v-model="statusFilter" class="filter-select" @change="fetchDocuments">
            <option value="">All Status</option>
            <option v-for="s in currentStatuses" :key="s" :value="s">{{ s }}</option>
          </select>
          <button class="refresh-btn" @click="fetchDocuments" :class="{ spinning: loading.docs }">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M11 6.5A4.5 4.5 0 1 1 8.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              <path d="M8.5 1V3.5H11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading.docs" class="loading-rows">
        <div class="skeleton-row" v-for="i in 5" :key="i"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="documents.length === 0" class="empty-state">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="8" y="4" width="24" height="32" rx="3" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
          <path d="M14 14H26M14 20H26M14 26H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/>
        </svg>
        <p>No {{ currentTab.label }} found</p>
        <span>Try changing the filter or create a new document</span>
      </div>

      <!-- Data table -->
      <table v-else>
        <thead>
          <tr>
            <th v-for="col in currentColumns" :key="col.key">{{ col.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="doc in documents"
            :key="doc.name"
            @click="openDoc(doc.name)"
            class="doc-row"
          >
            <td class="doc-name">{{ doc.name }}</td>
            <td>{{ doc.party || doc.company || '—' }}</td>
            <td>{{ formatDate(doc.posting_date || doc.payment_date) }}</td>
            <td class="amount-cell">{{ formatAmount(doc.grand_total || doc.paid_amount) }}</td>
            <td>
              <span class="status-pill" :class="getStatusClass(doc.status || doc.docstatus)">
                {{ getStatusLabel(doc.status || doc.docstatus) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination" v-if="documents.length > 0">
        <span class="page-info">
          Showing {{ documents.length }} of {{ totalCount }} documents
        </span>
        <div class="page-btns">
          <button class="page-btn" :disabled="page === 0" @click="prevPage">← Prev</button>
          <span class="page-num">{{ page + 1 }}</span>
          <button class="page-btn" :disabled="(page + 1) * pageSize >= totalCount" @click="nextPage">Next →</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const activeTab = ref('sales_invoice')
const searchQuery = ref('')
const statusFilter = ref('')
const documents = ref([])
const totalCount = ref(0)
const page = ref(0)
const pageSize = 20

const loading = ref({ summary: true, docs: true })

const summary = ref({
  salesInvoice: 0,
  purchaseInvoice: 0,
  paymentEntry: 0,
  unpaid: 0,
})

const tabs = ref([
  { key: 'sales_invoice',    label: 'Sales Invoice',    doctype: 'Sales Invoice',    count: 0 },
  { key: 'purchase_invoice', label: 'Purchase Invoice', doctype: 'Purchase Invoice', count: 0 },
  { key: 'payment_entry',    label: 'Payment Entry',    doctype: 'Payment Entry',    count: 0 },
])

const statusMap = {
  sales_invoice:    ['Draft', 'Submitted', 'Paid', 'Unpaid', 'Overdue', 'Cancelled'],
  purchase_invoice: ['Draft', 'Submitted', 'Paid', 'Unpaid', 'Overdue', 'Cancelled'],
  payment_entry:    ['Draft', 'Submitted', 'Cancelled'],
}

const columnMap = {
  sales_invoice: [
    { key: 'name',         label: 'Invoice No.' },
    { key: 'customer',     label: 'Customer' },
    { key: 'posting_date', label: 'Date' },
    { key: 'grand_total',  label: 'Amount' },
    { key: 'status',       label: 'Status' },
  ],
  purchase_invoice: [
    { key: 'name',         label: 'Invoice No.' },
    { key: 'supplier',     label: 'Supplier' },
    { key: 'posting_date', label: 'Date' },
    { key: 'grand_total',  label: 'Amount' },
    { key: 'status',       label: 'Status' },
  ],
  payment_entry: [
    { key: 'name',         label: 'Payment No.' },
    { key: 'party',        label: 'Party' },
    { key: 'payment_date', label: 'Date' },
    { key: 'paid_amount',  label: 'Amount' },
    { key: 'docstatus',    label: 'Status' },
  ],
}

const currentTab     = computed(() => tabs.value.find(t => t.key === activeTab.value))
const currentColumns = computed(() => columnMap[activeTab.value])
const currentStatuses = computed(() => statusMap[activeTab.value])

const currentDoctype = computed(() => currentTab.value?.doctype)

// ── API helpers ──────────────────────────────────────────────────────────────

async function frappeGet(doctype, fields, filters = [], limit = pageSize, start = 0) {
  const params = new URLSearchParams({
    doctype,
    fields: JSON.stringify(fields),
    filters: JSON.stringify(filters),
    limit_page_length: limit,
    limit_start: start,
    order_by: 'modified desc',
  })
  const res = await fetch(`/api/resource/${encodeURIComponent(doctype)}?${params}`)
  const data = await res.json()
  return data
}

async function frappeCount(doctype, filters = []) {
  const params = new URLSearchParams({
    doctype,
    filters: JSON.stringify(filters),
    limit_page_length: 0,
  })
  const res = await fetch(`/api/resource/${encodeURIComponent(doctype)}?${params}`)
  const data = await res.json()
  return data?.data?.length || 0
}

// ── Fetch summary counts ─────────────────────────────────────────────────────

async function fetchSummary() {
  loading.value.summary = true
  try {
    const [si, pi, pe, unpaid] = await Promise.all([
      frappeCount('Sales Invoice'),
      frappeCount('Purchase Invoice'),
      frappeCount('Payment Entry'),
      frappeCount('Sales Invoice', [['status', 'in', ['Unpaid', 'Overdue']]]),
    ])
    summary.value = {
      salesInvoice:    si,
      purchaseInvoice: pi,
      paymentEntry:    pe,
      unpaid,
    }
    tabs.value[0].count = si
    tabs.value[1].count = pi
    tabs.value[2].count = pe
  } catch (e) {
    console.error('Summary fetch error:', e)
  } finally {
    loading.value.summary = false
  }
}

// ── Fetch documents for active tab ──────────────────────────────────────────

async function fetchDocuments() {
  loading.value.docs = true
  try {
    const doctype = currentDoctype.value
    const fields  = currentColumns.value.map(c => c.key)
    const filters = []

    if (searchQuery.value) {
      filters.push(['name', 'like', `%${searchQuery.value}%`])
    }
    if (statusFilter.value) {
      if (activeTab.value === 'payment_entry') {
        filters.push(['docstatus', '=', statusFilter.value === 'Submitted' ? 1 : statusFilter.value === 'Cancelled' ? 2 : 0])
      } else {
        filters.push(['status', '=', statusFilter.value])
      }
    }

    const start = page.value * pageSize
    const data  = await frappeGet(doctype, fields, filters, pageSize, start)

    documents.value = data?.data || []

    // get total count separately
    const countData = await frappeGet(doctype, ['name'], filters, 500, 0)
    totalCount.value = countData?.data?.length || 0

  } catch (e) {
    console.error('Fetch error:', e)
    documents.value = []
  } finally {
    loading.value.docs = false
  }
}

// ── Tab switch ───────────────────────────────────────────────────────────────

function switchTab(key) {
  activeTab.value  = key
  statusFilter.value = ''
  searchQuery.value  = ''
  page.value         = 0
  fetchDocuments()
}

function prevPage() { if (page.value > 0) { page.value--; fetchDocuments() } }
function nextPage() { page.value++; fetchDocuments() }

// ── Formatting helpers ───────────────────────────────────────────────────────

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatAmount(a) {
  if (a === undefined || a === null) return '—'
  return '₨ ' + Number(a).toLocaleString('en-PK')
}

function getStatusClass(s) {
  if (s === 'Paid' || s === 1)       return 'submitted'
  if (s === 'Unpaid' || s === 0)     return 'pending'
  if (s === 'Overdue')               return 'overdue'
  if (s === 'Cancelled' || s === 2)  return 'cancelled'
  if (s === 'Draft')                 return 'draft'
  if (s === 'Submitted')             return 'submitted'
  return 'draft'
}

function getStatusLabel(s) {
  if (s === 0) return 'Draft'
  if (s === 1) return 'Submitted'
  if (s === 2) return 'Cancelled'
  return s || '—'
}

function openDoc(name) {
  window.open(`http://integratech.com:8000/app/${activeTab.value.replace('_', '-')}/${name}`, '_blank')
}

function openNew() {
  window.open(`http://integratech.com:8000/app/${activeTab.value.replace('_', '-')}/new-${activeTab.value.replace('_', '-')}-1`, '_blank')
}

// ── Init ─────────────────────────────────────────────────────────────────────

onMounted(() => {
  fetchSummary()
  fetchDocuments()
})
</script>

<style scoped>
.accounts-page { max-width: 1100px; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-family: 'Syne', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 4px;
}

.page-subtitle { font-size: 13px; color: #64748B; }

.new-btn {
  height: 36px;
  padding: 0 16px;
  background: #1A2B4A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}
.new-btn:hover { background: #243859; }

.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 16px 18px;
  border: 1px solid #E8EDF5;
}

.kpi-card.highlight { border-color: #FECACA; background: #FFF8F8; }

.kpi-label { font-size: 11px; color: #94A3B8; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 6px; }
.kpi-value { font-size: 26px; font-weight: 700; font-family: 'Syne', sans-serif; color: #0F172A; }
.kpi-sub { font-size: 11px; color: #94A3B8; margin-top: 4px; }
.alert-text { color: #F87171; }

.kpi-skeleton {
  height: 32px;
  width: 60px;
  background: #F1F5F9;
  border-radius: 6px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

.tab-bar {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid #E2E8F0;
  padding-bottom: 0;
}

.tab-btn {
  height: 36px;
  padding: 0 16px;
  border: none;
  background: none;
  font-size: 13px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  color: #94A3B8;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-btn:hover { color: #475569; }
.tab-btn.active { color: #1A2B4A; border-bottom-color: #3B82F6; }

.tab-count {
  background: #EFF6FF;
  color: #3B82F6;
  font-size: 11px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 20px;
}

.table-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #E8EDF5;
  overflow: hidden;
}

.table-toolbar {
  padding: 12px 16px;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 7px 12px;
  flex: 1;
  max-width: 320px;
  color: #94A3B8;
}

.search-input {
  border: none;
  background: none;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  color: #334155;
  outline: none;
  width: 100%;
}

.search-input::placeholder { color: #94A3B8; }

.toolbar-right { display: flex; align-items: center; gap: 8px; }

.filter-select {
  height: 34px;
  padding: 0 10px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 12.5px;
  font-family: 'DM Sans', sans-serif;
  color: #475569;
  background: white;
  cursor: pointer;
  outline: none;
}

.refresh-btn {
  width: 34px;
  height: 34px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748B;
  transition: all 0.15s;
}

.refresh-btn:hover { background: #F8FAFC; }
.refresh-btn.spinning svg { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.loading-rows { padding: 12px 20px; }
.skeleton-row {
  height: 44px;
  background: #F8FAFC;
  border-radius: 6px;
  margin-bottom: 6px;
  animation: pulse 1.5s infinite;
}

.empty-state {
  padding: 48px 20px;
  text-align: center;
  color: #94A3B8;
}
.empty-state svg { margin: 0 auto 12px; display: block; }
.empty-state p { font-size: 14px; font-weight: 500; color: #64748B; margin-bottom: 4px; }
.empty-state span { font-size: 12.5px; }

table { width: 100%; border-collapse: collapse; font-size: 12.5px; }

th {
  text-align: left;
  padding: 10px 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94A3B8;
  background: #F8FAFC;
  border-bottom: 1px solid #F1F5F9;
}

td { padding: 12px 20px; color: #334155; border-bottom: 1px solid #F8FAFC; }
tr:last-child td { border-bottom: none; }

.doc-row { cursor: pointer; transition: background 0.12s; }
.doc-row:hover td { background: #F8FAFC; }

.doc-name { font-family: monospace; font-size: 12px; color: #3B82F6; font-weight: 500; }
.amount-cell { font-weight: 500; color: #0F172A; }

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
}

.status-pill.submitted { background: #ECFDF5; color: #059669; }
.status-pill.pending   { background: #FFFBEB; color: #D97706; }
.status-pill.overdue   { background: #FEF2F2; color: #EF4444; }
.status-pill.cancelled { background: #F1F5F9; color: #94A3B8; }
.status-pill.draft     { background: #EFF6FF; color: #3B82F6; }

.pagination {
  padding: 12px 20px;
  border-top: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-info { font-size: 12.5px; color: #94A3B8; }
.page-btns { display: flex; align-items: center; gap: 8px; }

.page-btn {
  height: 30px;
  padding: 0 12px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  background: white;
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
}
.page-btn:hover:not(:disabled) { background: #F8FAFC; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-num { font-size: 12.5px; font-weight: 500; color: #1A2B4A; padding: 0 4px; }
</style>
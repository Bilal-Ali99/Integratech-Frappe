<template>
  <div class="dashboard">
    <div class="page-header">
      <div class="page-title">Good {{ greeting }}, {{ firstName }}</div>
      <div class="page-subtitle">Here's what's happening with Integratech today.</div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">Total Revenue</div>
        <div class="kpi-value">₨ 4.2M</div>
        <div class="kpi-delta positive">↑ 12.4% vs last month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Open Invoices</div>
        <div class="kpi-value">38</div>
        <div class="kpi-delta negative">↑ 5 pending overdue</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Active Projects</div>
        <div class="kpi-value">14</div>
        <div class="kpi-delta neutral">3 due this week</div>
      </div>
    </div>

    <!-- Recent Sales Orders -->
    <div class="table-card">
      <div class="table-header">
        <span class="table-title">Recent Sales Orders</span>
        <button class="view-all-btn">View All</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Document</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in recentOrders" :key="order.id">
            <td class="doc-id">{{ order.id }}</td>
            <td>{{ order.customer }}</td>
            <td>{{ order.date }}</td>
            <td>{{ order.amount }}</td>
            <td>
              <span class="status-pill" :class="order.status.toLowerCase()">
                {{ order.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
})

const firstName = 'Administrator'

const recentOrders = [
  { id: 'SO-2025-0091', customer: 'Karachi Traders Co.', date: '26 Mar 2025', amount: '₨ 84,500', status: 'Submitted' },
  { id: 'SO-2025-0090', customer: 'Lahore Distributors', date: '25 Mar 2025', amount: '₨ 1,20,000', status: 'Pending' },
  { id: 'SO-2025-0089', customer: 'Tech Solutions LLC', date: '24 Mar 2025', amount: '₨ 56,200', status: 'Draft' },
]
</script>

<style scoped>
.dashboard { max-width: 1100px; }

.page-header { margin-bottom: 24px; }

.page-title {
  font-family: 'Syne', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 4px;
}

.page-subtitle { font-size: 13px; color: #64748B; }

.kpi-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 18px 20px;
  border: 1px solid #E8EDF5;
}

.kpi-label { font-size: 11.5px; color: #94A3B8; font-weight: 500; letter-spacing: 0.03em; margin-bottom: 6px; text-transform: uppercase; }
.kpi-value { font-size: 24px; font-weight: 600; font-family: 'Syne', sans-serif; color: #0F172A; }
.kpi-delta { font-size: 11.5px; margin-top: 4px; }
.kpi-delta.positive { color: #10B981; }
.kpi-delta.negative { color: #F87171; }
.kpi-delta.neutral { color: #94A3B8; }

.table-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #E8EDF5;
  overflow: hidden;
}

.table-header {
  padding: 14px 20px;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-title { font-size: 13.5px; font-weight: 600; color: #1E293B; }

.view-all-btn {
  height: 28px;
  padding: 0 12px;
  border-radius: 7px;
  border: 1px solid #E2E8F0;
  background: white;
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  color: #475569;
  cursor: pointer;
}

.view-all-btn:hover { background: #F8FAFC; }

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

td { padding: 11px 20px; color: #334155; border-bottom: 1px solid #F8FAFC; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #FAFBFD; }

.doc-id { font-family: monospace; font-size: 12px; color: #3B82F6; }

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
.status-pill.draft     { background: #EFF6FF; color: #2563EB; }
</style>
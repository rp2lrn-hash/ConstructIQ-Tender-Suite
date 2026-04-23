<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import VueApexCharts from 'vue3-apexcharts'

const authStore = useAuthStore()

const stats = ref({
  totalTenders: 0,
  activeTenders: 0,
  totalBids: 0,
  totalContracts: 0,
  activeContracts: 0,
  totalVendors: 0,
  compliantVendors: 0
})

const recentTenders = ref([])
const upcomingDeadlines = ref([])
const loading = ref(true)

const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
    toolbar: { show: false },
    stacked: true
  },
  plotOptions: {
    bar: { borderRadius: 8, columnWidth: '50%' }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  colors: ['#D97706', '#F3E8E2', '#2D2D2D'],
  theme: { mode: 'light' },
  legend: {
    position: 'top'
  }
})

const chartSeries = ref([
  { name: 'Budget', data: [120, 190, 80, 150, 220, 180] },
  { name: 'Actual', data: [100, 160, 70, 130, 200, 160] },
  { name: 'Remaining', data: [20, 30, 10, 20, 20, 20] }
])

const fetchDashboardData = async () => {
  try {
    const response = await api.get('/reports/dashboard')
    stats.value = response.data.stats
    recentTenders.value = response.data.recentTenders
    upcomingDeadlines.value = response.data.upcomingDeadlines
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="text-3xl font-bold" style="color: #2D2D2D;">Dashboard</h1>
      <p class="text-gray-600 mt-1">Welcome back, {{ authStore.user?.name }}</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <div v-else>
      <!-- KPI Cards with Gold Highlights -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl border p-6" style="animation-delay: 0.1s; border-color: rgba(243, 232, 226, 0.2); box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Tenders</p>
              <p class="text-3xl font-bold mt-2" style="color: #2D2D2D;">
                {{ stats.totalTenders }}
              </p>
              <div class="w-16 h-1 rounded mt-3" style="background-color: #D97706;"></div>
            </div>
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background-color: #FEF3C7; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
              <i class="pi pi-file text-2xl" style="color: #D97706;"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border p-6" style="animation-delay: 0.2s; border-color: rgba(243, 232, 226, 0.2); box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Active Tenders</p>
              <p class="text-3xl font-bold mt-2" style="color: #2D2D2D;">
                {{ stats.activeTenders }}
              </p>
              <div class="w-16 h-1 rounded mt-3" style="background-color: #D97706;"></div>
            </div>
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background-color: #F3E8E2; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
              <i class="pi pi-check-circle text-2xl" style="color: #2D2D2D;"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border p-6" style="animation-delay: 0.3s; border-color: rgba(243, 232, 226, 0.2); box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Bids</p>
              <p class="text-3xl font-bold mt-2" style="color: #2D2D2D;">
                {{ stats.totalBids }}
              </p>
              <div class="w-16 h-1 rounded mt-3" style="background-color: #D97706;"></div>
            </div>
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background-color: #FEF3C7; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
              <i class="pi pi-send text-2xl" style="color: #D97706;"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border p-6" style="animation-delay: 0.4s; border-color: rgba(243, 232, 226, 0.2); box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Active Contracts</p>
              <p class="text-3xl font-bold mt-2" style="color: #2D2D2D;">
                {{ stats.activeContracts }}
              </p>
              <div class="w-16 h-1 rounded mt-3" style="background-color: #D97706;"></div>
            </div>
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background-color: #F3E8E2; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
              <i class="pi pi-file-edit text-2xl" style="color: #2D2D2D;"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Stacked Bar Chart for Budget vs Actual -->
      <div class="bg-white rounded-2xl border p-6 mb-8 animate-slide-up" style="border-color: rgba(243, 232, 226, 0.2); box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);">
        <h3 class="text-lg font-semibold mb-4 flex items-center" style="color: #2D2D2D;">
          <i class="pi pi-chart-bar mr-2" style="color: #D97706;"></i>
          Budget vs Actual
        </h3>
        <VueApexCharts
          type="bar"
          height="350"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>

      <!-- Recent Tenders -->
      <div class="bg-white rounded-2xl border p-6 mb-8 animate-slide-up" style="animation-delay: 0.1s; border-color: rgba(243, 232, 226, 0.2); box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);">
        <h3 class="text-lg font-semibold mb-4 flex items-center" style="color: #2D2D2D;">
          <i class="pi pi-list mr-2" style="color: #D97706;"></i>
          Recent Tenders
        </h3>
        <DataTable :value="recentTenders" stripedRows>
          <Column field="title" header="Title" />
          <Column field="category" header="Category" />
          <Column field="status" header="Status">
            <template #body="{ data }">
              <Tag
                :value="data.status"
                :severity="data.status === 'published' ? 'success' : data.status === 'closed' ? 'danger' : 'info'"
              />
            </template>
          </Column>
          <Column field="submission_deadline" header="Deadline">
            <template #body="{ data }">
              {{ new Date(data.submission_deadline).toLocaleDateString() }}
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Upcoming Deadlines -->
      <div class="bg-white rounded-2xl border p-6 animate-slide-up" style="animation-delay: 0.2s; border-color: rgba(243, 232, 226, 0.2); box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);">
        <h3 class="text-lg font-semibold mb-4 flex items-center" style="color: #2D2D2D;">
          <i class="pi pi-clock mr-2" style="color: #D97706;"></i>
          Upcoming Deadlines
        </h3>
        <DataTable :value="upcomingDeadlines" stripedRows>
          <Column field="title" header="Tender" />
          <Column field="submission_deadline" header="Deadline">
            <template #body="{ data }">
              {{ new Date(data.submission_deadline).toLocaleDateString() }}
            </template>
          </Column>
          <Column header="Days Left">
            <template #body="{ data }">
              <Tag
                :value="Math.ceil((new Date(data.submission_deadline) - new Date()) / (1000 * 60 * 60 * 24)) + ' days'"
                :severity="new Date(data.submission_deadline) - new Date() < 7 * 24 * 60 * 60 * 1000 ? 'danger' : 'success'"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

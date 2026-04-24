<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import VueApexCharts from 'vue3-apexcharts'

const authStore = useAuthStore()

const stats = ref({
  totalSpend: 0,
  activeBids: 0,
  daysToAward: 0,
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
const aiPanelOpen = ref(false)

const currentDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date().toLocaleDateString('en-US', options)
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const chartOptions = ref({
  chart: {
    type: 'area',
    height: 350,
    toolbar: { show: false },
    fontFamily: 'DM Sans, sans-serif',
    background: 'transparent',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    }
  },
  plotOptions: {
    area: {
      fillTo: 'end',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    }
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    labels: { 
      style: { colors: '#94A3B8', fontFamily: 'DM Sans, sans-serif', fontSize: '12px' }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { 
      style: { colors: '#94A3B8', fontFamily: 'DM Sans, sans-serif', fontSize: '12px' },
      formatter: (value) => '$' + value + 'K'
    }
  },
  colors: ['#005D6C', '#007B8F', '#009BAA'],
  theme: { mode: 'light' },
  legend: {
    position: 'top',
    fontFamily: 'DM Sans, sans-serif',
    markers: {
      radius: 12,
      strokeWidth: 0
    }
  },
  grid: {
    borderColor: '#E2E8ED',
    strokeDashArray: 4,
    yaxis: {
      lines: { show: true }
    },
    xaxis: {
      lines: { show: false }
    }
  },
  tooltip: {
    theme: 'light',
    style: { fontFamily: 'DM Sans, sans-serif' },
    y: {
      formatter: (value) => '$' + value + 'K'
    }
  }
})

const chartSeries = ref([
  { name: 'Budget', data: [120, 190, 80, 150, 220, 180] },
  { name: 'Actual', data: [100, 160, 70, 130, 200, 160] },
  { name: 'Remaining', data: [20, 30, 10, 20, 20, 20] }
])

const pipelineStages = [
  { name: 'Draft', count: 5, color: '#94A3B8' },
  { name: 'Published', count: 12, color: '#005D6C' },
  { name: 'Bid Open', count: 8, color: '#007B8F' },
  { name: 'Evaluation', count: 4, color: '#009BAA' },
  { name: 'Awarded', count: 15, color: '#16A34A' }
]

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
    <!-- Hero Header -->
    <div class="hero-lms mb-8 relative z-10">
      <div class="relative z-10">
        <p class="text-sm opacity-90 mb-2">{{ currentDate }}</p>
        <h1 class="text-2xl font-bold mb-2">{{ greeting }}, {{ authStore.user?.name?.split(' ')[0] }}! 👋</h1>
        <p class="text-sm opacity-80">Here's what's happening with your tenders today.</p>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <i class="pi pi-spinner pi-spin text-3xl text-text-muted"></i>
    </div>

    <div v-else class="relative">
      <!-- Main Content -->
      <div :class="aiPanelOpen ? 'mr-80' : ''">
        <!-- Top KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="card-lms">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-text-secondary mb-2">Total Spend Managed</p>
                <p class="text-3xl font-bold text-text-primary">${{ (stats.totalSpend || 2450000).toLocaleString() }}</p>
                <div class="mt-3 h-2 progress-bar-lms">
                  <div class="progress-bar-fill-lms" style="width: 75%;"></div>
                </div>
                <p class="text-xs text-status-success mt-2">+15.3% from last month</p>
              </div>
              <div class="w-12 h-12 flex items-center justify-center" style="background: #E8F4F6; border-radius: 12px;">
                <i class="pi pi-dollar text-xl" style="color: #005D6C;"></i>
              </div>
            </div>
          </div>

          <div class="card-lms">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-text-secondary mb-2">Active Bids</p>
                <p class="text-3xl font-bold text-text-primary">{{ stats.activeBids || 24 }}</p>
                <div class="mt-3 h-2 progress-bar-lms">
                  <div class="progress-bar-fill-lms" style="width: 60%;"></div>
                </div>
                <p class="text-xs text-status-warning mt-2">8 closing this week</p>
              </div>
              <div class="w-12 h-12 flex items-center justify-center" style="background: #FEF3C7; border-radius: 12px;">
                <i class="pi pi-briefcase text-xl" style="color: #D97706;"></i>
              </div>
            </div>
          </div>

          <div class="card-lms">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-text-secondary mb-2">Days to Award</p>
                <p class="text-3xl font-bold text-text-primary">{{ stats.daysToAward || 14 }}</p>
                <div class="mt-3 h-2 progress-bar-lms">
                  <div class="progress-bar-fill-lms" style="width: 45%;"></div>
                </div>
                <p class="text-xs text-status-success mt-2">On track</p>
              </div>
              <div class="w-12 h-12 flex items-center justify-center" style="background: #DCFCE7; border-radius: 12px;">
                <i class="pi pi-clock text-xl" style="color: #16A34A;"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Pipeline Visualization -->
        <div class="card-lms mb-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-base font-semibold text-text-primary">Tender Pipeline</h3>
              <p class="text-sm text-text-secondary mt-1">Track tender stages across the lifecycle</p>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div v-for="(stage, index) in pipelineStages" :key="stage.name" class="flex-1 flex flex-col items-center">
              <div 
                class="w-14 h-14 flex items-center justify-center mb-3 transition-all duration-200 hover:scale-110 cursor-pointer"
                :style="{ background: stage.color + '20', border: `2px solid ${stage.color}`, borderRadius: '12px' }"
              >
                <span class="text-xl font-bold" :style="{ color: stage.color }">{{ stage.count }}</span>
              </div>
              <p class="text-xs font-medium text-text-primary">{{ stage.name }}</p>
              <div v-if="index < pipelineStages.length - 1" class="flex-1 h-0.5 mx-2 mt-8" style="background: #E2E8ED;"></div>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="card-lms mb-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-base font-semibold text-text-primary">Budget vs Actual</h3>
              <p class="text-sm text-text-secondary mt-1">Financial performance overview</p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-2" style="background: #005D6C;"></div>
                <span class="text-xs text-text-secondary">Budget</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-2" style="background: #007B8F;"></div>
                <span class="text-xs text-text-secondary">Actual</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-2" style="background: #009BAA;"></div>
                <span class="text-xs text-text-secondary">Remaining</span>
              </div>
            </div>
          </div>
          <VueApexCharts
            type="area"
            height="350"
            :options="chartOptions"
            :series="chartSeries"
          />
        </div>

        <!-- Recent Tenders & Upcoming Deadlines -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="card-lms">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-base font-semibold text-text-primary">Recent Tenders</h3>
                <p class="text-sm text-text-secondary mt-1">Latest tender activities</p>
              </div>
              <button class="text-sm font-medium hover:underline" style="color: #005D6C;">View All</button>
            </div>
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

          <div class="card-lms">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-base font-semibold text-text-primary">Upcoming Deadlines</h3>
                <p class="text-sm text-text-secondary mt-1">Tenders closing soon</p>
              </div>
              <button class="text-sm font-medium hover:underline" style="color: #005D6C;">View All</button>
            </div>
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

      <!-- AI Sidepanel -->
      <div 
        v-if="aiPanelOpen"
        class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50"
        style="border-left: 1.5px solid #E2E8ED;"
      >
        <div class="p-6 h-full flex flex-col">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-2">
              <i class="pi pi-sparkles text-xl" style="color: #005D6C;"></i>
              <h3 class="text-base font-semibold text-text-primary">AI Assistant</h3>
            </div>
            <button @click="aiPanelOpen = false" class="text-text-muted hover:text-text-primary">
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto space-y-4">
            <!-- Bid Summary -->
            <div class="p-4" style="background: #E8F4F6; border-radius: 12px;">
              <div class="flex items-center space-x-2 mb-2">
                <i class="pi pi-file-text" style="color: #005D6C;"></i>
                <h4 class="font-medium text-text-primary">Bid Summary</h4>
              </div>
              <p class="text-sm text-text-secondary">3 new bids received today. 2 require immediate review.</p>
            </div>

            <!-- Compliance Checklist -->
            <div class="p-4" style="background: #DCFCE7; border-radius: 12px;">
              <div class="flex items-center space-x-2 mb-2">
                <i class="pi pi-check-circle" style="color: #16A34A;"></i>
                <h4 class="font-medium text-text-primary">Compliance Status</h4>
              </div>
              <p class="text-sm text-text-secondary">All vendors compliant. 2 pending documentation.</p>
            </div>

            <!-- Gap Analysis -->
            <div class="p-4" style="background: #FEF3C7; border-radius: 12px;">
              <div class="flex items-center space-x-2 mb-2">
                <i class="pi pi-chart-line" style="color: #D97706;"></i>
                <h4 class="font-medium text-text-primary">Gap Analysis</h4>
              </div>
              <p class="text-sm text-text-secondary">Budget variance: +5%. Consider renegotiation on T-2024-003.</p>
            </div>

            <!-- Recommendations -->
            <div class="p-4" style="background: #E8F4F6; border-radius: 12px;">
              <div class="flex items-center space-x-2 mb-2">
                <i class="pi pi-lightbulb" style="color: #005D6C;"></i>
                <h4 class="font-medium text-text-primary">Recommendations</h4>
              </div>
              <ul class="text-sm text-text-secondary space-y-1">
                <li>• Accelerate T-2024-005 evaluation</li>
                <li>• Review vendor ABC Corp compliance</li>
                <li>• Schedule award meeting for T-2024-001</li>
              </ul>
            </div>
          </div>

          <div class="mt-4 pt-4" style="border-top: 1.5px solid #E2E8ED;">
            <button class="w-full text-white font-medium transition-all duration-200 hover:opacity-90" style="background: linear-gradient(135deg, #005D6C, #007B8F, #009BAA); border-radius: 9px; padding: 10px 16px;">
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

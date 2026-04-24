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
  <div style="font-family: 'Montserrat', sans-serif;" class="animate-fade-in">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <i class="pi pi-spinner pi-spin text-3xl" style="color: #666;"></i>
    </div>

    <div v-else class="relative">
      <!-- Empty Dashboard -->
      <div class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full" style="background: rgba(46, 100, 254, 0.1);">
            <i class="pi pi-home text-4xl" style="color: #2E64FE;"></i>
          </div>
          <h2 class="text-2xl font-bold mb-2" style="color: #212121;">Welcome to ConstructIQ</h2>
          <p style="color: #666;">Your tender management dashboard</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.icon-animate {
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);
  }
  50% {
    box-shadow: 0 0 40px rgba(46, 100, 254, 0.4);
  }
}

.pulse-glow {
  animation: pulseGlow 3s ease-in-out infinite;
}
</style>

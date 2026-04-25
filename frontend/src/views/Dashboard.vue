<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import VueApexCharts from 'vue3-apexcharts'

const animateValue = (target, duration = 1500) => {
  const animated = ref(0)
  const start = performance.now()
  const tick = (now) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    animated.value = Math.round(target * ease)
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
  return animated
}

const animatedStats = ref({
  totalTenders: ref(0),
  activeTenders: ref(0),
  totalBids: ref(0),
  totalVendors: ref(0),
  totalContracts: ref(0),
  activeContracts: ref(0),
})

const cardsVisible = ref(false)

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
    setTimeout(() => {
      cardsVisible.value = true
      animatedStats.value.totalTenders = animateValue(stats.value.totalTenders || 0)
      animatedStats.value.activeTenders = animateValue(stats.value.activeTenders || 0)
      animatedStats.value.totalBids = animateValue(stats.value.totalBids || 0)
      animatedStats.value.totalVendors = animateValue(stats.value.totalVendors || 0)
      animatedStats.value.totalContracts = animateValue(stats.value.totalContracts || 0)
      animatedStats.value.activeContracts = animateValue(stats.value.activeContracts || 0)
    }, 100)
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const statCards = computed(() => [
  { label: 'Total Tenders', value: animatedStats.value.totalTenders, sub: 'All time', icon: 'pi pi-file', bg: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)' },
  { label: 'Active Tenders', value: animatedStats.value.activeTenders, sub: 'Currently open', icon: 'pi pi-bolt', bg: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)' },
  { label: 'Total Bids', value: animatedStats.value.totalBids, sub: 'Submitted bids', icon: 'pi pi-send', bg: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)' },
  { label: 'Total Vendors', value: animatedStats.value.totalVendors, sub: 'Registered vendors', icon: 'pi pi-users', bg: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' },
  { label: 'Contracts', value: animatedStats.value.totalContracts, sub: 'All contracts', icon: 'pi pi-briefcase', bg: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' },
  { label: 'Active Contracts', value: animatedStats.value.activeContracts, sub: 'In progress', icon: 'pi pi-check-circle', bg: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' },
])

onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <div style="font-family: 'Montserrat', sans-serif;">

    <!-- Welcome Banner -->
    <div class="mb-7 banner-slide-in wb-shell">
      <!-- Blob background layer -->
      <div class="wb-blobs" aria-hidden="true">
        <div class="wb-blob wb-blob-1"></div>
        <div class="wb-blob wb-blob-2"></div>
        <div class="wb-blob wb-blob-3"></div>
      </div>

      <!-- Glass card -->
      <div class="wb-glass">
        <!-- Left: greeting -->
        <div class="wb-left">
          <p class="wb-eyebrow">{{ currentDate }}</p>
          <h1 class="wb-heading">{{ greeting }}, {{ authStore.user?.name?.split(' ')[0] || 'User' }} 👋</h1>
          <p class="wb-sub">Here's your procurement snapshot for today.</p>
          <div class="wb-tags">
            <span class="wb-tag" style="background:rgba(99,102,241,0.18);color:#6366F1;">
              <i class="pi pi-file mr-1" style="font-size:10px;"></i>Tenders
            </span>
            <span class="wb-tag" style="background:rgba(6,182,212,0.18);color:#0EA5E9;">
              <i class="pi pi-send mr-1" style="font-size:10px;"></i>Bids
            </span>
            <span class="wb-tag" style="background:rgba(16,185,129,0.18);color:#10B981;">
              <i class="pi pi-briefcase mr-1" style="font-size:10px;"></i>Contracts
            </span>
          </div>
        </div>

        <!-- Right: pipeline rings -->
        <div class="wb-right">
          <div class="wb-ring-wrap">
            <div class="wb-ring wb-ring-outer"></div>
            <div class="wb-ring wb-ring-mid"></div>
            <div class="wb-ring wb-ring-inner"></div>
            <div class="wb-ring-center">
              <i class="pi pi-chart-pie" style="font-size:20px;color:#6366F1;"></i>
            </div>
          </div>
          <div class="wb-legend">
            <div class="wb-legend-item"><span class="wb-dot" style="background:#6366F1;"></span>Draft</div>
            <div class="wb-legend-item"><span class="wb-dot" style="background:#0EA5E9;"></span>Active</div>
            <div class="wb-legend-item"><span class="wb-dot" style="background:#10B981;"></span>Awarded</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton Loaders while loading -->
    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div v-for="i in 6" :key="i" class="skeleton rounded-2xl h-28"></div>
    </div>

    <!-- Animated Stat Cards -->
    <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div
        v-for="(card, index) in statCards"
        :key="card.label"
        class="stat-card rounded-2xl hover-lift cursor-pointer"
        :class="{ 'card-visible': cardsVisible }"
        :style="{ animationDelay: index * 80 + 'ms', background: card.bg }"
      >
        <div class="sc-inner">
          <div class="sc-top">
            <span class="sc-label">{{ card.label }}</span>
            <div class="sc-icon-wrap">
              <i :class="card.icon" class="text-white"></i>
            </div>
          </div>
          <div class="sc-value">{{ card.value?.value ?? 0 }}</div>
          <div class="sc-sub">
            <i class="pi pi-arrow-up-right" style="font-size:9px;"></i>
            {{ card.sub }}
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<style>
@keyframes banner-slide {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.banner-slide-in { animation: banner-slide 0.5s ease-out both; }

/* Welcome banner — glass card */
.wb-shell {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  min-height: 160px;
}

/* Blob background */
.wb-blobs {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #0C4A6E 100%);
  z-index: 0;
}
.wb-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.55;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
.wb-blob-1 {
  width: 300px; height: 300px;
  background: #6366F1;
  top: -80px; left: -60px;
  animation: blob1 10s ease-in-out infinite alternate;
}
.wb-blob-2 {
  width: 250px; height: 250px;
  background: #06B6D4;
  bottom: -80px; left: 40%;
  animation: blob2 14s ease-in-out infinite alternate;
}
.wb-blob-3 {
  width: 200px; height: 200px;
  background: #8B5CF6;
  top: -40px; right: -40px;
  animation: blob3 12s ease-in-out infinite alternate;
}
@keyframes blob1 { to { transform: translate(40px, 30px) scale(1.1); } }
@keyframes blob2 { to { transform: translate(-30px, -40px) scale(0.9); } }
@keyframes blob3 { to { transform: translate(-50px, 20px) scale(1.15); } }

/* Glass card */
.wb-glass {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 36px;
  background: rgba(0,0,0,0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  gap: 24px;
}

/* Left */
.wb-left { flex: 1; }
.wb-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.85);
  margin-bottom: 6px;
}
.wb-heading {
  font-size: 26px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.2;
  text-shadow: 0 2px 12px rgba(0,0,0,0.3);
}
.wb-sub {
  font-size: 13px;
  color: rgba(255,255,255,0.9);
  margin-top: 6px;
  margin-bottom: 16px;
}
.wb-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.wb-tag {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  backdrop-filter: blur(8px);
}

/* Right — decorative rings */
.wb-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}
.wb-ring-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wb-ring {
  position: absolute;
  border-radius: 50%;
  border: 3px solid transparent;
  animation: ring-spin linear infinite;
}
.wb-ring-outer {
  width: 100px; height: 100px;
  border-top-color: #6366F1;
  border-right-color: rgba(99,102,241,0.3);
  border-bottom-color: rgba(99,102,241,0.1);
  border-left-color: rgba(99,102,241,0.2);
  animation-duration: 8s;
}
.wb-ring-mid {
  width: 72px; height: 72px;
  border-top-color: #06B6D4;
  border-right-color: rgba(6,182,212,0.2);
  border-bottom-color: rgba(6,182,212,0.3);
  border-left-color: rgba(6,182,212,0.1);
  animation-duration: 6s;
  animation-direction: reverse;
}
.wb-ring-inner {
  width: 46px; height: 46px;
  border-top-color: #10B981;
  border-right-color: rgba(16,185,129,0.3);
  border-bottom-color: rgba(16,185,129,0.1);
  border-left-color: rgba(16,185,129,0.2);
  animation-duration: 4s;
}
@keyframes ring-spin { to { transform: rotate(360deg); } }

.wb-ring-center {
  position: absolute;
  width: 34px; height: 34px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Legend */
.wb-legend { display: flex; gap: 12px; }
.wb-legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.95);
}
.wb-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Stat cards */
@keyframes card-pop {
  from { opacity: 0; transform: translateY(24px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.stat-card { opacity: 0; }
.stat-card.card-visible { animation: card-pop 0.5s ease-out both; }

.sc-inner {
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.sc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.sc-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255,255,255,0.75);
}
.sc-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.sc-value {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  line-height: 1;
  letter-spacing: -1px;
}
.sc-sub {
  margin-top: 8px;
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
.icon-animate { animation: iconPulse 2s ease-in-out infinite; }
</style>

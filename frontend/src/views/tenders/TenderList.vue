<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import StatusBadge from '@/components/StatusBadge.vue'

const router = useRouter()
const authStore = useAuthStore()

const tenders = ref([])
const loading = ref(true)
const statusFilter = ref('')
const showClosed = ref(false)

const fetchTenders = async () => {
  try {
    const params = statusFilter.value ? { status: statusFilter.value } : {}
    const response = await api.get('/tenders', { params })
    tenders.value = response.data
  } catch (error) {
    console.error('Failed to fetch tenders:', error)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  router.push('/tenders/create')
}

const handleView = (id) => {
  router.push(`/tenders/${id}`)
}

const getStatus = (status) => {
  if (status === 'published') return 'success'
  if (status === 'closed' || status === 'cancelled') return 'danger'
  if (status === 'awarded') return 'warning'
  return 'neutral'
}

const filters = [
  { label: 'All', value: '' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Awarded', value: 'awarded' },
]

const filteredTenders = computed(() => {
  if (!showClosed.value) {
    return tenders.value.filter(t => t.status !== 'closed' && t.status !== 'cancelled')
  }
  return tenders.value
})

const iconGradients = [
  'linear-gradient(135deg,#6366F1,#8B5CF6)',
  'linear-gradient(135deg,#06B6D4,#0EA5E9)',
  'linear-gradient(135deg,#10B981,#06B6D4)',
  'linear-gradient(135deg,#F59E0B,#EF4444)',
  'linear-gradient(135deg,#EC4899,#8B5CF6)',
]

const getIconGradient = (index) => iconGradients[index % iconGradients.length]

const getUrgencyGradient = (status) => {
  if (status === 'closed' || status === 'cancelled') return 'linear-gradient(180deg, #DC2626, #D97706)'
  if (status === 'awarded') return 'linear-gradient(180deg, #D97706, #16A34A)'
  return 'linear-gradient(180deg, #16A34A, #005D6C)'
}

onMounted(() => {
  fetchTenders()
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest mb-1" style="color:#94A3B8;">Procurement</p>
        <div class="flex items-center gap-3">
          <span class="tl-count">{{ filteredTenders.length }}</span>
          <span class="text-sm font-semibold" style="color:#64748B;">total tenders</span>
        </div>
      </div>
      <button
        v-if="authStore.isEvaluator"
        @click="handleCreate"
        class="tl-create-btn"
      >
        <i class="pi pi-plus text-xs mr-2"></i> New Tender
      </button>
    </div>

    <!-- Filter pills -->
    <div class="flex items-center gap-2 mb-5 flex-wrap">
      <button
        v-for="f in filters"
        :key="f.value"
        @click="statusFilter = f.value; fetchTenders()"
        class="filter-pill"
        :class="statusFilter === f.value ? 'filter-pill-active' : ''"
      >
        {{ f.label }}
      </button>
      <button
        @click="showClosed = !showClosed"
        class="filter-pill ml-auto"
        :class="showClosed ? 'filter-pill-active' : ''"
      >
        <i class="pi pi-eye text-xs mr-1"></i>
        {{ showClosed ? 'Hide Closed' : 'Show Closed' }}
      </button>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="skeleton rounded-2xl h-20"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredTenders.length === 0" class="tl-empty">
      <div class="tl-empty-icon"><i class="pi pi-file text-2xl" style="color:#6366F1;"></i></div>
      <p class="font-bold text-base mt-3" style="color:#0F172A;">No tenders found</p>
      <p class="text-sm mt-1" style="color:#94A3B8;">Try adjusting your filters or create a new tender.</p>
    </div>

    <!-- Tender Cards -->
    <div v-else class="space-y-3">
      <div
        v-for="(tender, index) in filteredTenders"
        :key="tender.id"
        class="tl-card animate-slide-in-bottom"
        :style="{ animationDelay: index * 60 + 'ms' }"
        @click="handleView(tender.id)"
      >
        <!-- Status accent bar -->
        <div class="tl-accent" :style="{ background: getUrgencyGradient(tender.status) }"></div>

        <div class="flex items-center gap-5 flex-1 min-w-0">
          <!-- Icon -->
          <div class="tl-icon" :style="{ background: getIconGradient(index) }">
            <i class="pi pi-file text-white"></i>
          </div>

          <!-- Title & category -->
          <div class="flex-1 min-w-0">
            <p class="tl-title">{{ tender.title }}</p>
            <p class="tl-sub">{{ tender.category || 'General' }} &nbsp;·&nbsp; {{ tender.is_public ? 'External' : 'Internal' }}</p>
          </div>

          <!-- Budget -->
          <div class="hidden md:block text-right min-w-[100px]">
            <p class="tl-budget">${{ tender.budget_range_min?.toLocaleString() || '—' }}</p>
            <p class="tl-sub">Budget</p>
          </div>

          <!-- Date -->
          <div class="hidden lg:block text-right min-w-[100px]">
            <p class="text-sm font-semibold" style="color:#475569;">{{ new Date(tender.created_at).toLocaleDateString() }}</p>
            <p class="tl-sub">Created</p>
          </div>

          <!-- Status badge -->
          <div class="tl-badge-wrap">
            <span class="tl-badge" :class="'badge-' + tender.status">{{ tender.status }}</span>
          </div>

          <!-- Action -->
          <button class="tl-action" @click.stop="handleView(tender.id)">
            <i class="pi pi-arrow-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Page header */
.tl-count {
  font-size: 28px;
  font-weight: 900;
  color: #0F172A;
  line-height: 1;
}

.tl-create-btn {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: white;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99,102,241,0.35);
  transition: all 0.2s ease;
}
.tl-create-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.45); }

/* Filter pills */
.filter-pill {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: 1.5px solid #E2E8F0;
  background: white;
  color: #64748B;
  cursor: pointer;
  transition: all 0.15s ease;
}
.filter-pill:hover { border-color: #6366F1; color: #6366F1; }
.filter-pill-active { background: #6366F1; color: white; border-color: #6366F1; }

/* Cards */
.tl-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}
.tl-card:hover {
  border-color: #6366F1;
  box-shadow: 0 4px 20px rgba(99,102,241,0.1);
  transform: translateY(-2px);
}

.tl-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 14px 0 0 14px;
}

.tl-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tl-title {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tl-sub {
  font-size: 11.5px;
  color: #94A3B8;
  font-weight: 500;
  margin-top: 2px;
}

.tl-budget {
  font-size: 15px;
  font-weight: 800;
  color: #0F172A;
}

.tl-badge-wrap { min-width: 90px; display: flex; justify-content: center; }

.tl-badge {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
}

.badge-published  { background: #DCFCE7; color: #16A34A; }
.badge-draft      { background: #F1F5F9; color: #64748B; }
.badge-closed     { background: #FEE2E2; color: #DC2626; }
.badge-cancelled  { background: #FEE2E2; color: #DC2626; }
.badge-awarded    { background: #FEF9C3; color: #CA8A04; }
.badge-evaluation { background: #EDE9FE; color: #7C3AED; }

.tl-action {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #F8FAFF;
  border: 1.5px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.tl-action:hover { background: #EEF2FF; border-color: #6366F1; color: #6366F1; }

/* Empty state */
.tl-empty {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  border: 1.5px dashed #E2E8F0;
}
.tl-empty-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: #EEF2FF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
</style>

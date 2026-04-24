<script setup>
import { ref, onMounted } from 'vue'
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
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Tenders</h1>
        <p class="text-text-secondary">Active Tenders: {{ tenders.length }}</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="showClosed = !showClosed"
          class="btn-outline-lms"
        >
          {{ showClosed ? 'Hide Closed' : 'Show Closed' }}
        </button>
        <button
          v-if="authStore.isEvaluator"
          @click="handleCreate"
          class="btn-primary-lms"
        >
          + New Tender
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <i class="pi pi-spinner pi-spin text-3xl text-text-muted"></i>
    </div>

    <div v-else class="space-y-5">
      <div
        v-for="tender in tenders"
        :key="tender.id"
        class="card-lms cursor-pointer relative overflow-hidden"
        @click="handleView(tender.id)"
      >
        <div class="absolute left-0 top-0 bottom-0 w-1" :style="{ background: getUrgencyGradient(tender.status) }"></div>
        
        <div class="grid grid-cols-5 gap-6 items-center pl-4">
          <div class="flex items-center">
            <div class="w-12 h-12 flex items-center justify-center text-white" style="background: #005D6C; border-radius: 12px;">
              <i class="pi pi-file text-lg"></i>
            </div>
          </div>

          <div>
            <p class="text-base font-medium text-text-primary">{{ tender.title }}</p>
            <p class="text-sm text-text-secondary">{{ tender.category }}</p>
          </div>

          <div>
            <p class="text-xl font-bold text-text-primary">${{ tender.budget_range_min?.toLocaleString() || 0 }}</p>
            <p class="text-sm text-text-secondary">Budget</p>
          </div>

          <div>
            <StatusBadge :status="getStatus(tender.status)">
              {{ tender.status }}
            </StatusBadge>
          </div>

          <div class="flex items-center justify-end space-x-2">
            <button
              class="text-sm font-medium transition-all duration-200"
              style="color: #005D6C; padding: 8px 16px; border-radius: 8px;"
              @click.stop="handleView(tender.id)"
            >
              View Details
            </button>
          </div>
        </div>

        <div class="mt-4 pt-4 flex items-center space-x-6 text-sm text-text-secondary pl-4" style="border-top: 1.5px solid #E2E8ED;">
          <div class="flex items-center">
            <span class="w-2 h-2 rounded-full inline-block mr-2" style="background: #16A34A;"></span>
            {{ tender.status }}
          </div>
          <div>Created: {{ new Date(tender.created_at).toLocaleDateString() }}</div>
          <div>ID: #{{ tender.id }}</div>
          <div>Type: {{ tender.is_public ? 'External' : 'Internal' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

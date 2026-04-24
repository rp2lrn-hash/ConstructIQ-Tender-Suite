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
  <div style="font-family: 'Montserrat', sans-serif;">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold" style="color: #212121;">Tenders</h1>
        <p style="color: #666;">Active Tenders: {{ tenders.length }}</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="showClosed = !showClosed"
          class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          style="background: white; border: 2px solid #E0F2F7; color: #212121;"
        >
          {{ showClosed ? 'Hide Closed' : 'Show Closed' }}
        </button>
        <button
          v-if="authStore.isEvaluator"
          @click="handleCreate"
          class="px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          style="background: linear-gradient(135deg, #2E64FE 0%, #00B4D8 100%);"
        >
          + New Tender
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <i class="pi pi-spinner pi-spin text-3xl" style="color: #666;"></i>
    </div>

    <div v-else class="space-y-5">
      <div
        v-for="tender in tenders"
        :key="tender.id"
        class="p-6 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer relative overflow-hidden"
        style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);"
        @click="handleView(tender.id)"
      >
        <div class="absolute left-0 top-0 bottom-0 w-1" :style="{ background: getUrgencyGradient(tender.status) }"></div>
        
        <div class="grid grid-cols-5 gap-6 items-center pl-4">
          <div class="flex items-center">
            <div class="w-12 h-12 flex items-center justify-center text-white rounded-xl icon-animate" style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);">
              <i class="pi pi-file text-lg"></i>
            </div>
          </div>

          <div>
            <p class="text-base font-bold" style="color: #212121;">{{ tender.title }}</p>
            <p class="text-sm" style="color: #666;">{{ tender.category }}</p>
          </div>

          <div>
            <p class="text-xl font-bold" style="color: #212121;">${{ tender.budget_range_min?.toLocaleString() || 0 }}</p>
            <p class="text-sm" style="color: #666;">Budget</p>
          </div>

          <div>
            <StatusBadge :status="getStatus(tender.status)">
              {{ tender.status }}
            </StatusBadge>
          </div>

          <div class="flex items-center justify-end space-x-2">
            <button
              class="text-sm font-bold transition-all duration-200 px-4 py-2 rounded-xl hover:scale-105"
              style="color: #2E64FE;"
              @click.stop="handleView(tender.id)"
            >
              View Details
            </button>
          </div>
        </div>

        <div class="mt-4 pt-4 flex items-center space-x-6 text-sm pl-4" style="border-top: 1.5px solid #E0F2F7; color: #666;">
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

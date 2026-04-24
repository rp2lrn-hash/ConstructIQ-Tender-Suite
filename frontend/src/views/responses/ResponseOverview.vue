<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const responses = ref([])
const loading = ref(true)
const statusFilter = ref('')
const questionnaireFilter = ref('')
const projectFilter = ref('')

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'reviewed', label: 'Reviewed' }
]

const fetchResponses = async () => {
  loading.value = true
  try {
    const params = {}
    if (statusFilter.value) params.status = statusFilter.value
    if (questionnaireFilter.value) params.questionnaire_id = questionnaireFilter.value
    if (projectFilter.value) params.project_id = projectFilter.value

    const response = await api.get('/responses', { params })
    responses.value = response.data
  } catch (error) {
    console.error('Failed to fetch responses:', error)
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status) => {
  const colors = {
    not_started: '#9CA3AF',
    in_progress: '#3B82F6',
    completed: '#10B981',
    overdue: '#EF4444',
    reviewed: '#8B5CF6'
  }
  return colors[status] || '#9CA3AF'
}

const getStatusIcon = (status) => {
  const icons = {
    not_started: 'pi-circle',
    in_progress: 'pi-spinner',
    completed: 'pi-check-circle',
    overdue: 'pi-exclamation-circle',
    reviewed: 'pi-eye'
  }
  return icons[status] || 'pi-circle'
}

const getStatusLabel = (status) => {
  const labels = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed',
    overdue: 'Overdue',
    reviewed: 'Reviewed'
  }
  return labels[status] || status
}

const viewDetails = (id) => {
  router.push(`/responses/${id}`)
}

const sendReminder = async (id) => {
  try {
    await api.post(`/responses/${id}/reminder`)
    alert('Reminder sent successfully')
  } catch (error) {
    console.error('Failed to send reminder:', error)
    alert('Failed to send reminder')
  }
}

const printResponse = (id) => {
  window.print()
}

const downloadPDF = async (id) => {
  try {
    const response = await api.get(`/responses/${id}/pdf`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `response-${id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Failed to download PDF:', error)
    alert('Failed to download PDF')
  }
}

const calculateProgress = (response) => {
  if (!response.AnswerDetails || response.AnswerDetails.length === 0) return 0
  const totalQuestions = response.Questionnaire?.Questions?.length || 0
  return totalQuestions > 0 ? Math.round((response.AnswerDetails.length / totalQuestions) * 100) : 0
}

onMounted(() => {
  fetchResponses()
})
</script>

<template>
  <div style="font-family: 'Montserrat', sans-serif;">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold" style="color: #212121;">Response Overview</h1>
        <p style="color: #666;">View and manage questionnaire responses</p>
      </div>
      <div class="flex items-center space-x-3">
        <select
          v-model="statusFilter"
          @change="fetchResponses"
          class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif;"
        >
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <button
          @click="fetchResponses"
          class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          style="background: white; border: 2px solid #E0F2F7; color: #212121;"
        >
          <i class="pi pi-refresh mr-2"></i>Refresh
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <i class="pi pi-spinner pi-spin text-3xl" style="color: #666;"></i>
    </div>

    <div v-else-if="responses.length === 0" class="text-center py-12">
      <div class="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full" style="background: rgba(46, 100, 254, 0.1);">
        <i class="pi pi-file-text text-4xl" style="color: #2E64FE;"></i>
      </div>
      <h2 class="text-xl font-bold mb-2" style="color: #212121;">No Responses Found</h2>
      <p style="color: #666;">There are no questionnaire responses to display.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="response in responses"
        :key="response.id"
        class="p-6 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105"
        style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-bold mb-1" style="color: #212121;">
              {{ response.Questionnaire?.title || 'Untitled Questionnaire' }}
            </h3>
            <p class="text-sm" style="color: #666;">
              Project: {{ response.project?.title || 'N/A' }} | Customer: {{ response.customer?.name || 'N/A' }}
            </p>
          </div>
          <div class="flex items-center space-x-2 px-3 py-1 rounded-full" :style="{ background: `${getStatusColor(response.status)}20` }">
            <i :class="['pi', getStatusIcon(response.status)]" :style="{ color: getStatusColor(response.status) }"></i>
            <span class="text-sm font-bold" :style="{ color: getStatusColor(response.status) }">
              {{ getStatusLabel(response.status) }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-4 mb-4">
          <div>
            <p class="text-xs font-bold mb-1" style="color: #666;">Assigned Date</p>
            <p class="text-sm" style="color: #212121;">{{ new Date(response.assigned_date).toLocaleDateString() || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-xs font-bold mb-1" style="color: #666;">Last Updated</p>
            <p class="text-sm" style="color: #212121;">{{ new Date(response.last_updated).toLocaleDateString() }}</p>
          </div>
          <div>
            <p class="text-xs font-bold mb-1" style="color: #666;">Submitted By</p>
            <p class="text-sm" style="color: #212121;">{{ response.submitter?.name || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-xs font-bold mb-1" style="color: #666;">Progress</p>
            <div class="flex items-center space-x-2">
              <div class="flex-1 h-2 rounded-full overflow-hidden" style="background: #E0F2F7;">
                <div class="h-full rounded-full transition-all duration-300" :style="{ width: `${calculateProgress(response)}%`, background: getStatusColor(response.status) }"></div>
              </div>
              <span class="text-xs font-bold" :style="{ color: getStatusColor(response.status) }">{{ calculateProgress(response) }}%</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end space-x-2 pt-4" style="border-top: 1.5px solid #E0F2F7;">
          <button
            @click="viewDetails(response.id)"
            class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: rgba(46, 100, 254, 0.1); color: #2E64FE;"
          >
            <i class="pi pi-eye mr-2"></i>View Details
          </button>
          <button
            @click="sendReminder(response.id)"
            class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: rgba(245, 158, 11, 0.1); color: #F59E0B;"
          >
            <i class="pi pi-bell mr-2"></i>Send Reminder
          </button>
          <button
            @click="printResponse(response.id)"
            class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: rgba(46, 100, 254, 0.1); color: #2E64FE;"
          >
            <i class="pi pi-print mr-2"></i>Print
          </button>
          <button
            @click="downloadPDF(response.id)"
            class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: rgba(46, 100, 254, 0.1); color: #2E64FE;"
          >
            <i class="pi pi-download mr-2"></i>Download PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const response = ref(null)
const loading = ref(true)
const editingNotes = ref(false)
const notesContent = ref('')

const fetchResponse = async () => {
  loading.value = true
  try {
    const response_data = await api.get(`/responses/${route.params.id}`)
    response.value = response_data.data
    notesContent.value = response.value.internal_notes || ''
  } catch (error) {
    console.error('Failed to fetch response:', error)
    router.push('/responses')
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

const updateStatus = async (newStatus) => {
  try {
    await api.patch(`/responses/${route.params.id}/status`, { status: newStatus })
    response.value.status = newStatus
  } catch (error) {
    console.error('Failed to update status:', error)
    alert('Failed to update status')
  }
}

const saveNotes = async () => {
  try {
    await api.patch(`/responses/${route.params.id}/notes`, { internal_notes: notesContent.value })
    response.value.internal_notes = notesContent.value
    editingNotes.value = false
  } catch (error) {
    console.error('Failed to save notes:', error)
    alert('Failed to save notes')
  }
}

const cancelNotes = () => {
  notesContent.value = response.value.internal_notes || ''
  editingNotes.value = false
}

const printResponse = () => {
  window.print()
}

const downloadPDF = async () => {
  try {
    const response_data = await api.get(`/responses/${route.params.id}/pdf`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response_data.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `response-${route.params.id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Failed to download PDF:', error)
    alert('Failed to download PDF')
  }
}

const goBack = () => {
  router.push('/responses')
}

onMounted(() => {
  fetchResponse()
})
</script>

<template>
  <div style="font-family: 'Montserrat', sans-serif;">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <i class="pi pi-spinner pi-spin text-3xl" style="color: #666;"></i>
    </div>

    <div v-else-if="response" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <button
            @click="goBack"
            class="p-2 rounded-lg transition-all duration-200 hover:scale-110"
            style="background: rgba(46, 100, 254, 0.1);"
          >
            <i class="pi pi-arrow-left" style="color: #2E64FE;"></i>
          </button>
          <div>
            <h1 class="text-2xl font-bold" style="color: #212121;">Response Details</h1>
            <p style="color: #666;">View questionnaire response</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="printResponse"
            class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: white; border: 2px solid #E0F2F7; color: #212121;"
          >
            <i class="pi pi-print mr-2"></i>Print
          </button>
          <button
            @click="downloadPDF"
            class="px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: linear-gradient(135deg, #2E64FE 0%, #00B4D8 100%);"
          >
            <i class="pi pi-download mr-2"></i>Download PDF
          </button>
        </div>
      </div>

      <!-- Response Header Info -->
      <div class="p-6 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p class="text-xs font-bold mb-1" style="color: #666;">Questionnaire</p>
            <p class="text-sm font-bold" style="color: #212121;">{{ response.Questionnaire?.title || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-xs font-bold mb-1" style="color: #666;">Project</p>
            <p class="text-sm" style="color: #212121;">{{ response.project?.title || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-xs font-bold mb-1" style="color: #666;">Customer</p>
            <p class="text-sm" style="color: #212121;">{{ response.customer?.name || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-xs font-bold mb-1" style="color: #666;">Status</p>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full" :style="{ background: getStatusColor(response.status) }"></div>
              <span class="text-sm font-bold" :style="{ color: getStatusColor(response.status) }">
                {{ getStatusLabel(response.status) }}
              </span>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-xs font-bold mb-1" style="color: #666;">Submitted By</p>
            <p class="text-sm" style="color: #212121;">{{ response.submitter?.name || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-xs font-bold mb-1" style="color: #666;">Assigned Date</p>
            <p class="text-sm" style="color: #212121;">{{ new Date(response.assigned_date).toLocaleDateString() || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-xs font-bold mb-1" style="color: #666;">Submission Date</p>
            <p class="text-sm" style="color: #212121;">{{ new Date(response.submitted_date).toLocaleDateString() || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-xs font-bold mb-1" style="color: #666;">Last Updated</p>
            <p class="text-sm" style="color: #212121;">{{ new Date(response.last_updated).toLocaleDateString() }}</p>
          </div>
        </div>
      </div>

      <!-- Questions and Answers -->
      <div class="p-6 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);">
        <h3 class="text-lg font-bold mb-6" style="color: #212121;">Questions & Answers</h3>
        
        <div v-if="!response.AnswerDetails || response.AnswerDetails.length === 0" class="text-center py-8" style="color: #666;">
          <p>No answers provided yet</p>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="answer in response.AnswerDetails"
            :key="answer.id"
            class="pb-6"
            :style="{ borderBottom: answer.id !== response.AnswerDetails[response.AnswerDetails.length - 1].id ? '1.5px solid #E0F2F7' : 'none' }"
          >
            <p class="text-sm font-bold mb-2" style="color: #212121;">
              {{ answer.Question?.question_text || 'Unknown Question' }}
              <span v-if="answer.Question?.is_required" style="color: #DC2626;">*</span>
            </p>
            
            <!-- Text/Textarea/Number/Date answers -->
            <p v-if="['text', 'textarea', 'number', 'date'].includes(answer.Question?.question_type)" class="text-sm p-3 rounded-xl" style="color: #666; background: rgba(46, 100, 254, 0.05);">
              {{ answer.answer_text || 'No answer provided' }}
            </p>

            <!-- Radio/Checkbox/Dropdown answers -->
            <div v-else-if="['radio', 'checkbox', 'dropdown'].includes(answer.Question?.question_type)" class="space-y-2">
              <div v-if="answer.answer_value && Array.isArray(answer.answer_value)">
                <div v-for="(val, index) in answer.answer_value" :key="index" class="flex items-center space-x-2 p-2 rounded-lg" style="background: rgba(46, 100, 254, 0.05);">
                  <i class="pi pi-check text-xs" style="color: #10B981;"></i>
                  <span class="text-sm" style="color: #666;">{{ val }}</span>
                </div>
              </div>
              <p v-else class="text-sm p-3 rounded-xl" style="color: #666; background: rgba(46, 100, 254, 0.05);">
                {{ answer.answer_text || 'No answer provided' }}
              </p>
            </div>

            <!-- File upload answer -->
            <div v-else-if="answer.Question?.question_type === 'file_upload'" class="p-4 rounded-xl" style="background: rgba(46, 100, 254, 0.05);">
              <div v-if="answer.file_path" class="flex items-center space-x-2">
                <i class="pi pi-file text-2xl" style="color: #2E64FE;"></i>
                <a :href="answer.file_path" target="_blank" class="text-sm font-bold hover:underline" style="color: #2E64FE;">
                  View Uploaded File
                </a>
              </div>
              <p v-else class="text-sm" style="color: #666;">No file uploaded</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Internal Notes Section -->
      <div class="p-6 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold" style="color: #212121;">Internal Notes</h3>
          <button
            v-if="!editingNotes"
            @click="editingNotes = true"
            class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: rgba(46, 100, 254, 0.1); color: #2E64FE;"
          >
            <i class="pi pi-pencil mr-2"></i>Edit Notes
          </button>
        </div>

        <div v-if="!editingNotes">
          <p v-if="response.internal_notes" class="text-sm p-4 rounded-xl whitespace-pre-wrap" style="color: #666; background: rgba(46, 100, 254, 0.05);">
            {{ response.internal_notes }}
          </p>
          <p v-else class="text-sm text-center py-4" style="color: #666;">No internal notes added</p>
        </div>

        <div v-else class="space-y-4">
          <textarea
            v-model="notesContent"
            rows="4"
            class="w-full px-4 py-3 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif; resize: none;"
            placeholder="Add internal notes for team collaboration..."
          ></textarea>
          <div class="flex items-center space-x-2">
            <button
              @click="saveNotes"
              class="px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
              style="background: linear-gradient(135deg, #2E64FE 0%, #00B4D8 100%);"
            >
              Save Notes
            </button>
            <button
              @click="cancelNotes"
              class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
              style="background: white; border: 2px solid #E0F2F7; color: #212121;"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Status Update -->
      <div class="p-6 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);">
        <h3 class="text-lg font-bold mb-4" style="color: #212121;">Update Status</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="status in ['not_started', 'in_progress', 'completed', 'overdue', 'reviewed']"
            :key="status"
            @click="updateStatus(status)"
            :disabled="response.status === status"
            class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            :style="{
              background: response.status === status ? getStatusColor(status) : 'white',
              color: response.status === status ? 'white' : getStatusColor(status),
              border: response.status === status ? 'none' : `2px solid ${getStatusColor(status)}`
            }"
          >
            {{ getStatusLabel(status) }}
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

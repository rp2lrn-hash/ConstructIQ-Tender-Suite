<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const questionnaires = ref([])
const loading = ref(true)
const statusFilter = ref('all')
const sortColumn = ref('created_at')
const sortDirection = ref('desc')

const sortedQuestionnaires = computed(() => {
  return [...questionnaires.value].sort((a, b) => {
    let aVal = a[sortColumn.value]
    let bVal = b[sortColumn.value]
    
    if (sortColumn.value === 'created_at') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }
    
    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
})

const fetchQuestionnaires = async () => {
  loading.value = true
  try {
    const params = {}
    if (statusFilter.value !== 'all') params.is_active = statusFilter.value === 'active'

    const response = await api.get('/questionnaires', { params })
    console.log('Fetched questionnaires:', response.data)
    questionnaires.value = response.data
  } catch (error) {
    console.error('Failed to fetch questionnaires:', error)
  } finally {
    loading.value = false
  }
}

const createQuestionnaire = () => {
  router.push('/questionnaires/create')
}

const editQuestionnaire = (id) => {
  router.push(`/questionnaires/${id}/edit`)
}

const toggleStatus = async (id, isActive) => {
  try {
    await api.patch(`/questionnaires/${id}/status`, { is_active: !isActive })
    await fetchQuestionnaires()
  } catch (error) {
    console.error('Failed to toggle status:', error)
    alert('Failed to update questionnaire status')
  }
}

const deleteQuestionnaire = async (id) => {
  if (!confirm('Are you sure you want to delete this questionnaire? This action cannot be undone.')) {
    return
  }

  try {
    await api.delete(`/questionnaires/${id}`)
    await fetchQuestionnaires()
  } catch (error) {
    console.error('Failed to delete questionnaire:', error)
    alert('Failed to delete questionnaire')
  }
}

const getQuestionCount = (questionnaire) => {
  return questionnaire.questions?.length || 0
}

const handleSort = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const getSortIcon = (column) => {
  if (sortColumn.value !== column) return 'pi-sort'
  return sortDirection.value === 'asc' ? 'pi-sort-up' : 'pi-sort-down'
}

onMounted(() => {
  fetchQuestionnaires()
})
</script>

<template>
  <div style="font-family: 'Montserrat', sans-serif;">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold" style="color: #212121;">Questionnaires</h1>
        <p style="color: #666;">Manage questionnaire templates</p>
      </div>
      <div class="flex items-center space-x-3">
        <select
          v-model="statusFilter"
          @change="fetchQuestionnaires"
          class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif;"
        >
          <option value="all">All Questionnaires</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          @click="createQuestionnaire"
          class="px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          style="background: linear-gradient(135deg, #2E64FE 0%, #00B4D8 100%);"
        >
          + Create Questionnaire
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <i class="pi pi-spinner pi-spin text-3xl" style="color: #666;"></i>
    </div>

    <div v-else-if="questionnaires.length === 0" class="text-center py-12">
      <div class="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full" style="background: rgba(46, 100, 254, 0.1);">
        <i class="pi pi-file-text text-4xl" style="color: #2E64FE;"></i>
      </div>
      <h2 class="text-xl font-bold mb-2" style="color: #212121;">No Questionnaires Found</h2>
      <p style="color: #666;">Create your first questionnaire to get started.</p>
    </div>

    <div v-else class="rounded-2xl overflow-hidden" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);">
      <!-- Table Header -->
      <div class="grid grid-cols-12 gap-4 px-6 py-4" style="background: rgba(46, 100, 254, 0.05); border-bottom: 2px solid #E0F2F7;">
        <div class="col-span-3 flex items-center space-x-2 cursor-pointer hover:opacity-80" @click="handleSort('title')">
          <span class="text-sm font-bold" style="color: #212121;">Title</span>
          <i :class="['pi', getSortIcon('title'), 'text-xs']" style="color: #666;"></i>
        </div>
        <div class="col-span-2 flex items-center space-x-2 cursor-pointer hover:opacity-80" @click="handleSort('is_active')">
          <span class="text-sm font-bold" style="color: #212121;">Status</span>
          <i :class="['pi', getSortIcon('is_active'), 'text-xs']" style="color: #666;"></i>
        </div>
        <div class="col-span-2 flex items-center space-x-2 cursor-pointer hover:opacity-80" @click="handleSort('created_at')">
          <span class="text-sm font-bold" style="color: #212121;">Created</span>
          <i :class="['pi', getSortIcon('created_at'), 'text-xs']" style="color: #666;"></i>
        </div>
        <div class="col-span-2 flex items-center space-x-2">
          <span class="text-sm font-bold" style="color: #212121;">Questions</span>
        </div>
        <div class="col-span-2 flex items-center space-x-2">
          <span class="text-sm font-bold" style="color: #212121;">Creator</span>
        </div>
        <div class="col-span-1 flex items-center justify-end">
          <span class="text-sm font-bold" style="color: #212121;">Actions</span>
        </div>
      </div>

      <!-- Table Body -->
      <div class="divide-y" style="border-color: #E0F2F7;">
        <div
          v-for="questionnaire in sortedQuestionnaires"
          :key="questionnaire.id"
          class="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-300 hover:bg-blue-50"
        >
          <!-- Title -->
          <div class="col-span-3">
            <h3 class="text-sm font-bold mb-1" style="color: #212121;">{{ questionnaire.title }}</h3>
            <p v-if="questionnaire.description" class="text-xs line-clamp-1" style="color: #666;">{{ questionnaire.description }}</p>
          </div>

          <!-- Status -->
          <div class="col-span-2">
            <div class="px-3 py-1 rounded-full text-xs font-bold inline-block" :style="{ background: questionnaire.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)', color: questionnaire.is_active ? '#10B981' : '#9CA3AF' }">
              {{ questionnaire.is_active ? 'Active' : 'Inactive' }}
            </div>
          </div>

          <!-- Created Date -->
          <div class="col-span-2">
            <span class="text-sm" style="color: #666;">{{ new Date(questionnaire.created_at).toLocaleDateString() }}</span>
          </div>

          <!-- Questions Count -->
          <div class="col-span-2">
            <div class="flex items-center space-x-2">
              <i class="pi pi-list text-xs" style="color: #2E64FE;"></i>
              <span class="text-sm font-bold" style="color: #212121;">{{ getQuestionCount(questionnaire) }}</span>
            </div>
          </div>

          <!-- Creator -->
          <div class="col-span-2">
            <div v-if="questionnaire.creator" class="flex items-center space-x-2">
              <div class="w-6 h-6 flex items-center justify-center rounded-full text-white font-semibold text-xs" style="background: linear-gradient(135deg, #2E64FE 0%, #00B4D8 100%);">
                {{ questionnaire.creator.name?.charAt(0) || 'U' }}
              </div>
              <span class="text-sm" style="color: #666;">{{ questionnaire.creator.name }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="col-span-1 flex items-center justify-end space-x-1">
            <button
              @click="editQuestionnaire(questionnaire.id)"
              class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 hover:shadow-lg"
              style="background: rgba(46, 100, 254, 0.1); color: #2E64FE;"
              title="Edit"
            >
              <i class="pi pi-pencil text-xs"></i>
            </button>
            <button
              @click="toggleStatus(questionnaire.id, questionnaire.is_active)"
              class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 hover:shadow-lg"
              :style="{
                background: questionnaire.is_active ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: questionnaire.is_active ? '#F59E0B' : '#10B981'
              }"
              :title="questionnaire.is_active ? 'Deactivate' : 'Activate'"
            >
              <i :class="['pi', questionnaire.is_active ? 'pi-pause' : 'pi-play', 'text-xs']"></i>
            </button>
            <button
              @click="deleteQuestionnaire(questionnaire.id)"
              class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 hover:shadow-lg"
              style="background: rgba(220, 38, 38, 0.1); color: #DC2626;"
              title="Delete"
            >
              <i class="pi pi-trash text-xs"></i>
            </button>
          </div>
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

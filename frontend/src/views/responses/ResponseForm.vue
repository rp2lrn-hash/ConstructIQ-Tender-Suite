<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const questionnaire = ref(null)
const response = ref(null)
const assignment = ref(null)
const answers = ref({})
const loading = ref(true)
const saving = ref(false)
const autoSaving = ref(false)
const progress = ref(0)
const isAssignmentMode = ref(false)

const fetchAssignment = async () => {
  try {
    const response_data = await api.get(`/assignments/${route.params.assignmentId}`)
    assignment.value = response_data.data
    isAssignmentMode.value = true
    await fetchQuestionnaire(assignment.value.questionnaire.id)
  } catch (error) {
    console.error('Failed to fetch assignment:', error)
    alert('Failed to load assignment')
    router.push('/responses')
  } finally {
    loading.value = false
  }
}

const fetchQuestionnaire = async (questionnaireId = null) => {
  try {
    const id = questionnaireId || route.params.questionnaireId
    const response_data = await api.get(`/questionnaires/${id}`)
    questionnaire.value = response_data.data

    // Initialize answers object
    const qs = questionnaire.value.questions || questionnaire.value.Questions || []
    qs.forEach(q => {
      answers.value[q.id] = {
        question_id: q.id,
        answer_text: '',
        answer_value: null,
        file_path: null
      }
    })

    // Check if there's an existing response
    if (route.params.responseId) {
      await fetchExistingResponse()
    }
  } catch (error) {
    console.error('Failed to fetch questionnaire:', error)
    alert('Failed to load questionnaire')
    router.push('/responses')
  } finally {
    loading.value = false
  }
}

const fetchExistingResponse = async () => {
  try {
    const response_data = await api.get(`/responses/${route.params.responseId}`)
    response.value = response_data.data

    // Populate answers
    if (response.value.AnswerDetails) {
      response.value.AnswerDetails.forEach(ad => {
        answers.value[ad.question_id] = {
          question_id: ad.question_id,
          answer_text: ad.answer_text || '',
          answer_value: ad.answer_value || null,
          file_path: ad.file_path || null
        }
      })
    }
  } catch (error) {
    console.error('Failed to fetch existing response:', error)
  }
}

const calculateProgress = () => {
  if (!questionnaire.value) return 0
  const qs = questionnaire.value.questions || questionnaire.value.Questions || []
  const totalQuestions = qs.length
  const answeredQuestions = Object.values(answers.value).filter(a => {
    return a.answer_text || (a.answer_value && a.answer_value.length > 0) || a.file_path
  }).length
  progress.value = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0
}

const canSubmit = computed(() => {
  if (!questionnaire.value) return false
  const requiredQuestions = (questionnaire.value.questions || questionnaire.value.Questions || []).filter(q => q.is_required)
  for (const q of requiredQuestions) {
    const answer = answers.value[q.id]
    if (!answer || (!answer.answer_text && !answer.answer_value && !answer.file_path)) {
      return false
    }
  }
  return true
})

const handleFileUpload = async (questionId, event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response_data = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    answers.value[questionId].file_path = response_data.data.file_path
    calculateProgress()
    autoSave()
  } catch (error) {
    console.error('Failed to upload file:', error)
    alert('Failed to upload file')
  }
}

const autoSave = async () => {
  if (autoSaving.value) return
  autoSaving.value = true

  try {
    const payload = {
      questionnaire_id: questionnaire.value.id,
      answers: Object.values(answers.value),
      ...(isAssignmentMode.value && assignment.value ? { assignment_id: assignment.value.id } : {})
    }

    if (response.value) {
      await api.put(`/responses/${response.value.id}`, payload)
    } else {
      const newResponse = await api.post('/responses', payload)
      response.value = newResponse.data
    }
  } catch (error) {
    console.error('Auto-save failed:', error)
  } finally {
    autoSaving.value = false
  }
}

const saveAndContinue = async () => {
  saving.value = true
  try {
    await autoSave()
    alert('Progress saved successfully')
  } catch (error) {
    console.error('Failed to save:', error)
    alert('Failed to save progress')
  } finally {
    saving.value = false
  }
}

const submitResponse = async () => {
  if (!canSubmit.value) {
    alert('Please fill in all required fields before submitting')
    return
  }

  if (!confirm('Are you sure you want to submit this response? You cannot edit it after submission.')) {
    return
  }

  saving.value = true
  try {
    const payload = {
      questionnaire_id: questionnaire.value.id,
      answers: Object.values(answers.value),
      status: 'completed'
    }

    // If in assignment mode, link to assignment
    if (isAssignmentMode.value && assignment.value) {
      payload.assignment_id = assignment.value.id
    }

    if (response.value) {
      await api.put(`/responses/${response.value.id}`, payload)
    } else {
      const newResponse = await api.post('/responses', payload)
      response.value = newResponse.data
    }

    // Update assignment status if in assignment mode
    if (isAssignmentMode.value && assignment.value) {
      await api.patch(`/assignments/${assignment.value.id}/status`, { status: 'completed' })
    }

    alert('Response submitted successfully!')
    router.push('/responses')
  } catch (error) {
    console.error('Failed to submit response:', error)
    const msg = error.response?.data?.error || error.response?.data?.message || error.message || 'Unknown error'
    alert(`Failed to submit response: ${msg}`)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (route.params.assignmentId) {
    fetchAssignment()
  } else {
    fetchQuestionnaire()
  }
})

const cancel = () => {
  if (confirm('Are you sure you want to cancel? Your progress will be lost.')) {
    router.push('/responses')
  }
}
</script>

<template>
  <div style="font-family: 'Montserrat', sans-serif;">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <i class="pi pi-spinner pi-spin text-3xl" style="color: #666;"></i>
    </div>

    <div v-else-if="questionnaire" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold" style="color: #212121;">{{ questionnaire.title }}</h1>
          <p v-if="questionnaire.description" style="color: #666;">{{ questionnaire.description }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-2 px-4 py-2 rounded-xl" style="background: rgba(46, 100, 254, 0.1);">
            <i class="pi pi-chart-bar" style="color: #2E64FE;"></i>
            <span class="text-sm font-bold" style="color: #2E64FE;">{{ progress }}% Complete</span>
          </div>
          <div v-if="autoSaving" class="flex items-center space-x-2 text-sm" style="color: #666;">
            <i class="pi pi-spinner pi-spin"></i>
            <span>Auto-saving...</span>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="h-2 rounded-full overflow-hidden" style="background: #E0F2F7;">
        <div class="h-full rounded-full transition-all duration-300" :style="{ width: `${progress}%`, background: 'linear-gradient(135deg, #2E64FE 0%, #00B4D8 100%)' }"></div>
      </div>

      <!-- Questions -->
      <div class="space-y-6">
        <div
          v-for="question in (questionnaire.questions || questionnaire.Questions || [])"
          :key="question.id"
          class="p-6 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105"
          style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);"
        >
          <label class="text-sm font-bold mb-3 block" style="color: #212121;">
            {{ question.question_text }}
            <span v-if="question.is_required" style="color: #DC2626;">*</span>
          </label>

          <!-- Text input -->
          <input
            v-if="question.question_type === 'text'"
            v-model="answers[question.id].answer_text"
            @input="calculateProgress(); autoSave()"
            type="text"
            class="w-full px-4 py-3 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif;"
            placeholder="Enter your answer"
          />

          <!-- Textarea -->
          <textarea
            v-else-if="question.question_type === 'textarea'"
            v-model="answers[question.id].answer_text"
            @input="calculateProgress(); autoSave()"
            rows="4"
            class="w-full px-4 py-3 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif; resize: none;"
            placeholder="Enter your answer"
          ></textarea>

          <!-- Radio buttons -->
          <div v-else-if="question.question_type === 'radio'" class="space-y-2">
            <div v-for="(option, index) in question.options" :key="index" class="flex items-center">
              <input
                v-model="answers[question.id].answer_text"
                @change="calculateProgress(); autoSave()"
                type="radio"
                :id="`radio-${question.id}-${index}`"
                :value="option"
                class="mr-2"
              />
              <label :for="`radio-${question.id}-${index}`" class="text-sm" style="color: #666;">{{ option }}</label>
            </div>
          </div>

          <!-- Checkboxes -->
          <div v-else-if="question.question_type === 'checkbox'" class="space-y-2">
            <div v-for="(option, index) in question.options" :key="index" class="flex items-center">
              <input
                v-model="answers[question.id].answer_value"
                @change="calculateProgress(); autoSave()"
                type="checkbox"
                :id="`checkbox-${question.id}-${index}`"
                :value="option"
                class="mr-2"
              />
              <label :for="`checkbox-${question.id}-${index}`" class="text-sm" style="color: #666;">{{ option }}</label>
            </div>
          </div>

          <!-- Dropdown -->
          <select
            v-else-if="question.question_type === 'dropdown'"
            v-model="answers[question.id].answer_text"
            @change="calculateProgress(); autoSave()"
            class="w-full px-4 py-3 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif;"
          >
            <option value="">Select an option</option>
            <option v-for="(option, index) in question.options" :key="index" :value="option">
              {{ option }}
            </option>
          </select>

          <!-- Date -->
          <input
            v-else-if="question.question_type === 'date'"
            v-model="answers[question.id].answer_text"
            @change="calculateProgress(); autoSave()"
            type="date"
            class="w-full px-4 py-3 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif;"
          />

          <!-- Number -->
          <input
            v-else-if="question.question_type === 'number'"
            v-model="answers[question.id].answer_text"
            @input="calculateProgress(); autoSave()"
            type="number"
            class="w-full px-4 py-3 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif;"
            placeholder="Enter number"
          />

          <!-- File upload -->
          <div v-else-if="question.question_type === 'file_upload'" class="p-4 rounded-xl text-center" style="background: rgba(46, 100, 254, 0.05); border: 2px dashed #E0F2F7;">
            <input
              type="file"
              :id="`file-${question.id}`"
              @change="handleFileUpload(question.id, $event)"
              class="hidden"
            />
            <label :for="`file-${question.id}`" class="cursor-pointer">
              <i class="pi pi-upload text-2xl mb-2" style="color: #2E64FE;"></i>
              <p class="text-sm" style="color: #666;">Click to upload file</p>
              <p v-if="answers[question.id].file_path" class="text-xs mt-2" style="color: #10B981;">
                File uploaded successfully
              </p>
            </label>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end space-x-3 pt-6" style="border-top: 1.5px solid #E0F2F7;">
        <button
          @click="cancel"
          class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          style="background: white; border: 2px solid #E0F2F7; color: #212121;"
        >
          Cancel
        </button>
        <button
          @click="saveAndContinue"
          :disabled="saving"
          class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          style="background: white; border: 2px solid #E0F2F7; color: #212121;"
        >
          {{ saving ? 'Saving...' : 'Save & Continue Later' }}
        </button>
        <button
          @click="submitResponse"
          :disabled="!canSubmit || saving"
          class="px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          :style="{
            background: canSubmit ? 'linear-gradient(135deg, #2E64FE 0%, #00B4D8 100%)' : '#9CA3AF',
            cursor: canSubmit ? 'pointer' : 'not-allowed'
          }"
        >
          {{ saving ? 'Submitting...' : 'Submit Response' }}
        </button>
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

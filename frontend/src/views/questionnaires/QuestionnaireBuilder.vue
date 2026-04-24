<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const questionnaire = ref({
  title: '',
  description: '',
  customer_id: null,
  project_id: null,
  is_active: true
})

const questions = ref([])
const loading = ref(false)
const saving = ref(false)
const previewMode = ref(false)
const isEditMode = ref(false)

// Assignment fields
const assignToUser = ref(null)
const dueDate = ref('')
const assignmentNotes = ref('')
const availableUsers = ref([])
const loadingUsers = ref(false)

const questionTypes = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'radio', label: 'Radio Button' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
  { value: 'file_upload', label: 'File Upload' }
]

const fetchQuestionnaire = async () => {
  const id = route.params.id
  if (!id) return

  loading.value = true
  isEditMode.value = true
  try {
    const response = await api.get(`/questionnaires/${id}`)
    const data = response.data
    
    questionnaire.value = {
      title: data.title,
      description: data.description,
      customer_id: data.customer_id,
      project_id: data.project_id,
      is_active: data.is_active
    }
    
    if (data.questions && data.questions.length > 0) {
      questions.value = data.questions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options || [],
        is_required: q.is_required,
        order_index: q.order_index
      }))
    }
  } catch (error) {
    console.error('Failed to fetch questionnaire:', error)
    alert('Failed to load questionnaire')
  } finally {
    loading.value = false
  }
}

const fetchUsers = async () => {
  loadingUsers.value = true
  console.log('Fetching users for assignment...')
  try {
    const response = await api.get('/assignments/users')
    console.log('Users fetched:', response.data)
    availableUsers.value = response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    console.error('Error response:', error.response?.data)
  } finally {
    loadingUsers.value = false
  }
}

const createAssignment = async (questionnaireId) => {
  if (!assignToUser.value) return

  try {
    await api.post('/assignments', {
      questionnaire_id: questionnaireId,
      assigned_to: assignToUser.value,
      due_date: dueDate.value || null,
      notes: assignmentNotes.value || null
    })
    // Reset assignment fields
    assignToUser.value = null
    dueDate.value = ''
    assignmentNotes.value = ''
  } catch (error) {
    console.error('Failed to create assignment:', error)
    alert('Failed to assign questionnaire')
  }
}

onMounted(() => {
  fetchQuestionnaire()
  fetchUsers()
})

const addQuestion = () => {
  questions.value.push({
    id: Date.now(),
    question_text: '',
    question_type: 'text',
    options: [],
    is_required: false,
    order_index: questions.value.length
  })
}

const removeQuestion = (index) => {
  questions.value.splice(index, 1)
  // Update order indices
  questions.value.forEach((q, i) => q.order_index = i)
}

const addOption = (question) => {
  if (!question.options) question.options = []
  question.options.push('')
}

const removeOption = (question, optionIndex) => {
  question.options.splice(optionIndex, 1)
}

const moveQuestionUp = (index) => {
  if (index > 0) {
    const temp = questions.value[index]
    questions.value[index] = questions.value[index - 1]
    questions.value[index - 1] = temp
    questions.value.forEach((q, i) => q.order_index = i)
  }
}

const moveQuestionDown = (index) => {
  if (index < questions.value.length - 1) {
    const temp = questions.value[index]
    questions.value[index] = questions.value[index + 1]
    questions.value[index + 1] = temp
    questions.value.forEach((q, i) => q.order_index = i)
  }
}

const saveQuestionnaire = async () => {
  saving.value = true
  try {
    const payload = {
      ...questionnaire.value,
      questions: questions.value.map(q => ({
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options && q.options.length > 0 ? q.options : null,
        is_required: q.is_required,
        order_index: q.order_index
      }))
    }

    console.log('Saving questionnaire with payload:', payload)
    
    let questionnaireId
    if (isEditMode.value) {
      const id = route.params.id
      const response = await api.put(`/questionnaires/${id}`, payload)
      console.log('Update response:', response.data)
      questionnaireId = id
    } else {
      const response = await api.post('/questionnaires', payload)
      console.log('Save response:', response.data)
      questionnaireId = response.data.id
    }
    
    // Create assignment if user is selected
    if (assignToUser.value) {
      await createAssignment(questionnaireId)
    }
    
    router.push('/questionnaires')
  } catch (error) {
    console.error('Failed to save questionnaire:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    alert(`Failed to save questionnaire. ${error.response?.data?.error || error.message || 'Please try again.'}`)
  } finally {
    saving.value = false
  }
}

const togglePreview = () => {
  previewMode.value = !previewMode.value
}

const cancel = () => {
  router.push('/questionnaires')
}
</script>

<template>
  <div style="font-family: 'Montserrat', sans-serif;">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold" style="color: #212121;">{{ isEditMode ? 'Edit Questionnaire' : 'Questionnaire Builder' }}</h1>
        <p style="color: #666;">{{ isEditMode ? 'Update questionnaire details and questions' : 'Create and manage questionnaires' }}</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="togglePreview"
          class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          style="background: white; border: 2px solid #E0F2F7; color: #212121;"
        >
          {{ previewMode ? 'Edit Mode' : 'Preview Mode' }}
        </button>
        <button
          @click="cancel"
          class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          style="background: white; border: 2px solid #E0F2F7; color: #212121;"
        >
          Cancel
        </button>
        <button
          @click="saveQuestionnaire"
          :disabled="saving"
          class="px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          style="background: linear-gradient(135deg, #2E64FE 0%, #00B4D8 100%);"
        >
          {{ saving ? 'Saving...' : 'Save Questionnaire' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <i class="pi pi-spinner pi-spin text-3xl" style="color: #666;"></i>
    </div>

    <div v-else class="space-y-6">
      <!-- Questionnaire Details -->
      <div class="p-6 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);">
        <h3 class="text-lg font-bold mb-4" style="color: #212121;">Questionnaire Details</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-2" style="color: #212121;">Title *</label>
            <input
              v-model="questionnaire.title"
              type="text"
              class="w-full px-4 py-3 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
              style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif;"
              placeholder="Enter questionnaire title"
            />
          </div>
          <div>
            <label class="block text-sm font-bold mb-2" style="color: #212121;">Description</label>
            <textarea
              v-model="questionnaire.description"
              rows="3"
              class="w-full px-4 py-3 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
              style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif; resize: none;"
              placeholder="Enter questionnaire description"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Assignment Section -->
      <div class="p-6 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);">
        <h3 class="text-lg font-bold mb-4" style="color: #212121;">Assign to User (Optional)</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-2" style="color: #212121;">Assign To</label>
            <select
              v-model="assignToUser"
              class="w-full px-4 py-3 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
              style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif;"
            >
              <option value="">Select a user to assign...</option>
              <option v-if="loadingUsers" disabled>Loading users...</option>
              <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold mb-2" style="color: #212121;">Due Date (Optional)</label>
            <input
              v-model="dueDate"
              type="date"
              class="w-full px-4 py-3 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
              style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif;"
            />
          </div>
          <div>
            <label class="block text-sm font-bold mb-2" style="color: #212121;">Assignment Notes (Optional)</label>
            <textarea
              v-model="assignmentNotes"
              rows="2"
              class="w-full px-4 py-3 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
              style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif; resize: none;"
              placeholder="Add any notes for the assignee..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Questions Section -->
      <div v-if="!previewMode">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold" style="color: #212121;">Questions</h3>
          <button
            @click="addQuestion"
            class="px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            style="background: linear-gradient(135deg, #2E64FE 0%, #00B4D8 100%);"
          >
            + Add Question
          </button>
        </div>

        <div v-if="questions.length === 0" class="text-center py-12" style="color: #666;">
          <i class="pi pi-question-circle text-4xl mb-4" style="color: #2E64FE;"></i>
          <p>No questions added yet. Click "Add Question" to get started.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(question, index) in questions"
            :key="question.id"
            class="p-6 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105 relative"
            style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);"
          >
            <div class="flex items-start justify-between mb-4">
              <span class="text-sm font-bold" style="color: #2E64FE;">Question {{ index + 1 }}</span>
              <div class="flex items-center space-x-2">
                <button
                  @click="moveQuestionUp(index)"
                  :disabled="index === 0"
                  class="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style="background: rgba(46, 100, 254, 0.1);"
                >
                  <i class="pi pi-arrow-up" style="color: #2E64FE;"></i>
                </button>
                <button
                  @click="moveQuestionDown(index)"
                  :disabled="index === questions.length - 1"
                  class="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style="background: rgba(46, 100, 254, 0.1);"
                >
                  <i class="pi pi-arrow-down" style="color: #2E64FE;"></i>
                </button>
                <button
                  @click="removeQuestion(index)"
                  class="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style="background: rgba(220, 38, 38, 0.1);"
                >
                  <i class="pi pi-trash" style="color: #DC2626;"></i>
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-bold mb-2" style="color: #212121;">Question Text *</label>
                <input
                  v-model="question.question_text"
                  type="text"
                  class="w-full px-4 py-3 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
                  style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif;"
                  placeholder="Enter your question"
                />
              </div>

              <div>
                <label class="block text-sm font-bold mb-2" style="color: #212121;">Question Type</label>
                <select
                  v-model="question.question_type"
                  class="w-full px-4 py-3 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
                  style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif;"
                >
                  <option v-for="type in questionTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>

              <div v-if="['radio', 'checkbox', 'dropdown'].includes(question.question_type)">
                <label class="block text-sm font-bold mb-2" style="color: #212121;">Options</label>
                <div class="space-y-2">
                  <div v-for="(option, optIndex) in question.options" :key="optIndex" class="flex items-center space-x-2">
                    <input
                      v-model="question.options[optIndex]"
                      type="text"
                      class="flex-1 px-4 py-2 text-sm focus:outline-none transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
                      style="background: white; border: 2px solid #E0F2F7; font-family: 'Open Sans', sans-serif;"
                      placeholder="Option text"
                    />
                    <button
                      @click="removeOption(question, optIndex)"
                      class="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                      style="background: rgba(220, 38, 38, 0.1);"
                    >
                      <i class="pi pi-times" style="color: #DC2626;"></i>
                    </button>
                  </div>
                  <button
                    @click="addOption(question)"
                    class="text-sm font-bold transition-all duration-200 hover:scale-105"
                    style="color: #2E64FE;"
                  >
                    + Add Option
                  </button>
                </div>
              </div>

              <div class="flex items-center">
                <input
                  v-model="question.is_required"
                  type="checkbox"
                  id="required-{{ index }}"
                  class="mr-2"
                />
                <label :for="'required-' + index" class="text-sm font-bold" style="color: #212121;">Required field</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Mode -->
      <div v-else>
        <h3 class="text-lg font-bold mb-4" style="color: #212121;">Preview</h3>
        <div class="p-6 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);">
          <h2 class="text-xl font-bold mb-2" style="color: #212121;">{{ questionnaire.title || 'Untitled Questionnaire' }}</h2>
          <p v-if="questionnaire.description" class="mb-6" style="color: #666;">{{ questionnaire.description }}</p>

          <div v-if="questions.length === 0" class="text-center py-8" style="color: #666;">
            <p>No questions to preview</p>
          </div>

          <div v-else class="space-y-6">
            <div v-for="(question, index) in questions" :key="question.id" class="space-y-2">
              <label class="text-sm font-bold" style="color: #212121;">
                {{ question.question_text }}
                <span v-if="question.is_required" style="color: #DC2626;">*</span>
              </label>
              
              <!-- Text input -->
              <input
                v-if="question.question_type === 'text'"
                type="text"
                disabled
                class="w-full px-4 py-3 text-sm rounded-xl"
                style="background: rgba(46, 100, 254, 0.05); border: 2px solid #E0F2F7;"
                placeholder="Your answer"
              />

              <!-- Textarea -->
              <textarea
                v-else-if="question.question_type === 'textarea'"
                disabled
                rows="3"
                class="w-full px-4 py-3 text-sm rounded-xl"
                style="background: rgba(46, 100, 254, 0.05); border: 2px solid #E0F2F7; resize: none;"
                placeholder="Your answer"
              ></textarea>

              <!-- Radio buttons -->
              <div v-else-if="question.question_type === 'radio'" class="space-y-2">
                <div v-for="(option, optIndex) in question.options" :key="optIndex" class="flex items-center">
                  <input type="radio" disabled class="mr-2" />
                  <span class="text-sm" style="color: #666;">{{ option }}</span>
                </div>
              </div>

              <!-- Checkboxes -->
              <div v-else-if="question.question_type === 'checkbox'" class="space-y-2">
                <div v-for="(option, optIndex) in question.options" :key="optIndex" class="flex items-center">
                  <input type="checkbox" disabled class="mr-2" />
                  <span class="text-sm" style="color: #666;">{{ option }}</span>
                </div>
              </div>

              <!-- Dropdown -->
              <select
                v-else-if="question.question_type === 'dropdown'"
                disabled
                class="w-full px-4 py-3 text-sm rounded-xl"
                style="background: rgba(46, 100, 254, 0.05); border: 2px solid #E0F2F7;"
              >
                <option value="">Select an option</option>
                <option v-for="(option, optIndex) in question.options" :key="optIndex" :value="option">
                  {{ option }}
                </option>
              </select>

              <!-- Date -->
              <input
                v-else-if="question.question_type === 'date'"
                type="date"
                disabled
                class="w-full px-4 py-3 text-sm rounded-xl"
                style="background: rgba(46, 100, 254, 0.05); border: 2px solid #E0F2F7;"
              />

              <!-- Number -->
              <input
                v-else-if="question.question_type === 'number'"
                type="number"
                disabled
                class="w-full px-4 py-3 text-sm rounded-xl"
                style="background: rgba(46, 100, 254, 0.05); border: 2px solid #E0F2F7;"
                placeholder="Enter number"
              />

              <!-- File upload -->
              <div v-else-if="question.question_type === 'file_upload'" class="p-4 rounded-xl text-center" style="background: rgba(46, 100, 254, 0.05); border: 2px dashed #E0F2F7;">
                <i class="pi pi-upload text-2xl mb-2" style="color: #2E64FE;"></i>
                <p class="text-sm" style="color: #666;">Click to upload file</p>
              </div>
            </div>
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

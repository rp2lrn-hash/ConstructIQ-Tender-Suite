<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const isEdit = ref(false)

const formData = ref({
  title: '',
  description: '',
  category: '',
  budget_range_min: '',
  budget_range_max: '',
  deadline: '',
  submission_deadline: '',
  requirements: [],
  evaluation_criteria: {
    technical: 0.5,
    financial: 0.3,
    compliance: 0.2
  }
})

const categories = ['Construction', 'Technology', 'Materials', 'Services', 'Consulting']

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isEdit.value) {
      await api.put(`/tenders/${route.params.id}`, formData.value)
    } else {
      await api.post('/tenders', formData.value)
    }
    router.push('/tenders')
  } catch (error) {
    console.error('Failed to save tender:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.params.id) {
    isEdit.value = true
  }
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ isEdit ? 'Edit Tender' : 'Create Tender' }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ isEdit ? 'Update tender details' : 'Create a new tender opportunity' }}
      </p>
    </div>

    <Card>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <InputText v-model="formData.title" class="w-full" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <Textarea v-model="formData.description" class="w-full" rows="4" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <Dropdown
            v-model="formData.category"
            :options="categories"
            class="w-full"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget Min
            </label>
            <InputNumber v-model="formData.budget_range_min" class="w-full" mode="currency" currency="USD" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget Max
            </label>
            <InputNumber v-model="formData.budget_range_max" class="w-full" mode="currency" currency="USD" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deadline
            </label>
            <Calendar v-model="formData.deadline" class="w-full" showTime />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Submission Deadline
            </label>
            <Calendar v-model="formData.submission_deadline" class="w-full" showTime />
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <Button label="Cancel" severity="secondary" @click="router.push('/tenders')" />
          <Button type="submit" label="Save" :loading="loading" />
        </div>
      </form>
    </Card>
  </div>
</template>

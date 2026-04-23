<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

const tender = ref(null)
const loading = ref(true)

const fetchTender = async () => {
  try {
    const response = await api.get(`/tenders/${route.params.id}`)
    tender.value = response.data
  } catch (error) {
    console.error('Failed to fetch tender:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTender()
})
</script>

<template>
  <div>
    <div class="mb-8">
      <Button label="Back" icon="pi pi-arrow-left" text @click="router.push('/tenders')" class="mb-4" />
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tender Details</h1>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <Card v-else-if="tender">
      <template #title>{{ tender.title }}</template>
      <template #subtitle>{{ tender.category }}</template>

      <div class="space-y-4">
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Description</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ tender.description }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Budget Range</h3>
            <p class="text-gray-600 dark:text-gray-400">
              ${{ tender.budget_range_min?.toLocaleString() }} - ${{ tender.budget_range_max?.toLocaleString() }}
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Status</h3>
            <Tag :value="tender.status" :severity="tender.status === 'published' ? 'success' : 'info'" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Deadline</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ new Date(tender.deadline).toLocaleString() }}</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Submission Deadline</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ new Date(tender.submission_deadline).toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

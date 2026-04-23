<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

const evaluation = ref(null)
const loading = ref(true)

const fetchEvaluation = async () => {
  try {
    const response = await api.get(`/evaluations/${route.params.id}`)
    evaluation.value = response.data
  } catch (error) {
    console.error('Failed to fetch evaluation:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEvaluation()
})
</script>

<template>
  <div>
    <div class="mb-8">
      <Button label="Back" icon="pi pi-arrow-left" text @click="router.push('/evaluations')" class="mb-4" />
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Evaluation Details</h1>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <Card v-else-if="evaluation">
      <template #title>Evaluation for Bid #{{ evaluation.bid?.id?.substring(0, 8) }}</template>

      <div class="space-y-4">
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Vendor</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ evaluation.bid?.vendor?.name }}</p>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Technical Score</h3>
            <p class="text-2xl font-bold text-primary-600">{{ evaluation.technical_score }}/100</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Financial Score</h3>
            <p class="text-2xl font-bold text-primary-600">{{ evaluation.financial_score }}/100</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Compliance Score</h3>
            <p class="text-2xl font-bold text-primary-600">{{ evaluation.compliance_score }}/100</p>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Weighted Score</h3>
          <p class="text-3xl font-bold text-green-600">{{ evaluation.weighted_score }}/100</p>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Recommendation</h3>
          <Tag
            :value="evaluation.recommendation"
            :severity="evaluation.recommendation === 'recommended' ? 'success' : 'warning'"
            class="text-lg"
          />
        </div>

        <div v-if="evaluation.comments">
          <h3 class="font-semibold text-gray-900 dark:text-white">Comments</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ evaluation.comments }}</p>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Evaluation Date</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ new Date(evaluation.evaluation_date).toLocaleString() }}</p>
        </div>
      </div>
    </Card>
  </div>
</template>

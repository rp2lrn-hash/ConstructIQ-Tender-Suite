<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

const contract = ref(null)
const loading = ref(true)

const fetchContract = async () => {
  try {
    const response = await api.get(`/contracts/${route.params.id}`)
    contract.value = response.data
  } catch (error) {
    console.error('Failed to fetch contract:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchContract()
})
</script>

<template>
  <div>
    <div class="mb-8">
      <Button label="Back" icon="pi pi-arrow-left" text @click="router.push('/contracts')" class="mb-4" />
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Contract Details</h1>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <Card v-else-if="contract">
      <template #title>{{ contract.contract_number }}</template>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Tender</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ contract.tender?.title }}</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Vendor</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ contract.vendor?.name }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Contract Value</h3>
            <p class="text-2xl font-bold text-green-600">${{ contract.contract_value?.toLocaleString() }}</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Status</h3>
            <Tag
              :value="contract.status"
              :severity="contract.status === 'active' ? 'success' : 'info'"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Start Date</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ new Date(contract.start_date).toLocaleDateString() }}</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">End Date</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ new Date(contract.end_date).toLocaleDateString() }}</p>
          </div>
        </div>

        <div v-if="contract.signed_date">
          <h3 class="font-semibold text-gray-900 dark:text-white">Signed Date</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ new Date(contract.signed_date).toLocaleDateString() }}</p>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Terms</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ contract.terms }}</p>
        </div>

        <div v-if="contract.payment_terms">
          <h3 class="font-semibold text-gray-900 dark:text-white">Payment Terms</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ contract.payment_terms }}</p>
        </div>

        <div v-if="contract.deliverables && contract.deliverables.length">
          <h3 class="font-semibold text-gray-900 dark:text-white">Deliverables</h3>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-400">
            <li v-for="deliverable in contract.deliverables" :key="deliverable">{{ deliverable }}</li>
          </ul>
        </div>
      </div>
    </Card>
  </div>
</template>

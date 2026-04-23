<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

const bid = ref(null)
const loading = ref(true)

const fetchBid = async () => {
  try {
    const response = await api.get(`/bids/${route.params.id}`)
    bid.value = response.data
  } catch (error) {
    console.error('Failed to fetch bid:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBid()
})
</script>

<template>
  <div>
    <div class="mb-8">
      <Button label="Back" icon="pi pi-arrow-left" text @click="router.push('/bids')" class="mb-4" />
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Bid Details</h1>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <Card v-else-if="bid">
      <template #title>Bid #{{ bid.id.substring(0, 8) }}</template>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Tender</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ bid.tender?.title }}</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Vendor</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ bid.vendor?.name }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Total Amount</h3>
            <p class="text-gray-600 dark:text-gray-400">${{ bid.total_bid_amount?.toLocaleString() }}</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Status</h3>
            <Tag
              :value="bid.status"
              :severity="bid.status === 'accepted' ? 'success' : bid.status === 'rejected' ? 'danger' : 'info'"
            />
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Submission Date</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ new Date(bid.submission_date).toLocaleString() }}</p>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Technical Proposal</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ bid.technical_proposal }}</p>
        </div>

        <div v-if="bid.submission_notes">
          <h3 class="font-semibold text-gray-900 dark:text-white">Submission Notes</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ bid.submission_notes }}</p>
        </div>
      </div>
    </Card>
  </div>
</template>

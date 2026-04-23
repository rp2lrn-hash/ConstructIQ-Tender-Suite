<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const loading = ref(false)
const formData = ref({
  tender_id: '',
  vendor_id: '',
  pricing_details: [],
  total_bid_amount: 0,
  technical_proposal: '',
  submission_notes: ''
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await api.post('/bids', formData.value)
    router.push('/bids')
  } catch (error) {
    console.error('Failed to submit bid:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Submit Bid</h1>
      <p class="text-gray-600 dark:text-gray-400">Submit a new bid for a tender</p>
    </div>

    <Card>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tender ID
          </label>
          <InputText v-model="formData.tender_id" class="w-full" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Vendor ID
          </label>
          <InputText v-model="formData.vendor_id" class="w-full" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Total Bid Amount
          </label>
          <InputNumber v-model="formData.total_bid_amount" class="w-full" mode="currency" currency="USD" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Technical Proposal
          </label>
          <Textarea v-model="formData.technical_proposal" class="w-full" rows="4" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Submission Notes
          </label>
          <Textarea v-model="formData.submission_notes" class="w-full" rows="3" />
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <Button label="Cancel" severity="secondary" @click="router.push('/bids')" />
          <Button type="submit" label="Submit Bid" :loading="loading" />
        </div>
      </form>
    </Card>
  </div>
</template>

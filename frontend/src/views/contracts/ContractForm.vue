<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const loading = ref(false)
const formData = ref({
  tender_id: '',
  vendor_id: '',
  terms: '',
  contract_value: 0,
  start_date: '',
  end_date: '',
  payment_terms: '',
  deliverables: []
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await api.post('/contracts', formData.value)
    router.push('/contracts')
  } catch (error) {
    console.error('Failed to create contract:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Contract</h1>
      <p class="text-gray-600 dark:text-gray-400">Create a new contract from an awarded tender</p>
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
            Contract Value
          </label>
          <InputNumber v-model="formData.contract_value" class="w-full" mode="currency" currency="USD" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Terms
          </label>
          <Textarea v-model="formData.terms" class="w-full" rows="4" required />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <Calendar v-model="formData.start_date" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <Calendar v-model="formData.end_date" class="w-full" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Terms
          </label>
          <Textarea v-model="formData.payment_terms" class="w-full" rows="3" />
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <Button label="Cancel" severity="secondary" @click="router.push('/contracts')" />
          <Button type="submit" label="Create Contract" :loading="loading" />
        </div>
      </form>
    </Card>
  </div>
</template>

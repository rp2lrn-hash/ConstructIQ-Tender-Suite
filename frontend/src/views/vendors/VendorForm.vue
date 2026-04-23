<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const loading = ref(false)
const formData = ref({
  name: '',
  license_no: '',
  certifications: [],
  contact_email: '',
  contact_phone: '',
  address: '',
  business_type: '',
  years_in_business: ''
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await api.post('/vendors', formData.value)
    router.push('/vendors')
  } catch (error) {
    console.error('Failed to create vendor:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Vendor</h1>
      <p class="text-gray-600 dark:text-gray-400">Add a new vendor to the system</p>
    </div>

    <Card>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <InputText v-model="formData.name" class="w-full" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            License No
          </label>
          <InputText v-model="formData.license_no" class="w-full" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contact Email
          </label>
          <InputText v-model="formData.contact_email" type="email" class="w-full" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contact Phone
          </label>
          <InputText v-model="formData.contact_phone" class="w-full" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Business Type
          </label>
          <InputText v-model="formData.business_type" class="w-full" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Years in Business
          </label>
          <InputNumber v-model="formData.years_in_business" class="w-full" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          <Textarea v-model="formData.address" class="w-full" rows="3" />
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <Button label="Cancel" severity="secondary" @click="router.push('/vendors')" />
          <Button type="submit" label="Save" :loading="loading" />
        </div>
      </form>
    </Card>
  </div>
</template>

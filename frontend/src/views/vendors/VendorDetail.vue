<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

const vendor = ref(null)
const loading = ref(true)

const fetchVendor = async () => {
  try {
    const response = await api.get(`/vendors/${route.params.id}`)
    vendor.value = response.data
  } catch (error) {
    console.error('Failed to fetch vendor:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchVendor()
})
</script>

<template>
  <div>
    <div class="mb-8">
      <Button label="Back" icon="pi pi-arrow-left" text @click="router.push('/vendors')" class="mb-4" />
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Vendor Details</h1>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <Card v-else-if="vendor">
      <template #title>{{ vendor.name }}</template>
      <template #subtitle>{{ vendor.business_type }}</template>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">License No</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ vendor.license_no }}</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Compliance Status</h3>
            <Tag
              :value="vendor.compliance_status"
              :severity="vendor.compliance_status === 'compliant' ? 'success' : 'warning'"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Contact Email</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ vendor.contact_email }}</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Contact Phone</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ vendor.contact_phone }}</p>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Address</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ vendor.address }}</p>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Years in Business</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ vendor.years_in_business }} years</p>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Certifications</h3>
          <div class="flex flex-wrap gap-2">
            <Tag v-for="cert in vendor.certifications" :key="cert" :value="cert" />
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

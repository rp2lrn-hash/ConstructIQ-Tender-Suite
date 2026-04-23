<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const vendors = ref([])
const loading = ref(true)

const fetchVendors = async () => {
  try {
    const response = await api.get('/vendors')
    vendors.value = response.data
  } catch (error) {
    console.error('Failed to fetch vendors:', error)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  router.push('/vendors/create')
}

const handleView = (id) => {
  router.push(`/vendors/${id}`)
}

onMounted(() => {
  fetchVendors()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Vendors</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage vendor profiles</p>
      </div>
      <Button label="Add Vendor" icon="pi pi-plus" @click="handleCreate" />
    </div>

    <Card>
      <DataTable :value="vendors" :loading="loading" stripedRows>
        <Column field="name" header="Name" />
        <Column field="license_no" header="License No" />
        <Column field="business_type" header="Business Type" />
        <Column field="contact_email" header="Contact Email" />
        <Column field="compliance_status" header="Compliance Status">
          <template #body="{ data }">
            <Tag
              :value="data.compliance_status"
              :severity="data.compliance_status === 'compliant' ? 'success' : 'warning'"
            />
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="data.status === 'active' ? 'success' : 'danger'"
            />
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <Button
              icon="pi pi-eye"
              size="small"
              @click="handleView(data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </Card>
  </div>
</template>

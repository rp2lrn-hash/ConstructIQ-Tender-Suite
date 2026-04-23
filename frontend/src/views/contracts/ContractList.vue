<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const contracts = ref([])
const loading = ref(true)

const fetchContracts = async () => {
  try {
    const response = await api.get('/contracts')
    contracts.value = response.data
  } catch (error) {
    console.error('Failed to fetch contracts:', error)
  } finally {
    loading.value = false
  }
}

const handleView = (id) => {
  router.push(`/contracts/${id}`)
}

onMounted(() => {
  fetchContracts()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Contracts</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage awarded contracts</p>
      </div>
      <Button label="Create Contract" icon="pi pi-plus" @click="router.push('/contracts/create')" />
    </div>

    <Card>
      <DataTable :value="contracts" :loading="loading" stripedRows>
        <Column field="contract_number" header="Contract Number" />
        <Column field="tender.title" header="Tender" />
        <Column field="vendor.name" header="Vendor" />
        <Column field="contract_value" header="Value">
          <template #body="{ data }">
            ${{ data.contract_value?.toLocaleString() }}
          </template>
        </Column>
        <Column field="start_date" header="Start Date">
          <template #body="{ data }">
            {{ new Date(data.start_date).toLocaleDateString() }}
          </template>
        </Column>
        <Column field="end_date" header="End Date">
          <template #body="{ data }">
            {{ new Date(data.end_date).toLocaleDateString() }}
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="data.status === 'active' ? 'success' : 'info'"
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

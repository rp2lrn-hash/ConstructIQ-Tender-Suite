<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const logs = ref([])
const loading = ref(true)
const total = ref(0)

const fetchLogs = async () => {
  try {
    const response = await api.get('/admin/audit-logs')
    logs.value = response.data.logs
    total.value = response.data.total
  } catch (error) {
    console.error('Failed to fetch audit logs:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLogs()
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
      <p class="text-gray-600 dark:text-gray-400">System activity tracking</p>
    </div>

    <Card>
      <DataTable :value="logs" :loading="loading" stripedRows>
        <Column field="timestamp" header="Timestamp">
          <template #body="{ data }">
            {{ new Date(data.timestamp).toLocaleString() }}
          </template>
        </Column>
        <Column field="action" header="Action">
          <template #body="{ data }">
            <Tag :value="data.action" severity="info" />
          </template>
        </Column>
        <Column field="entity_type" header="Entity Type" />
        <Column field="ip_address" header="IP Address" />
        <Column field="user_agent" header="User Agent">
          <template #body="{ data }">
            <span class="text-sm text-gray-500">{{ data.user_agent?.substring(0, 50) }}...</span>
          </template>
        </Column>
      </DataTable>
    </Card>
  </div>
</template>

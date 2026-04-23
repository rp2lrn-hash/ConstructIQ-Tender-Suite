<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const tenders = ref([])
const loading = ref(true)
const statusFilter = ref('')

const fetchTenders = async () => {
  try {
    const params = statusFilter.value ? { status: statusFilter.value } : {}
    const response = await api.get('/tenders', { params })
    tenders.value = response.data
  } catch (error) {
    console.error('Failed to fetch tenders:', error)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  router.push('/tenders/create')
}

const handleView = (id) => {
  router.push(`/tenders/${id}`)
}

onMounted(() => {
  fetchTenders()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tenders</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage tender opportunities</p>
      </div>
      <Button
        v-if="authStore.isEvaluator"
        label="Create Tender"
        icon="pi pi-plus"
        @click="handleCreate"
      />
    </div>

    <Card class="mb-6">
      <div class="flex items-center space-x-4">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status:</label>
        <Dropdown
          v-model="statusFilter"
          :options="['', 'draft', 'published', 'closed', 'awarded', 'cancelled']"
          option-label="label"
          placeholder="All Statuses"
          class="w-48"
          @change="fetchTenders"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value">{{ slotProps.value }}</div>
            <div v-else>All Statuses</div>
          </template>
        </Dropdown>
      </div>
    </Card>

    <Card>
      <DataTable :value="tenders" :loading="loading" stripedRows>
        <Column field="title" header="Title" />
        <Column field="category" header="Category" />
        <Column field="budget_range_min" header="Budget Min">
          <template #body="{ data }">
            ${{ data.budget_range_min?.toLocaleString() }}
          </template>
        </Column>
        <Column field="budget_range_max" header="Budget Max">
          <template #body="{ data }">
            ${{ data.budget_range_max?.toLocaleString() }}
          </template>
        </Column>
        <Column field="submission_deadline" header="Deadline">
          <template #body="{ data }">
            {{ new Date(data.submission_deadline).toLocaleDateString() }}
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="data.status === 'published' ? 'success' : data.status === 'closed' ? 'danger' : 'info'"
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

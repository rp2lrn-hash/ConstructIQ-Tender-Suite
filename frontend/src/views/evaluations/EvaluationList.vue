<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const evaluations = ref([])
const loading = ref(true)

const fetchEvaluations = async () => {
  try {
    const response = await api.get('/evaluations')
    evaluations.value = response.data
  } catch (error) {
    console.error('Failed to fetch evaluations:', error)
  } finally {
    loading.value = false
  }
}

const handleView = (id) => {
  router.push(`/evaluations/${id}`)
}

onMounted(() => {
  fetchEvaluations()
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Evaluations</h1>
      <p class="text-gray-600 dark:text-gray-400">View bid evaluations and scores</p>
    </div>

    <Card>
      <DataTable :value="evaluations" :loading="loading" stripedRows>
        <Column field="bid.id" header="Bid ID" />
        <Column field="bid.vendor.name" header="Vendor" />
        <Column field="technical_score" header="Technical Score" />
        <Column field="financial_score" header="Financial Score" />
        <Column field="compliance_score" header="Compliance Score" />
        <Column field="weighted_score" header="Weighted Score" />
        <Column field="recommendation" header="Recommendation">
          <template #body="{ data }">
            <Tag
              :value="data.recommendation"
              :severity="data.recommendation === 'recommended' ? 'success' : 'warning'"
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

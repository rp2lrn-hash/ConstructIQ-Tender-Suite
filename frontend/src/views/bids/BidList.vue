<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const bids = ref([])
const loading = ref(true)

const fetchBids = async () => {
  try {
    const response = await api.get('/bids')
    bids.value = response.data
  } catch (error) {
    console.error('Failed to fetch bids:', error)
  } finally {
    loading.value = false
  }
}

const handleView = (id) => {
  router.push(`/bids/${id}`)
}

onMounted(() => {
  fetchBids()
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Bids</h1>
      <p class="text-gray-600 dark:text-gray-400">View all bid submissions</p>
    </div>

    <Card>
      <DataTable :value="bids" :loading="loading" stripedRows>
        <Column field="id" header="Bid ID" />
        <Column field="tender.title" header="Tender" />
        <Column field="vendor.name" header="Vendor" />
        <Column field="total_bid_amount" header="Amount">
          <template #body="{ data }">
            ${{ data.total_bid_amount?.toLocaleString() }}
          </template>
        </Column>
        <Column field="submission_date" header="Submitted">
          <template #body="{ data }">
            {{ new Date(data.submission_date).toLocaleDateString() }}
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="data.status === 'accepted' ? 'success' : data.status === 'rejected' ? 'danger' : 'info'"
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

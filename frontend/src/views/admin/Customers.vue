<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const customers = ref([])
const loading = ref(true)
const showDialog = ref(false)
const editingCustomer = ref(null)

const formData = ref({
  name: '',
  industry: '',
  contact_email: '',
  contact_phone: '',
  address: '',
  status: 'active'
})

const statuses = ['active', 'inactive', 'suspended']

const fetchCustomers = async () => {
  try {
    const response = await api.get('/admin/customers')
    customers.value = response.data
  } catch (error) {
    console.error('Failed to fetch customers:', error)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  editingCustomer.value = null
  formData.value = {
    name: '',
    industry: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    status: 'active'
  }
  showDialog.value = true
}

const handleEdit = (customer) => {
  editingCustomer.value = customer
  formData.value = {
    name: customer.name,
    industry: customer.industry,
    contact_email: customer.contact_email,
    contact_phone: customer.contact_phone,
    address: customer.address,
    status: customer.status
  }
  showDialog.value = true
}

const handleSave = async () => {
  try {
    if (editingCustomer.value) {
      await api.put(`/admin/customers/${editingCustomer.value.id}`, formData.value)
    } else {
      await api.post('/admin/customers', formData.value)
    }
    showDialog.value = false
    await fetchCustomers()
  } catch (error) {
    console.error('Failed to save customer:', error)
  }
}

onMounted(() => {
  fetchCustomers()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage customer accounts</p>
      </div>
      <Button label="Add Customer" icon="pi pi-plus" @click="handleCreate" />
    </div>

    <Card>
      <DataTable :value="customers" :loading="loading" stripedRows>
        <Column field="name" header="Name" />
        <Column field="industry" header="Industry" />
        <Column field="contact_email" header="Contact Email" />
        <Column field="contact_phone" header="Phone" />
        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="data.status === 'active' ? 'success' : data.status === 'suspended' ? 'danger' : 'warning'"
            />
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <Button
              icon="pi pi-pencil"
              size="small"
              @click="handleEdit(data)"
            />
          </template>
        </Column>
      </DataTable>
    </Card>

    <Dialog
      v-model:visible="showDialog"
      :header="editingCustomer ? 'Edit Customer' : 'Add Customer'"
      modal
      class="w-full max-w-md"
    >
      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <InputText v-model="formData.name" class="w-full" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Industry
          </label>
          <InputText v-model="formData.industry" class="w-full" required />
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
            Address
          </label>
          <Textarea v-model="formData.address" class="w-full" rows="3" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <Dropdown
            v-model="formData.status"
            :options="statuses"
            class="w-full"
            required
          />
        </div>
        <div class="flex justify-end space-x-2 pt-4">
          <Button label="Cancel" severity="secondary" @click="showDialog = false" />
          <Button type="submit" label="Save" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const users = ref([])
const loading = ref(true)
const showDialog = ref(false)
const editingUser = ref(null)

const formData = ref({
  name: '',
  email: '',
  password: '',
  role: 'customer_user',
  phone: ''
})

const roles = ['admin', 'evaluator', 'vendor', 'customer_user']

const fetchUsers = async () => {
  try {
    const response = await api.get('/admin/users')
    users.value = response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  editingUser.value = null
  formData.value = {
    name: '',
    email: '',
    password: '',
    role: 'customer_user',
    phone: ''
  }
  showDialog.value = true
}

const handleEdit = (user) => {
  editingUser.value = user
  formData.value = {
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
    phone: user.phone || ''
  }
  showDialog.value = true
}

const handleSave = async () => {
  try {
    if (editingUser.value) {
      await api.put(`/admin/users/${editingUser.value.id}/role`, {
        role: formData.value.role
      })
    } else {
      await api.post('/admin/users', formData.value)
    }
    showDialog.value = false
    await fetchUsers()
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}

const handleDelete = async (userId) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await api.delete(`/admin/users/${userId}`)
      await fetchUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage system users and roles</p>
      </div>
      <Button label="Add User" icon="pi pi-plus" @click="handleCreate" />
    </div>

    <Card>
      <DataTable :value="users" :loading="loading" stripedRows>
        <Column field="name" header="Name" />
        <Column field="email" header="Email" />
        <Column field="role" header="Role">
          <template #body="{ data }">
            <Tag :value="data.role.replace('_', ' ')" severity="info" />
          </template>
        </Column>
        <Column field="phone" header="Phone" />
        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="data.status === 'active' ? 'success' : 'warning'"
            />
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <div class="flex space-x-2">
              <Button
                icon="pi pi-pencil"
                size="small"
                @click="handleEdit(data)"
              />
              <Button
                icon="pi pi-trash"
                size="small"
                severity="danger"
                @click="handleDelete(data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </Card>

    <Dialog
      v-model:visible="showDialog"
      :header="editingUser ? 'Edit User' : 'Add User'"
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
            Email
          </label>
          <InputText v-model="formData.email" type="email" class="w-full" required />
        </div>
        <div v-if="!editingUser">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <Password v-model="formData.password" class="w-full" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role
          </label>
          <Dropdown
            v-model="formData.role"
            :options="roles"
            option-label="label"
            class="w-full"
            required
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="capitalize">
                {{ slotProps.value.replace('_', ' ') }}
              </div>
            </template>
            <template #option="slotProps">
              <div class="capitalize">{{ slotProps.option.replace('_', ' ') }}</div>
            </template>
          </Dropdown>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <InputText v-model="formData.phone" class="w-full" />
        </div>
        <div class="flex justify-end space-x-2 pt-4">
          <Button label="Cancel" severity="secondary" @click="showDialog = false" />
          <Button type="submit" label="Save" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

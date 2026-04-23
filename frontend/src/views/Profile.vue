<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const formData = ref({
  name: '',
  phone: ''
})

const loading = ref(false)
const success = ref(false)

onMounted(() => {
  if (authStore.user) {
    formData.value = {
      name: authStore.user.name,
      phone: authStore.user.phone || ''
    }
  }
})

const handleUpdate = async () => {
  loading.value = true
  success.value = false
  
  try {
    await authStore.updateProfile(formData.value)
    success.value = true
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (error) {
    console.error('Failed to update profile:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage your account settings</p>
    </div>

    <Card class="max-w-2xl">
      <template #title>
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {{ authStore.user?.name?.charAt(0) || 'U' }}
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ authStore.user?.name }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 capitalize">
              {{ authStore.user?.role?.replace('_', ' ') }}
            </p>
          </div>
        </div>
      </template>

      <form @submit.prevent="handleUpdate" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <InputText
            :model-value="authStore.user?.email"
            disabled
            class="w-full bg-gray-100 dark:bg-gray-700"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <InputText
            v-model="formData.name"
            placeholder="Enter your name"
            class="w-full"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <InputText
            v-model="formData.phone"
            placeholder="Enter your phone number"
            class="w-full"
          />
        </div>

        <Message v-if="success" severity="success" :closable="false">
          Profile updated successfully!
        </Message>

        <Button
          type="submit"
          label="Save Changes"
          :loading="loading"
        />
      </form>
    </Card>
  </div>
</template>

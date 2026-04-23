<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(credentials.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 animate-fade-in" style="background-color: #F9FAFB;">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl border p-8 animate-slide-up" style="border-color: rgba(243, 232, 226, 0.2); box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style="background-color: #FEF3C7; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
            <i class="pi pi-building text-4xl" style="color: #D97706;"></i>
          </div>
          <h1 class="text-3xl font-bold" style="color: #2D2D2D;">ConstructIQ</h1>
          <p class="text-gray-600 mt-2">Tender Management System</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium mb-2" style="color: #2D2D2D;">
              Email
            </label>
            <InputText
              id="email"
              v-model="credentials.email"
              type="email"
              placeholder="Enter your email"
              class="w-full"
              autocomplete="email"
              required
              style="background: #F9FAFB; border: 1px solid #F3E8E2; border-radius: 12px; padding: 12px;"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium mb-2" style="color: #2D2D2D;">
              Password
            </label>
            <Password
              id="password"
              v-model="credentials.password"
              placeholder="Enter your password"
              class="w-full"
              :feedback="false"
              toggleMask
              autocomplete="current-password"
              required
              input-style="background: #F9FAFB; border: 1px solid #F3E8E2; border-radius: 12px; padding: 12px;"
            />
          </div>

          <div v-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 text-white font-semibold"
            style="background-color: #D97706; box-shadow: 8px 8px 16px #F3E8E2, -8px -8px 16px #F9FAFB;"
            @mouseover="event.target.style.boxShadow = '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff'"
            @mouseout="event.target.style.boxShadow = '8px 8px 16px #F3E8E2, -8px -8px 16px #F9FAFB'"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            Demo credentials: admin@acme.com / Admin@123
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

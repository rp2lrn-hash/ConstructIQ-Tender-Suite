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
  <div class="min-h-screen flex items-center justify-center px-4 animate-fade-in" style="background: #F8FAFC;">
    <div class="max-w-md w-full">
      <div class="bg-white border border-border-light p-8 animate-slide-up card-premium" style="border-radius: 16px;">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style="background: #3B82F6;">
            <i class="pi pi-box text-4xl text-white"></i>
          </div>
          <h1 class="text-3xl font-bold text-text-primary">PROLOGISTIC</h1>
          <p class="text-text-secondary mt-2">Tender Management System</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium mb-2 text-text-primary">
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
              style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 22px; padding: 12px;"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium mb-2 text-text-primary">
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
              input-style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 22px; padding: 12px;"
            />
          </div>

          <div v-if="error" class="p-4 bg-status-red-light text-status-red" style="border-radius: 12px;">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full text-white font-medium transition-all duration-200 hover:opacity-90"
            style="background: #3B82F6; border-radius: 12px; padding: 0.75rem 1.5rem;"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-text-tertiary">
            Demo credentials: admin@acme.com / Admin@123
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

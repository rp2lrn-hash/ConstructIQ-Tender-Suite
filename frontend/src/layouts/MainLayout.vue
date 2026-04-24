<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen relative overflow-hidden" style="background: linear-gradient(135deg, #F8FCFF 0%, #E0F2F7 100%); font-family: 'Montserrat', sans-serif;">
    <Navbar :user="authStore.user" @logout="handleLogout" />
    <main class="px-8 py-8 relative z-10 overflow-y-auto">
      <div class="max-w-7xl w-full mx-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>

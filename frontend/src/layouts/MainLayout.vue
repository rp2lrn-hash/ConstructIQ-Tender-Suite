<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(true)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="flex h-screen bg-ivory">
    <Sidebar :open="sidebarOpen" @toggle="toggleSidebar" />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar 
        :user="authStore.user" 
        :sidebar-open="sidebarOpen"
        @toggle-sidebar="toggleSidebar"
        @logout="handleLogout"
      />
      
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

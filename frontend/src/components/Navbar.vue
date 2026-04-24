<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const props = defineProps({
  user: Object
})

const emit = defineEmits(['logout'])

const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const showNotifications = ref(false)
const showNavMenu = ref(false)
const notifications = ref([])
const unreadCount = ref(0)
const loadingNotifications = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
  showNavMenu.value = false
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
  showNavMenu.value = false
  if (showNotifications.value) {
    fetchNotifications()
  }
}

const toggleNavMenu = () => {
  showNavMenu.value = !showNavMenu.value
  showUserMenu.value = false
  showNotifications.value = false
}

const navigateTo = (path) => {
  router.push(path)
  showNavMenu.value = false
}

const fetchNotifications = async () => {
  loadingNotifications.value = true
  try {
    const response = await api.get('/notifications', { params: { unread_only: 'false' } })
    notifications.value = response.data
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  } finally {
    loadingNotifications.value = false
  }
}

const fetchUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count')
    unreadCount.value = response.data.count
  } catch (error) {
    console.error('Failed to fetch unread count:', error)
  }
}

const markAsRead = async (notification) => {
  try {
    await api.patch(`/notifications/${notification.id}/read`)
    notification.is_read = true
    fetchUnreadCount()
    
    // Navigate to response form if it's an assignment notification
    if (notification.type === 'assignment' && notification.related_id) {
      router.push(`/responses/assignment/${notification.related_id}`)
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    await api.patch('/notifications/read-all')
    notifications.value.forEach(n => n.is_read = true)
    unreadCount.value = 0
  } catch (error) {
    console.error('Failed to mark all as read:', error)
  }
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

onMounted(() => {
  fetchUnreadCount()
  // Poll for new notifications every 30 seconds
  setInterval(fetchUnreadCount, 30000)
})
</script>

<template>
  <header class="px-8 py-4 flex items-center sticky top-0 z-20 relative" style="background: #E0F2F7;">
    <div class="flex items-center justify-between w-full">
      <!-- Logo -->
      <div class="flex items-center space-x-6">
        <h1 class="text-3xl font-extrabold header-gradient-alt" style="font-family: 'Poppins', sans-serif; letter-spacing: 2px; text-shadow: 0 0 20px rgba(168, 85, 247, 0.3);">Construct<span style="font-weight: 900;">IQ</span></h1>
      </div>

      <!-- Navigation Menu -->
      <nav class="hidden md:flex items-center space-x-6">
        <button
          @click="navigateTo('/')"
          class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          :style="{
            background: router.currentRoute.value.path === '/' ? 'rgba(46, 100, 254, 0.1)' : 'white',
            color: router.currentRoute.value.path === '/' ? '#2E64FE' : '#212121',
            border: router.currentRoute.value.path === '/' ? '2px solid #2E64FE' : '2px solid #E0F2F7'
          }"
        >
          Dashboard
        </button>
        <button
          @click="navigateTo('/tenders')"
          class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          :style="{
            background: router.currentRoute.value.path.startsWith('/tenders') ? 'rgba(46, 100, 254, 0.1)' : 'white',
            color: router.currentRoute.value.path.startsWith('/tenders') ? '#2E64FE' : '#212121',
            border: router.currentRoute.value.path.startsWith('/tenders') ? '2px solid #2E64FE' : '2px solid #E0F2F7'
          }"
        >
          Tenders
        </button>
        <button
          v-if="authStore.isEvaluator"
          @click="navigateTo('/questionnaires')"
          class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          :style="{
            background: router.currentRoute.value.path.startsWith('/questionnaires') ? 'rgba(46, 100, 254, 0.1)' : 'white',
            color: router.currentRoute.value.path.startsWith('/questionnaires') ? '#2E64FE' : '#212121',
            border: router.currentRoute.value.path.startsWith('/questionnaires') ? '2px solid #2E64FE' : '2px solid #E0F2F7'
          }"
        >
          Questionnaires
        </button>
        <button
          @click="navigateTo('/responses')"
          class="px-4 py-2 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          :style="{
            background: router.currentRoute.value.path.startsWith('/responses') ? 'rgba(46, 100, 254, 0.1)' : 'white',
            color: router.currentRoute.value.path.startsWith('/responses') ? '#2E64FE' : '#212121',
            border: router.currentRoute.value.path.startsWith('/responses') ? '2px solid #2E64FE' : '2px solid #E0F2F7'
          }"
        >
          Responses
        </button>
      </nav>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-4">
        <!-- Mobile Menu Toggle -->
        <button
          @click="toggleNavMenu"
          class="md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110"
          style="background: white; border: 2px solid #E0F2F7;"
        >
          <i class="pi pi-bars" style="color: #2E64FE;"></i>
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button
            @click="toggleNotifications"
            class="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110"
            style="background: white; border: 2px solid #E0F2F7;"
          >
            <i class="pi pi-bell" style="color: #2E64FE;"></i>
            <span v-if="unreadCount > 0" class="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style="background: #DC2626;">
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>

          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-80 z-50 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl"
            style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);"
            @click.stop
          >
            <div class="px-4 py-3 border-b flex items-center justify-between" style="border-color: #E0F2F7;">
              <p class="text-sm font-bold" style="color: #212121;">Notifications</p>
              <button
                v-if="unreadCount > 0"
                @click="markAllAsRead"
                class="text-xs font-bold transition-colors"
                style="color: #2E64FE;"
              >
                Mark all read
              </button>
            </div>
            
            <div v-if="loadingNotifications" class="p-4 text-center">
              <i class="pi pi-spinner pi-spin" style="color: #666;"></i>
            </div>
            
            <div v-else-if="notifications.length === 0" class="p-4 text-center text-sm" style="color: #666;">
              <p>No notifications</p>
            </div>
            
            <div v-else class="max-h-96 overflow-y-auto">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                @click="markAsRead(notification)"
                class="px-4 py-3 border-b cursor-pointer transition-colors hover:bg-blue-50"
                :class="{ 'bg-blue-50': !notification.is_read }"
                style="border-color: #E0F2F7;"
              >
                <div class="flex items-start space-x-3">
                  <div class="w-2 h-2 mt-2 rounded-full flex-shrink-0" :style="{ background: notification.is_read ? '#E0F2F7' : '#2E64FE' }"></div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold mb-1" style="color: #212121;">{{ notification.title }}</p>
                    <p class="text-xs mb-1" style="color: #666;">{{ notification.message }}</p>
                    <p class="text-xs" style="color: #999;">{{ new Date(notification.created_at).toLocaleString() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-3 p-2 transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-2xl"
            style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);"
          >
            <div class="w-10 h-10 flex items-center justify-center text-white font-semibold rounded-full" style="background: linear-gradient(135deg, #2E64FE 0%, #00B4D8 100%);">
              {{ user?.name?.charAt(0) || 'U' }}
            </div>
            <div v-if="user" class="hidden md:block text-left">
              <p class="text-sm font-bold" style="color: #212121;">{{ user.name }}</p>
              <p class="text-xs capitalize" style="color: #666;">{{ user.role?.replace('_', ' ') }}</p>
            </div>
            <i class="pi pi-chevron-down" style="color: #666;"></i>
          </button>

          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 py-2 z-50 p-4 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105"
            style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);"
            @click.stop
          >
            <button
              @click="emit('logout')"
              class="w-full px-4 py-2 text-left transition-colors flex items-center hover:bg-sneat-gray-100 rounded-xl"
              style="color: #212121;"
            >
              <i class="pi pi-sign-out mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <div
      v-if="showNavMenu"
      class="absolute top-full left-0 right-0 mt-2 p-4 z-50 rounded-2xl pulse-glow transition-all duration-300"
      style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);"
      @click.stop
    >
      <div class="space-y-2">
        <button
          @click="navigateTo('/')"
          class="w-full px-4 py-3 text-left font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          :style="{
            background: router.currentRoute.value.path === '/' ? 'rgba(46, 100, 254, 0.1)' : 'white',
            color: router.currentRoute.value.path === '/' ? '#2E64FE' : '#212121'
          }"
        >
          Dashboard
        </button>
        <button
          @click="navigateTo('/tenders')"
          class="w-full px-4 py-3 text-left font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          :style="{
            background: router.currentRoute.value.path.startsWith('/tenders') ? 'rgba(46, 100, 254, 0.1)' : 'white',
            color: router.currentRoute.value.path.startsWith('/tenders') ? '#2E64FE' : '#212121'
          }"
        >
          Tenders
        </button>
        <button
          v-if="authStore.isEvaluator"
          @click="navigateTo('/questionnaires')"
          class="w-full px-4 py-3 text-left font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          :style="{
            background: router.currentRoute.value.path.startsWith('/questionnaires') ? 'rgba(46, 100, 254, 0.1)' : 'white',
            color: router.currentRoute.value.path.startsWith('/questionnaires') ? '#2E64FE' : '#212121'
          }"
        >
          Questionnaires
        </button>
        <button
          @click="navigateTo('/responses')"
          class="w-full px-4 py-3 text-left font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
          :style="{
            background: router.currentRoute.value.path.startsWith('/responses') ? 'rgba(46, 100, 254, 0.1)' : 'white',
            color: router.currentRoute.value.path.startsWith('/responses') ? '#2E64FE' : '#212121'
          }"
        >
          Responses
        </button>
      </div>
    </div>
  </header>
</template>

<style>
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);
  }
  50% {
    box-shadow: 0 0 40px rgba(46, 100, 254, 0.4);
  }
}

.pulse-glow {
  animation: pulseGlow 3s ease-in-out infinite;
}

.header-gradient-alt {
  background: linear-gradient(135deg, #2E64FE 0%, #00B4D8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>

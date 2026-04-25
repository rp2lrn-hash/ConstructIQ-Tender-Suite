<script setup>
import { ref, onMounted } from 'vue'
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

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'pi pi-home' },
  { path: '/tenders', label: 'Tenders', icon: 'pi pi-file' },
  { path: '/questionnaires', label: 'Questionnaires', icon: 'pi pi-list', roleRequired: true },
  { path: '/responses', label: 'Responses', icon: 'pi pi-reply' },
]

const isActive = (path) => {
  if (path === '/') return router.currentRoute.value.path === '/'
  return router.currentRoute.value.path.startsWith(path)
}

const handleLogout = async () => {
  showUserMenu.value = false
  authStore.logout()
  await router.push('/login')
}

onMounted(() => {
  fetchUnreadCount()
  setInterval(fetchUnreadCount, 60000)
})
</script>

<template>
  <div class="flex items-center gap-3">

    <!-- Notifications -->
    <div class="relative">
      <button @click="toggleNotifications" class="icon-btn relative">
        <i class="pi pi-bell"></i>
        <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
      </button>
      <transition name="dropdown">
        <div v-if="showNotifications" class="dropdown-panel w-80" style="right:0; top:100%;" @click.stop>
          <div class="flex items-center justify-between px-4 py-3 border-b" style="border-color:#F1F5F9;">
            <p class="text-sm font-bold" style="color:#0F172A;">Notifications</p>
            <button v-if="unreadCount > 0" @click="markAllAsRead" class="text-xs font-semibold" style="color:#6366F1;">Mark all read</button>
          </div>
          <div v-if="loadingNotifications" class="p-6 text-center"><i class="pi pi-spinner pi-spin" style="color:#6366F1;"></i></div>
          <div v-else-if="notifications.length === 0" class="p-6 text-center text-sm" style="color:#94A3B8;">No notifications yet</div>
          <div v-else class="max-h-80 overflow-y-auto">
            <div
              v-for="n in notifications" :key="n.id"
              @click="markAsRead(n)"
              class="notif-item px-4 py-3 cursor-pointer border-b"
              :class="{ 'notif-unread': !n.is_read }"
              style="border-color:#F1F5F9;"
            >
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 mt-1.5 rounded-full flex-shrink-0" :style="{ background: n.is_read ? '#E2E8F0' : '#6366F1' }"></div>
                <div>
                  <p class="text-sm font-semibold" style="color:#0F172A;">{{ n.title }}</p>
                  <p class="text-xs mt-0.5" style="color:#64748B;">{{ n.message }}</p>
                  <p class="text-xs mt-1" style="color:#CBD5E1;">{{ new Date(n.created_at).toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- User Menu -->
    <div class="relative">
      <button @click="toggleUserMenu" class="user-btn flex items-center gap-2 px-2.5 py-2 rounded-xl">
        <div class="avatar">{{ user?.name?.charAt(0) || 'U' }}</div>
        <i class="pi pi-chevron-down text-xs" style="color:#94A3B8;"></i>
      </button>
      <transition name="dropdown">
        <div v-if="showUserMenu" class="dropdown-panel w-44" style="right:0; top:100%;" @click.stop>
          <button @click="handleLogout" class="w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-2 hover:bg-red-50 rounded-xl transition-colors" style="color:#EF4444;">
            <i class="pi pi-sign-out"></i> Logout
          </button>
        </div>
      </transition>
    </div>

  </div>
</template>

<style scoped>
.navbar-glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.12);
  box-shadow: 0 2px 20px rgba(99, 102, 241, 0.08);
}

.navbar-logo {
  color: #0F172A;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;
}

.navbar-logo-accent {
  background: linear-gradient(135deg, #6366F1, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-btn {
  color: #64748B;
  background: transparent;
  border: none;
  cursor: pointer;
}

.nav-btn:hover {
  color: #6366F1;
  background: rgba(99, 102, 241, 0.08);
}

.nav-btn-active {
  color: #6366F1 !important;
  background: rgba(99, 102, 241, 0.12) !important;
  font-weight: 700;
}

.icon-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #F8FAFF;
  border: 1.5px solid #E2E8F0;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.icon-btn:hover {
  border-color: #6366F1;
  color: #6366F1;
  background: #EEF2FF;
}

.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  background: #EF4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  animation: badge-pop 0.3s cubic-bezier(0.68,-0.55,0.27,1.55);
}

@keyframes badge-pop {
  from { transform: scale(0); }
  to   { transform: scale(1); }
}

.user-btn {
  background: #F8FAFF;
  border: 1.5px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-btn:hover {
  border-color: #6366F1;
  background: #EEF2FF;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366F1, #06B6D4);
  color: white;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.dropdown-panel {
  position: absolute;
  background: white;
  border: 1.5px solid #E2E8F0;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(15, 23, 42, 0.15), 0 4px 12px rgba(99,102,241,0.1);
  z-index: 9999;
  overflow: hidden;
  margin-top: 8px;
}

.notif-item {
  transition: background 0.15s ease;
}

.notif-item:hover { background: #F8FAFF; }
.notif-unread { background: #EEF2FF; }

/* Dropdown transition */
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
</style>

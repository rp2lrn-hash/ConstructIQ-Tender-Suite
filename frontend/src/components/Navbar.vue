<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const props = defineProps({
  user: Object
})

const emit = defineEmits(['logout'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const showNotifications = ref(false)
const showNavMenu = ref(false)
const bellRef = ref(null)
const userRef = ref(null)
const bellRect = ref({})
const userRect = ref({})

const updateRects = () => {
  if (bellRef.value) bellRect.value = bellRef.value.getBoundingClientRect()
  if (userRef.value) userRect.value = userRef.value.getBoundingClientRect()
}

const notifStyle = computed(() => ({
  position: 'fixed',
  top: (bellRect.value.bottom || 0) + 8 + 'px',
  right: (window.innerWidth - (bellRect.value.right || 0)) + 'px',
  width: '320px'
}))

const userMenuStyle = computed(() => ({
  position: 'fixed',
  top: (userRect.value.bottom || 0) + 8 + 'px',
  right: (window.innerWidth - (userRect.value.right || 0)) + 'px',
  width: '176px'
}))
const notifications = ref([])
const unreadCount = ref(0)
const loadingNotifications = ref(false)

const toggleUserMenu = () => {
  updateRects()
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
  showNavMenu.value = false
}

const toggleNotifications = () => {
  updateRects()
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
    unreadCount.value = Math.max(0, unreadCount.value - 1)

    // Close dropdown first, then navigate
    if (notification.related_id) {
      showNotifications.value = false
      if (notification.type === 'assignment') {
        await router.push(`/responses/assignment/${notification.related_id}`)
      } else if (notification.type === 'response_submitted') {
        await router.push(`/responses/${notification.related_id}`)
      }
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

watch(() => route.path, () => {
  showUserMenu.value = false
  showNotifications.value = false
  showNavMenu.value = false
})

const closeAll = () => {
  showUserMenu.value = false
  showNotifications.value = false
  showNavMenu.value = false
}

onMounted(() => {
  fetchUnreadCount()
  setInterval(fetchUnreadCount, 60000)
  document.addEventListener('click', closeAll)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeAll)
})
</script>

<template>
  <div class="flex items-center gap-3">

    <!-- Notifications -->
    <div class="relative">
      <button ref="bellRef" @click.stop="toggleNotifications" class="icon-btn relative">
        <i class="pi pi-bell"></i>
        <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
      </button>
      <Teleport to="body">
        <transition name="dropdown">
          <div v-if="showNotifications" class="dropdown-panel" :style="notifStyle" @click.stop>
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
      </Teleport>
    </div>

    <!-- User Menu -->
    <div class="relative">
      <button ref="userRef" @click.stop="toggleUserMenu" class="user-btn flex items-center gap-2 px-2.5 py-1.5 rounded-xl">
        <span class="user-fullname">{{ user?.name || 'User' }}</span>
        <i class="pi pi-chevron-down text-xs" style="color:rgba(255,255,255,0.5);"></i>
      </button>
      <Teleport to="body">
        <transition name="dropdown">
          <div v-if="showUserMenu" class="dropdown-panel" :style="userMenuStyle" @click.stop>
            <button @click="handleLogout" class="w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-2 hover:bg-red-50 rounded-xl transition-colors" style="color:#EF4444;">
              <i class="pi pi-sign-out"></i> Logout
            </button>
          </div>
        </transition>
      </Teleport>
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
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(255,255,255,0.12);
  border: 1.5px solid rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.icon-btn:hover {
  background: rgba(255,255,255,0.22);
  border-color: rgba(255,255,255,0.35);
  color: #ffffff;
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
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-btn:hover {
  opacity: 0.85;
}

.user-fullname {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}


.dropdown-panel {
  position: absolute;
  background: white;
  border: 1.5px solid #E2E8F0;
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.22), 0 4px 16px rgba(99,102,241,0.12);
  z-index: 99999;
  overflow: hidden;
  margin-top: 8px;
  isolation: isolate;
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

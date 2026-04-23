<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  open: Boolean
})

const emit = defineEmits(['toggle'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const menuItems = computed(() => {
  const items = [
    { icon: 'pi pi-home', label: 'Dashboard', path: '/' },
  ]

  if (authStore.isAdmin) {
    items.push(
      { icon: 'pi pi-users', label: 'Users', path: '/admin/users' },
      { icon: 'pi pi-building', label: 'Customers', path: '/admin/customers' },
      { icon: 'pi pi-history', label: 'Audit Logs', path: '/admin/audit-logs' }
    )
  }

  items.push(
    { icon: 'pi pi-file', label: 'Tenders', path: '/tenders' },
    { icon: 'pi pi-truck', label: 'Vendors', path: '/vendors' },
    { icon: 'pi pi-send', label: 'Bids', path: '/bids' }
  )

  if (authStore.isEvaluator) {
    items.push(
      { icon: 'pi pi-chart-bar', label: 'Evaluations', path: '/evaluations' },
      { icon: 'pi pi-file-edit', label: 'Contracts', path: '/contracts' }
    )
  }

  return items
})

const navigate = (path) => {
  router.push(path)
}
</script>

<template>
  <aside 
    :class="[
      'bg-white border-r transition-all duration-300',
      open ? 'w-64' : 'w-20'
    ]"
    style="border-color: rgba(243, 232, 226, 0.2); box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);"
  >
    <div class="p-4 border-b" style="border-color: rgba(243, 232, 226, 0.2);">
      <h1 v-if="open" class="text-xl font-bold flex items-center" style="color: #2D2D2D;">
        <i class="pi pi-building mr-2" style="color: #D97706;"></i>
        ConstructIQ
      </h1>
      <div v-else class="text-center">
        <i class="pi pi-building text-2xl" style="color: #D97706;"></i>
      </div>
    </div>

    <nav class="p-4 space-y-2">
      <button
        v-for="item in menuItems"
        :key="item.path"
        @click="navigate(item.path)"
        :class="[
          'flex items-center w-full p-3 rounded-xl transition-all duration-300',
          route.path === item.path
            ? 'text-white'
            : ''
        ]"
        :style="route.path === item.path 
          ? 'background-color: #D97706; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);'
          : 'color: #2D2D2D;'
        "
        @mouseover="route.path !== item.path && (event.target.style.backgroundColor = 'rgba(243, 232, 226, 0.3)')"
        @mouseout="route.path !== item.path && (event.target.style.backgroundColor = 'transparent')"
      >
        <i :class="[item.icon, 'text-lg']"></i>
        <span v-if="open" class="ml-3 font-medium">{{ item.label }}</span>
      </button>
    </nav>

    <div class="absolute bottom-0 left-0 right-0 p-4 border-t" style="border-color: rgba(243, 232, 226, 0.2);">
      <button
        @click="navigate('/profile')"
        :class="[
          'flex items-center w-full p-3 rounded-xl transition-all duration-300',
          route.path === '/profile'
            ? 'text-white'
            : ''
        ]"
        :style="route.path === '/profile'
          ? 'background-color: #D97706; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);'
          : 'color: #2D2D2D;'
        "
        @mouseover="route.path !== '/profile' && (event.target.style.backgroundColor = 'rgba(243, 232, 226, 0.3)')"
        @mouseout="route.path !== '/profile' && (event.target.style.backgroundColor = 'transparent')"
      >
        <i class="pi pi-user text-lg"></i>
        <span v-if="open" class="ml-3 font-medium">Profile</span>
      </button>
    </div>
  </aside>
</template>

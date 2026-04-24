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
      'text-text-primary transition-all duration-300 flex flex-col relative z-10 bg-white',
      open ? 'w-[260px]' : 'w-20'
    ]"
    style="height: 100vh; border-right: 1.5px solid #E2E8ED;"
  >
    <div class="p-6 border-b" style="border-color: #E2E8ED;">
      <h1 v-if="open" class="text-xl font-bold leading-tight text-text-primary">
        PROLOGISTIC
        <span class="block text-sm font-normal text-text-secondary">LOGISTICS</span>
      </h1>
      <div v-else class="text-center">
        <i class="pi pi-box text-2xl text-teal-primary"></i>
      </div>
    </div>

    <nav class="flex-1 p-4 space-y-6 overflow-y-auto">
      <div v-if="open">
        <p class="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Main</p>
        <div class="space-y-2">
          <button
            v-for="item in menuItems.filter(i => ['/', '/tenders'].includes(i.path))"
            :key="item.path"
            @click="navigate(item.path)"
            :class="[
              'flex items-center w-full p-3 transition-all duration-200',
              route.path === item.path
                ? 'bg-teal-soft text-teal-primary'
                : 'hover:bg-teal-light text-text-secondary'
            ]"
            style="border-radius: 8px;"
          >
            <i :class="[item.icon, 'text-lg']"></i>
            <span class="ml-3 font-medium">{{ item.label }}</span>
            <span v-if="item.path === '/tenders'" class="ml-auto text-white text-xs px-2 py-0.5" style="background: #005D6C; border-radius: 999px;">32</span>
          </button>
        </div>
      </div>

      <div v-if="open && authStore.isEvaluator">
        <p class="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Finance</p>
        <div class="space-y-2">
          <button
            v-for="item in menuItems.filter(i => ['/evaluations', '/contracts'].includes(i.path))"
            :key="item.path"
            @click="navigate(item.path)"
            :class="[
              'flex items-center w-full p-3 transition-all duration-200',
              route.path === item.path
                ? 'bg-teal-soft text-teal-primary'
                : 'hover:bg-teal-light text-text-secondary'
            ]"
            style="border-radius: 8px;"
          >
            <i :class="[item.icon, 'text-lg']"></i>
            <span class="ml-3 font-medium">{{ item.label }}</span>
          </button>
        </div>
      </div>

      <div v-if="open && authStore.isAdmin">
        <p class="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Admin</p>
        <div class="space-y-2">
          <button
            v-for="item in menuItems.filter(i => ['/admin/users', '/admin/customers', '/admin/audit-logs'].includes(i.path))"
            :key="item.path"
            @click="navigate(item.path)"
            :class="[
              'flex items-center w-full p-3 transition-all duration-200',
              route.path === item.path
                ? 'bg-teal-soft text-teal-primary'
                : 'hover:bg-teal-light text-text-secondary'
            ]"
            style="border-radius: 8px;"
          >
            <i :class="[item.icon, 'text-lg']"></i>
            <span class="ml-3 font-medium">{{ item.label }}</span>
          </button>
        </div>
      </div>

      <div v-if="!open" class="space-y-2">
        <button
          v-for="item in menuItems"
          :key="item.path"
          @click="navigate(item.path)"
            :class="[
              'flex items-center justify-center w-full p-3 transition-all duration-200',
              route.path === item.path
                ? 'bg-teal-soft text-teal-primary'
                : 'hover:bg-teal-light text-text-secondary'
            ]"
            style="border-radius: 8px;"
        >
          <i :class="[item.icon, 'text-lg']"></i>
        </button>
      </div>
    </nav>

    <div class="p-4 border-t" style="border-color: #E2E8ED;">
      <button
        @click="navigate('/profile')"
        :class="[
          'flex items-center w-full p-3 transition-all duration-200',
          route.path === '/profile'
            ? 'bg-teal-soft text-teal-primary'
            : 'hover:bg-teal-light text-text-secondary'
        ]"
        style="border-radius: 8px;"
      >
        <div class="w-8 h-8 flex items-center justify-center text-white font-semibold text-sm" style="background: #005D6C; border-radius: 999px;">
          {{ authStore.user?.name?.charAt(0) || 'U' }}
        </div>
        <div v-if="open" class="ml-3 text-left">
          <p class="text-sm font-medium text-text-primary">{{ authStore.user?.name }}</p>
          <p class="text-xs text-text-muted capitalize">{{ authStore.user?.role?.replace('_', ' ') }}</p>
        </div>
      </button>
    </div>
  </aside>
</template>

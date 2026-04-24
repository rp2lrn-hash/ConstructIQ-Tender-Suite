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
      'text-text-primary transition-all duration-300 flex flex-col relative z-10',
      open ? 'w-[260px]' : 'w-20'
    ]"
    style="height: 100vh; background: rgba(2, 62, 138, 0.7); backdrop-filter: blur(10px); border-right: 2px solid rgba(72, 202, 228, 0.3); box-shadow: 0 0 20px rgba(72, 202, 228, 0.2);"
  >
    <div class="p-6" style="border-bottom: 2px solid rgba(72, 202, 228, 0.3);">
      <h1 v-if="open" class="text-2xl font-extrabold leading-tight" style="font-family: 'Poppins', sans-serif; letter-spacing: 2px; text-shadow: 0 0 20px rgba(72, 202, 228, 0.5); background: linear-gradient(135deg, #48CAE4, #0096C7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
        Construct<span style="font-weight: 900;">IQ</span>
      </h1>
      <div v-else class="text-center">
        <i class="pi pi-box text-2xl" style="color: #48CAE4;"></i>
      </div>
    </div>

    <nav class="flex-1 p-4 space-y-6 overflow-y-auto">
      <div v-if="open">
        <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color: rgba(255, 255, 255, 0.7);">Main</p>
        <div class="space-y-2">
          <button
            v-for="item in menuItems.filter(i => ['/', '/tenders'].includes(i.path))"
            :key="item.path"
            @click="navigate(item.path)"
            class="flex items-center w-full p-3 transition-all duration-200 text-white font-medium hover:opacity-90"
            :style="route.path === item.path
              ? 'background: linear-gradient(135deg, #48CAE4, #0096C7); border-radius: 9px; box-shadow: 0 0 20px rgba(72, 202, 228, 0.4);'
              : 'background: linear-gradient(135deg, rgba(72, 202, 228, 0.3), rgba(0, 150, 199, 0.3)); border-radius: 9px; box-shadow: 0 0 15px rgba(72, 202, 228, 0.2);'
            "
          >
            <i :class="[item.icon, 'text-lg']"></i>
            <span class="ml-3">{{ item.label }}</span>
            <span v-if="item.path === '/tenders'" class="ml-auto text-white text-xs px-2 py-0.5" style="background: rgba(255, 255, 255, 0.3); border-radius: 999px;">32</span>
          </button>
        </div>
      </div>

      <div v-if="open && authStore.isEvaluator">
        <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color: rgba(255, 255, 255, 0.7);">Finance</p>
        <div class="space-y-2">
          <button
            v-for="item in menuItems.filter(i => ['/evaluations', '/contracts'].includes(i.path))"
            :key="item.path"
            @click="navigate(item.path)"
            class="flex items-center w-full p-3 transition-all duration-200 text-white font-medium hover:opacity-90"
            :style="route.path === item.path
              ? 'background: linear-gradient(135deg, #48CAE4, #0096C7); border-radius: 9px; box-shadow: 0 0 20px rgba(72, 202, 228, 0.4);'
              : 'background: linear-gradient(135deg, rgba(72, 202, 228, 0.3), rgba(0, 150, 199, 0.3)); border-radius: 9px; box-shadow: 0 0 15px rgba(72, 202, 228, 0.2);'
            "
          >
            <i :class="[item.icon, 'text-lg']"></i>
            <span class="ml-3">{{ item.label }}</span>
          </button>
        </div>
      </div>

      <div v-if="open && authStore.isAdmin">
        <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color: rgba(255, 255, 255, 0.7);">Admin</p>
        <div class="space-y-2">
          <button
            v-for="item in menuItems.filter(i => ['/admin/users', '/admin/customers', '/admin/audit-logs'].includes(i.path))"
            :key="item.path"
            @click="navigate(item.path)"
            class="flex items-center w-full p-3 transition-all duration-200 text-white font-medium hover:opacity-90"
            :style="route.path === item.path
              ? 'background: linear-gradient(135deg, #48CAE4, #0096C7); border-radius: 9px; box-shadow: 0 0 20px rgba(72, 202, 228, 0.4);'
              : 'background: linear-gradient(135deg, rgba(72, 202, 228, 0.3), rgba(0, 150, 199, 0.3)); border-radius: 9px; box-shadow: 0 0 15px rgba(72, 202, 228, 0.2);'
            "
          >
            <i :class="[item.icon, 'text-lg']"></i>
            <span class="ml-3">{{ item.label }}</span>
          </button>
        </div>
      </div>

      <div v-if="!open" class="space-y-2">
        <button
          v-for="item in menuItems"
          :key="item.path"
          @click="navigate(item.path)"
          class="flex items-center justify-center w-full p-3 transition-all duration-200 text-white hover:opacity-90"
          :style="route.path === item.path
            ? 'background: linear-gradient(135deg, #48CAE4, #0096C7); border-radius: 9px; box-shadow: 0 0 20px rgba(72, 202, 228, 0.4);'
            : 'background: linear-gradient(135deg, rgba(72, 202, 228, 0.3), rgba(0, 150, 199, 0.3)); border-radius: 9px; box-shadow: 0 0 15px rgba(72, 202, 228, 0.2);'
          "
        >
          <i :class="[item.icon, 'text-lg']"></i>
        </button>
      </div>
    </nav>

    <div class="p-4" style="border-top: 2px solid rgba(72, 202, 228, 0.3);">
      <button
        @click="navigate('/profile')"
        class="flex items-center w-full p-3 transition-all duration-200 text-white font-medium hover:opacity-90"
        :style="route.path === '/profile'
          ? 'background: linear-gradient(135deg, #48CAE4, #0096C7); border-radius: 9px; box-shadow: 0 0 20px rgba(72, 202, 228, 0.4);'
          : 'background: linear-gradient(135deg, rgba(72, 202, 228, 0.3), rgba(0, 150, 199, 0.3)); border-radius: 9px; box-shadow: 0 0 15px rgba(72, 202, 228, 0.2);'
        "
      >
        <div class="w-8 h-8 flex items-center justify-center text-white font-semibold text-sm" style="background: rgba(255, 255, 255, 0.3); border-radius: 999px;">
          {{ authStore.user?.name?.charAt(0) || 'U' }}
        </div>
        <div v-if="open" class="ml-3 text-left">
          <p class="text-sm font-medium">{{ authStore.user?.name }}</p>
          <p class="text-xs capitalize">{{ authStore.user?.role?.replace('_', ' ') }}</p>
        </div>
      </button>
    </div>
  </aside>
</template>

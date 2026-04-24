<script setup>
import { ref } from 'vue'

const props = defineProps({
  user: Object,
  sidebarOpen: Boolean
})

const emit = defineEmits(['toggle-sidebar', 'logout'])

const showUserMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}
</script>

<template>
  <header class="px-6 h-[56px] flex items-center sticky top-0 z-20 bg-white" style="border-bottom: 1.5px solid #E2E8ED; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center space-x-4">
        <button
          @click="emit('toggle-sidebar')"
          class="p-2 transition-all duration-200 text-text-primary hover:bg-teal-light"
          style="border-radius: 8px;"
        >
          <i :class="['pi', sidebarOpen ? 'pi-angle-left' : 'pi-angle-right', 'text-lg']"></i>
        </button>
        <h2 class="text-lg font-semibold text-text-primary">
          Tender Management System
        </h2>
      </div>

      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            type="text"
            placeholder="Search..."
            class="h-10 px-4 w-64 text-sm focus:outline-none transition-all duration-200 text-text-primary"
            style="background: #F7F9FA; border: 1.5px solid #E2E8ED; border-radius: 22px;"
          />
        </div>

        <button
          class="text-white font-medium transition-all duration-200"
          style="background: linear-gradient(135deg, #005D6C, #007B8F, #009BAA); border-radius: 9px; padding: 10px 16px; box-shadow: 0 4px 12px rgba(0,93,108,0.25);"
        >
          + New Tender
        </button>

        <button class="relative p-2 transition-all duration-200 text-text-primary hover:bg-teal-light" style="border-radius: 8px;">
          <i class="pi pi-bell text-lg"></i>
          <span class="absolute top-1 right-1 w-2 h-2 rounded-full" style="background: #DC2626;"></span>
        </button>

        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-3 p-2 transition-all duration-200 hover:bg-teal-light"
            style="border-radius: 8px;"
          >
            <div class="w-10 h-10 flex items-center justify-center text-white font-semibold" style="background: #005D6C; border-radius: 999px;">
              {{ user?.name?.charAt(0) || 'U' }}
            </div>
            <div v-if="user" class="text-left">
              <p class="text-sm font-medium text-text-primary">{{ user.name }}</p>
              <p class="text-xs text-text-muted capitalize">{{ user.role?.replace('_', ' ') }}</p>
            </div>
            <i class="pi pi-chevron-down text-text-muted"></i>
          </button>

          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white py-2 z-50 shadow-lg"
            style="border: 1.5px solid #E2E8ED; border-radius: 12px;"
          >
            <button
              @click="emit('logout')"
              class="w-full px-4 py-2 text-left transition-colors flex items-center"
              style="color: #DC2626;"
            >
              <i class="pi pi-sign-out mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

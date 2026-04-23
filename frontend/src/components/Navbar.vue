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
  <header class="bg-white border-b px-6 py-4" style="border-color: rgba(243, 232, 226, 0.2); box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="emit('toggle-sidebar')"
          class="p-2 rounded-xl transition-all duration-300"
          style="color: #2D2D2D;"
          @mouseover="event.target.style.backgroundColor = 'rgba(243, 232, 226, 0.3)'"
          @mouseout="event.target.style.backgroundColor = 'transparent'"
        >
          <i :class="['pi', sidebarOpen ? 'pi-angle-left' : 'pi-angle-right', 'text-lg']"></i>
        </button>
        <h2 class="text-lg font-semibold" style="color: #2D2D2D;">
          Tender Management System
        </h2>
      </div>

      <div class="flex items-center space-x-4">
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-3 p-2 rounded-xl transition-all duration-300"
            @mouseover="event.target.style.backgroundColor = 'rgba(243, 232, 226, 0.3)'"
            @mouseout="event.target.style.backgroundColor = 'transparent'"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold" style="background-color: #D97706; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
              {{ user?.name?.charAt(0) || 'U' }}
            </div>
            <div v-if="user" class="text-left">
              <p class="text-sm font-medium" style="color: #2D2D2D;">{{ user.name }}</p>
              <p class="text-xs text-gray-500 capitalize">{{ user.role?.replace('_', ' ') }}</p>
            </div>
            <i class="pi pi-chevron-down text-gray-500"></i>
          </button>

          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-xl py-2 z-50"
            style="border-color: rgba(243, 232, 226, 0.2); box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);"
          >
            <button
              @click="emit('logout')"
              class="w-full px-4 py-2 text-left text-red-600 transition-colors flex items-center"
              @mouseover="event.target.style.backgroundColor = 'rgba(243, 232, 226, 0.3)'"
              @mouseout="event.target.style.backgroundColor = 'transparent'"
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

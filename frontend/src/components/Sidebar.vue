<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({ collapsed: Boolean })
const emit = defineEmits(['toggle'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isActive = (path) => path === '/' ? route.path === '/' : route.path.startsWith(path)

const navGroups = computed(() => {
  const groups = [
    {
      label: 'Overview',
      items: [
        { icon: 'pi pi-th-large', label: 'Dashboard', path: '/' },
      ]
    },
    {
      label: 'Workflow',
      items: [
        { icon: 'pi pi-reply', label: 'Responses', path: '/responses' },
        ...(authStore.isEvaluator || authStore.isAdmin ? [
          { icon: 'pi pi-list-check', label: 'Questionnaires', path: '/questionnaires' },
        ] : [])
      ]
    },
  ]
  if (authStore.isAdmin) {
    groups.push({
      label: 'Admin',
      items: [
        { icon: 'pi pi-user-edit', label: 'Users', path: '/admin/users' },
        { icon: 'pi pi-building', label: 'Customers', path: '/admin/customers' },
        { icon: 'pi pi-history', label: 'Audit Logs', path: '/admin/audit-logs' },
      ]
    })
  }
  return groups
})
</script>

<template>
  <aside class="sidebar flex flex-col" :class="collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'">

    <!-- Logo -->
    <div class="sidebar-logo" @click="emit('toggle')">
      <transition name="label-fade">
        <span v-if="!collapsed" class="logo-text">Construct<span class="logo-accent">IQ</span></span>
      </transition>
      <button v-if="!collapsed" class="ml-auto collapse-btn" @click.stop="emit('toggle')">
        <i class="pi pi-chevron-left text-xs"></i>
      </button>
      <div v-if="collapsed" class="logo-icon">
        <span class="logo-accent" style="font-weight:900; font-size:14px;">IQ</span>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-6">
      <div v-for="group in navGroups" :key="group.label">
        <transition name="label-fade">
          <p v-if="!collapsed" class="nav-group-label">{{ group.label }}</p>
        </transition>
        <div class="space-y-1">
          <button
            v-for="item in group.items"
            :key="item.path"
            @click="router.push(item.path)"
            class="nav-item"
            :class="isActive(item.path) ? 'nav-item-active' : ''"
            :title="collapsed ? item.label : ''"
          >
            <i :class="item.icon" class="nav-icon"></i>
            <transition name="label-fade">
              <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
            </transition>
          </button>
        </div>
      </div>
    </nav>

  </aside>
</template>

<style scoped>
.sidebar {
  height: 100vh;
  background: linear-gradient(160deg, #1E1B4B 0%, #312E81 40%, #1E3A5F 100%);
  border-right: none;
  transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 4px 0 24px rgba(15,23,42,0.18);
}

.sidebar-expanded  { width: 240px; }
.sidebar-collapsed { width: 68px; }

/* Logo */
.sidebar-logo {
  display: flex;
  align-items: center;
  padding: 18px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  cursor: pointer;
  min-height: 64px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366F1, #06B6D4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-text {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: 22px;
  color: #fff;
  white-space: nowrap;
}

.logo-accent {
  background: linear-gradient(135deg, #6366F1, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-sub {
  font-size: 10px;
  color: rgba(255,255,255,0.45);
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 1px;
}

.collapse-btn {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: rgba(255,255,255,0.1);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.6);
  transition: all 0.2s;
}
.collapse-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }

/* Nav group */
.nav-group-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  padding: 0 10px;
  margin-bottom: 6px;
  white-space: nowrap;
}

/* Nav item */
.nav-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.18s ease;
  text-align: left;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
}

.nav-icon {
  font-size: 15px;
  color: rgba(255,255,255,0.5);
  flex-shrink: 0;
  width: 20px;
  text-align: center;
  transition: color 0.18s;
}

.nav-label {
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  margin-left: 12px;
  white-space: nowrap;
  transition: color 0.18s;
}

.nav-item:hover .nav-icon,
.nav-item:hover .nav-label { color: #fff; }

.nav-item-active {
  background: linear-gradient(135deg, rgba(255,255,255,0.18), rgba(99,102,241,0.25)) !important;
  box-shadow: 0 2px 12px rgba(99,102,241,0.25);
}
.nav-item-active .nav-icon,
.nav-item-active .nav-label {
  color: #fff !important;
  font-weight: 700;
}

/* User footer */
.sidebar-footer {
  padding: 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.user-card {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
}

.user-card-collapsed { justify-content: center; }

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366F1, #06B6D4);
  color: white;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  text-transform: capitalize;
  white-space: nowrap;
}

/* Transition */
.label-fade-enter-active, .label-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.label-fade-enter-from, .label-fade-leave-to { opacity: 0; transform: translateX(-6px); }
</style>

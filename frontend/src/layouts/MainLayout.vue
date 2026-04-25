<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const sidebarCollapsed = ref(false)
const loadingProgress = ref(0)
const isNavigating = ref(false)

const removeBeforeEach = router.beforeEach(() => {
  isNavigating.value = true
  loadingProgress.value = 20
  setTimeout(() => { loadingProgress.value = 60 }, 100)
  setTimeout(() => { loadingProgress.value = 85 }, 300)
})

const removeAfterEach = router.afterEach(() => {
  loadingProgress.value = 100
  setTimeout(() => {
    isNavigating.value = false
    loadingProgress.value = 0
  }, 400)
})

onBeforeUnmount(() => {
  removeBeforeEach()
  removeAfterEach()
})

const handleLogout = async () => {
  authStore.logout()
  await router.push('/login')
}

const pageTitle = () => {
  const p = route.path
  if (p === '/') return 'Dashboard'
  if (p.startsWith('/tenders')) return 'Tenders'
  if (p.startsWith('/vendors')) return 'Vendors'
  if (p.startsWith('/bids')) return 'Bids'
  if (p.startsWith('/responses')) return 'Responses'
  if (p.startsWith('/questionnaires')) return 'Questionnaires'
  if (p.startsWith('/evaluations')) return 'Evaluations'
  if (p.startsWith('/contracts')) return 'Contracts'
  if (p.startsWith('/admin/users')) return 'Users'
  if (p.startsWith('/admin/customers')) return 'Customers'
  if (p.startsWith('/admin/audit-logs')) return 'Audit Logs'
  return 'ConstructIQ'
}

const pageIcon = () => {
  const p = route.path
  if (p === '/') return 'pi pi-th-large'
  if (p.startsWith('/responses')) return 'pi pi-reply'
  if (p.startsWith('/questionnaires')) return 'pi pi-list-check'
  if (p.startsWith('/admin')) return 'pi pi-shield'
  return 'pi pi-home'
}

const contextualAction = computed(() => {
  const p = route.path
  if (p === '/questionnaires') return { label: 'New Questionnaire', icon: 'pi pi-plus', route: '/questionnaires' }
  if (p === '/responses') return { label: 'View Responses', icon: 'pi pi-list', route: '/responses' }
  return null
})

</script>

<template>
  <div class="app-shell" style="font-family: 'Montserrat', sans-serif;">

    <!-- Top progress bar -->
    <div v-if="isNavigating" class="progress-bar-top" :style="{ width: loadingProgress + '%' }"></div>

    <!-- Sidebar -->
    <Sidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />

    <!-- Right side -->
    <div class="app-right">

      <!-- Top Header -->
      <header class="top-header">
        <!-- Left: expand + page icon + gradient title -->
        <div class="flex items-center gap-3">
          <button v-if="sidebarCollapsed" class="expand-btn" @click="sidebarCollapsed = false">
            <i class="pi pi-bars text-sm"></i>
          </button>
          <div class="header-icon-wrap">
            <div class="header-icon-accent"></div>
            <i :class="pageIcon()" class="text-white text-sm"></i>
          </div>
          <div>
            <h2 class="page-title-gradient">{{ pageTitle() }}</h2>
            <p class="page-breadcrumb">ConstructIQ &rsaquo; {{ pageTitle() }}</p>
          </div>
        </div>

        <!-- Right: contextual action + frosted pill -->
        <div class="flex items-center gap-3">
          <!-- Navbar pill: bell + full name -->
          <div class="navbar-pill">
            <Navbar :user="authStore.user" @logout="handleLogout" />
          </div>
        </div>
      </header>

      <!-- Aurora background -->
      <div class="aurora" aria-hidden="true">
        <div class="aurora-orb aurora-orb-1"></div>
        <div class="aurora-orb aurora-orb-2"></div>
        <div class="aurora-orb aurora-orb-3"></div>
      </div>

      <!-- Main content -->
      <main class="app-main">
        <router-view v-slot="{ Component, route }">
          <transition name="page-slide" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #EEF0F8;
}

/* Aurora */
.aurora {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.aurora-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.18;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.aurora-orb-1 {
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, #6366F1 0%, transparent 70%);
  bottom: -100px;
  left: 5%;
  animation: aurora1 14s ease-in-out infinite alternate;
}

.aurora-orb-2 {
  width: 500px;
  height: 350px;
  background: radial-gradient(ellipse, #06B6D4 0%, transparent 70%);
  bottom: -80px;
  left: 35%;
  animation: aurora2 18s ease-in-out infinite alternate;
}

.aurora-orb-3 {
  width: 450px;
  height: 300px;
  background: radial-gradient(ellipse, #8B5CF6 0%, transparent 70%);
  bottom: -60px;
  right: 5%;
  animation: aurora3 22s ease-in-out infinite alternate;
}

@keyframes aurora1 {
  0%   { transform: translate(0,   0)   scale(1);    opacity: 0.18; }
  33%  { transform: translate(60px, -40px) scale(1.1); opacity: 0.22; }
  66%  { transform: translate(-40px, -80px) scale(0.95); opacity: 0.15; }
  100% { transform: translate(80px, -20px) scale(1.05); opacity: 0.20; }
}

@keyframes aurora2 {
  0%   { transform: translate(0,   0)   scale(1);    opacity: 0.16; }
  40%  { transform: translate(-70px, -50px) scale(1.15); opacity: 0.22; }
  70%  { transform: translate(50px, -90px) scale(0.9);  opacity: 0.14; }
  100% { transform: translate(-30px, -30px) scale(1.08); opacity: 0.19; }
}

@keyframes aurora3 {
  0%   { transform: translate(0,   0)   scale(1);    opacity: 0.14; }
  30%  { transform: translate(-50px, -60px) scale(1.1);  opacity: 0.20; }
  65%  { transform: translate(40px, -100px) scale(0.92); opacity: 0.16; }
  100% { transform: translate(-80px, -40px) scale(1.06); opacity: 0.18; }
}

.app-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  position: relative;
}

/* Top header */
.top-header {
  height: 68px;
  background: linear-gradient(135deg, #1E1B4B 0%, #312E81 55%, #1E3A5F 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  flex-shrink: 0;
  box-shadow: 0 4px 24px rgba(15,23,42,0.22);
  overflow: visible;
  position: relative;
  z-index: 100;
}
.top-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%);
}

.header-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}
.header-icon-accent {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #06B6D4, #6366F1);
  border-radius: 3px 0 0 3px;
}

.page-title-gradient {
  font-size: 17px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  letter-spacing: 0.2px;
}

.quick-actions-btn {
  display: flex;
  align-items: center;
  padding: 8px 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #6366F1, #06B6D4);
  color: white;
  font-size: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99,102,241,0.45);
  transition: all 0.2s ease;
  white-space: nowrap;
  letter-spacing: 0.3px;
}
.quick-actions-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 22px rgba(99,102,241,0.55);
  filter: brightness(1.08);
}

.navbar-pill {
  background: rgba(255,255,255,0.1);
  border: 1.5px solid rgba(255,255,255,0.18);
  border-radius: 14px;
  padding: 5px 10px 5px 10px;
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 200;
  overflow: visible;
}
.user-identity {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1;
}
.user-identity-name {
  font-size: 12px;
  font-weight: 800;
  color: #ffffff;
  white-space: nowrap;
}
.user-identity-role {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
  text-transform: capitalize;
  margin-top: 2px;
}

.page-title {
  font-size: 17px;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.2;
}

.page-breadcrumb {
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  font-weight: 500;
}

.expand-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1.5px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255,255,255,0.7);
  transition: all 0.2s;
}
.expand-btn:hover { border-color: rgba(255,255,255,0.5); color: #fff; background: rgba(255,255,255,0.18); }

/* Main content area */
.app-main {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
  position: relative;
  z-index: 1;
}

/* Progress bar */
.progress-bar-top {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  z-index: 9999;
  background: linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4);
  transition: width 0.3s ease-out;
}

/* Page transitions */
.page-slide-enter-active { transition: all 0.28s ease-out; }
.page-slide-leave-active { transition: all 0.2s ease-in; }
.page-slide-enter-from { opacity: 0; transform: translateY(14px); }
.page-slide-leave-to   { opacity: 0; transform: translateY(-6px); }
</style>

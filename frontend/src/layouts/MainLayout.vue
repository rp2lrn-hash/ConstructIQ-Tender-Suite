<script setup>
import { ref, onBeforeUnmount } from 'vue'
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
  if (p.startsWith('/tenders')) return 'pi pi-file'
  if (p.startsWith('/vendors')) return 'pi pi-users'
  if (p.startsWith('/bids')) return 'pi pi-send'
  if (p.startsWith('/responses')) return 'pi pi-reply'
  if (p.startsWith('/questionnaires')) return 'pi pi-list-check'
  if (p.startsWith('/evaluations')) return 'pi pi-chart-bar'
  if (p.startsWith('/contracts')) return 'pi pi-briefcase'
  if (p.startsWith('/admin')) return 'pi pi-shield'
  return 'pi pi-home'
}
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
            <i :class="pageIcon()" class="text-white text-sm"></i>
          </div>
          <div>
            <h2 class="page-title-gradient">{{ pageTitle() }}</h2>
            <p class="page-breadcrumb">ConstructIQ &rsaquo; {{ pageTitle() }}</p>
          </div>
        </div>

        <!-- Right: quick actions + frosted pill -->
        <div class="flex items-center gap-3">
          <button class="quick-actions-btn">
            <i class="pi pi-plus text-xs mr-1.5"></i> Quick Actions
          </button>
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
  background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(238,240,255,0.95) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(99,102,241,0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  flex-shrink: 0;
  box-shadow: 0 2px 16px rgba(99,102,241,0.08);
  overflow: visible;
  position: relative;
  z-index: 100;
}

.header-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99,102,241,0.35);
}

.page-title-gradient {
  font-size: 18px;
  font-weight: 900;
  background: linear-gradient(135deg, #4F46E5, #7C3AED, #0EA5E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.quick-actions-btn {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: white;
  font-size: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
  transition: all 0.2s ease;
  white-space: nowrap;
}
.quick-actions-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(99,102,241,0.4);
}

.navbar-pill {
  background: rgba(255,255,255,0.8);
  border: 1.5px solid rgba(99,102,241,0.15);
  border-radius: 14px;
  padding: 4px 8px;
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 17px;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.2;
}

.page-breadcrumb {
  font-size: 11px;
  color: #94A3B8;
  font-weight: 500;
}

.expand-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1.5px solid #E2E8F0;
  background: #F8FAFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748B;
  transition: all 0.2s;
}
.expand-btn:hover { border-color: #6366F1; color: #6366F1; background: #EEF2FF; }

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

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const features = [
  { icon: 'pi pi-list-check', title: 'Questionnaire Builder', desc: 'Create & manage structured questionnaire templates', gradient: 'linear-gradient(135deg,#6366F1,#8B5CF6)' },
  { icon: 'pi pi-send', title: 'Smart Assignments', desc: 'Assign questionnaires to teams with deadlines', gradient: 'linear-gradient(135deg,#06B6D4,#0EA5E9)' },
  { icon: 'pi pi-reply', title: 'Response Tracking', desc: 'Monitor submissions, progress & review responses', gradient: 'linear-gradient(135deg,#10B981,#06B6D4)' },
]
const stats = [
  { value: '100%', label: 'Digital Workflow' },
  { value: 'Real-time', label: 'Progress Tracking' },
  { value: 'Role-based', label: 'Access Control' },
]

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(credentials.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-root h-screen flex overflow-hidden" style="font-family: 'Montserrat', sans-serif;">

    <!-- LEFT PANEL — Dark Gradient Hero -->
    <div class="login-left hidden lg:flex flex-col justify-between p-10 relative overflow-hidden" style="width: 45%; background: linear-gradient(145deg, #0A0F1E 0%, #1a1040 50%, #0d1f3c 100%);">

      <!-- Glow orbs -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>

      <!-- Logo -->
      <div class="relative z-10">
        <span class="text-4xl font-black login-logo">Construct<span style="color:#06B6D4;">IQ</span></span>
        <p class="text-sm mt-1" style="color: rgba(255,255,255,0.5); letter-spacing:3px; text-transform:uppercase;">Tender Suite</p>
      </div>

      <!-- Hero Text & Feature Cards -->
      <div class="relative z-10 space-y-8">
        <div>
          <h2 class="text-4xl font-black leading-tight" style="color: #fff;">Streamline Your<br/><span class="hero-gradient-text">Tender Responses</span></h2>
          <p class="mt-3 text-sm leading-relaxed" style="color: rgba(255,255,255,0.55);">The all-in-one platform to build questionnaires, assign them to your team, and track responses in real time.</p>
        </div>

        <div class="space-y-3">
          <div v-for="(feat, i) in features" :key="i" class="feature-card flex items-center space-x-4" :style="{ animationDelay: i * 150 + 'ms' }">
            <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl" :style="{ background: feat.gradient }">
              <i :class="feat.icon" class="text-white text-sm"></i>
            </div>
            <div>
              <p class="text-sm font-bold" style="color:#fff;">{{ feat.title }}</p>
              <p class="text-xs" style="color:rgba(255,255,255,0.5);">{{ feat.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-3 gap-4">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <p class="text-2xl font-black hero-gradient-text">{{ stat.value }}</p>
            <p class="text-xs mt-1" style="color:rgba(255,255,255,0.45);">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <p class="relative z-10 text-xs" style="color: rgba(255,255,255,0.3);"> 2025 ConstructIQ. All rights reserved.</p>
    </div>

    <!-- RIGHT PANEL — Login Form -->
    <div class="flex-1 flex flex-col items-center justify-center px-8 py-10 relative" style="background: #F8FAFF;">

      <!-- Top accent line -->
      <div class="absolute top-0 left-0 right-0 h-1" style="background: linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4);"></div>

      <div class="w-full max-w-md">

        <!-- Mobile logo -->
        <div class="lg:hidden mb-8 text-center">
          <span class="text-3xl font-black" style="color:#1E1B4B;">Construct<span style="color:#06B6D4;">IQ</span></span>
        </div>

        <!-- Form Card -->
        <div class="form-card p-8 rounded-3xl">
          <div class="mb-7">
            <h1 class="login-signin-title">Sign In</h1>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <div>
              <label class="block text-xs font-bold mb-1.5 uppercase tracking-wide" style="color:#475569;">Email Address</label>
              <input
                v-model="credentials.email"
                type="email"
                placeholder="admin@acme.com"
                autocomplete="email"
                required
                class="premium-input w-full"
              />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="block text-xs font-bold uppercase tracking-wide" style="color:#475569;">Password</label>
                <a href="#" class="text-xs font-semibold" style="color:#6366F1;">Forgot password?</a>
              </div>
              <Password
                v-model="credentials.password"
                placeholder="Enter your password"
                :feedback="false"
                toggleMask
                autocomplete="current-password"
                required
                class="w-full"
                :inputStyle="{ width:'100%', background:'#F8FAFF', border:'1.5px solid #E2E8F0', borderRadius:'12px', padding:'12px 16px', fontSize:'14px', fontFamily:'Montserrat, sans-serif', color:'#0F172A' }"
                :panelStyle="{ background:'white', borderRadius:'12px', border:'1.5px solid #E2E8F0' }"
              />
            </div>

            <div v-if="error" class="flex items-center space-x-2 p-3 rounded-xl text-xs font-semibold" style="background:#FEF2F2; color:#DC2626; border:1px solid #FECACA;">
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ error }}</span>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="premium-btn w-full py-3.5 rounded-xl font-bold text-sm text-white"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <i class="pi pi-spinner pi-spin"></i> Signing in...
              </span>
              <span v-else>Sign In →</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="flex items-center my-5">
            <div class="flex-1 h-px" style="background:#E2E8F0;"></div>
            <span class="px-3 text-xs font-semibold" style="color:#94A3B8;">Or continue with</span>
            <div class="flex-1 h-px" style="background:#E2E8F0;"></div>
          </div>

          <!-- Social buttons -->
          <div class="flex gap-3">
            <button class="social-btn flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold">
              <i class="pi pi-google" style="color:#DB4437;"></i> Google
            </button>
            <button class="social-btn flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold">
              <i class="pi pi-microsoft" style="color:#00A4EF;"></i> Microsoft
            </button>
          </div>

          <p class="text-center text-xs mt-5" style="color:#94A3B8;">
            Demo: <span style="color:#6366F1; font-weight:700;">admin@acme.com</span> / <span style="color:#6366F1; font-weight:700;">Admin@123</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-root { font-family: 'Montserrat', sans-serif; }

/* LEFT PANEL ORBS */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
}
.orb-1 { width: 350px; height: 350px; background: #6366F1; top: -80px; right: -80px; }
.orb-2 { width: 250px; height: 250px; background: #06B6D4; bottom: 60px; left: -60px; }
.orb-3 { width: 180px; height: 180px; background: #8B5CF6; top: 50%; left: 40%; }

.login-logo { color: #fff; letter-spacing: 1px; }

.hero-gradient-text {
  background: linear-gradient(90deg, #6366F1, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-card {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 14px 16px;
  animation: feature-slide 0.6s ease-out both;
}

@keyframes feature-slide {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}

.login-signin-title {
  font-size: 32px;
  font-weight: 900;
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #6366F1, #8B5CF6, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  line-height: 1.1;
}

/* RIGHT PANEL */
.form-card {
  background: #fff;
  border: 1.5px solid #E2E8F0;
  box-shadow: 0 20px 60px rgba(99,102,241,0.10), 0 4px 16px rgba(0,0,0,0.06);
  animation: card-rise 0.5s ease-out both;
}

@keyframes card-rise {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.premium-input {
  background: #F8FAFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  color: #0F172A;
  outline: none;
  transition: all 0.2s ease;
}

.premium-input:focus {
  border-color: #6366F1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  background: #fff;
}

.premium-btn {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%);
  background-size: 200% 200%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: gradient-shift 4s ease infinite;
  box-shadow: 0 4px 20px rgba(99,102,241,0.4);
}

.premium-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(99,102,241,0.5);
}

.premium-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.social-btn {
  background: #F8FAFF;
  border: 1.5px solid #E2E8F0;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  border-color: #6366F1;
  background: #EEF2FF;
  transform: translateY(-1px);
}
</style>

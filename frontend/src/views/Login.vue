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
  <div class="h-screen flex flex-col relative overflow-hidden" style="background: linear-gradient(135deg, #F8FCFF 0%, #E0F2F7 100%); font-family: 'Montserrat', sans-serif;">
    <!-- Progress Indicator -->
    <div class="h-1 w-full" style="background: #E0F2F7;">
      <div class="progress-bar h-full" style="background: linear-gradient(90deg, #2E64FE, #00B4D8, #48CAE4);"></div>
    </div>

    <!-- Floating Particles -->
    <div class="particle particle-1"></div>
    <div class="particle particle-2"></div>
    <div class="particle particle-3"></div>
    <div class="particle particle-4"></div>
    <div class="particle particle-5"></div>
    <div class="particle particle-6"></div>

    <!-- Header Bar -->
    <header class="flex items-center px-8 py-4 relative z-10" style="background: #E0F2F7;">
      <span class="text-3xl font-extrabold header-gradient-alt" style="font-family: 'Poppins', sans-serif; letter-spacing: 2px; text-shadow: 0 0 20px rgba(168, 85, 247, 0.3);">Construct<span style="font-weight: 900;">IQ</span></span>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center px-8 py-8 relative z-10 overflow-y-auto">
      <div class="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pt-4">
        <!-- Left Panel - App Info with Geometric Shape -->
        <div class="relative">
          <!-- Abstract Geometric Shape with Morphing -->
          <div class="absolute top-0 left-0 w-96 h-96 opacity-20 morph-shape" style="background: linear-gradient(135deg, #2E64FE 0%, #00B4D8 100%);"></div>
          <div class="absolute top-20 left-20 w-64 h-64 opacity-15 morph-shape-2" style="background: linear-gradient(135deg, #00B4D8 0%, #2E64FE 100%);"></div>
          
          <div class="relative z-10 space-y-8">
            <div class="space-y-4">
              <div class="p-4 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);">
                <div class="flex items-start space-x-4">
                  <div class="w-10 h-10 flex items-center justify-center rounded-xl icon-animate" style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);">
                    <i class="pi pi-briefcase text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-sm" style="color: #212121;">Manage Tenders</h3>
                    <p class="text-xs mt-1" style="color: #666;">Create, publish, and manage tender opportunities efficiently</p>
                  </div>
                </div>
              </div>

              <div class="p-4 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);">
                <div class="flex items-start space-x-4">
                  <div class="w-10 h-10 flex items-center justify-center rounded-xl icon-animate" style="background: linear-gradient(135deg, #A855F7 0%, #EC4899 100%); animation-delay: 1s;">
                    <i class="pi pi-user-plus text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-sm" style="color: #212121;">Vendor Management</h3>
                    <p class="text-xs mt-1" style="color: #666;">Track and evaluate vendor submissions and compliance</p>
                  </div>
                </div>
              </div>

              <div class="p-4 rounded-2xl pulse-glow transition-all duration-300 hover:shadow-xl hover:scale-105" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);">
                <div class="flex items-start space-x-4">
                  <div class="w-10 h-10 flex items-center justify-center rounded-xl icon-animate" style="background: linear-gradient(135deg, #10B981 0%, #06B6D4 100%); animation-delay: 2s;">
                    <i class="pi pi-chart-bar text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-sm" style="color: #212121;">Analytics & Reports</h3>
                    <p class="text-xs mt-1" style="color: #666;">Gain insights with comprehensive dashboards and reports</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Positive One-Point Features -->
            <div class="grid grid-cols-2 gap-3">
              <div class="flex items-center space-x-2 p-3 rounded-xl transition-all duration-300 hover:scale-105" style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3);">
                <div class="w-8 h-8 flex items-center justify-center rounded-lg" style="background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);">
                  <i class="pi pi-shield text-white text-sm"></i>
                </div>
                <span class="text-xs font-semibold" style="color: #212121;">Secure & Compliant</span>
              </div>

              <div class="flex items-center space-x-2 p-3 rounded-xl transition-all duration-300 hover:scale-105" style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3);">
                <div class="w-8 h-8 flex items-center justify-center rounded-lg" style="background: linear-gradient(135deg, #2196F3 0%, #03A9F4 100%);">
                  <i class="pi pi-bell text-white text-sm"></i>
                </div>
                <span class="text-xs font-semibold" style="color: #212121;">Real-time Alerts</span>
              </div>

              <div class="flex items-center space-x-2 p-3 rounded-xl transition-all duration-300 hover:scale-105" style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3);">
                <div class="w-8 h-8 flex items-center justify-center rounded-lg" style="background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);">
                  <i class="pi pi-clock text-white text-sm"></i>
                </div>
                <span class="text-xs font-semibold" style="color: #212121;">24/7 Support</span>
              </div>

              <div class="flex items-center space-x-2 p-3 rounded-xl transition-all duration-300 hover:scale-105" style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3);">
                <div class="w-8 h-8 flex items-center justify-center rounded-lg" style="background: linear-gradient(135deg, #9C27B0 0%, #E91E63 100%);">
                  <i class="pi pi-mobile text-white text-sm"></i>
                </div>
                <span class="text-xs font-semibold" style="color: #212121;">Mobile Friendly</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Login Form -->
        <div class="space-y-6">
          <div class="p-6 rounded-2xl pulse-glow" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 2px solid rgba(46, 100, 254, 0.3); box-shadow: 0 0 30px rgba(46, 100, 254, 0.2);">
            <h1 class="text-2xl font-extrabold gradient-text text-left mb-6">Sign In</h1>
            <form @submit.prevent="handleLogin" class="space-y-4">
              <div>
                <label for="email" class="block text-xs font-semibold mb-1" style="color: #212121;">
                  Email
                </label>
                <InputText
                  id="email"
                  v-model="credentials.email"
                  type="email"
                  placeholder="Enter your email"
                  class="w-full input-glow"
                  autocomplete="email"
                  required
                  style="background: white; border: 2px solid #E0F2F7; border-radius: 10px; padding: 12px; font-family: 'Open Sans', sans-serif; transition: all 0.3s; font-size: 14px;"
                />
              </div>

              <div>
                <label for="password" class="block text-xs font-semibold mb-1" style="color: #212121;">
                  Password
                </label>
                <Password
                  id="password"
                  v-model="credentials.password"
                  placeholder="Enter your password"
                  class="w-full input-glow"
                  :feedback="false"
                  toggleMask
                  autocomplete="current-password"
                  required
                  :inputStyle="{ background: 'white', border: '2px solid #E0F2F7', borderRadius: '10px', padding: '12px', width: '100%', fontFamily: 'Open Sans, sans-serif', transition: 'all 0.3s', fontSize: '14px' }"
                  :panelStyle="{ background: 'white', border: '2px solid #E0F2F7', borderRadius: '10px' }"
                />
              </div>

              <div v-if="error" class="p-3 text-xs font-semibold" style="background: #FEE2E2; border-radius: 10px; color: #DC2626;">
                {{ error }}
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3 text-sm font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                style="background: linear-gradient(135deg, #2E64FE 0%, #00B4D8 100%); border: none; color: white;"
              >
                {{ loading ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>

            <div class="text-center mt-4">
              <p class="text-xs" style="color: #666;">
                Demo credentials: admin@acme.com / Admin@123
              </p>
            </div>

            <!-- Forgot Password & Sign Up Links -->
            <div class="flex justify-between items-center text-xs mt-4">
              <a href="#" class="hover:underline" style="color: #2E64FE;">Forgot password?</a>
              <a href="#" class="hover:underline" style="color: #2E64FE;">Don't have an account? Sign up</a>
            </div>

            <!-- Social Login -->
            <div class="space-y-3 mt-4">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t" style="border-color: #E0F2F7;"></div>
                </div>
                <div class="relative flex justify-center text-xs">
                  <span class="px-3" style="background: rgba(255, 255, 255, 0.9); color: #666;">Or continue with</span>
                </div>
              </div>
              <div class="flex justify-center space-x-3">
                <button class="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110" style="background: white; border: 2px solid #E0F2F7;">
                  <i class="pi pi-google" style="color: #DB4437;"></i>
                </button>
                <button class="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110" style="background: white; border: 2px solid #E0F2F7;">
                  <i class="pi pi-microsoft" style="color: #00A4EF;"></i>
                </button>
                <button class="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110" style="background: white; border: 2px solid #E0F2F7;">
                  <i class="pi pi-linkedin" style="color: #0077B5;"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="px-8 py-6 relative z-10" style="background: #E0F2F7;">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p class="text-sm" style="color: #666;">© 2024 ConstructIQ Tender Suite. All rights reserved.</p>
        <div class="flex space-x-6 text-sm">
          <a href="#" class="hover:underline" style="color: #2E64FE;">Privacy Policy</a>
          <a href="#" class="hover:underline" style="color: #2E64FE;">Terms of Service</a>
        </div>
        <div class="flex space-x-4">
          <a href="#" class="hover:scale-110 transition-transform" style="color: #2E64FE;">
            <i class="pi pi-facebook text-xl"></i>
          </a>
          <a href="#" class="hover:scale-110 transition-transform" style="color: #2E64FE;">
            <i class="pi pi-twitter text-xl"></i>
          </a>
          <a href="#" class="hover:scale-110 transition-transform" style="color: #2E64FE;">
            <i class="pi pi-linkedin text-xl"></i>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

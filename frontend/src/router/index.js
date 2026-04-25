import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, transition: 'zoom' }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { transition: 'slide-fade' }
      },
      // Admin Routes
      {
        path: 'admin',
        meta: { requiresRole: ['admin'] },
        children: [
          {
            path: 'users',
            name: 'AdminUsers',
            component: () => import('@/views/admin/Users.vue')
          },
          {
            path: 'customers',
            name: 'AdminCustomers',
            component: () => import('@/views/admin/Customers.vue')
          },
          {
            path: 'audit-logs',
            name: 'AuditLogs',
            component: () => import('@/views/admin/AuditLogs.vue')
          }
        ]
      },
      // Questionnaire Routes
      {
        path: 'questionnaires',
        meta: { requiresRole: ['admin', 'evaluator'] },
        children: [
          {
            path: '',
            name: 'Questionnaires',
            component: () => import('@/views/questionnaires/QuestionnaireList.vue')
          },
          {
            path: 'create',
            name: 'CreateQuestionnaire',
            component: () => import('@/views/questionnaires/QuestionnaireBuilder.vue')
          },
          {
            path: ':id/edit',
            name: 'EditQuestionnaire',
            component: () => import('@/views/questionnaires/QuestionnaireBuilder.vue')
          }
        ]
      },
      // Response Routes
      {
        path: 'responses',
        children: [
          {
            path: '',
            name: 'Responses',
            component: () => import('@/views/responses/ResponseOverview.vue')
          },
          {
            path: ':id',
            name: 'ResponseDetail',
            component: () => import('@/views/responses/ResponseDetail.vue')
          },
          {
            path: 'form/:questionnaireId',
            name: 'ResponseForm',
            component: () => import('@/views/responses/ResponseForm.vue')
          },
          {
            path: 'form/:questionnaireId/:responseId',
            name: 'EditResponseForm',
            component: () => import('@/views/responses/ResponseForm.vue')
          },
          {
            path: 'assignment/:assignmentId',
            name: 'AssignmentResponseForm',
            component: () => import('@/views/responses/ResponseForm.vue')
          }
        ]
      },
      // Profile
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresRole && !to.meta.requiresRole.includes(authStore.user?.role)) {
    next('/')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router

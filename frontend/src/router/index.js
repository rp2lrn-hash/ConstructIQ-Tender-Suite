import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
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
      // Tender Routes
      {
        path: 'tenders',
        children: [
          {
            path: '',
            name: 'Tenders',
            component: () => import('@/views/tenders/TenderList.vue')
          },
          {
            path: 'create',
            name: 'CreateTender',
            component: () => import('@/views/tenders/TenderForm.vue'),
            meta: { requiresRole: ['admin', 'evaluator'] }
          },
          {
            path: ':id',
            name: 'TenderDetail',
            component: () => import('@/views/tenders/TenderDetail.vue')
          },
          {
            path: ':id/edit',
            name: 'EditTender',
            component: () => import('@/views/tenders/TenderForm.vue'),
            meta: { requiresRole: ['admin', 'evaluator'] }
          }
        ]
      },
      // Vendor Routes
      {
        path: 'vendors',
        children: [
          {
            path: '',
            name: 'Vendors',
            component: () => import('@/views/vendors/VendorList.vue')
          },
          {
            path: 'create',
            name: 'CreateVendor',
            component: () => import('@/views/vendors/VendorForm.vue')
          },
          {
            path: ':id',
            name: 'VendorDetail',
            component: () => import('@/views/vendors/VendorDetail.vue')
          }
        ]
      },
      // Bid Routes
      {
        path: 'bids',
        children: [
          {
            path: '',
            name: 'Bids',
            component: () => import('@/views/bids/BidList.vue')
          },
          {
            path: 'create',
            name: 'CreateBid',
            component: () => import('@/views/bids/BidForm.vue')
          },
          {
            path: ':id',
            name: 'BidDetail',
            component: () => import('@/views/bids/BidDetail.vue')
          }
        ]
      },
      // Evaluation Routes
      {
        path: 'evaluations',
        meta: { requiresRole: ['admin', 'evaluator'] },
        children: [
          {
            path: '',
            name: 'Evaluations',
            component: () => import('@/views/evaluations/EvaluationList.vue')
          },
          {
            path: ':id',
            name: 'EvaluationDetail',
            component: () => import('@/views/evaluations/EvaluationDetail.vue')
          }
        ]
      },
      // Contract Routes
      {
        path: 'contracts',
        meta: { requiresRole: ['admin', 'evaluator'] },
        children: [
          {
            path: '',
            name: 'Contracts',
            component: () => import('@/views/contracts/ContractList.vue')
          },
          {
            path: 'create',
            name: 'CreateContract',
            component: () => import('@/views/contracts/ContractForm.vue')
          },
          {
            path: ':id',
            name: 'ContractDetail',
            component: () => import('@/views/contracts/ContractDetail.vue')
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

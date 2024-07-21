  import { createRouter, createWebHistory } from 'vue-router'

  import LoginView from '../views/LoginView.vue'
  import RegisterView from '../views/SignUpView.vue'
  import ProfileView from '../views/ProfileView.vue'
  import ForgotPasswordView from '../views/ForgotPasswordView.vue'
  import MisionView from '../views/MisionView.vue'
  import MisionRewardView from '../views/MisionRewardView.vue'
  import MisionResultsView from '../views/MisionResultsView.vue'
  import AdminView from '../views/AdminView.vue'


  const routes = [
    {
      path: '/',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true } // Esta ruta requiere autenticación
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signin',
      name: 'signin',
      component: RegisterView
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView
    },
    {  
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true } // Esta ruta requiere autenticación
    },
    {
      path: '/misions/:missionId',
      name: 'MissionView',
      component: MisionView,
    },
    {
      path: '/misionResults/:missionId',
      name: 'MissionResultsView',
      component: MisionResultsView
    },
    {
      path: '/misionResults/:missionId/reward',
      name: 'MissionRewardView',
      component: MisionRewardView
    }
  ];

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
  });

  export default router
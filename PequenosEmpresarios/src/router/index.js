  import { createRouter, createWebHistory } from 'vue-router'
  import {useCrudStore} from "@/stores/crudUserAndmisions.js";
  import {useAuthStore} from '@/stores/auth.js';

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
      component: LoginView,
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
      meta: { 
        requiresAuth: true,
        rolesAllowed: ['admin'] //rol requerido
       } // Esta ruta requiere autenticación
    },
    {
      path: '/misions/:missionId',
      name: 'MissionView',
      component: MisionView,
      meta: { 
        requiresAuth: true,
        rolesAllowed: ['estudiante'] //rol requerido
       }
    },
    {
      path: '/misionResults/:missionId',
      name: 'MissionResultsView',
      component: MisionResultsView,
      meta: { 
        requiresAuth: true,
        rolesAllowed: ['profe'] //rol requerido
       }
    },
    {
      path: '/misionResults/:missionId/reward',
      name: 'MissionRewardView',
      component: MisionRewardView,
      meta: { 
        requiresAuth: true,
        rolesAllowed: ['profe'] //rol requerido
       }
    }
  ];

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
  });


  // Guarda de navegación para proteger rutas según roles

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth) {
    const crudStore = useCrudStore();
    
    //obtiene el usuario
    const user = await crudStore.getUserByEmail(useAuthStore().currentUserEmail);

    if (!user) {
      next('/login');
      return;
    }

    const userRole = user.rol;
    const rolesAllowed = to.meta.rolesAllowed;

    //Comprueba los roles del usuario vs los solicitados por la vista
    if (rolesAllowed && !rolesAllowed.includes(userRole)) {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

  export default router
<script setup>
import NavBarPrincipal from './components/NavBarPrincipal.vue';
import { useAuthStore } from '@/stores/auth.js';

const authStore = useAuthStore()
</script>


<template>
  <NavBarPrincipal/>
  <div class="flex justify-center " >
    <div :class="{ 'w-full':!authStore.
    currentUserEmail, 'h-screen pt-28 w-10/12':authStore.
    currentUserEmail}">
    
      <RouterView/>
    </div>
    
  </div>
</template>
<script setup>
import {ref, onMounted, onBeforeUnmount, onBeforeMount, onUnmounted} from "vue";
import {useAuthStore} from '@/stores/auth.js';
import {useCrudStore} from "@/stores/crudUserAndMisions.js";
import {useRouter} from "vue-router";

const crudStore = useCrudStore();
const router = useRouter();
const user = ref([]);
const authStore = useAuthStore();
const mobile = ref(false);
const scrolledNav = ref(0);
const mobileNav = ref(false);
let windowWidth = window.innerWidth;

function checkScreen() {
  windowWidth = window.innerWidth;
  if (windowWidth <= 640) {
    mobile.value = true;
  } else {
    mobile.value = false;
    mobileNav.value = false;
  }
}

function updateScroll() {
  scrolledNav.value = window.scrollY;
  if (scrolledNav.value > 0) {
    mobile.value = true;
  } else {
    mobile.value = false;
  }
}


onMounted(() => {
  window.addEventListener("scroll", updateScroll);
  updateScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateScroll);
});

onBeforeMount(() => {
  if (!authStore.currentUserEmail) {
    router.push("/login")
  }
  window.addEventListener("resize", checkScreen);
  checkScreen();

});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreen);
});

onMounted(async () => {

  user.value = await crudStore.getUserByEmail(useAuthStore().currentUserEmail);
});


</script>

<template>
  <header
      v-if="authStore.currentUserEmail"
      class="w-full fixed z-50 bg-[#1f1f1f] text-white">
    <nav class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 p-3">
      <div class="relative flex items-center justify-between">
        <div>
          <router-link to="/">
            <img src="@/assets/LogoH.png" alt="logo" class="object-contain w-56 xs:w-48 pr-10"/>
          </router-link>
        </div>
        <div v-if="user.rol === 'profe'">
          <ul class="navigation flex gap-10 text-xl font-semibold items-center">
            <li class="hover:text-[#10d2c1]">

              <router-link :to="{ name: 'profile' }"><i class="fa-solid fa-house"/> Inicio</router-link>
            </li>
            <li class="hover:text-[#10d2c1]" @click="authStore.signout">
              <router-link :to="{ name: 'login' }"><i class="fa-solid fa-sign-out"/> Cerrar sesión</router-link>
            </li>
          </ul>
        </div>
        <div v-else>
          <ul class="navigation flex gap-10 text-xl font-semibold items-center">
            <li class="hover:text-[#eea854]">

              <router-link :to="{ name: 'profile' }"><i class="fa-solid fa-house"/> Inicio</router-link>
            </li>
            <li class="hover:text-[#eea854]" @click="authStore.signout">
              <router-link :to="{ name: 'login' }"><i class="fa-solid fa-sign-out"/> Cerrar sesión</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>



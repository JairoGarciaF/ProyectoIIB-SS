<script setup>
import { useCrudStore } from "@/stores/crudUserAndmisions.js";
import { onMounted, ref } from "vue";
import { useAuthStore } from '@/stores/auth.js';
import { useRoute } from "vue-router";

const authStore = useAuthStore(); // Inicio el store de auth
const route = useRoute()
const crudStore = useCrudStore(); // Inicio el store del crud de users y missions
const user = ref("");
const edad = ref(0);
const currentYear = new Date().getFullYear(); // Obtener el año actual

onMounted(async () => {
  // Obtener el usuario actual
  user.value = await crudStore.getUserByEmail(authStore.currentUserEmail);
  // Calcular la edad del usuario
  edad.value = currentYear - user.value.anionac;
});

</script>

<template>
  <div class="mx-5 my-4 p-6 bg-white rounded-md shadow-md grid justify-items-center">
    <h3 class="font-bold text-2xl text-primary"><i class="fa-solid fa-book"></i> JUEGO DE PLANIFICACIÓN</h3>
    <hr class="w-full my-2 border border-primary">
    <br>
    <!-- Put the game of plannification -->
    <p>Llega hasta el <span class="text-primary font-bold">nivel 13</span> de este juego, hacerlo te ayudará a mejorar tus habilidades de planificación</p>
    <iframe src="https://www.juegosjuegos.com/embed/flow-free-online" width="640" height="480" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="no" webkitallowfullscreen="true" mozallowfullscreen="true" msallowfullscreen="true" allowfullscreen="true" />
    <hr class="my-2">
    <hr class="w-full my-2 border border-primary">
    <hr class="my-2">
    <label class="text-primary" for="nivel_maximo">Responde al terminar: ¿Hasta qué nivel llegaste? </label>
    <input class="input input-primary" type="number" name="" id="nivel_maximo">
    <hr class="my-2">
    <button  class="btn btn-primary mb-4" @click="crudStore.saveUserMission(authStore.currentUserEmail, route.params.missionId)">Enviar respuesta</button>
  </div>
</template>



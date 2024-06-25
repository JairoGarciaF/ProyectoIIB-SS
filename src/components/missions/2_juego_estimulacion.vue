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
    <h3 class="font-bold text-2xl text-primary"><i class="fa-solid fa-book"></i> JUEGO DE ESTIMULACIÓN</h3>
    <hr class="w-full my-2 border border-primary">
    <br>
    <p>Obtén el mayor puntaje en este juego, al finalizar envía tu puntaje.</p>
    <!-- Put the game of ESTIMULATION -->
    <div v-if="edad >= 8 && edad <= 10">
      <iframe src='https://www.miniplay.com/embed/papa-s-pancakeria' class="w-full h-96" frameborder='0' allowfullscreen></iframe>

      <hr class="my-2">
      <hr class="w-full my-2 border border-primary">
      <hr class="my-2">
      <label class="text-primary" for="nivel_maximo">Responde al terminar: ¿Hasta qué nivel llegaste? </label>
      <input class="input input-primary" type="number" name="" id="nivel_maximo">
      <hr class="my-2">
      <hr class="w-full my-2 border border-primary">
      <hr class="my-2">
      <label class="text-primary" for="nivel_maximo">Responde al terminar: ¿Hasta qué nivel llegaste? </label>
      <input class="input input-primary" type="number" name="" id="nivel_maximo">
    </div>
    <div v-else-if="edad.value >= 11 && edad.value <= 13">
      <iframe src='https://www.minijuegos.com/embed/jewel-block' class="w-full h-96" frameborder='0' allowfullscreen></iframe>
      <hr class="my-2">
      <hr class="w-full my-2 border border-primary">
      <hr class="my-2">
      <label class="text-primary" for="nivel_maximo">Responde al terminar: ¿Cuál fue tu puntaje? </label>
      <input class="input input-primary" type="number" name="" id="nivel_maximo">
    </div>
    <div v-else>
      <iframe src="https://www.cooljuegos.com/embed/monopoly-online/" frameborder="0" scrolling="no" class="w-full h-96" allowfullscreen></iframe>
      <hr class="my-2">
      <hr class="w-full my-2 border border-primary">
      <hr class="my-2">
      <label class="text-primary" for="nivel_maximo">Responde al terminar: ¿Cuál fue tu puntaje? </label>
      <input class="input input-primary" type="number" name="" id="nivel_maximo">
    </div>
    <hr class="my-2">
    <button  class="btn btn-primary mb-4" @click="crudStore.saveUserMission(authStore.currentUserEmail, route.params.missionId)">Enviar respuesta</button>
</template>



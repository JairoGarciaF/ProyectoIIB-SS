<script setup>
import { useCrudStore } from "@/stores/crudUserAndmisions.js";
import { useAuthStore } from '@/stores/auth.js';
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";


const authStore = useAuthStore(); // Inicio el store de auth
const crudStore = useCrudStore(); // Inicio el store del crud de users y missions
const user = ref("");
const edad = ref(0);
const currentYear = new Date().getFullYear(); // Obtener el año actual
const route = useRoute()
const answerReady = ref(false)


onMounted(async () => {
  // Obtener el usuario actual
  user.value = await crudStore.getUserByEmail(authStore.currentUserEmail);
  // Calcular la edad del usuario
  edad.value = currentYear - user.value.anionac;
});

</script>

<template>
  <div class="mx-5 my-4 p-6 bg-white rounded-md shadow-md grid justify-items-center">
    <h3 class="font-bold text-2xl"><i class="fa-solid fa-users"></i> COMUNIDAD EMPRESARIAL JUNIOR</h3>
    <br>
    <!-- Put the BotStorming table -->
    <iframe width="100%" height="615" src="https://dotstorming.com/w/654b831ebbcf8b05c4824bf7" frameborder="0" allowfullscreen></iframe>

    <!-- Input para cerrar misión -->
    
    <hr class="border my-4 ">
    
    <h2 class="flex items-center text-purple-400">¿Has terminado la actividad y deseas terminar la misión? <input id="respuesta" type="radio" name="respuesta" class="radio radio-primary ml-2" value="si" v-model="answerReady"></h2>
    
    
    <hr class="border my-4 ">

    <button v-if="answerReady" class="btn btn-primary mb-4" @click="crudStore.saveUserMission(authStore.currentUserEmail, route.params.missionId)">Enviar respuesta</button>


  </div>
</template>



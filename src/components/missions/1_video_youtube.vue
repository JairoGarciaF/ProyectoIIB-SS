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

const questions = ref([
    // preguntas categoria A - Edad: 8-10
    { id: "1", label: "Mira este fabuloso video y responde a la pregunta", answer: "", answers: 1 }
]);

onMounted(async () => {
  // Obtener el usuario actual
  user.value = await crudStore.getUserByEmail(authStore.currentUserEmail);
  // Calcular la edad del usuario
  edad.value = currentYear - user.value.anionac;

});

</script>

<template>
  <div class="mx-5 my-4 p-6 bg-white rounded-md shadow-md grid justify-items-center">
    <h3 class="font-bold text-2xl"><i class="fa-solid fa-money-bill-1-wave"></i> ¿QUIÉN INVENTÓ EL DINERO?</h3>
    <br>
    <!-- Put the video of money -->
    <iframe class="w-[100%] h-[625px]" src="https://www.youtube.com/embed/JOdc1az2aJ8?si=qu_PiuOQ_TMi0hzW"
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen></iframe>
    <br>
    <div v-for="question in questions" :key="question.id" class="mb-5 justify-self-start w-full">
        <label :for="'respuesta-' + question.id" class="block text-gray-700 text-sm mb-2">
            {{ question.label }}
        </label>
      <textarea v-model="question.answer" :id="'respuesta-' + question.id" :name="'respuesta-' + question.id"
        class="textarea w-full border border-gray-300 p-2 rounded-md mr-2" type="text">Tu respuesta aquí</textarea>
    </div>

    <button class="btn btn-primary mb-4"
      @click="crudStore.saveUserMission(authStore.currentUserEmail, route.params.missionId)">Enviar respuestas</button>
  </div>
</template>



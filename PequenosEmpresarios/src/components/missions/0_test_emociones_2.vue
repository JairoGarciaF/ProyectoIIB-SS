<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { useCrudStore } from "@/stores/crudUserAndmisions.js";
import { useRoute } from "vue-router";
import { ref } from "vue";
    
const authStore = useAuthStore(); // Inicio el store de auth
const crudStore = useCrudStore(); // Inicio el store del crud de users y missions

const route = useRoute()

const questions = ref([
    { id: "pregunta 1", question: "Muchas veces siento asco o nauseas.", answer: "" },
    { id: "pregunta 2", question: "Soy muy nervioso (a).", answer: "" },
    { id: "pregunta 3", question: "Muchas veces me preocupa que algo malo me pase.", answer: "" },
    { id: "pregunta 4", question: "Tengo miedo que otros niños se rían de mi durante la clase.", answer: "" },
    { id: "pregunta 5", question: "Tengo demasiados dolores de cabeza.", answer: "" },
    { id: "pregunta 6", question: "Me preocupa no agradarles a otros.", answer: "" },
    { id: "pregunta 7", question: "Algunas veces me despierto asustado(a).", answer: "" },
    { id: "pregunta 8", question: "La gente me pone nervioso (a).", answer: "" },
    { id: "pregunta 9", question: "Siento que alguien va a decirme que hago mal las cosas.", answer: "" },
    { id: "pregunta 10", question: "Tengo miedo que los demás se rían de mí.", answer: "" },
    { id: "pregunta 11", question: "Me cuesta trabajo tomar decisiones.", answer: "" },
    { id: "pregunta 12", question: "Me pongo nervioso(a) cuando las cosas no me salen como quiero.", answer: "" },
    { id: "pregunta 13", question: "Parece que las cosas son más fáciles para los demás que para mí.", answer: "" },
    { id: "pregunta 14", question: "Todas las personas que conozco me caen bien.", answer: "" },
    { id: "pregunta 15", question: "Muchas veces siento que me falta el aire.", answer: "" },
    { id: "pregunta 16", question: "Casi todo el tiempo estoy preocupado(a).", answer: "" },
    { id: "pregunta 17", question: "Me siento mal si la gente se ríe de mí.", answer: "" },
    { id: "pregunta 18", question: "Muchas cosas me dan miedo. Perros, arañas, presión social", answer: "" },
    { id: "pregunta 19", question: "Siempre soy amable.", answer: "" },
    { id: "pregunta 20", question: "Me enojo con facilidad.", answer: "" },
    { id: "pregunta 21", question: "Me preocupa lo que mis papás me vayan a decir.", answer: "" },
    { id: "pregunta 22", question: "Siento que a los demás no les gusta como hago las cosas.", answer: "" },
    { id: "pregunta 23", question: "Me da miedo hablar en voz alta frente a mis compañeros durante las horas de clase.", answer: "" },
    { id: "pregunta 24", question: "Siempre me porto bien.", answer: "" },
    { id: "pregunta 25", question: "En las noches me cuesta trabajo quedarme dormido.", answer: "" },
    { id: "pregunta 26", question: "Me preocupo lo que la gente piense de mí.", answer: "" },
    { id: "pregunta 27", question: "Me siento solo(a) aunque esté acompañado.", answer: "" },
    { id: "pregunta 28", question: "En la escuela se burlan de mí.", answer: "" },
    { id: "pregunta 29", question: "Siempre soy bueno(a).", answer: "" },
    { id: "pregunta 30", question: "Es muy fácil herir mis sentimientos.", answer: "" },
    { id: "pregunta 31", question: "Me sudan las manos.", answer: "" },
    { id: "pregunta 32", question: "Me preocupa cometer errores frente a la gente.", answer: "" },
    { id: "pregunta 33", question: "Siempre soy agradable con todos.", answer: "" },
    { id: "pregunta 34", question: "Me canso mucho.", answer: "" },
    { id: "pregunta 35", question: "Me preocupa lo que va a pasar.", answer: "" },
    { id: "pregunta 36", question: "Los demás son más felices que yo.", answer: "" },
    { id: "pregunta 37", question: "Temo hablar en voz alta de delante de un grupo.", answer: "" },
    { id: "pregunta 38", question: "Siempre digo la verdad.", answer: "" },
    { id: "pregunta 39", question: "Tengo pesadillas.", answer: "" },
    { id: "pregunta 40", question: "A veces me enojo.", answer: "" },
    { id: "pregunta 41", question: "Me preocupa que durante la clase me hagan participar.", answer: "" },
    { id: "pregunta 42", question: "Me siento preocupado(a) cuando me voy a dormir en la noche.", answer: "" },
    { id: "pregunta 43", question: "Me puesta trabajo concentrarme en mis tareas escolares.", answer: "" },
    { id: "pregunta 44", question: "A veces digo cosas que no debería decir.", answer: "" },
    { id: "pregunta 45", question: "Me preocupa que alguien me dé una golpiza.", answer: "" },
    { id: "pregunta 46", question: "Me muevo mucho en mi asiento.", answer: "" },
    { id: "pregunta 47", question: "Muchas personas están en mi contra.", answer: "" },
    { id: "pregunta 48", question: "He dicho alguna mentira.", answer: "" },
    { id: "pregunta 49", question: "Me preocupa decir alguna tontería.", answer: "" },
]);



</script>

<template>
    
    <div v-for="question in questions" :key="question.id" class="mb-2 max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
    <ul>
        <!-- Primer elemento -->
        <h2 class="text-purple-400">{{"Pregunta " + question.id.replace(/\D/g, '') + ": "+ question.question}}</h2>
        <hr class="border my-2 border-purple-100">
        <li class="flex justify-between items-center mb-2">
            <span>Si</span>
            <input :id="question.id" type="radio" :name="question.id" class="radio radio-primary ml-2" value="si">
        </li>
        <hr class="my-1">
        <!-- Segundo elemento -->
        <li class="flex justify-between items-center mb-2">
            <span>No</span>
            <input :id="question.id" type="radio" :name="question.id" class="radio radio-primary ml-2" value="no">
        </li>
        <hr class="my-1">

    </ul>
</div>

<div class="flex justify-center">
    <br>
    <button class="btn btn-primary mb-4" @click="crudStore.saveUserMission(authStore.currentUserEmail, route.params.missionId)">Enviar respuestas</button>
</div>




</template>



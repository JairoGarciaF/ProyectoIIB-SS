<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { useCrudStore } from "@/stores/crudUserAndmisions.js";
import { useRoute } from "vue-router";
import { ref } from "vue";
    
const authStore = useAuthStore(); // Inicio el store de auth
const crudStore = useCrudStore(); // Inicio el store del crud de users y missions

const route = useRoute()

const questions = ref([
    { id: "pregunta 1", option1: "Estoy triste de vez en cuando.", option2: "Estoy triste muchas veces.", option3: "Estoy triste siempre.", answer: "" },
    { id: "pregunta 2", option1: "Nunca me saldrá nada bien", option2: "No estoy seguro de si las cosas me saldrán bien.", option3: "Las cosas me saldrán bien", answer: "" },
    { id: "pregunta 3", option1: "Hago bien la mayoría de las cosas.", option2: "Hago mal muchas cosas", option3: "Todo lo hago mal", answer: "" },
    { id: "pregunta 4", option1: "Me divierten muchas cosas", option2: "Me divierten algunas cosas", option3: "Nada me divierte", answer: "" },
    { id: "pregunta 5", option1: "Soy malo siempre", option2: "Soy malo muchas veces", option3: "Soy malo algunas veces", answer: "" },
    { id: "pregunta 6", option1: "A veces pienso que me pueden ocurrir cosas malas.", option2: "Me preocupa que me ocurran cosas malas.", option3: "Estoy seguro de que me van a ocurrir cosas terribles", answer: "" },
    { id: "pregunta 7", option1: "Me odio", option2: "No me gusta como soy", option3: "Me gusta como soy", answer: "" },
    { id: "pregunta 8", option1: "Todas las cosas malas son culpa mía", option2: "Muchas cosas malas son culpa mía.", option3: "Generalmente no tengo la culpa de que ocurran cosas malas.", answer: "" },
    { id: "pregunta 9", option1: "No pienso en matarme", option2: "Pienso en matarme pero no lo haría", option3: "Quiero matarme", answer: "" },
    { id: "pregunta 10", option1: "Tengo ganas de llorar todos los días", option2: "Tengo ganas de llorar muchos días", option3: "Tengo ganas de llorar de cuando en cuando.", answer: "" },
    { id: "pregunta 11", option1: "Las cosas me preocupan siempre", option2: "Las cosas me preocupan muchas veces", option3: "Las cosas me preocupan de cuando en cuando", answer: "" },
    { id: "pregunta 12", option1: "Me gusta estar con la gente", option2: "Muy a menudo no me gusta estar con la gente", option3: "No quiero en absoluto estar con la gente", answer: "" },
    { id: "pregunta 13", option1: "No puedo decidirme", option2: "Me cuesta decidirme", option3: "Me decido fácilmente", answer: "" },
    { id: "pregunta 14", option1: "Tengo buen aspecto", option2: "Hay algunas cosas de mi aspecto que no me gustan", option3: "Soy feo", answer: "" },
    { id: "pregunta 15", option1: "Siempre me cuesta ponerme a hacer los deberes", option2: "Muchas veces me cuesta ponerme a hacer los deberes", option3: "No me cuesta ponerme a hacer los deberes", answer: "" },
    { id: "pregunta 16", option1: "Todas las noches me cuesta dormirme", option2: "Muchas noches me cuesta dormirme.", option3: "Duermo muy bien", answer: "" },
    { id: "pregunta 17", option1: "Estoy cansado de cuando en cuando", option2: "Estoy cansado muchos días", option3: "Estoy cansado siempre", answer: "" },
    { id: "pregunta 18", option1: "La mayoría de los días no tengo ganas de comer", option2: "Muchos días no tengo ganas de comer", option3: "Como muy bien", answer: "" },
    { id: "pregunta 19", option1: "No me preocupa el dolor ni la enfermedad", option2: "Muchas veces me preocupa el dolor y la enfermedad", option3: "Siempre me preocupa el dolor y la enfermedad", answer: "" },
    { id: "pregunta 20", option1: "Nunca me siento solo.", option2: "Me siento solo muchas veces", option3: "Me siento solo siempre", answer: "" },
    { id: "pregunta 21", option1: "Nunca me divierto en el colegio", option2: "Me divierto en el colegio sólo de vez en cuando.", option3: "Me divierto en el colegio muchas veces", answer: "" },
    { id: "pregunta 22", option1: "Tengo muchos amigos", option2: "Tengo muchos amigos pero me gustaría tener más", option3: "No tengo amigos", answer: "" },
    { id: "pregunta 23", option1: "Mi trabajo en el colegio es bueno", option2: "Mi trabajo en el colegio no es tan bueno como antes", option3: "Llevo muy mal las asignaturas que antes llevaba bien", answer: "" },
    { id: "pregunta 24", option1: "Nunca podré ser tan bueno como otros niños", option2: "Si quiero puedo ser tan bueno como otros niños", option3: "Soy tan bueno como otros niños", answer: "" },
    { id: "pregunta 25", option1: "Nadie me quiere", option2: "No estoy seguro de que alguien me quiera", option3: "Estoy seguro de que alguien me quiere", answer: "" },
    { id: "pregunta 26", option1: "Generalmente hago lo que me dicen", option2: "Muchas veces no hago lo que me dicen", option3: "Nunca hago lo que me dicen", answer: "" },
    { id: "pregunta 27", option1: "Me llevo bien con la gente", option2: "Me peleo muchas veces", option3: "Me peleo siempre", answer: "" },
]);



</script>

<template>
    
    <div v-for="question in questions" :key="question.id" class="mb-2 max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
    <ul>
        <!-- Primer elemento -->
        <h2 class="text-purple-400">{{"Pregunta " + question.id.replace(/\D/g, '')}}</h2>
        <hr class="border my-2 border-purple-100">
        <li class="flex justify-between items-center mb-2">
            <span>{{ question.option1 }}</span>
            <input :id="question.id" type="radio" :name="question.id" class="radio radio-primary ml-2" :value="question.option1">
        </li>
        <hr class="my-1">
        <!-- Segundo elemento -->
        <li class="flex justify-between items-center mb-2">
            <span>{{ question.option2 }}</span>
            <input :id="question.id" type="radio" :name="question.id" class="radio radio-primary ml-2" :value="question.option2">
        </li>
        <hr class="my-1">
        <!-- Tercer elemento -->
        <li class="flex justify-between items-center">
            <span>{{ question.option3 }}</span>
            <input :id="question.id" type="radio" :name="question.id" class="radio radio-primary ml-2" :value="question.option3">
        </li>
    </ul>
</div>

<div class="flex justify-center">
    <br>
    <button class="btn btn-primary mb-4" @click="crudStore.saveUserMission(authStore.currentUserEmail, route.params.missionId)">Enviar respuestas</button>
</div>




</template>



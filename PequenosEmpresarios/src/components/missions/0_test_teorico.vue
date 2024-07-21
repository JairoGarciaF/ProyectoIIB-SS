<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { useCrudStore } from "@/stores/crudUserAndmisions.js";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
    
const authStore = useAuthStore(); // Inicio el store de auth
const crudStore = useCrudStore(); // Inicio el store del crud de users y missions
const user = ref("");
const edad = ref(0);
const currentYear = new Date().getFullYear(); // Obtener el año actual
const route = useRoute()

onMounted(async () => {
    // Obtener el usuario actual
    user.value = await crudStore.getUserByEmail(authStore.currentUserEmail);
    // Calcular la edad del usuario
    edad.value = currentYear - user.value.anionac;

    if(edad.value >= 8 && edad.value <= 10){
        questions.value = questions.value.filter(question => question.category == "A" || question.category == "Global");
    } else if(edad.value >= 11 && edad.value <= 13){
        questions.value = questions.value.filter(question => question.category == "B" || question.category == "Global");
    } else if(edad.value >= 14 && edad.value <= 16){
        questions.value = questions.value.filter(question => question.category == "C" || question.category == "Global");
    } else {
        questions.value = questions.value.filter(question => question.category == "Global");
    }
});


const questions = ref([
    // preguntas categoria A - Edad: 8-10
    { id: "pregunta 1-A", category: "A", label: "1. Soy redonda como una pelota, pero no soy de goma. Si me pinchan, exploto, ¿qué soy?", answer: "", answers: 1 }, 
    { id: "pregunta 2-A", category: "A", label: "2. ¿Cuál es el próximo número en la serie? 2, 4, 6, 8, __", answer: "", answers: 1 }, 
    { id: "pregunta 3-A", category: "A", label: "3. Si un paquete de lápices contiene 12 lápices y compras 2 paquetes, ¿cuántos lápices tendrás en total?", answer: "", answers: 1 }, 
    { id: "pregunta 4-A", category: "A", label: "4. Encuentra la palabra intrusa: Perro, gato, hámster, avión.", answer: "", answers: 1 }, 

    // preguntas categoria B - Edad: 11-13
    { id: "pregunta 1-B", category: "B", label: "1. Un padre tiene tres hijas. Cada una tiene un hermano. ¿Cuántos hijos tiene el padre en total?", answer: "", answers: 1 }, 
    { id: "pregunta 2-B", category: "B", label: "2. Resuelve el siguiente problema de secuencias numéricas: 2, 5, 9, 14, __. ¿Cuál es el siguiente número?", answer: "", answers: 1 }, 
    { id: "pregunta 3-B", category: "B", label: "3. Si un paquete de lápices contiene 12 lápices y compras 4 paquetes, y de ellos vendes 22 ¿cuántos lápices tendrás en total?", answer: "", answers: 1 }, 
    { id: "pregunta 4-B", category: "B", label: "4. Reescribe la siguiente oración usando un sinónimo de la palabra subrayada: 'El perro ladraba fuertemente.'", answer: "", answers: 1 }, 

    // preguntas categoria C - Edad: 14-16
    { id: "pregunta 1-C", category: "C", label: "1. ¿Qué palabra se escribe incorrectamente en todos los diccionarios?", answer: "", answers: 1 }, 
    { id: "pregunta 2-C", category: "C", label: "2. ¿Qué siempre sube pero nunca baja?", answer: "", answers: 1 }, 
    { id: "pregunta 3-C", category: "C", label: "3. Calcula el resultado de: 12+5×2−412+5×2−4.", answer: "", answers: 1 }, 
    { id: "pregunta 4-C", category: "C", label: "4. Si un número disminuido en un cuarto de sí mismo es igual a 18, ¿cuál es el número?", answer: "", answers: 1 }, 

    // preguntas globales
    { id: "pregunta 5", category: "Global", label: "5. ¿Qué es ahorro?", answer: "", answers: 1 }, 
    { id: "pregunta 6", category: "Global", label: "6. ¿Qué es un presupuesto?", answer: "", answers: 1 }, 
    { id: "pregunta 7", category: "Global", label: "7. ¿Qué significa invertir dinero?", answer: "", answers: 1 }, 
    { id: "pregunta 8", category: "Global", label: "8. ¿Qué es un gerente general?", answer: "", answers: 1 }, 
    { id: "pregunta 9", category: "Global", label: "9. ¿Qué es un prestamo?", answer: "", answers: 1 }, 
    { id: "pregunta 10", category: "Global", label: "10. ¿Qué es una alianza estratégica entre empresas?", answer: "", answers: 1 }, 
]);

</script>

<template>
    
    <div class="max-w-md mx-auto my-4 p-6 bg-white rounded-md shadow-md">
    <h3 class="font-bold text-2xl">TEST TEÓRICO </h3>
    <br>
    <!-- Use v-for to loop through answers and generate input fields -->
    <div v-for="question in questions" :key="question.id" class="mb-4">
        <label :for="'respuesta-' + question.id" class="block text-gray-700 text-sm mb-2">
            {{ question.label }}
        </label>
        
        <input
            required
            v-model="question.answer"
            :id="'respuesta-' + question.id"
            :name="'respuesta-' + question.id"
            class="textarea w-full border border-gray-300 p-2 rounded-md mr-2"
            type="text"
        />
    </div>
    
    <button class="btn btn-primary mb-4" @click="crudStore.saveUserMission(authStore.currentUserEmail, route.params.missionId)">Enviar respuestas</button>

</div>




</template>



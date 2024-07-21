<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { useCrudStore } from "@/stores/crudUserAndmisions.js";
import { useRoute } from "vue-router";
import { ref } from "vue";
    
const authStore = useAuthStore(); // Inicio el store de auth
const crudStore = useCrudStore(); // Inicio el store del crud de users y missions
const aceptacionChecked = ref(true)

const route = useRoute()
</script>

<template>
    <h3 class="font-bold text-2xl">CONSENTIMIENTO INFORMADO</h3>
    <h3>PROYECTO PEQUEÑOS EMPRESARIOS</h3>
    <p> Yo, <input required type="text" id="nombre" class="input input-xs mr-2 border border-purple-400" placeholder="Nombre completo">, mayor de edad, con número de cédula <input required class="input input-xs mr-2 border border-purple-400" type="text" id="cedula" placeholder="Número de cédula">, manifiesto que consiento en la participación de mi representado en el proyecto Pequeños Empresarios, cuya organización se encuentra a cargo de las empresas Fidepor S.A.S. y Psicoexpertos S.A.S. </p>
    <p>Reconozco:</p>
    <ul class="list-disc ml-4">
        <li class="list-item"> Que la información de mi representado que se pueda recolectar durante el proceso de inscripción y evaluación no puede ser divulgada a terceras personas sin mi consentimiento expreso. </li>
        <li> Que acepto que seré informado de los aspectos relacionados con el proceso de aprendizaje y su evolución dentro del proyecto. </li>
        <li> Que he sido informada y consiento que mi representado asista a reuniones presenciales los días sábados con una duración de 120 minutos. Para ello me comprometo a asistir de manera puntual y evitar que mi representado falte </li>
        <li> Que en el caso de no ser posible la asistencia de mi representado lo comunicare con al menos 24 horas de antelación. </li>
        <li> Que mi representado no podrá retirarse de nuestras instalaciones de manera independiente (sin ser retirado por su representante) al menos que se envíe una carta de autorización de salida firmado por el representante, con copia de cédula para su constancia. </li>
        <li> Que durante los encuentros se puedan llevar registros a través de medios audio-visuales, que serán publicados en medios sociales sin que ello ponga en riesgo la integridad de la persona. </li>
        <li> Declaro que la asistencia de mi representado es de manera voluntaria y por tal motivo puedo cesar la asistencia cuando desee bajo mi propia responsabilidad, sin que ello represente una devolución de la inversión económica realizada. </li>
        <!-- Agrega más elementos <li> según sea necesario -->
    </ul>
    <!-- Agrega más párrafos y elementos <li> según sea necesario -->
    <br>
    <p class="font-bold">En Quito, <input required :value="new Date().toLocaleDateString()" disabled type="text" id="fechaAceptacion">
    </p>
    <br>
    <!-- Agrega más elementos HTML según sea necesario -->
    <!-- Botón de submit -->
    <label class="text-purple-500 mr-2" for="checkbox">He leido y acepto el consentimiento informado</label>
    <input type="checkbox" class="checkbox checkbox-primary" id="aceptacion" v-model="aceptacionChecked">

    <hr class="my-2">
    <button class="btn btn-primary mb-4" type="submit" value="He leido y acepto" v-if="aceptacionChecked" @click="crudStore.saveUserMission(authStore.currentUserEmail, route.params.missionId)">Enviar aceptación</button>


</template>



<script setup>
import {useCrudStore} from "@/stores/crudUserAndmisions.js";
import {onBeforeMount, onMounted, watchEffect, ref} from "vue";
import {useRoute} from "vue-router";
import ScrollPanel from 'primevue/scrollpanel';
import Textarea from 'primevue/textarea';



const route = useRoute()
const crudStore = useCrudStore(); // Inicio el store del crud de users y missions
const userAnswer = ref(false); //0. Aquí guardaré la info de la bdd

const recompensaSeleccionada = ref(1);
const feedback = ref('');
const misionMonedas = ref(0);
const puntuacionesPermitidas = ref([]);
const user = ref([]);
const missionInformation = ref([]);
const userFound = ref([]);
const fechaEntrega = ref('');


// Validación para asegurarse de que solo se permitan valores enteros
watchEffect(() => {
  const esNumeroEntero = recompensaSeleccionada.value && Number.isInteger(Number(recompensaSeleccionada.value));
  if (!esNumeroEntero) {
    recompensaSeleccionada.value = ''; // Limpiar si no es un número entero
  }
});

// 0. Obtener el contenido de las misiones de la bdd según el parámetro de ruta
onBeforeMount(async () => {
  user.value = await crudStore.getUserByEmail(sessionStorage.getItem('email_user_selected'));
  missionInformation.value = await crudStore.getMissionInformation(user.value.curso, route.params.missionId);

  misionMonedas.value = missionInformation.value.monedas;
  puntuacionesPermitidas.value = Array.from({length: misionMonedas.value }, (_, index) => index + 1 );
  const rawAnswers = await crudStore.getStudentAnswers(route.params.missionId, user.value.correo);

  // Filtra las claves y asigna solo las preguntas a userAnswer
  let filteredAnswers = {};
  for (let key in rawAnswers) {
    if (key.startsWith("pregunta")) {
      filteredAnswers[key] = rawAnswers[key];
    }
  }

  userAnswer.value = filteredAnswers;
  userFound.value = missionInformation.value.state_2_sent.find(objetoUsuario => objetoUsuario.correo === user.value.correo);

  fechaEntrega.value = formatearFecha(userFound.value.fechaEnvio);
});

onMounted(() => {
});

function formatearFecha(timestamp) {
  const fecha = timestamp.toDate();

  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const año = fecha.getFullYear();

  const nombreMeses = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic"
  ];
  const nombreMes = nombreMeses[mes - 1];

  return `${dia} ${nombreMes} ${año}`;
}

const handleSubmit = () => {
  // Llama a la función para registrar un usuario
  crudStore.storeGrade(route.params.missionId, user.value.curso, user.value.correo, recompensaSeleccionada.value, userFound.value.edad, user.value.nombre, feedback.value);
};

</script>

<template>
  <div class="inset-x-0 h-full mx-auto max-w-7xl  sm:px-6 lg:px-8 gap-2">
    <!-- LADO IZQUIERDOOOOOOOOOOOOO -->
    <div class="order-last h-full lg:order-first">
      <!-- Descripción de missiones -->

      <h1 class="text-3xl sm:text-3xl border-l-4 inline-block border-[#0db1ab] lg:text-4xl text-[#0db1ab] font-semibold px-3 my-3 sm:my-4 lg:my-5">
        <i class="fa-solid fa-clipboard"></i> Misión:
      </h1>
      <h1 class="text-4xl sm:text-3xl inline-block lg:text-4xl text-gray-500 font-semibold my-3 sm:my-4 lg:my-5">
        {{ missionInformation.nombre }}</h1>


      <div class="p-2 sm:p-3 border bg-[#0db1ab] rounded-xl">
        <h2 class="text-2xl sm:text-2xl mb-3 text-white font-medium flex items-center gap-2 "><i
            class="fa-solid fa-user text-lg"></i> {{ user.nombre }}
        </h2>
        <div class="flex gap-2">
                  <span class="bg-[#fce4c7] text-[#b37c39] p-2 rounded-xl text-xs font-medium m-1">
                    Edad: <span class="  text"> {{ userFound.edad }} años <i
                      class="fa-solid fa-cake-candles"></i></span>
                </span>
          <span class="bg-purple-100 m-1 text-purple-500 p-2 rounded-xl text-xs font-medium">
                    Fecha de entrega: <span Activo="  text"> {{ fechaEntrega }} <i
              class="fa-solid fa-calendar-days"></i></span>
                </span>
        </div>
      </div>
      <!-- Que llame a las consultas a la base de datos -->
      <div class="grid grid-cols-1 grid-rows-1 sm:grid-cols-2 lg:grid-cols-4  gap-4 content-center">
        <div class="px-1 sm:mt-5 col-span-2 sm:col-span-2 lg:col-span-2 h-full">
          <h2 class="text-2xl sm:text-2xl font-medium p-2 sm:p-3 text-blue-600 border-l-4 border-blue-600 bg-gradient-to-r from-blue-100">
            Desarrollo</h2>
          <div class="my-2 py-3 px-2 border-2  border-blue-600/20 rounded-xl">
            <ScrollPanel style="height: 400px;"
                         :pt="{
                          wrapper: {
                              style: { 'border-right': '10px solid var(--surface-ground)' }
                          },
                          bary: 'hover:bg-blue-400 bg-blue-600/50'
                      }">
              <ul>
                <li v-for="(answer, index) in userAnswer" :key="index" class="px-2 py-4">
                    <span class="text-red-500">
                      <i class="fa-solid fa-question w-4 text-center"></i>
                      <span class="text-gray-500 font-semibold"> Q: </span>
                      <span class="text-gray-500"> {{ index.charAt(0).toUpperCase() + index.slice(1) }}</span>
                    </span>
                  <hr>
                  <span class="text-sky-200">
                      <i class="fa-solid fa-comment w-4"></i>
                      <span class="text-gray-500 font-semibold"> A: </span>
                      <span class="text-gray-500"> {{ answer }}</span>
                    </span>
                </li>
                <hr>
              </ul>
            </ScrollPanel>
          </div>

        </div>
        <div class="px-1 sm:mt-5 col-span-2 sm:col-span-2 lg:col-span-2 ">
          <h2 class="text-2xl sm:text-2xl font-medium p-2 sm:p-3 text-green-600 border-l-4 border-green-600 bg-gradient-to-r from-green-100">
            Calificar</h2>
          <div class="my-2 py-3 px-2 border-2 border-green-600/20 rounded-xl align-middle ">
            <div class="text-2xl p-2 grid grid-cols-4 gap-4">
                            <span class="col-span-4 text-xl">
                                <i class="fa-solid fa-lightbulb text-green-600"></i>
                                Retroalimentación:
                            </span>
              <Textarea id="retroalimentacion" v-model="feedback"
                        class="border  p-2 rounded-md text-sm h-36 col-start-1 col-span-4"></Textarea>

            </div>
            <div class="text-2xl p-2 flex justify-between items-center">
              <div>
                <span class="text-xl">
                  <i class="fa-solid fa-coins text-green-600"></i>
                  Recompensa:
                </span>
                <span class="justify-self-end text-xl">
                  <select id="recompensa" v-model="recompensaSeleccionada" class="border p-2 rounded-md">
                    <option v-for="puntuacion in puntuacionesPermitidas" :key="puntuacion"
                            :value="puntuacion">
                      {{ puntuacion }} <i class="fa-solid fa-coins"></i>
                    </option>
                  </select>
                </span>
              </div>
              <button @click="handleSubmit"
                      class="transition p-5 w-1/2 bg-[#291836] border-2 border-white hover:bg-green-700 text-white text-lg rounded-lg font-bold col-start-2 col-span-2">

                <i class="fa-solid fa-paper-plane text-xl text-[#EEA854]"></i>
                Calificar

              </button>
            </div>

          </div>

        </div>
        <br>
      </div>
    </div>


    <!-- LADO IZQUIERDOOOOOOOOOOOOO ENDDDDDD-->

    <!-- LADO DERECHOOOOOOOOOO -->
    <div
        class="col-span-4   lg:col-span-1 text-center w-full text-gray-500 text-lg sm:text-lg font-bold sm:my-4 lg:my-5">

    </div>

    <!-- LADO DERECHOOOOOOOOOO ENDDDDDDD-->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


      <!-- <div class="grid grid-cols-4 gap-4 p-4 my-2 sm:my-3 mx-2 sm:mx-3 rounded-xl border-2 border-[#191919]"
  :class="{
    'bg-[#191919] text-white': mission.estado === 'Pendiente',
    'bg-[#0FD2C0] text-[#191919]': mission.estado === 'Por revisar',
    'bg-[#EEA854] text-[#191919]': mission.estado === 'Completado'
  }"> -->
      <!-- <h3 class="text-xl font-semibold">{{ mission.short }}</h3> -->

    </div>
    <!-- LADO DERECHOOOOOOOOOO ENDDDDDDDDD-->


  </div>
</template>
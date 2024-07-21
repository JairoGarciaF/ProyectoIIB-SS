<script setup>
import {useCrudStore} from "@/stores/crudUserAndmisions.js";
import {useAuthStore} from '@/stores/auth.js';
import {onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";


const route = useRoute()
const crudStore = useCrudStore(); // Inicio el store del crud de users y missions
//const userAnswer = ref(false); //0. Aquí guardaré la info de la bdd
const router = useRouter()
const missionInformation = ref([]); // Obtener la informacion de la mision
const user = ref([]);
const numStudents = ref(0);

// Redirección por router a las respuestas de la misión que toca
const handleMisionButton = (mision, email) => {
  const fixedTextMision = quitarTildes(mision).replace(/\s/g, "-").toLowerCase();
  router.push(`/misionResults/${fixedTextMision}/reward`);
  sessionStorage.setItem('email_user_selected', email);
};

// Función para quitar tildes
function quitarTildes(cadena) {
  return cadena
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
}


// 0. Obtener el contenido de las misiones de la bdd según el parámetro de ruta
onBeforeMount(async () => {
  //userAnswer.value = await crudStore.getUserAnswersbyMission(route.params.missionId, authStore.currentUserEmail);
});

onMounted(async () => {
  user.value = await crudStore.getUserByEmail(useAuthStore().currentUserEmail);
  missionInformation.value = await crudStore.getMissionInformation(user.value.curso, route.params.missionId);
  numStudents.value = missionInformation.value.state_1_pending.length; // Número de estudiantes que han completado la misión
});

</script>

<template>
  <div class="inset-x-0 mx-auto max-w-7xl sm:px-6 lg:px-8 gap-2">
    <!-- LADO IZQUIERDOOOOOOOOOOOOO -->
    <div class="order-last lg:order-first">
      <!-- Descripción de missiones -->

      <h1 class="text-3xl sm:text-3xl border-l-4 inline-block border-[#0db1ab] lg:text-4xl text-[#0db1ab] font-semibold px-3 my-3 sm:my-4 lg:my-5"> <i
          class="fa-solid fa-book"></i> Misión:
        </h1>
      <h1 class="text-4xl sm:text-3xl inline-block lg:text-4xl text-gray-500 font-semibold my-3 sm:my-4 lg:my-5">
        {{ missionInformation.nombre }}</h1>

      <div class="p-4 border bg-[#0db1ab] h-fit rounded-xl">
        <h2 class="text-2xl sm:text-2xl mb-2 text-white font-medium ">
          <i class="fa-solid fa-circle-exclamation"></i> Número de estudiantes por completar la misión:
          <span class="text-[#b3e7e5] font-bold">
                         {{ numStudents }}
                    </span>
        </h2>
        <div class="flex gap-2">
          <span class="bg-[#fce4c7] text-[#b37c39] p-2 rounded-xl text-xs font-medium">
                    Monedas disponibles de asignar: <span class="text"> {{ missionInformation.monedas }} <i
              class="fa-solid fa-coins"></i></span>
                </span>
          <!--<span class="bg-purple-100 m-1 text-purple-500 p-2 rounded-xl text-xs font-medium"
              v-if="userAnswer.finished">
              Estado: <span class="  text"> Terminado <i class="fa-solid fa-flag"></i></span>
          </span>-->
          <span class="bg-green-100 text-green-500 p-2 rounded-xl text-xs font-medium">
                    Estado: <span Activo="  text"> Activo <i class="fa-solid fa-flag"></i></span>
                </span>
        </div>
      </div>
      <!-- Que llame a las consultas a la base de datos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 content-center">
        <!-- Estudiantes por calificar -->
        <div class="px-1 sm:mt-5 col-span-2 sm:col-span-2 lg:col-span-2">
          <h2 class="text-2xl sm:text-2xl text-yellow-600 font-medium bg-gradient-to-r from-yellow-100 sm:p-3 border-l-4 border-yellow-600 ">
            Por calificar </h2>
          <div class="my-2 py-3 px-2  ">
            <!--Estudiantes que no ha sido calificado-->
            <ul>
              <li @click="handleMisionButton(missionInformation.misionId, student.correo)"
                  v-for="(student, index) in missionInformation.state_2_sent" :key="index"
                  class="p-2 text-yellow-600 hover:font-bold cursor-pointer hover:bg-yellow-100/40 rounded-xl py-3">
                                <span>
                                    <span class="text-gray-500"> {{ student.nombre }} - {{ student.edad }} años </span>
                                    | <span class="text-gray-500"> {{
                                    crudStore.convertTimestampToDate(student.fechaEnvio)
                                  }}
                                    </span>
                                </span>
              </li>
            </ul>
          </div>
        </div>
        <!-- Estudiantes calificados -->
        <div class="px-1 sm:mt-5 col-span-2 sm:col-span-2 lg:col-span-2">
          <h2 class="text-2xl sm:text-2xl font-medium p-2 sm:p-3 text-green-600 border-l-4 border-green-600 bg-gradient-to-r from-green-100">
            Calificados </h2>
          <div class="my-2 py-3 px-2 ">
            <ul>
              <li v-for="(student, index) in missionInformation.state_3_finished" :key="index"
                  class="p-2 flex text-green-600 justify-between">
                                <span>
                                    <span class="text-gray-500"> {{ student.nombre }} - {{ student.edad }} años </span>
                                    | <span class="text-gray-500">
                                        {{ crudStore.convertTimestampToDate(student.fechaCalificacion) }} </span>
                                </span>
                <span class="justify-self-end">
                                    {{ student.monedas_obtenidas }} <i class="fa-solid fa-coins text-[#f4cd11]"></i>
                                </span>
              </li>
            </ul>
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
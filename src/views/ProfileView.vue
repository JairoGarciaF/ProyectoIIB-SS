<script setup>
import {onMounted, ref} from "vue";
import {useCrudStore} from "@/stores/crudUserAndMisions.js";
import {useAuthStore} from '@/stores/auth.js';
import {useRouter} from "vue-router";


const router = useRouter();
const crudStore = useCrudStore();

const missions = ref([]);
const courseInformation = ref([]); // Tiene toda la informacion de un curso

const user = ref([]);
const userHistoric = ref([]);

const sortedMissions = (courseInformation) => {
  const missionsWithOutEmail = [];
  const missionsWithEmail = [];

  courseInformation.curso_misiones.forEach((mission) => {
    const state_2_sent = mission.state_2_sent || [];
    const state_3_finished = mission.state_3_finished || [];

    if ((state_2_sent.length > 0 && state_2_sent.some(userDetails => userDetails.correo === user.value.correo)) || (state_3_finished.length > 0 && state_3_finished.some(userDetails => userDetails.correo === user.value.correo))) {
      missionsWithEmail.push(mission);
    } else {
      missionsWithOutEmail.push(mission);
    }
  });

  return missionsWithOutEmail.concat(missionsWithEmail);
};

const storeMission = (item) => {
  // Store the selected mission
  sessionStorage.setItem("userMissionSelected", item);
};

// Redirección por router a la misión que toca
const handleMisionButton = (mision) => {
  const fixedTextMision = quitarTildes(mision).replace(/\s/g, "-").toLowerCase();
  router.push(`/misions/${fixedTextMision}`);
};

// Redirección por router al resultado de la mision que toca
const handleResultMisionButton = (mision) => {
  const fixedTextMision = quitarTildes(mision).replace(/\s/g, "-").toLowerCase();
  router.push(`/misionResults/${fixedTextMision}`);
};

function quitarTildes(cadena) {
  return cadena
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
}

onMounted(async () => {
  user.value = await crudStore.getUserByEmail(useAuthStore().currentUserEmail);
  courseInformation.value = await crudStore.getCourseInformation(user.value.curso);
  if (user.value.rol === 'estudiante') {
    missions.value = sortedMissions(courseInformation.value);
  } else {
    missions.value = courseInformation.value.curso_misiones;
  }
  userHistoric.value = await crudStore.getStudentHistoric(user.value.correo);
});


</script>


<template>
  <!--esta es la parte del estudiante-->
  <div class="student " v-if="user.rol === 'estudiante'">
    <br>
    <div class="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 gap-4 items-center">
      <div class="col-span-3">
        <h1 class="text-4xl sm:text-3xl lg:text-4xl font-semibold my-3 sm:my-4 lg:my-5">
          <i class="fa-solid fa-user mr-3 sm:mr-4 text-[#eea854] text-4xl sm:text-4xl"></i>
          ¡Hola, {{ user.nombre }}!
        </h1>
      </div>
      <div class="text-center w-full text-[#0db1ab] text-lg sm:text-lg font-bold my-3 sm:my-4 lg:my-5">
        <h1 class="text-xl sm:text-lg text-black font-medium p-2 sm:p-3 border-2 border-[#eea854] rounded-2xl">
          Total:
          {{ user.monedas }} <i class="fa-solid fa-coins text-2xl sm:text-lg text-[#f4cd11]"></i>
        </h1>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- Misiones actuales -->
      <div class="mt-3 sm:mt-5 col-span-1 sm:col-span-2 lg:col-span-3">
        <h2 class="text-3xl font-medium p-2 sm:p-3 text-[#eea854] border-l-4 border-[#eea854]"> Misiones
          actuales </h2>

        <div v-if="missions.length === 0" class="mt-4 bg-orange-100 text-orange-500 p-4 rounded-md col-span-3 text-sm">
          Aquí verás las misiones que te asignaron.
        </div>
        <div class="my-2 sm:my-3 mx-2 sm:mx-3 grid grid-cols-2  gap-6">
          <div v-for="(mission, index) in missions" :key="index">
            <button
                v-if="mission.state_2_sent.length > 0 && mission.state_2_sent.some(userDetails => userDetails.correo === user.correo) || mission.state_3_finished.length > 0 && mission.state_3_finished.some(userDetails => userDetails.correo === user.correo)"
                class="flex flex-col items-center justify-between w-full h-full col-span-2 lg:col-span-1 p-2 sm:p-4 lg:p-4 my-2 sm:my-3 border-2 border-gray-600 rounded-xl cursor-default">

              <div class="col-span-3 sm:col-span-2 ">
                <div class="mt-auto">
                  <h3 class="text-green-500 text-lg font-bold"><i class="fa fa-flag"></i> Misión completada </h3>
                  <h3 class="text-gray-500 text-lg font-bold mb-3">
                    {{
                      mission.nombre
                    }} </h3>

                  <p>{{
                      mission.short && mission.short.length > 80 ? mission.short.substring(0, 80) + "..." : mission.short
                    }}</p>
                </div>

              </div>
              <div class="w-full text-xl">
                <!-- Botón si ya envío -->
                <div
                    class="transition p-4 w-full bg-gray-600 text-white rounded-lg cursor-default">
                  Misión enviada: <span class="text-[#EEA854] font-semibold">{{ mission.monedas }}</span> <i
                    class="fa-solid fa-coins text-xl text-[#EEA854]"></i>
                </div>
              </div>
            </button>
            <button
                v-else
                class="flex flex-col items-center justify-between w-full h-full col-span-2 lg:col-span-1 p-2 sm:p-4 lg:p-4 my-2 sm:my-3 border-2 border-[#EEA854] rounded-xl cursor-default">

              <div class="col-span-3 sm:col-span-2 ">
                <div class="mt-auto">
                  <h3 class="text-black text-xl font-bold "><i class="fa fa-flag text-red-500"></i> Misión </h3>
                  <h3 class="text-[#bb8342] text-xl font-bold mb-3">{{
                      mission.nombre
                    }}
                  </h3>
                  <p>{{
                      mission.short && mission.short.length > 80 ? mission.short.substring(0, 80) + "..." : mission.short
                    }}</p>
                </div>

              </div>
              <div class="w-full text-xl">

                <!-- Botón si aún no ha empezado -->
                <button @click="handleMisionButton(mission.misionId)"
                        class="transition p-4 w-full bg-[#EEA854] hover:bg-[#bb8342] text-white rounded-lg font-bold cursor-pointer">
                  Empezar misión <span class=""> +{{ mission.monedas }}</span> <i
                    class="fa-solid fa-coins text-xl text-[#ffe735]"></i>
                </button>
              </div>
            </button>
          </div>

        </div>
      </div>

      <!-- Misiones completadas -->
      <div class="mt-3 sm:mt-5 col-span-1 sm:col-span-2 lg:col-span-1">
        <h2 class="text-2xl font-medium p-2 sm:p-3 text-[#eea854] border-l-4 border-[#eea854]">
          Historial
        </h2>
        <div v-if="userHistoric.length === 0" class="mt-4 bg-orange-100 text-orange-500 p-4 rounded-md text-sm">Aquí
          verás
          las monedas que
          recolectarás
          durante tu viaje con pequeños empresarios, pasará una vez se califiquen tus misiones
        </div>
        <ul class="mt-4">
          <li v-for="(historic, index) in userHistoric" :key="index">
            <div v-if="!historic.state_3_finished" class="grid grid-cols-4 gap-4 p-2 justify-center items-center">
              <div v-if="historic.monedas > 0" class=" col-span-1 text-center w-full text-black text-md font-bold">
                +{{ historic.monedas }} <i class="fa-solid fa-coins text-lg text-[#f4cd11]"></i>
              </div>
              <div v-else class=" col-span-1 text-center w-full text-red-400 text-md font-bold">
                - {{ historic.monedas }} <i class="fa-solid fa-coins text-lg "></i>
              </div>
              <div class="col-span-3">
                <h3 class="text-md font-semibold truncate">Misión: {{ historic.nombre }}</h3>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>


  <!--DOCENTEEEEEEEEEEEEEEEE-->
  <div class="teacher" v-else-if="user.rol === 'profe'">
    <br>
    <div class="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 gap-4 items-center">
      <div class="col-span-3">
        <h1 class="text-4xl sm:text-3xl lg:text-4xl font-semibold my-3 sm:my-4 lg:my-5">
          <i class="fa-solid fa-user mr-3 sm:mr-4 text-[#0db1ab] text-4xl sm:text-4xl"></i>
          ¡Hola, {{ user.nombre }}!
        </h1>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Misiones actuales -->
      <div class="mt-3 sm:mt-5 col-span-1 sm:col-span-2 lg:col-span-3">
        <div class="text-3xl font-medium p-2 sm:p-3 text-[#0db1ab] border-l-4 border-[#0db1ab]"> Misiones
          actuales </div>
        <div v-if="missions.length === 0" class="mt-4 bg-orange-100 text-orange-500 p-4 rounded-md col-span-3 text-sm">
          Aquí verás las misiones disponibles.
        </div>
        <ul v-if="missions" class="mx-2 sm:mx-3 grid grid-cols-2 gap-5">
          <button @click="handleResultMisionButton(mission.misionId)" v-for="(mission, index) in missions" :key="index"
                  class="flex items-end justify-center w-full col-span-2 lg:col-span-1 hover:bg-[#0db1ab50]  bg-[#0db1ab20] border-[#0db1ab10] transition ease-in-out duration-300 hover:scale-105 p-2 sm:p-4 lg:p-4 border-2  rounded-xl ">
            <div class="col-span-3 sm:col-span-2 ">
              <div class="mt-auto">
                <h3 class="text-[#0db1ab] text-xl mb-3 font-bold">
                  Misión {{ mission.nombre }}
                </h3>
              </div>
              <div class="text-center flex missions-center justify-center text-lg">
                <button @click="storeMission(mission.nombre)"
                        class="flex justify-center items-center  w-full  text-gray-900 rounded-lg font-semibold">
                  <div class="px-2 py-1 m-1 p-1 border-2 border-red-600 bg-red-200 rounded-md ">
                    <i class="fa-solid fa-x mr-3 text-red-600"></i>
                    <span>{{ courseInformation.curso_misiones[index].state_1_pending.length }}</span>
                    <p class="flex text-xs text-red-600">Sin enviar</p>
                  </div>
                  <div class="px-2 py-1 m-1 p-1 border-2 border-yellow-600 bg-yellow-200 rounded-md ">
                    <i class="fa-solid fa-envelope-open text-yellow-600"></i>
                    <span class="ml-3">{{ courseInformation.curso_misiones[index].state_2_sent.length }}</span>
                    <p class="flex text-xs text-yellow-600">Por calificar</p>
                  </div>
                  <div class="px-2 py-1 m-1 p-1 border-2 border-green-600 bg-green-200 rounded-md ">
                    <i class="fa-solid fa-check mr-3 text-green-600"></i>
                    <span>{{ courseInformation.curso_misiones[index].state_3_finished.length }}</span>
                    <p class="flex text-xs text-green-600">Calificados</p>
                  </div>
                </button>

              </div>

            </div>
          </button>
        </ul>
      </div>
      <!-- Misiones completadas -->
      <div class="mt-3 sm:mt-5 col-span-1 sm:col-span-2 lg:col-span-1">
        <h2 class="text-2xl font-medium p-2 sm:p-3 text-[#0db1ab] border-l-4 border-[#0db1ab] ">
          Historial
        </h2>
        <div class="mt-7 bg-orange-100 text-orange-500 p-4 rounded-md text-sm">Aquí verás las anteriores misiones que
          los
          niños completaron durante su viaje con pequeños empresarios.
        </div>
        <div class="my-2 sm:my-3 mx-2 sm:mx-3">
          <!-- Add your completed missions here with similar styling as above -->
          <!-- <p class="text-gray-400"><span class="text-red-300">-10</span> <i
              class="fa-solid fa-coins text-2xl sm:text-lg text-red-300"></i> Por portarse mal en clase</p>
          <hr class="border border-2">
          <p class="text-gray-400"><span class="text-[#EEA854]">+3</span> <i
              class="fa-solid fa-coins text-2xl sm:text-lg text-[#EEA854]"></i> Por completar tu perfil</p>
          <hr class="border border-2"> -->
        </div>
      </div>
    </div>
  </div>
</template>

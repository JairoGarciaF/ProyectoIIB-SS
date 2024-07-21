  <script setup>
  import { useCrudStore } from "@/stores/crudUserAndmisions.js";
  import { useAuthStore } from '@/stores/auth.js';
  import {onBeforeMount, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { usePrimeVue } from 'primevue/config';
  import Knob from 'primevue/knob';
  const value = ref(0);
  const authStore = useAuthStore(); // Inicio el store de auth
  const route = useRoute()
  const crudStore = useCrudStore(); // Inicio el store del crud de users y missions
  const mission = ref(null); //0. Aquí guardaré la info de la bdd
  const userAnswer = ref(false); //0. Aquí guardaré la info de la bdd
  let dynamicComponent = null;
  
  // 0. Obtener el contenido de las misiones de la bdd según el parámetro de ruta
  onBeforeMount(async () => {
    mission.value = await crudStore.getUserMissionSelected(route.params.missionId);
    userAnswer.value = await crudStore.getUserAnswersbyMission(route.params.missionId, authStore.currentUserEmail)
  });


  // 1. Obtener el componente dinámicamente dependiento del parámetro de ruta
  const getAsyncComponent = async () => {
    dynamicComponent = (await import(`../components/missions/${route.params.missionId}.vue`)).default
  }
  
  onMounted(() => {
    const PrimeVue = usePrimeVue();
    PrimeVue.changeTheme('lara-light-teal', 'lara-light-amber', 'lara-light-teal-link', () => {});

    getAsyncComponent()
  })

  </script>

  <template>
    <div class="inset-x-0 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 gap-2">
      <!-- LADO IZQUIERDOOOOOOOOOOOOO -->
      <div v-if="mission" class="order-last lg:order-first">
        <!-- Descripción de missiones -->
        <div class="flex">
          <h1 class="text-3xl sm:text-3xl border-l-4 inline-block border-[#eea854] lg:text-4xl text-[#eea854] font-semibold px-3 my-3 sm:my-4 lg:my-5"><i class="fa-solid fa-book"></i> Misión: </h1>
          <h1 class="text-4xl sm:text-3xl inline-block lg:text-4xl text-gray-500 font-semibold my-3 sm:my-4 lg:my-5">
            {{mission.nombre}}</h1>
        </div>

        <div class="p-4 border bg-[#eea854] rounded-xl">
          <h2 class="text-2xl sm:text-2xl mb-2 text-white font-medium "><i class="fa fa-circle-question"></i> ¿Qué debo hacer? </h2>

          <p class="text-sm text-white pb-4"> {{ mission.short }}</p>
          <span class="bg-[#fce4c7] text-[#b37c39] p-2 rounded-xl text-xs font-medium">
            Monedas a ganar: <span class="  text">{{ mission.monedas }} <i class="fa-solid fa-coins"></i></span>
          </span>  
          <span class="bg-purple-100 text-purple-500 p-2 rounded-xl text-xs font-medium" v-if="userAnswer.finished">
            Estado: <span class="  text"> Terminado <i class="fa-solid fa-flag"></i></span>
          </span>  
          <span class="bg-green-100 text-green-500 p-2 rounded-xl text-xs font-medium m-1" v-if="!userAnswer.finished">
            Estado: <span Activo="  text"> Activo <i class="fa-solid fa-flag"></i></span>
          </span>
        </div>
        
        <!-- Html traido desde los componentes -->
        <div v-if="userAnswer.finished" class="border-2 border-purple-500 rounded-lg p-5 my-3">
          <p class="text-gray-500">Ya has entregado esta misión, una vez de califiquen te asignarán nuevas monedas.</p>
          <hr class="my-2">
          <router-link to="/">
            <button class="btn btn-primary">Regresar</button>
          </router-link>
        </div>
        
        <div v-if="!userAnswer.finished" class="border-2 border-purple-500 rounded-lg p-5 my-3 ">
          <component  :is="dynamicComponent" />

        </div>

        


      </div>


    <!-- LADO IZQUIERDOOOOOOOOOOOOO ENDDDDDD-->

    <!-- LADO DERECHOOOOOOOOOO -->
    <div v-if="mission" class="col-span-4   lg:col-span-1 text-center w-full text-gray-500 text-lg sm:text-lg font-bold sm:my-4 lg:my-5">

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

<script setup>
import { useCrudStore } from "@/stores/crudUserAndmisions.js";
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRoute } from "vue-router";
import DynamicTable from "../DynamicTable.vue";

const authStore = useAuthStore(); // Inicio el store de auth
const route = useRoute();
const crudStore = useCrudStore(); // Inicio el store del crud de users y missions
const user = ref("");
const edad = ref(0);
const currentYear = new Date().getFullYear(); // Obtener el año actual

onMounted(async () => {
  // Obtener el usuario actual
  user.value = await crudStore.getUserByEmail(authStore.currentUserEmail);
  // Calcular la edad del usuario
  edad.value = currentYear - user.value.anionac;
});
</script>

<template>

    <h3 class="font-bold text-2xl text-primary">
      <i class="fa-solid fa-book"></i>LISTA DE PRODUCTOS Y SERVICIOS
    </h3>
    <hr class="w-full my-2 border border-primary" />
    <br />
    <p>
      Has una lista de todos los productos o servicios que te gustaría vender y completa la tabla con la información.
    </p>
    <div class="overflow-x-auto">
      <DynamicTable />
    </div>

    <button
      class="btn btn-primary my-4"
      @click="
        crudStore.saveUserMission(
          authStore.currentUserEmail,
          route.params.missionId
        )
      "
    >
      Enviar respuesta
    </button>
</template>

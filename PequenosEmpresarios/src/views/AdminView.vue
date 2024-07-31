<script setup>
import { useCrudStore } from '@/stores/crudUserAndMisions.js';
import { useCrudAdminStore } from "@/stores/crudAdmin.js";
import { onMounted, ref } from "vue";

const adminStore = useCrudAdminStore(); // Usar store del admin
const crudStore = useCrudStore() // Usar store del crud missions and user
const users = ref([]); // Para llenarlo de los usuarios




onMounted(async () => {
  users.value = await adminStore.getAllUsers()
});




</script>


<template>
  
  <table class="text-left min-w-full bg-white border border-gray-300">
    <thead>
      <tr>
        <th class=" py-2 px-4 border-b">Nombre</th>
        <th class="py-2 px-4 border-b">Edad</th>
        <th class="py-2 px-4 border-b">Curso</th>
        <th class="py-2 px-4 border-b">Rol</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(user, index) in users" :key="index">
        <td class="py-2 px-4 border-b"><i class="fa fa-user text-[#0DB1AB]"></i> {{ user.nombre }}</td>
        <td class="py-2 px-4 border-b">{{ user.anionac }}</td>
        <td class="py-2 px-4 border-b">
          <select @change="adminStore.addUserToCourse(user.correo, $event.target.value, user.nombre)" class="border-[#0DB1AB] select select-primary w-full max-w-xs">
            <option disabled selected>Actual: {{ user.curso }}</option>
            <option>Ninguno</option>
            <option>202311_01</option>
          </select>
        </td>
        <td class="py-2 px-4 border-b">
          <select @change="adminStore.changeUserRol(user.correo, $event.target.value)" class="border-[#0DB1AB] select select-primary w-full max-w-xs">
            <option disabled selected>Actual: {{ user.rol }}</option>
            <option>Estudiante</option>
            <option>Profesor</option>
            <option>Administrador</option>
          </select>
        </td>
      </tr>
    </tbody>
  </table>
</template>

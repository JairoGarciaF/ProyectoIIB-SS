<script setup>

/* global Swal */
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth.js';
import { ref } from 'vue';

const name = ref(null);
const birthYear = ref('');
const email = ref(null);
const password = ref(null);
const v_pass = ref(null);

const handleSubmit = () => {
  // Accede al almacén de autenticación
  const authStore = useAuthStore();

  // Llama a la función register del almacén
  authStore.register(name.value, birthYear.value, email.value, password.value, validateFields());
};

const validateYear = (event) => {
  const value = parseInt(event.target.value);
  if (value < 1950 || value > 2016 || isNaN(value)) {
    event.target.setCustomValidity("El año debe estar entre 1950 y 2016");
  } else {
    event.target.setCustomValidity("");
  }
};

const validateFields = () => {

  if (name.value !== null && birthYear.value !== '' && email.value !== null && password.value !== null && v_pass.value !== null) {
    if (birthYear.value < 1950 || birthYear.value > 2016) {
      Swal.fire({
        title: "Error",
        text: "El año debe estar entre 1950 y 2016",
        icon: "error",
        confirmButtonColor: '#3085d6'
      });
      return false;
    } else if (!checkPassword(password.value) || !checkPassword(v_pass.value)) {
      Swal.fire({
        title: "Error",
        text: "La contraseña no cumple con los requisitos: debe tener entre 8 y 15 caracteres, al menos una letra mayúscula, una minúscula, un número y un caracter especial.",
        icon: "error",
        confirmButtonColor: '#3085d6'
      });
      return false;
    } else if (checkPassword(password.value) && checkPassword(v_pass.value) && password.value !== v_pass.value) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error",
        confirmButtonColor: '#3085d6'
      });
      return false;
    } else if (checkPassword(password.value) && checkPassword(v_pass.value) && password.value === v_pass.value) {

      return true;
    } else {
      Swal.fire({
        title: "Error",
        text: "Por favor, verifique los campos",
        icon: "error",
        confirmButtonColor: '#3085d6'
      });
      return false;
    }
  } else {
    Swal.fire({
      title: "Error",
      text: "Por favor, llene todos los campos",
      icon: "error",
      confirmButtonColor: '#3085d6'
    })
    return false;
  }
};

const checkPassword = (password) => {
  const tamanioValid = /^(?=.{8,15})/;
  const minusculaValid = /^(?=.*[a-z])/;
  const mayusculaValid = /^(?=.*[A-Z])/;
  const numeroValid = /^(?=.*[0-9])/;
  const caracterValid = /^(?=.*[!@#\$%^&*])/;

  return (
    tamanioValid.test(password) &&
    minusculaValid.test(password) &&
    mayusculaValid.test(password) &&
    numeroValid.test(password) &&
    caracterValid.test(password)
  );
};
</script>


<template>
  <div class="p-10 bg-[#EEA854] absolute w-full flex items-start justify-center align-center">
    <div class="bg-white shadow-lg overflow-hidden rounded-lg w-[75%]" name="formRegistro">
      <div class="w-full sm:p-5 lg:hidden">
        <img src="../assets/Logoletras.png" alt="Logo" class="w-[75%] mx-auto py-5">
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="flex space-between items-center justify-center">
          <div class="lg:w-[50%] hidden lg:block">
            <div class="p-5 h-full w-full">
              <img src="/Logo.png" alt="Logo" class="p-3">
            </div>
          </div>
          <div class="xs:w-[50%] sx:w-full p-10">
            <div>
              <b class="text-3xl text-gray-800">Registrarse</b>
              <p class="text-gray-600">Impulsar a pequeños para que lleguen a ser grandes.</p>
            </div>
            <br>
            <div>
              <div class="flex flex-col">
                <span class="font-bold mb-1">
                  <i class="fa-solid fa-user ml-1.5 mr-3 text-[#7A59E4]"></i>Nombre
                </span>
                <input type="text" v-model="name" name="name" placeholder="Nombre completo"
                  class="p-4 rounded-lg border border-gray-300 w-full">
              </div>
            </div>
            <br>
            <div>
              <div class="flex flex-col">
                <span class="font-bold mb-1">
                  <i class="fa-solid fa-calendar ml-1.5 mr-3 text-[#7A59E4]"></i>Año de nacimiento
                </span>
                <input type="number" v-model="birthYear" name="birthYear" placeholder="AAAA"
                  class="p-4 rounded-lg border border-gray-300 w-full"
                  pattern="^(195[0-9]|19[6-9][0-9]|200[0-9]|201[0-6])" @input="validateYear" />
              </div>
            </div>
            <br>
            <div>
              <div class="flex flex-col">
                <span class="font-bold mb-1">
                  <i class="fa-solid fa-envelope ml-1.5 mr-3 text-[#7A59E4]"></i>Correo electrónico
                </span>
                <input type="email" v-model="email" name="email" placeholder="ejemplo@ejemplo.com"
                  class="p-4 rounded-lg border border-gray-300 w-full">
              </div>
            </div>
            <br>
            <div>
              <div class="flex flex-col">
                <span class="font-bold mb-1">
                  <i class="fa-solid fa-lock ml-1.5 mr-3 text-[#7A59E4]"></i>Contraseña
                </span>
                <input type="password" v-model="password" id="password" name="password" placeholder="•••••••••••"
                  @input="checkPassword($event.target.value)" minlength="8" maxlength="15" required
                  class="p-4 rounded-lg border border-gray-300 w-full">
              </div>
            </div>
            <br>
            <div>
              <div class="flex flex-col">
                <span class="font-bold mb-1">
                  <i class="fa-solid fa-check-double ml-1.5 mr-3 text-[#7A59E4]"></i>Verificación de contraseña
                </span>
                <input type="password" v-model="v_pass" id="v_pswd" name="v_pswd" placeholder="•••••••••••"
                  @input="checkPassword($event.target.value)" minlength="8" maxlength="15" required
                  class="p-4 rounded-lg border border-gray-300 w-full">
              </div>
            </div>
            <br>
            <button @click="validateFields"
              class="transition p-4 w-full bg-[#7A59E4] hover:bg-[#10D2C1] text-white rounded-lg">
              <b>Registrarse<i class="fa fa-log-in"></i></b>
            </button>
            <br>
            <br>
            <div class="text-center">
              <router-link to="/login" class="text-[#0FD2C0] hover:text-[#11727C] cursor-pointer">
                <b>¿Ya tienes cuenta?</b>
              </router-link>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>


<style scoped>
.validation ul {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.validation ul li {
  list-style: none;
  font-size: 0.9em;
  transition: 0.5s;
}

.validation ul li.valid {
  color: #11727C;
  display: inline;
}

.validation ul li .valid i.text-green-500 {
  display: inline;
  /* Mostrar el ícono verde */

}

/* Estilo para los íconos rojos */
.validation ul li .valid i.text-red-500 {
  display: none;
  /* Ocultar el ícono rojo */
}
</style>  
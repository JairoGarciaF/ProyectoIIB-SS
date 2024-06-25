<template>
    <div class="p-10 bg-[#EEA854] absolute w-full xl:h-full lg:h-full md:h-full sm:h-full flex items-center justify-center">
        <div class="bg-white shadow-lg overflow-hidden rounded-lg w-[75%]">
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
                            <b class="text-3xl text-gray-800">Recuperar cuenta</b>
                            <p class="text-gray-600">Ingresa tu correo electrónico para recuperar tu cuenta.</p>
                        </div>
                        <br>
                        <div>
                            <div class="flex flex-col">
                                <span class="font-bold mb-1">
                                    <i class="fa-solid fa-envelope ml-1.5 mr-3 text-[#7A59E4]"></i>Email
                                </span>
                                <input type="email" v-model="email" name="email" placeholder="example@example.com"
                                    class="p-4 rounded-lg border border-gray-300 w-full">
                            </div>
                        </div>
                        <br>
                        <button type="submit"
                            class="transition p-4 w-full bg-[#7A59E4] hover:bg-[#10D2C1] text-white rounded-lg">
                            <b>Enviar correo</b>
                        </button>
                        <br>
                        <br>
                        <div class="text-center">
                            <router-link to="/signin" class="text-[#0FD2C0] hover:text-[#11727C] cursor-pointer">
                                <b>¿No tienes cuenta?</b>
                            </router-link>
                        </div>
                        <div class="text-center">
                            <router-link to="/login" class="text-[#1F1F1F] hover:text-[#11727C] cursor-pointer">
                                <b>Volver a iniciar sesión</b>
                            </router-link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { ref } from 'vue';

const email = ref(null);
const password = ref(null);


const handleSubmit = () => {
    // Accede al almacén de autenticación
    const authStore = useAuthStore();

    // Llama a la función register del almacén
    authStore.resetPassword(email.value);
};
</script>
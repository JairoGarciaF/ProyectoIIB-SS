<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { ref, onMounted, watch } from 'vue';
const email = ref(null);
const password = ref(null);
const showCaptcha = ref(false);
const loginAttempts = ref(0);
const recaptchaResponse = ref(null);
const recaptchaWidgetId = ref(null);

const renderRecaptcha = () => {
    window.grecaptcha.ready(() => {
        recaptchaWidgetId.value = window.grecaptcha.render('recaptcha', {
            sitekey: import.meta.env.VITE_RECAPTCHA2_SITE_KEY,
            callback: onRecaptchaVerified,
        });
    });
};

const handleSubmit = async () => {
    if (showCaptcha.value && !recaptchaResponse.value) {
        alert('Por favor, completa el reCAPTCHA.');
        return;
    }

    let captchaValid = true;

    if (showCaptcha.value) {
        const response = await fetch('http://localhost:5000/verify-recaptcha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: recaptchaResponse.value })
        });
        const data = await response.json();
        captchaValid = data.success;
    }

    if (captchaValid) {
        const authStore = useAuthStore();
        try {
            await authStore.login(email.value, password.value);
            loginAttempts.value = 0; // Reiniciar intentos al iniciar sesión exitosamente
            recaptchaResponse.value = null; // Resetear el reCAPTCHA
            showCaptcha.value = false; // Ocultar el reCAPTCHA
        } catch (error) {
            loginAttempts.value += 1;
            if (loginAttempts.value >= 3) {
                showCaptcha.value = true;
                window.grecaptcha.reset(recaptchaWidgetId.value); // Resetear el reCAPTCHA
            }
        }
    } else {
        alert('reCAPTCHA no válido. Por favor, inténtalo de nuevo.');
        window.grecaptcha.reset(recaptchaWidgetId.value); // Resetear el reCAPTCHA
    }
};

const onRecaptchaVerified = (response) => {
    recaptchaResponse.value = response;
};

watch(showCaptcha, (newVal) => {
    if (newVal) {
        renderRecaptcha();
    }
});

onMounted(() => {
    if (showCaptcha.value) {
        renderRecaptcha();
    }
});
</script>

<template>
    <div class="p-10 bg-[#EEA854] min-h-[100vh] flex items-center justify-center">
        <div class="bg-white shadow-lg overflow-hidden rounded-lg lg:w-[75%]">
            <div class="w-full sm:p-5 lg:hidden">
                <img src="../assets/Logoletras.png" alt="Logo" class="w-[75%] mx-auto py-5">
            </div>
            <form @submit.prevent="handleSubmit">
                <div class="flex space-between items-center justify-center">
                    <div class="lg:w-[75%] hidden lg:block">
                        <div class="p-5 h-full w-full flex justify-center">
                            <img src="/Logo.png" alt="Logo" class="p-3 max-w-xs">
                        </div>
                    </div>
                    <div class="xs:w-[50%] sm:w-full p-10 lg:pl-0">
                        <div>
                            <b class="text-3xl text-gray-800">Inicio de sesión</b>
                            <p class="text-gray-600">Impulsar a pequeños para que lleguen a ser grandes.</p>
                        </div>
                        <br>
                        <div>
                            <div class="flex flex-col">
                                <span class="font-bold mb-1">
                                    <i class="fa-solid fa-envelope ml-1.5 mr-3 text-[#0FD2C0]"></i>Email
                                </span>
                                <input type="email" v-model="email" name="email" placeholder="example@example.com"
                                    class="p-4 rounded-lg border border-gray-300 w-full">
                            </div>
                        </div>
                        <br>
                        <div>
                            <div class="flex flex-col">
                                <span class="font-bold mb-1">
                                    <i class="fa-solid fa-lock ml-1.5 mr-3 text-[#0FD2C0]"></i>Contraseña
                                </span>
                                <input type="password" v-model="password" name="password" placeholder="•••••••••••"
                                    class="p-4 rounded-lg border border-gray-300 w-full">
                            </div>
                        </div>
                        <br>
                        <div v-if="showCaptcha" id="recaptcha"></div>
                        <br>
                        <button type="submit"
                            class="transition p-4 w-full bg-[#0FD2C0] hover:bg-[#0DB1AB] text-white rounded-lg">
                            <b>Iniciar sesión</b>
                        </button>
                        <br>
                        <br>
                        <div class="text-center">
                            <router-link to="/signin" class="text-[#0FD2C0] hover:text-[#11727C] cursor-pointer">
                                <b>Registrarse</b>
                            </router-link>
                        </div>
                        <div class="text-center">
                            <router-link to="/forgot-password"
                                class="text-[#1F1F1F] hover:text-[#0DB1AB] cursor-pointer">
                                <b>¿Olvidaste tu contraseña?</b>
                            </router-link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
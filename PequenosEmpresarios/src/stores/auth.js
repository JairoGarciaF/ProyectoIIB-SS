import { defineStore } from 'pinia'
import Swal from 'sweetalert2';
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { ref, watchEffect } from 'vue';
import { useCrudStore } from '@/stores/crudUserAndMisions.js';
import log from '@/utils/logger';
import { getClientIp } from '@/utils/ip';

export const useAuthStore = defineStore('auth', () => {

    const sessionStatus = ref(sessionStorage.getItem('sessionStatus') || false);
    const currentUserEmail = ref(sessionStorage.getItem('currentUserEmail') || '');

    const user = ref({
        email: '',
        password: '',
        repassword: '',
        errorMessage: ''
    });
    /* global Swal */

    const register = async (name, birthYear, email, password, flag) => {
        const auth = getAuth();
        const clientIp = await getClientIp();
        if (flag == true) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    log.info(`User registered: ${email}`);
                    Swal.fire({
                        title: "¡Usuario registrado!",
                        icon: "success",
                    });

                    sendEmailVerification(auth.currentUser)
                        .then(() => {
                            log.info(`Verification email sent to: ${email}`);
                            useCrudStore().addUser(name, birthYear, email);
                        })
                        .catch((error) => {
                            log.error(`Error sending verification email: ${error}`);
                        });

                    setTimeout(function () {
                        window.location.href = "/ProyectoIIB-SS/login";
                    }, 3000);
                })
                .catch((error) => {
                    log.error(`Registration failed: ${error}`);
                    Swal.fire({
                        title: "¡Fallo al registrar usuario!",
                        icon: "error",
                    });
                });
        } else {
            log.warn(`Registration flag is false, registration aborted`);
        }
    };

    const login = async (email, password) => {
        const auth = getAuth();
        const clientIp = await getClientIp();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                if (userCredential.user.emailVerified) {
                    log.info(`User logged in: ${email}`);
                    Swal.fire({
                        title: "¡Sesión iniciada!",
                        icon: "success",
                    });
                    setTimeout(() => {
                        currentUserEmail.value = userCredential.user.email;
                        localStorage.setItem("emailStatus", user.value.emailVerified);
                        window.location.href = "/";
                    }, 3000);
                } else {
                    log.warn(`User tried to log in without email verification: ${email}`);
                    Swal.fire({
                        title: "¡Verifica tu correo!",
                        icon: "warning",
                        text: "¿Reenviar link de verificación?",
                        showCancelButton: true,
                        confirmButtonText: "Sí, enviar",
                        cancelButtonText: "Cancelar",
                    })
                        .then(resultado => {
                            if (resultado.value) {
                                sendEmailVerification(auth.currentUser);
                                log.info(`Verification email resent to: ${email}`);
                            }
                        });
                }
            })
            .catch((error) => {
                log.error(`Login failed for user ${email}: ${error}`);
                Swal.fire({
                    title: "¡Fallo al iniciar sesión!",
                    icon: "error",
                });
            });
    };

    const signout = async () => {
        const auth = getAuth();
        const clientIp = await getClientIp();
        signOut(auth).then(() => {
            log.info(`User signed out: ${currentUserEmail.value}`);
            Swal.fire({
                title: "¡Sesión cerrada!",
                icon: "success",
            });

            currentUserEmail.value = "";
            sessionStatus.value = "";
        }).catch((error) => {
            log.error(`Sign out failed: ${error}`);
        });
    };

    const onauthstatechanged = async () => {
        const auth = getAuth();
        const clientIp = await getClientIp();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                log.info(`Auth state changed, user signed in: ${user.email}`);
                sessionStatus.value = true;
            } else {
                log.info(`Auth state changed, user signed out`);
                sessionStatus.value = false;
            }
        });
    };

    const resetPassword = async (email) => {
        const auth = getAuth();
        const clientIp = await getClientIp();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                log.info(`Password reset email sent to: ${email}`);
                Swal.fire({
                    title: "¡Correo enviado!",
                    icon: "success",
                });
            })
            .catch((error) => {
                log.error(`Password reset email failed for ${email}: ${error}`);
            });
    };

    watchEffect(() => {
        sessionStorage.setItem('sessionStatus', sessionStatus.value);
        sessionStorage.setItem('currentUserEmail', currentUserEmail.value);
    });

    return {
        register,
        login,
        signout,
        onauthstatechanged,
        resetPassword,
        sessionStatus,
        currentUserEmail
    };
});
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

    const register = async (name, birthYear, email, password, flag) => {
        const auth = getAuth();
        const clientIp = await getClientIp();
        if (flag) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    log.info('auth', `User registered: ${email}`);
                    Swal.fire({
                        title: "¡Usuario registrado!",
                        icon: "success",
                        confirmButtonColor: '#3085d6'
                    });

                    sendEmailVerification(auth.currentUser)
                        .then(() => {
                            log.info('auth', `Verification email sent to: ${email}`);
                            useCrudStore().addUser(name, birthYear, email);
                        })
                        .catch((error) => {
                            log.error('auth', `Error sending verification email: ${error}`);
                        });

                    setTimeout(() => {
                        window.location.href = "/ProyectoIIB-SS/login";
                    }, 3000);
                })
                .catch((error) => {
                    log.error('auth', `Registration failed: ${error}`);
                    Swal.fire({
                        title: "¡Fallo al registrar usuario!",
                        icon: "error",
                        confirmButtonColor: '#3085d6'
                    });
                });
        } else {
            log.warn('auth', `Registration flag is false, registration aborted`);
        }
    };

    const login = async (email, password) => {
        const auth = getAuth();
        const clientIp = await getClientIp();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                if (userCredential.user.emailVerified) {
                    log.info('auth', `User logged in: ${email}`);
                    Swal.fire({
                        title: "¡Sesión iniciada!",
                        icon: "success",
                        confirmButtonColor: '#3085d6'
                    });
                    setTimeout(() => {
                        currentUserEmail.value = userCredential.user.email;
                        localStorage.setItem("emailStatus", user.value.emailVerified);
                        window.location.href = "/";
                    }, 3000);
                } else {
                    log.warn('auth', `User tried to log in without email verification: ${email}`);
                    Swal.fire({
                        title: "¡Verifica tu correo!",
                        icon: "warning",
                        text: "¿Reenviar link de verificación?",
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: "Sí, enviar",
                        cancelButtonText: "Cancelar",
                    })
                        .then(resultado => {
                            if (resultado.value) {
                                sendEmailVerification(auth.currentUser);
                                log.info('auth', `Verification email resent to: ${email}`);
                            }
                        });
                }
            })
            .catch((error) => {
                log.error('auth', `Login failed for user ${email}: ${error}`);
                Swal.fire({
                    title: "¡Fallo al iniciar sesión!",
                    icon: "error",
                    confirmButtonColor: '#3085d6'
                });
            });
    };

    const signout = async () => {
        const auth = getAuth();
        const clientIp = await getClientIp();
        signOut(auth).then(() => {
            log.info('auth', `User signed out: ${currentUserEmail.value}`);
            Swal.fire({
                title: "¡Sesión cerrada!",
                icon: "success",
                confirmButtonColor: '#3085d6'
            });

            currentUserEmail.value = "";
            sessionStatus.value = "";
        }).catch((error) => {
            log.error('auth', `Sign out failed: ${error}`);
        });
    };

    const onauthstatechanged = async () => {
        const auth = getAuth();
        const clientIp = await getClientIp();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                log.info('auth', `Auth state changed, user signed in: ${user.email}`);
                sessionStatus.value = true;
            } else {
                log.info('auth', `Auth state changed, user signed out`);
                sessionStatus.value = false;
            }
        });
    };

    const resetPassword = async (email) => {
        const auth = getAuth();
        const clientIp = await getClientIp();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                log.info('auth', `Password reset email sent to: ${email}`);
                Swal.fire({
                    title: "¡Correo enviado!",
                    icon: "success",
                    confirmButtonColor: '#3085d6'
                });
            })
            .catch((error) => {
                log.error('auth', `Password reset email failed for ${email}: ${error}`);
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

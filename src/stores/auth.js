import { defineStore } from 'pinia'
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { ref, watchEffect } from 'vue';
import { useCrudStore } from '@/stores/crudUserAndMisions.js';


export const useAuthStore = defineStore('auth', () => {

    // This variable is used to store the session status
    const sessionStatus = ref(sessionStorage.getItem('sessionStatus') || false);

    // This variable is used to store the current user's email
    const currentUserEmail = ref(sessionStorage.getItem('currentUserEmail') || '');

    const user = ref({
        email: '',
        password: '',
        repassword: '',
        errorMessage: ''
    });
    /* global Swal */

    const register = (name, birthYear, email, password, flag) => {
        const auth = getAuth();
        if (flag == true) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    Swal.fire({
                        title: "¡Usuario registrado!",
                        icon: "success",
                    });

                    sendEmailVerification(auth.currentUser)
                        .then(() => {
                            useCrudStore().addUser(name, birthYear, email);
                        })
                        .catch((error) => {
                            // Ocurrió un error al enviar el correo de verificación
                            console.error('Error al enviar el correo de verificación', error);
                        });

                    // Redirect to page in 3 seconds
                    setTimeout(function () {
                        window.location.href = "/login";
                    }, 3000);
                })
                .catch((error) => {
                    let errorMessage = error.message;
                    console.log(errorMessage);
                    Swal.fire({
                        title: "¡Fallo al registrar usuario!",
                        icon: "error",
                    });
                });
        } else {
            console.log("Error en el registro");
        }
    };

    const login = (email, password) => {
        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                if (userCredential.user.emailVerified) {
                    Swal.fire({
                        title: "¡Sesión iniciada!",
                        icon: "success",
                    });
                    setTimeout(() => {
                        // Signed in
                        currentUserEmail.value = userCredential.user.email;
                        // Crear una variable en el almacenamiento local y almacenar un valor
                        localStorage.setItem("emailStatus", user.value.emailVerified);
                        // Redirect to page in 3 seconds
                        window.location.href = "/";
                    }, 3000);
                } else {
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
                                // Hicieron click en "Sí"
                                sendEmailVerification(auth.currentUser);
                            }
                        });
                }
            })
            .catch((error) => {
                let errorMessage = error.message;
                console.log(errorMessage);
                Swal.fire({
                    title: "¡Fallo al iniciar sesión!",
                    icon: "error",
                });
            });
    };

    const signout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            Swal.fire({
                title: "¡Sesión cerrada!",
                icon: "success",
            });

            currentUserEmail.value = ""
            sessionStatus.value = ""
        }).catch((error) => {
            console.error(error);
        });
    };

    const onauthstatechanged = () => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                sessionStatus.value = true
            } else { // User is signed out
                sessionStatus.value = false
            }
        });
    };

    const resetPassword = (email) => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                Swal.fire({
                    title: "¡Correo enviado!",
                    icon: "success",
                });
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                // ..
            });
    };

    watchEffect(() => {
        sessionStorage.setItem('sessionStatus', sessionStatus.value) // Llamar a la acción con el usuario activo
        sessionStorage.setItem('currentUserEmail', currentUserEmail.value)
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
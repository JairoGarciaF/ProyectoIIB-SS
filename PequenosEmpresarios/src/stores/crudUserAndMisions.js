import { defineStore } from 'pinia';
import Swal from 'sweetalert2';
import { db } from '@/main.js';
import { updateDoc, setDoc, collection, getDocs, getDoc, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuthStore } from '@/stores/auth.js';
import { useRouter } from "vue-router";
import { ref } from "vue";
import log from '@/utils/logger';
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const useCrudStore = defineStore('crud', () => {

    /* global Swal */
    const router = useRouter()



    // 1. Obtener la información del usuario con el email
    const getUserByEmail = async (email) => {
        const userSnapshot = await getDoc(doc(db, "usuarios", email));

        if (userSnapshot.exists()) {
            const encryptedUserData = userSnapshot.data();
            const decryptedUser = {
                anionac: decryptData(encryptedUserData.anionac),
                correo: encryptedUserData.correo,
                curso: encryptedUserData.curso,
                monedas: encryptedUserData.monedas,
                nombre: decryptData(encryptedUserData.nombre),
                rol: encryptedUserData.rol
            };
            return decryptedUser;
        } else {
            console.log("No such document!");
            return null;
        }
    };


    // 2. Agregar usuario con el email
    const addUser = async (nombre, anio, correo) => {
        try {
            // Utiliza el correo electrónico como ID
            const docRef = doc(db, "usuarios", correo);

            // Establece los datos del documento
            await setDoc(docRef, {
                nombre: encryptData(nombre),
                anionac: encryptData(anio.toString()),
                correo: correo,
                rol: "estudiante",
                monedas: 0,
                curso: "202311_01"
            });

            log.info('user', `User ${correo} added successfully`);

            // Agregar una subcolección "historial" al documento creado
            //const historialRef = collection(docRef, 'historial');

        } catch (error) {
            log.error('user', `Error adding user ${correo}: ${error}`)
            console.log("Error adding document: ", error);
        }
    };


    // 3. Eliminar usuarios
    const deleteUser = async (id) => {
        try {
            await deleteDoc(doc(db, "usuarios", id));
            log.info('user', `User with id ${id} deleted successfully`);
        } catch (error) {
            log.error('user', `Error deleting user ${id}: ${error}`);
        }
    };


    // 4. Update user coins
    const updateUserCoins = async (userEmail, coins) => {
        const userRef = doc(db, "usuarios", userEmail);
        const userSnapshot = await getDoc(userRef);
        const userCoins = userSnapshot.data().monedas;

        await updateDoc(userRef, {
            monedas: userCoins + coins
        });
        log.info('user', `User's ${userEmail} coins updated to ${userCoins + coins}`);
    };


    // 5. Obtener la misión seleccionada
    const getUserMissionSelected = async (misionRoute) => {
        // Get the current user's email
        const refMission = doc(db, "misiones", misionRoute);

        const snapshot = await getDoc(refMission);

        return snapshot.data();
    };


    // 6. Obtener todas las misiones
    const getMissionsDocs = async () => {
        // Obtiene una referencia a la colección "cursos"
        const missionsRef = collection(db, 'misiones');
        const missionQuerySnapshot = await getDocs(missionsRef);
        const missions = []
        missionQuerySnapshot.forEach((doc) => {
            let mission = doc.data();
            mission.id = doc.id;
            missions.push(mission);
        });
        return missions;
    }


    // 7 Obtener toda la informacion de un curso
    const getCourseInformation = async (course) => {
        const courseRef = doc(db, "cursos", course);
        const courseSnapshot = await getDoc(courseRef);
        const courseData = courseSnapshot.data()
        return courseData;
    }


    // 7.1 Convertir _timestamp a fecha dd/mm/yyyy
    const convertTimestampToDate = (timestamp) => {
        const date = timestamp.toDate();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }


    // 7.2 Obtener la informacion de una mision con respecto a un curso
    const getMissionInformation = async (course, mission) => {
        const courseRef = doc(db, "cursos", course);
        const courseSnapshot = await getDoc(courseRef);
        const courseMissions = courseSnapshot.data().curso_misiones;

        for (let key in courseMissions) {
            let mision = courseMissions[key];
            if (mision.misionId === mission) {
                return mision;
            }
        }
        return false;
    }


    // 7.3 Obtener las respuestas de un estudiante a una misión
    const getStudentAnswers = async (missionRoute, userEmail) => {
        try{
            const missionProgressRef = doc(db, "misiones", missionRoute, "usersAnswers", userEmail);
            const missionProgressSnapshot = await getDoc(missionProgressRef);

            if (missionProgressSnapshot.exists()) {
                // Verificar si el documento existe antes de acceder a sus datos
                const missionData = missionProgressSnapshot.data();
                return missionData.mission_answer;
            } else {
                Swal.fire({
                        title: "El estudiante con correo no tiene respuesta para la misión",
                        icon: "info",
                        confirmButtonColor: '#3085d6'
                    });
                    log.warn('mission', `No answers found for student ${userEmail}`);
            }
        } catch (error) {
            log.error('mission', `Error retrieving student ${userEmail} answers: ${error}`);
            throw error;
        }
    };


    // 8. Guardar el resultado de una misión
    const saveUserMission = async (userEmail, misionRoute) => {
        const fechaActual = new Date();

        // Obtener datos del usuario
        const user = await getUserByEmail(useAuthStore().currentUserEmail);
        const emailStudent = user.correo;
        
        const userDetails = {
            correo: user.correo,
            fechaEnvio: fechaActual,
            edad: fechaActual.getFullYear() - user.anionac,
            nombre: user.nombre,
        }

        try {
            const userAnswers = updateUserAnswers();

            const missionAnswersRef = doc(db, "misiones", misionRoute, "usersAnswers", userEmail);

            await setDoc(missionAnswersRef, {
                mission_answer: userAnswers
            });

            const misionStateInCourseRef = doc(db, "cursos", user.curso);
            const oldCourseDoc = await getDoc(misionStateInCourseRef);
            const missionHistoric = ref([]);

            if (oldCourseDoc.exists()) {
                const oldCourseMissions = oldCourseDoc.data().curso_misiones;

                // Encuentra la misión con misionId "misionRoute"
                const updatedMissions = Object.values(oldCourseMissions).map((mision) => {
                    if (mision.misionId === misionRoute) {
                        // Actualiza solo la misión "misionRoute"
                        if (mision.state_2_sent === undefined) {
                            mision.state_2_sent = [];
                        }
                        if (!mision.state_2_sent.includes(emailStudent)) {
                            mision.state_2_sent.push(userDetails);
                            missionHistoric.value.push(mision);
                        }
                    }
                    return mision;
                });

                await updateDoc(misionStateInCourseRef, {
                    curso_misiones: updatedMissions,
                });
            }

            Swal.fire({
                title: "Se han enviado las respuestas con éxito",
                icon: "success",
                confirmButtonColor: '#3085d6'
            });

            // Agregar historial de misiones de cada estudiante
            addStudentHistoric(missionHistoric.value[0].nombre, missionHistoric.value[0].short, missionHistoric.value[0].monedas);

            setTimeout(() => {
                router.push("/")
            }, 2 * 1000);
            log.info('mission', `User ${userEmail} mission ${misionRoute} saved successfully.`);
        } catch (error) {
            // Handle the validation error or any other error here
            Swal.fire({
                title: error,
                icon: "error",
                confirmButtonColor: '#3085d6'
            });
            log.error('mission', `Error saving user ${userEmail} mission: ${error}`);
        }
    };


    // 8.1. Toma los valores de los inputs o los textareas y genera una ventana de error si no están todos
    const updateUserAnswers = () => {
        let userAnswers = {};
        const inputs = document.querySelectorAll('input');
        const textareas = document.querySelectorAll('textarea');
        userAnswers.fecha = new Date();
        const radioGroups = {};


        // Código para inputs
        for (const input of inputs) {


            // Handle checkbox specifically

            // para checkbox
            if (input.type === 'checkbox') {
                userAnswers[input.id] = input.checked;

                // Para radios
            } else if (input.type === 'radio') {
                // para radios

                if (input.checked) {
                    radioGroups[input.name] = true;
                    userAnswers[input.id] = input.value;
                    if (input.value.trim() === '') {
                        throw new Error(`El campo '${input.id}' es requerido.`);
                    }

                    // Track checked radio buttons in a group
                } else if (!input.checked && radioGroups[input.name] != true) {
                    radioGroups[input.name] = false;
                }

                //Para textos y números
            } else if (input.type == 'text' || input.type == 'number') {
                const value = input.value;

                // Check if the input is required and empty
                if (input.required && value.trim() === '') {
                    throw new Error(`El campo '${input.id}' es requerido.`);
                }

                userAnswers[input.id] = value;
            }
        }

        Object.keys(radioGroups).forEach(groupName => {
            if (!radioGroups[groupName]) {
                throw new Error(`Al menos una opción en la '${groupName}' es requerida.`);
            }
        });

        for (const textarea of textareas) {
            const value = textarea.value.trim();
            if (textarea.required && value === '') {
                throw new Error(`El campo '${textarea.id}' es requerido.`);
            } else {
                userAnswers[textarea.id] = value;
            }
        }

        return userAnswers;
    };


    // 9. Traer respuesta a la misión del estudiante
    const getUserAnswersbyMission = async (misionRoute, userEmail) => {
        const missionAnswersRef = doc(db, "misiones", misionRoute, "usersAnswers", userEmail);
        try {
            const snapshot = await getDoc(missionAnswersRef)
            if (snapshot.exists()) {

                return snapshot.data()
            } else {
                const noAnswerYet = { finished: false, mission_answer: null }
                log.warn('mission', `No answers found for user ${userEmail} by mission`);

                return noAnswerYet
            }
        } catch (error) {
            log.error('mission', `Error retrieving user ${userEmail} answers by mission: ${error}`);

        }

    }

    // 10. Guardar calificación dada por el profesor
    const storeGrade = async (misionRoute, course, userEmail, grade, age, name, feedback) => {
        const fechaActual = new Date();
        const userDetails = {
            correo: userEmail,
            edad: age,
            fechaCalificacion: fechaActual,
            monedas_obtenidas: grade,
            nombre: name,
            retroalimentacion: feedback
        }

        try {
            const courseRef = doc(db, "cursos", course);
            const courseSnapshot = await getDoc(courseRef);

            if (courseSnapshot.exists()) {
                // Obtiene el array "curso_misiones" del documento del curso
                const course_missions_data = courseSnapshot.data().curso_misiones || [];

                // Busca la misión por nombre
                const misionIndex = course_missions_data.findIndex(mision => mision.misionId === misionRoute);

                if (misionIndex !== -1) {
                    // Actualiza la puntuación y retroalimentación en la misión encontrada
                    course_missions_data[misionIndex].state_3_finished.push(userDetails);

                    // Actualiza el documento del curso con el nuevo array "curso_misiones"
                    await updateDoc(courseRef, {
                        curso_misiones: course_missions_data,
                    });

                    Swal.fire({
                        title: "Calificación ingresada correctamente",
                        icon: "success",
                        confirmButtonColor: '#3085d6'
                    });

                    // Elimina al usuario del array "state_2_sent" de la misión
                    deleteUserFromState2(courseRef, course_missions_data, misionIndex, userEmail);

                    // Actualiza las monedas del usuario
                    updateUserCoins(userEmail, grade);

                    setTimeout(() => {
                        router.push(`/misionResults/${misionRoute}`);
                    }, 2 * 1000);

                    log.info('grade', `Grade for ${userEmail} stored successfully`);
                } else {

                    log.error('grade', `No mission found for ${userEmail} at 'state_3_finished'.`);
                }
            }

        } catch (error) {
            log.error('grade', `Error storing grade for ${userEmail}: ${error}` );
        }
    }

    // 11. Eliminar usuario de state_2_sent
    const deleteUserFromState2 = async (courseRef, course_missions_data, misionIndex, userEmail) => {
        try {
            const userIndex = course_missions_data[misionIndex].state_2_sent.findIndex(user => user.correo === userEmail);
            course_missions_data[misionIndex].state_2_sent.splice(userIndex, 1);

            // Actualiza el documento del curso con el nuevo array "curso_misiones"
            await updateDoc(courseRef, {
                curso_misiones: course_missions_data,
            });


        } catch (error) {
            log.error('mission', `Error deleting user ${userEmail} from state_2_sent: ${error}`);
        }
    }

    // 12. Agregar historial de misiones de cada estudiante
    const addStudentHistoric = async (missionName, description, coins) => {
        let emailStudent = useAuthStore().currentUserEmail;

        try {
            // Utiliza el correo electrónico como ID
            const docRef = doc(db, "usuarios", emailStudent);

            // Agregar una subcolección "historial" al documento creado
            const historialRef = collection(docRef, 'historial');
            await addDoc(historialRef, {
                nombre: missionName,
                descripcion: description,
                monedas: coins,
            });

            log.info('historic', `Mission history added successfully for ${emailStudent}`);

        } catch (error) {
            log.error('historic', `Error adding mission history for ${emailStudent}: ${error}`);
        }
    }

    // 13. Obtener el historial de misiones de cada estudiante
    const getStudentHistoric = async () => {
        let emailStudent = useAuthStore().currentUserEmail;

        try {
            // Utiliza el correo electrónico como ID
            const docRef = doc(db, "usuarios", emailStudent);

            // Obtener la referencia a la subcoleccion "historial"
            const historialRef = collection(docRef, 'historial');
            const historialQuerySnapshot = await getDocs(historialRef);
            const historial = []

            historialQuerySnapshot.forEach((doc) => {
                let mission = doc.data();
                historial.push(mission);
            });

            return historial;

        } catch (error) {
            log.error('historic', `Error retrieving mission history for ${emailStudent}: ${error}`);
            return false;
        }
    }



    return {
        getUserByEmail,
        addUser,
        deleteUser,
        getUserMissionSelected,
        getMissionsDocs,
        saveUserMission,
        getUserAnswersbyMission,
        getCourseInformation,
        getStudentAnswers,
        getMissionInformation,
        convertTimestampToDate,
        storeGrade,
        deleteUserFromState2,
        updateUserCoins,
        addStudentHistoric,
        getStudentHistoric
    };
});

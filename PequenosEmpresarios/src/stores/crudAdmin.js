import { defineStore } from 'pinia';
import Swal from 'sweetalert2';
import { db } from '@/main.js';
import { setDoc, collection, getDocs, getDoc, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuthStore } from '@/stores/auth.js';
import { useRouter } from "vue-router";
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

export const useCrudAdminStore = defineStore('crudAdmin', () => {

    /* global Swal */
    const router = useRouter()

    // 1. Obtener todos los usuarios

    const getAllUsers = async () => {
        // Get the current user's email
        const users = []
        const usersSnapshot = await getDocs(collection(db, "usuarios"));
        usersSnapshot.forEach(doc => {
            const encryptedUserData = doc.data();
            try {
                const decryptedUser = {
                    anionac: decryptData(encryptedUserData.anionac),
                    correo: encryptedUserData.correo,
                    curso: encryptedUserData.curso,
                    monedas: encryptedUserData.monedas,
                    nombre: decryptData(encryptedUserData.nombre),
                    rol: encryptedUserData.rol
                };
                users.push(decryptedUser)
            } catch (error) {
                users.push(encryptedUserData)
            }
            
        })
        return users;
    };


    // 2. Asignar curso
    const addUserToCourse = async (email, course, nombre) => {
        if (course !== "Ninguno") {
            try {
                // Utiliza el correo electrónico como ID
                const docRef = doc(db, "usuarios", email);

                // Establece los datos del documento
                await updateDoc(docRef, {
                    curso: course,
                });

                // Agregar una subcolección "historial" al documento creado
                const courseRef = doc(db, "cursos", course);
                const oldCourseDoc = await getDoc(courseRef)
                if (oldCourseDoc.exists()) {
                    const oldCourseMissions = oldCourseDoc.data().curso_misiones
                    const newCourseMissions = Object.values(oldCourseMissions).map((mision) => {
                        if (mision.state_1_pending === undefined) {
                            // Si es undefined, asigna un nuevo array vacío
                            mision.state_1_pending = [];
                        } else if (!mision.state_1_pending.includes(email)) {
                            mision.state_1_pending.push(email);
                        }
                        return mision
                    });

                    const oldCourseStudents = oldCourseDoc.data().estudiantes;
                    let newCourseStudents = [];
                    if (!oldCourseStudents.some(student => student.correo === email)) {
                        // Clona el array existente y agrega el nuevo estudiante
                        newCourseStudents = [...oldCourseStudents, { correo: email, nombre: nombre }];
                    } else {
                        newCourseStudents = oldCourseStudents
                    }

                    await updateDoc(courseRef, {
                        curso_misiones: newCourseMissions,
                        estudiantes: newCourseStudents
                    });
                }
                log.info('course', `User ${email} added to course ${course} successfully`);


            } catch (error) {
                log.error('course', `Error adding user ${email} to course: ${error}`);
            }
        } else {
            log.info('course', `No course selected for ${email}`);
        }

    }



    // 3. Agregar usuario con el email
    const addUser = async (nombre, anio, correo) => {
        try {
            // Utiliza el correo electrónico como ID
            const docRef = doc(db, "usuarios", correo);

            // Establece los datos del documento
            await setDoc(docRef, {
                nombre: nombre,
                anionac: anio,
                correo: correo,
                rol: "estudiante",
                monedas: 0
            });

            // Agregar una subcolección "historial" al documento creado
            const historialRef = collection(docRef, 'historial');
            await addDoc(historialRef, {
                nombre: 'Misión Prueba 1',
                estado: 'Pendiente'
            });
            log.info('user', `User ${correo} added successfully`);
        } catch (error) {
            log.error('user', `Error adding user ${correo}: ${error}`);
        }
    };

    // 4. Eliminar usuarios
    const deleteUser = async (id) => {
        try {
            await deleteDoc(doc(db, "usuarios", id));
            log.info('user', `User with id ${id} deleted successfully`);
        } catch (error) {
            log.error('user', `Error deleting user ${id}: ${error}`);
        }
    };

    // 5. Obtener las misiones según el correo del usuario
    const emailStudent = useAuthStore().currentUserEmail;
    const getMissionsPerStudent = async () => {
        try {
            // Obtiene una referencia a la colección "cursos"
            let missions = []
            const cursosCollection = collection(db, 'cursos');

            // Hace una consulta para encontrar el estudiante con el correo electrónico especificado en todas las subcolecciones "estudiantes"
            const cursosQuery = await getDocs(cursosCollection);

            // Acceder a los documentos
            cursosQuery.forEach(doc => {
                const data = doc.data();

                // Verificar que 'estudiantes' exista y sea un array antes de usar 'find'
                if (data.estudiantes && Array.isArray(data.estudiantes)) {
                    const estudianteEncontrado = data.estudiantes.find(estudiante => estudiante.correo === emailStudent);
                    // Aquí agrego solo las misiones que no son parte del historial
                    if (estudianteEncontrado) {
                        for (const mision in data.curso_misiones) {
                            if (Object.hasOwnProperty.call(data.curso_misiones, mision)) {
                                const element = data.curso_misiones[mision];
                                if (element.state_3_finished && element.state_3_finished.includes(emailStudent) === false) {
                                    missions.push(element)
                                }
                            }
                        }
                    }
                }
            });
            return missions

        } catch (error) {
            log.error('mission', `Error retrieving missions for ${emailStudent}: ${error}`);
        }
    };

    // 6. Obtener la misión seleccionada
    const getUserMissionSelected = async (misionRoute) => {
        // Get the current user's email
        const refMission = doc(db, "misiones", misionRoute);

        const snapshot = await getDoc(refMission);

        return snapshot.data();
    };

    // 7. Obtener todas las misiones
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

    // 8. Obtener misiones del curso
    const getCourseMissions = async () => {
        const userCourse = '202311_01'; // nombre del curso del que desea obtener las misiones

        const courseRef = doc(db, "cursos", userCourse);
        const courseSnapshot = await getDoc(courseRef);
        const courseMissions = courseSnapshot.data().curso_misiones;
        return courseMissions;
    }

    // 9 Obtener numero total de estudiantes del curso
    const getTotalStudentsCourse = async () => {
        const userCourse = '202311_01'; // nombre del curso del que desea obtener las misiones

        const courseRef = doc(db, "cursos", userCourse);
        const courseSnapshot = await getDoc(courseRef);
        const courseLength = courseSnapshot.data().estudiantes.length;
        return courseLength;
    }

    // 10 Obtener numero total de estudiantes que enviaron cada mision
    const getTotalStudentsSentMissions = async () => {
        const missionsRef = collection(db, "misiones");
        const missionsSnapshot = await getDocs(missionsRef);

        // Utilizar Promise.all para esperar a que todas las operaciones asíncronas se completen
        const promises = missionsSnapshot.docs.map(async (missionDoc) => {
            const usersProgressionRef = collection(missionDoc.ref, "usersProgression");
            const usersProgressionSnapshot = await getDocs(usersProgressionRef);
            const numUsers = usersProgressionSnapshot.size;

            return { [missionDoc.id]: { numUsers } };
        });

        const totalStudentsPerMission = await Promise.all(promises);

        // Convertir el array de objetos a un solo objeto
        const result = totalStudentsPerMission.reduce((acc, mission) => {
            return { ...acc, ...mission };
        }, {});

        return result;
    };

    // 11 Convertir _timestamp a fecha dd/mm/yyyy
    const convertTimestampToDate = (timestamp) => {
        const date = timestamp.toDate();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // 12 Obtener estudiantes que enviaron una mision
    const getStudentsSentMission = async (missionRoute) => {
        const usersProgressionRef = collection(db, "misiones", missionRoute, "usersProgression");
        const usersProgressionSnapshot = await getDocs(usersProgressionRef);

        let users = [];
        const currentYear = new Date().getFullYear();

        usersProgressionSnapshot.forEach(async (userProgressionDoc) => {
            const userRef = doc(db, "usuarios", userProgressionDoc.id);
            const userSnapshot = await getDoc(userRef);

            // Verificar si el documento existe antes de acceder a sus datos
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                users.push({ nombre: userData.nombre, edad: currentYear - userData.anionac, fechaEnvio: convertTimestampToDate(userProgressionDoc.data().mission_answer.fecha) });
            } else {
                Swal.fire({
                    title: "Usuario no encontrado.",
                    icon: "info",
                    confirmButtonColor: '#3085d6'
                });
            }
        });

        return users;
    }

    // 13 Obtener las respuestas de un estudiante a una misión
    const getStudentAnswers = async (missionRoute, userEmail) => {
        try {
            const missionProgressRef = doc(db, "misiones", missionRoute, "usersProgression", userEmail);
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

    // 14 Guardar el resultado de una misión
    const saveUserMission = async (userEmail, misionRoute) => {
        try {
            const userAnswers = updateUserAnswers();

            const missionAnswersRef = doc(db, "misiones", misionRoute, "usersAnswers", userEmail);
            const missionProgressRef = doc(db, "misiones", misionRoute, "usersProgression", userEmail);
            await setDoc(missionProgressRef, {
                state: "send",
            });
            await setDoc(missionAnswersRef, {
                mission_answer: userAnswers
            });
            Swal.fire({
                title: "Se han enviado las respuestas con éxito",
                icon: "success",
                confirmButtonColor: '#3085d6'
            });
            setTimeout(() => {
                router.push("/")
            }, 2 * 1000);
            log.info('mission', `User ${userEmail} mission ${misionRoute} saved successfully.`);
        } catch (error) {
            Swal.fire({
                title: error,
                icon: "error",
                confirmButtonColor: '#3085d6'
            });
            log.error('mission', `Error saving user ${userEmail} mission: ${error}`);
        }
    };

    // 16 Traer respuesta a la misión del estudiante
    const getUserAnswersbyMission = async (misionRoute, userEmail) => {
        const missionAnswersRef = doc(db, "misiones", misionRoute, "usersAnswers", userEmail);
        try {
            const snapshot = await getDoc(missionAnswersRef);
            if (snapshot.exists()) {
                return snapshot.data();
            } else {
                const noAnswerYet = { finished: false, mission_answer: null };
                log.warn('mission', `No answers found for user ${userEmail} by mission`);
                return noAnswerYet;
            }
        } catch (error) {
            log.error('mission', `Error retrieving user ${userEmail} answers by mission: ${error}`);
            throw error;
        }
    };

    
    return {
        getAllUsers,
        addUserToCourse,
        addUser,
        deleteUser,
        getUserMissionSelected,
        getMissionsPerStudent,
        getMissionsDocs,
        getCourseMissions,
        saveUserMission,
        getUserAnswersbyMission,
        getTotalStudentsCourse,
        getTotalStudentsSentMissions,
        getStudentsSentMission,
        getStudentAnswers
    };
});

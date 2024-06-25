<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { useCrudStore } from "@/stores/crudUserAndmisions.js";
import { useRoute } from "vue-router";
import { ref } from "vue";
    
const authStore = useAuthStore(); // Inicio el store de auth
const crudStore = useCrudStore(); // Inicio el store del crud de users y missions

const route = useRoute()

const questions = ref([
    { id: "pregunta 01", label: "Prestas atención a la persona que te está hablando y haces un esfuerzo para comprender lo que te está diciendo", answer: "", answers: 1 },
    { id: "pregunta 02", label: "Hablas con los demás de temas poco importantes para pasar luego a los más importantes", answer: "", answers: 1 },
    { id: "pregunta 03", label: "Hablas con otras personas sobre cosas que interesan a ambos", answer: "", answers: 1 },
    { id: "pregunta 04", label: "Clarificas la información que necesitas y se la pides a la persona adecuada", answer: "", answers: 1 },
    { id: "pregunta 05", label: "Permites que los demás sepan que les agradeces los favores", answer: "", answers: 1 },
    { id: "pregunta 06", label: "Te das a conocer a los demás por propia iniciativa", answer: "", answers: 1 },
    { id: "pregunta 07", label: "Ayudas a que los demás se conozcan entre sí", answer: "", answers: 1 },
    { id: "pregunta 08", label: "Dices que te gusta algún aspecto de la otra persona o alguna de las actividades que realiza", answer: "", answers: 1 },
    { id: "pregunta 0 9", label: "Pides que te ayuden cuando tienes alguna dificultad", answer: "", answers: 1 },
    { id: "pregunta 10", label: "Eliges la mejor forma para integrarte en un grupo o para participar en una determinada actividad", answer: "", answers: 1 },
    { id: "pregunta 11", label: "Explicas con claridad a los demás cómo hacer una tarea específica", answer: "", answers: 1 },
    { id: "pregunta 12", label: "Prestas atención a las instrucciones, pides explicaciones y llevas adelante las instrucciones correctamente", answer: "", answers: 1 },
    { id: "pregunta 13", label: "Pides disculpas a los demás por haber hecho algo mal", answer: "", answers: 1 },
    { id: "pregunta 14", label: "Intentas persuadir a los demás de que tus ideas son mejores y que serán de mayor utilidad que las de la otra persona", answer: "", answers: 1 },
    { id: "pregunta 15", label: "Intentas reconocer las emociones que experimentas", answer: "", answers: 1 },
    { id: "pregunta 16", label: "Permites que los demás conozcan lo que sientes", answer: "", answers: 1 },
    { id: "pregunta 17", label: "Intentas comprender lo que sienten los demás", answer: "", answers: 1 },
    { id: "pregunta 18", label: "Intentas comprender el enfado de la otra persona", answer: "", answers: 1 },
    { id: "pregunta 19", label: "Permites que los demás sepan que te interesas o preocupas por ellos", answer: "", answers: 1 },
    { id: "pregunta 20", label: "Piensas por qué estás asustado y haces algo para disminuir tu miedo", answer: "", answers: 1 },
    { id: "pregunta 21", label: "Te dices a ti mismo o haces cosas agradables cuando te mereces una recompensa", answer: "", answers: 1 },
    { id: "pregunta 22", label: "Reconoces cuando es necesario pedir permiso para hacer algo y luego lo pides a la persona indicada", answer: "", answers: 1 },
    { id: "pregunta 23", label: "Te ofreces para compartir algo que es apreciado por los demás", answer: "", answers: 1 },
    { id: "pregunta 24", label: "Ayudas a quien lo necesita", answer: "", answers: 1 },
    { id: "pregunta 25", label: "Llegas a establecer un sistema de negociación que te satisface tanto a ti mismo como a quienes sostienen posturas diferentes", answer: "", answers: 1 },
    { id: "pregunta 26", label: "Controlas tu carácter de modo que no se te “escapan las cosas de la mano”", answer: "", answers: 1 },
    { id: "pregunta 27", label: "Defiendes tus derechos dando a conocer a los demás cuál es tu postura", answer: "", answers: 1 },
    { id: "pregunta 28", label: "Te las arreglas sin perder el control cuando los demás te hacen bromas", answer: "", answers: 1 },
    { id: "pregunta 29", label: "Te mantienes al margen de situaciones que te pueden ocasionar problemas", answer: "", answers: 1 },
    { id: "pregunta 30", label: "Encuentras otras formas para resolver situaciones difíciles sin tener que pelearte", answer: "", answers: 1 },
    { id: "pregunta 31", label: "Dices a los demás cuándo han sido los responsables de originar un determinado problema e intentas encontrar una solución", answer: "", answers: 1 },
    { id: "pregunta 32", label: "Intentas llegar a una solución justa ante la queja justificada de alguien", answer: "", answers: 1 },
    { id: "pregunta 33", label: "Expresas un sincero cumplido a los demás por la forma en que han jugado", answer: "", answers: 1 },
    { id: "pregunta 34", label: "Haces algo que te ayude a sentir menos vergüenza o a estar menos cohibido", answer: "", answers: 1 },
    { id: "pregunta 35", label: "Eres consciente cuando te han dejado de lado en alguna actividad y, luego, haces algo para sentirte mejor en ese momento", answer: "", answers: 1 },
    { id: "pregunta 36", label: "Manifiestas a los demás que han tratado injustamente a un amigo", answer: "", answers: 1 },
    { id: "pregunta 37", label: "Consideras con cuidado la posición de la otra persona, comparándola con la propia, antes de decidir lo que hacer", answer: "", answers: 1 },
    { id: "pregunta 38", label: "Comprendes la razón por la cual has fracasado en una determinada situación y qué puedes hacer para tener más éxito en el futuro", answer: "", answers: 1 },
    { id: "pregunta 39", label: "Reconoces y resuelves la confusión que se produce cuando los demás te explican una cosa pero dicen o hacen otras que se contradicen", answer: "", answers: 1 },
    { id: "pregunta 40", label: "Comprendes lo que significa la acusación y por qué te la han hecho y, luego, piensas en la mejor forma de relacionarte con la persona que te ha hecho la acusación", answer: "", answers: 1 },
    { id: "pregunta 41", label: "Planificas la mejor forma para exponer tu punto de vista antes de una conversación problemática", answer: "", answers: 1 },
    { id: "pregunta 42", label: "Decides lo que quieres hacer cuando los demás quieren que hagas otra cosa distinta", answer: "", answers: 1 },
    { id: "pregunta 43", label: "Resuelves la sensación de aburrimiento iniciando una nueva actividad interesante", answer: "", answers: 1 },
    { id: "pregunta 44", label: "Reconoces si la causa de algún acontecimiento es consecuencia de alguna situación bajo tu control", answer: "", answers: 1 },
    { id: "pregunta 45", label: "Tomas decisiones realistas sobre lo que eres capaz de realizar antes de comenzar una tarea", answer: "", answers: 1 },
    { id: "pregunta 46", label: "Eres realista cuando debes dilucidar cómo puedes desenvolverte en una determinada tarea", answer: "", answers: 1 },
    { id: "pregunta 47", label: "Resuelves qué necesitas saber y cómo conseguir la información", answer: "", answers: 1 },
    { id: "pregunta 48", label: "Determinas de forma realista cuál de los numerosos problemas es el más importante y el que deberías solucionar primero", answer: "", answers: 1 },
    { id: "pregunta 49", label: "Consideras las posibilidades y eliges la que te hará sentir mejor", answer: "", answers: 1 },
    { id: "pregunta 50", label: "Te organizas y te preparas para facilitar la ejecución de tu trabajo", answer: "", answers: 1 },
]);


</script>

<template>
    <div class="overflow-x-auto">
      
      <table class="table-auto w-full">
        <tbody>
          <tr v-for="question in questions" :key="question.id" class="border border-y-2 border-x-0 border-primary">
            <td class="border px-4 py-2 text-sm">{{question.id.replace(/\D/g, '') + ". " + question.label}}</td>
            <td class="border px-4 py-2 flex justify-between items-center"><span class="text-start text-xs text-primary">Muy pocas veces</span> <input class=" radio radio-primary"  :id="question.id" type="radio" :name="question.id" value="Muy pocas veces"></td>
            <td class="border px-4 py-2 flex justify-between items-center "><span class="text-start text-xs text-primary">Algunas veces</span><input  class="radio radio-primary" :id="question.id" type="radio" :name="question.id" value="Algunas veces"> </td>
            <td class="border px-4 py-2 flex justify-between items-center"><span class="text-xs text-primary text-start">Muchas veces</span><input  class="radio radio-primary" :id="question.id" type="radio" :name="question.id" value="Muchas veces"> </td>
            <td class="border px-4 py-2 flex justify-between items-center"><span class="text-xs text-primary text-start">Bastantes veces</span><input  class="radio radio-primary" :id="question.id" type="radio" :name="question.id" value="Bastantes veces"> </td>
          </tr>
                
              <!-- Agrega más filas según sea necesario -->
          </tbody>
      </table>
    </div>
    <br>
    <button class="btn btn-primary mb-4" @click="crudStore.saveUserMission(authStore.currentUserEmail, route.params.missionId)">Enviar respuestas</button>


</template>



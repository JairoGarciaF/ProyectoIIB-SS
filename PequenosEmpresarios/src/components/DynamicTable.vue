<!-- DynamicTable.vue -->

<template>
  
    <table class="overflow-x-auto">
      <thead>
        <tr>
          <th class="py-2">Producto</th>
          <th class="py-2">¿Para qué sirve?</th>
          <th class="py-2">Posibles nombres del producto</th>
          <th class="py-2">¿Para quién va dirigido?</th>
          <th class="py-2">
            ¿Enlista qué elementos necesita para poderlo crear?
          </th>
          <th class="py-2">¿Quién compraría ese producto?</th>
          <th class="py-2">Acciones</th>
        </tr>
      </thead>
      <tbody class="text-xs">
        <tr v-for="(row, index) in tableData" :key="index" class="j">
          <td><input v-model="row.column1" class="border-2 border-sky-400 p-2 rounded-md" :id="'Producto_' + index"/></td>
          <td><input v-model="row.column2" class="border-2 border-sky-400 p-2 rounded-md" :id="'Uso_' + index"/></td>
          <td><input v-model="row.column3" class="border-2 border-sky-400 p-2 rounded-md" :id="'Nombres_' + index"/></td>
          <td><input v-model="row.column4" class="border-2 border-sky-400 p-2 rounded-md" :id="'Público_' + index"/></td>
          <td><input v-model="row.column5" class="border-2 border-sky-400 p-2 rounded-md" :id="'Encargado_' + index"/></td>
          <td><input v-model="row.column6" class="border-2 border-sky-400 p-2 rounded-md" :id="row+'_' + index"/></td>
          <td>
            <button @click="removeRow(index)" class="btn btn-danger">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="addRow" class="btn btn-primary mt-4">Agregar Fila</button>
</template>

<script setup>
import { ref } from "vue";

const tableData = ref([
  { column1: "", column2: "", column3: "", column4: "", column5: "", column6: "" },
]);

const addRow = () => {
  tableData.value.push({ column1: "", column2: "", column3: "", column4: "", column5: "", column6: "" });
};

const removeRow = (index) => {
  tableData.value.splice(index, 1);
};
</script>

<template>
  <div class="container">
    <h1>{{ isEdit ? 'Actualizar Cancha' : 'Crear Cancha' }}</h1>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="nombre">Nombre de la Cancha:</label>
        <input v-model="form.nombre" type="text" id="nombre" required />
      </div>

      <div>
        <label for="direccion">Dirección:</label>
        <input v-model="form.direccion" type="text" id="direccion" required />
      </div>

      <div>
        <label for="cliente_id">Cliente:</label>
        <select v-model="form.cliente_id" id="cliente_id" required>
          <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
            {{ cliente.nombre }}
          </option>
        </select>
      </div>

      <div>
        <label for="disponibilidad">Disponibilidad:</label>
        <select v-model="form.disponibilidad" id="disponibilidad">
          <option value="1">Disponible</option>
          <option value="0">No disponible</option>
        </select>
      </div>

      <button type="submit">{{ isEdit ? 'Actualizar' : 'Crear' }}</button>
    </form>

    <h2>Lista de Canchas</h2>
    <div v-if="canchas.length === 0">No hay canchas disponibles.</div>
    <ul>
      <li v-for="cancha in canchas" :key="cancha.id">
        <span>{{ cancha.nombre }} - {{ cancha.direccion }}</span>
        <button @click="editCancha(cancha)">Editar</button>
        <button @click="deleteCancha(cancha.id)">Eliminar</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        id: null,
        nombre: "",
        direccion: "",
        cliente_id: "",
        disponibilidad: 1,
      },
      clientes: [],
      canchas: [],
      isEdit: false,
    };
  },
  created() {
    this.fetchClientes();
    this.fetchCanchas();
  },
  methods: {
    // Obtener clientes
    async fetchClientes() {
      try {
        const response = await axios.get("/api/admin/clientes");
        this.clientes = response.data;
      } catch (error) {
        console.error("Error al obtener clientes:", error);
        alert("Error al obtener clientes");
      }
    },

    // Obtener todas las canchas
    async fetchCanchas() {
      try {
        const response = await axios.get("/api/admin/canchas");
        this.canchas = response.data;
      } catch (error) {
        console.error("Error al obtener canchas:", error);
        alert("Error al obtener canchas");
      }
    },

    // Crear o actualizar cancha
    async handleSubmit() {
      if (this.isEdit) {
        await this.updateCancha();
      } else {
        await this.createCancha();
      }
    },

    // Crear cancha con confirmación
    async createCancha() {
      const confirm = window.confirm("¿Está seguro de que desea crear esta cancha?");
      if (!confirm) return;

      try {
        const response = await axios.post("/api/admin/canchas", this.form);
        this.canchas.push(response.data); // Añadir la nueva cancha a la lista
        this.clearForm();
        alert("Cancha creada exitosamente!");
      } catch (error) {
        console.error("Error al crear la cancha:", error);
        alert("Error al crear la cancha");
      }
    },

    // Actualizar cancha con confirmación
    async updateCancha() {
      const confirm = window.confirm("¿Está seguro de que desea actualizar esta cancha?");
      if (!confirm) return;

      try {
        await axios.put(`/api/admin/canchas/${this.form.id}`, this.form);
        this.fetchCanchas(); // Refrescar la lista de canchas
        this.clearForm();
        this.isEdit = false;
        alert("Cancha actualizada exitosamente!");
      } catch (error) {
        console.error("Error al actualizar la cancha:", error);
        alert("Error al actualizar la cancha");
      }
    },

    // Eliminar cancha con confirmación
    async deleteCancha(id) {
      const confirm = window.confirm("¿Está seguro de que desea eliminar esta cancha?");
      if (!confirm) return;

      try {
        await axios.delete(`/api/admin/canchas/${id}`);
        this.fetchCanchas(); // Refrescar la lista de canchas
        alert("Cancha eliminada exitosamente!");
      } catch (error) {
        console.error("Error al eliminar la cancha:", error);
        alert("Error al eliminar la cancha");
      }
    },

    // Preparar edición
    editCancha(cancha) {
      this.form = { ...cancha };
      this.isEdit = true;
    },

    // Limpiar formulario
    clearForm() {
      this.form = {
        id: null,
        nombre: "",
        direccion: "",
        cliente_id: "",
        disponibilidad: 1,
      };
    },
  },
};
</script>


<style>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
form {
  margin-bottom: 30px;
}
form div {
  margin-bottom: 15px;
}
button {
  margin-right: 10px;
}
</style>

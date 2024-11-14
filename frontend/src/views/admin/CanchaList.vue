<template>
  <div class="canchas-manager">
    <h2>Gestión de Canchas</h2>

    <!-- Formulario de Crear/Actualizar Cancha -->
    <div>
      <h3>{{ isEditing ? 'Actualizar Cancha' : 'Crear Cancha' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="nombre">Nombre:</label>
          <input type="text" v-model="nombre" required />
        </div>
        <div>
          <label for="direccion">Dirección:</label>
          <input type="text" v-model="direccion" required />
        </div>
        <div>
          <label for="disponibilidad">Disponibilidad:</label>
          <select v-model="disponibilidad" required>
            <option value="disponible">Disponible</option>
            <option value="no disponible">No disponible</option>
          </select>
        </div>
        <button type="submit">{{ isEditing ? 'Actualizar' : 'Crear' }} Cancha</button>
      </form>
    </div>

    <!-- Lista de Canchas -->
    <div>
      <h3>Lista de Canchas</h3>
      <ul>
        <li v-for="cancha in canchas" :key="cancha.id">
          <div>
            <span>{{ cancha.nombre }} - {{ cancha.direccion }} - {{ cancha.disponibilidad }}</span>
            <button @click="editCancha(cancha)">Editar</button>
            <button @click="deleteCancha(cancha.id)">Eliminar</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      canchas: [],
      nombre: '',
      direccion: '',
      disponibilidad: 'disponible',
      isEditing: false,
      editingCanchaId: null
    };
  },
  async created() {
    await this.fetchCanchas();
  },
  methods: {
    async fetchCanchas() {
      try {
        const response = await axios.get('/api/admin/canchas');
        this.canchas = response.data;
      } catch (error) {
        console.error('Error al obtener las canchas:', error);
      }
    },
    async handleSubmit() {
      if (this.isEditing) {
        // Si estamos editando, actualizamos la cancha
        await this.updateCancha();
      } else {
        // Si no estamos editando, creamos una nueva cancha
        await this.createCancha();
      }
    },
    async createCancha() {
      try {
        const newCancha = {
          nombre: this.nombre,
          direccion: this.direccion,
          disponibilidad: this.disponibilidad
        };
        await axios.post('/api/admin/canchas', newCancha);
        alert('Cancha creada con éxito');
        await this.fetchCanchas(); // Actualizar la lista de canchas
        this.resetForm();
      } catch (error) {
        console.error('Error al crear la cancha:', error);
        alert('Hubo un error al crear la cancha');
      }
    },
    async updateCancha() {
      try {
        const updatedCancha = {
          nombre: this.nombre,
          direccion: this.direccion,
          disponibilidad: this.disponibilidad
        };
        await axios.put(`/api/admin/canchas/${this.editingCanchaId}`, updatedCancha);
        alert('Cancha actualizada con éxito');
        await this.fetchCanchas(); // Actualizar la lista de canchas
        this.resetForm();
      } catch (error) {
        console.error('Error al actualizar la cancha:', error);
        alert('Hubo un error al actualizar la cancha');
      }
    },
    async deleteCancha(id) {
      if (confirm('¿Estás seguro de que deseas eliminar esta cancha?')) {
        try {
          await axios.delete(`/api/admin/canchas/${id}`);
          alert('Cancha eliminada con éxito');
          await this.fetchCanchas(); // Actualizar la lista de canchas
        } catch (error) {
          console.error('Error al eliminar la cancha:', error);
          alert('Hubo un error al eliminar la cancha');
        }
      }
    },
    editCancha(cancha) {
      this.nombre = cancha.nombre;
      this.direccion = cancha.direccion;
      this.disponibilidad = cancha.disponibilidad;
      this.isEditing = true;
      this.editingCanchaId = cancha.id;
    },
    resetForm() {
      this.nombre = '';
      this.direccion = '';
      this.disponibilidad = 'disponible';
      this.isEditing = false;
      this.editingCanchaId = null;
    }
  }
};
</script>

<style scoped>
.canchas-manager {
  max-width: 800px;
  margin: 0 auto;
}
form div {
  margin-bottom: 10px;
}
button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}
button:hover {
  background-color: #3d668f;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 15px;
}
</style>

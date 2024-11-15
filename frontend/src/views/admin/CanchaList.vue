<template>
  <div class="cancha-container">
    <h2>Canchas</h2>
    
    <!-- Formulario de creación y edición -->
    <form @submit.prevent="handleSubmit" class="cancha-form">
      <input type="text" v-model="canchaForm.nombre" placeholder="Nombre de la cancha" required class="form-input" />
      <input type="text" v-model="canchaForm.direccion" placeholder="Dirección" required class="form-input" />
      <input type="text" v-model="canchaForm.cliente_id" placeholder="ID del cliente" required class="form-input" />
      <select v-model="canchaForm.disponibilidad" required class="form-input">
        <option value="Disponible">Disponible</option>
        <option value="No Disponible">No Disponible</option>
      </select>
      <button type="submit" class="form-button">
        {{ editMode ? "Actualizar Cancha" : "Crear Cancha" }}
      </button>
    </form>
    
    <!-- Lista de canchas -->
    <ul class="cancha-list">
      <li v-for="cancha in canchas" :key="cancha.id" class="cancha-item">
        <p><strong>Nombre:</strong> {{ cancha.nombre }}</p>
        <p><strong>Dirección:</strong> {{ cancha.direccion }}</p>
        <p><strong>Disponibilidad:</strong> {{ cancha.disponibilidad }}</p>
        <button @click="editCancha(cancha)" class="edit-button">Editar</button>
        <button @click="deleteCancha(cancha.id)" class="delete-button">Eliminar</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      canchas: [],
      canchaForm: {
        nombre: '',
        direccion: '',
        cliente_id: '',
        disponibilidad: 'Disponible'
      },
      editMode: false,
      canchaId: null
    };
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
      try {
        if (this.editMode) {
          await axios.put(`/api/admin/canchas/${this.canchaId}`, this.canchaForm);
        } else {
          await axios.post('/api/admin/canchas', this.canchaForm);
        }
        this.resetForm();
        this.fetchCanchas();
      } catch (error) {
        console.error('Error al guardar la cancha:', error);
      }
    },
    editCancha(cancha) {
      this.canchaForm = { ...cancha };
      this.canchaId = cancha.id;
      this.editMode = true;
    },
    async deleteCancha(id) {
      try {
        await axios.delete(`/api/admin/canchas/${id}`);
        this.fetchCanchas();
      } catch (error) {
        console.error('Error al eliminar la cancha:', error);
      }
    },
    resetForm() {
      this.canchaForm = {
        nombre: '',
        direccion: '',
        cliente_id: '',
        disponibilidad: 'Disponible'
      };
      this.editMode = false;
      this.canchaId = null;
    }
  },
  mounted() {
    this.fetchCanchas();
  }
};
</script>

<style scoped>
.cancha-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}
.cancha-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
.form-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}
.form-button {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.form-button:hover {
  background-color: #3a9d72;
}
.cancha-list {
  list-style-type: none;
  padding: 0;
}
.cancha-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
}
.edit-button, .delete-button {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.edit-button {
  background-color: #e67e22;
  color: white;
}
.edit-button:hover {
  background-color: #d06d20;
}
.delete-button {
  background-color: #e74c3c;
  color: white;
}
.delete-button:hover {
  background-color: #c0392b;
}
</style>

<template>
  <div>
    <h2>Gestión de Clientes</h2>

    <!-- Crear Cliente -->
    <form @submit.prevent="createCliente">
      <input v-model="newCliente.nombre" placeholder="Nombre" required />
      <input v-model="newCliente.direccion" placeholder="Dirección" />
      <input v-model="newCliente.telefono" placeholder="Teléfono" />
      <input v-model="newCliente.correo" placeholder="Correo" />
      <input type="file" @change="handleImageUpload" />
      <button type="submit">Crear Cliente</button>
    </form>

    <!-- Mostrar Clientes -->
    <ul>
      <li v-for="cliente in clientes" :key="cliente.id">
        <p>{{ cliente.nombre }} - {{ cliente.direccion }}</p>
        <img v-if="cliente.imagen" :src="'data:image/jpeg;base64,' + cliente.imagen" alt="Imagen del Cliente" />
        <button @click="editCliente(cliente)">Editar</button>
        <button @click="deleteCliente(cliente.id)">Eliminar</button>
      </li>
    </ul>

    <!-- Modal para Editar Cliente -->
    <div v-if="editingCliente" class="modal">
      <form @submit.prevent="updateCliente">
        <input v-model="editingCliente.nombre" placeholder="Nombre" required />
        <input v-model="editingCliente.direccion" placeholder="Dirección" />
        <input v-model="editingCliente.telefono" placeholder="Teléfono" />
        <input v-model="editingCliente.correo" placeholder="Correo" />
        <input type="file" @change="handleImageUploadEdit" />
        <button type="submit">Actualizar Cliente</button>
        <button @click="cancelEdit">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      clientes: [],
      newCliente: {
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        imagen: null,
      },
      editingCliente: null,
    };
  },
  created() {
    this.fetchClientes();
  },
  methods: {
    async fetchClientes() {
      try {
        const response = await axios.get('/api/admin/clientes');
        this.clientes = response.data;
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    },

    async createCliente() {
      try {
        const formData = new FormData();
        formData.append('nombre', this.newCliente.nombre);
        formData.append('direccion', this.newCliente.direccion);
        formData.append('telefono', this.newCliente.telefono);
        formData.append('correo', this.newCliente.correo);
        if (this.newCliente.imagen) {
          formData.append('imagen', this.newCliente.imagen);
        }

        await axios.post('/api/admin/clientes', formData);
        this.fetchClientes(); // Refrescar lista
        this.newCliente = { nombre: '', direccion: '', telefono: '', correo: '', imagen: null };
      } catch (error) {
        console.error('Error al crear cliente:', error);
      }
    },

    async deleteCliente(id) {
      try {
        await axios.delete(`/api/admin/clientes/${id}`);
        this.fetchClientes(); // Refrescar lista
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    },

    editCliente(cliente) {
      this.editingCliente = { ...cliente };
    },

    async updateCliente() {
      try {
        const formData = new FormData();
        formData.append('nombre', this.editingCliente.nombre);
        formData.append('direccion', this.editingCliente.direccion);
        formData.append('telefono', this.editingCliente.telefono);
        formData.append('correo', this.editingCliente.correo);
        if (this.editingCliente.imagen) {
          formData.append('imagen', this.editingCliente.imagen);
        }

        await axios.put(`/api/admin/clientes/${this.editingCliente.id}`, formData);
        this.fetchClientes(); // Refrescar lista
        this.editingCliente = null;
      } catch (error) {
        console.error('Error al actualizar cliente:', error);
      }
    },

    cancelEdit() {
      this.editingCliente = null;
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      this.newCliente.imagen = file;
    },

    handleImageUploadEdit(event) {
      const file = event.target.files[0];
      this.editingCliente.imagen = file;
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal form {
  background: white;
  padding: 20px;
  border-radius: 5px;
}
</style>


<style scoped>
/* Agrega estilos para el componente */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>


<style scoped>
.clientes {
  max-width: 800px;
  margin: 0 auto;
}

h3 {
  margin-top: 20px;
}

form div {
  margin-bottom: 10px;
}

button {
  padding: 5px 10px;
  margin-top: 10px;
}

button[type="submit"] {
  background-color: green;
  color: white;
}

button[type="button"] {
  background-color: red;
  color: white;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>

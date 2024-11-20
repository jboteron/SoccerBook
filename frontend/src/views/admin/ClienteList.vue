<template>
  <div>
    <h1>Gestión de Clientes</h1>

    <!-- Formulario para crear o actualizar cliente -->
    <form @submit.prevent="handleSubmit">
      <input type="text" v-model="cliente.nombre" placeholder="Nombre" required />
      <input type="text" v-model="cliente.direccion" placeholder="Dirección" required />
      <input type="text" v-model="cliente.telefono" placeholder="Teléfono" required />
      <input type="email" v-model="cliente.correo" placeholder="Correo" required />
      <input type="file" @change="onFileChange" />
      <button type="submit">{{ isEditing ? 'Actualizar' : 'Crear' }} Cliente</button>
    </form>

    <div v-if="clientes.length">
      <h2>Clientes</h2>
      <ul>
        <li v-for="cliente in clientes" :key="cliente.id">
          <div>
            <p><strong>{{ cliente.nombre }}</strong></p>
            <p>{{ cliente.direccion }}</p>
            <p>{{ cliente.telefono }}</p>
            <p>{{ cliente.correo }}</p>
            <img v-if="cliente.imagenUrl" :src="cliente.imagenUrl" alt="Imagen del Cliente" width="100" height="100" />
            <button @click="editCliente(cliente)">Editar</button>
            <button @click="deleteCliente(cliente.id)">Eliminar</button>
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
      cliente: {
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        imagen: null,
      },
      isEditing: false,
      editingId: null,
      clientes: [],
    };
  },
  methods: {
    async fetchClientes() {
      try {
        const response = await axios.get('/api/admin/clientes');
        this.clientes = response.data;
        await this.loadImages();
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
        alert('Error al obtener los clientes');
      }
    },

    async loadImages() {
      for (const cliente of this.clientes) {
        if (cliente.id) {
          const imageUrl = await this.loadImage(cliente.id);
          cliente.imagenUrl = imageUrl;
        }
      }
    },

    async loadImage(clienteId) {
      try {
        const response = await axios.get(`/api/admin/clientes/${clienteId}/imagen`, { responseType: 'blob' });
        return await this.convertBlobToBase64(response.data);
      } catch (error) {
        console.error('Error al cargar la imagen:', error);
        return null;
      }
    },

    convertBlobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    },

    async handleSubmit() {
      const formData = new FormData();
      formData.append('nombre', this.cliente.nombre);
      formData.append('direccion', this.cliente.direccion);
      formData.append('telefono', this.cliente.telefono);
      formData.append('correo', this.cliente.correo);
      if (this.cliente.imagen) formData.append('imagen', this.cliente.imagen);

      try {
        if (this.isEditing) {
          const confirm = window.confirm("¿Está seguro de que desea actualizar este cliente?");
          if (!confirm) return;

          await axios.put(`/api/admin/clientes/${this.editingId}`, formData);
          alert('Cliente actualizado exitosamente!');
          this.isEditing = false;
          this.editingId = null;
        } else {
          const confirm = window.confirm("¿Está seguro de que desea crear este cliente?");
          if (!confirm) return;

          await axios.post('/api/admin/clientes', formData);
          alert('Cliente creado exitosamente!');
        }
        this.resetForm();
        this.fetchClientes();
      } catch (error) {
        console.error('Error al guardar el cliente:', error);
        alert('Error al guardar el cliente');
      }
    },

    resetForm() {
      this.cliente = {
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        imagen: null,
      };
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.cliente.imagen = file;
      }
    },

    async editCliente(cliente) {
      this.cliente = { ...cliente };
      this.editingId = cliente.id;
      this.isEditing = true;
    },

    async deleteCliente(clienteId) {
      const confirm = window.confirm("¿Está seguro de que desea eliminar este cliente?");
      if (!confirm) return;

      try {
        await axios.delete(`/api/admin/clientes/${clienteId}`);
        alert('Cliente eliminado exitosamente!');
        this.fetchClientes();
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        alert('Error al eliminar el cliente');
      }
    },
  },
  mounted() {
    this.fetchClientes();
  },
};
</script>


<style scoped>
/* Estilos para el formulario y la lista de clientes */
form {
  margin-bottom: 20px;
}

input {
  margin: 5px;
}

button {
  margin: 5px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  border: 1px solid #ccc;
  padding: 10px;
}

img {
  border-radius: 50%;
  margin-top: 10px;
}
</style>

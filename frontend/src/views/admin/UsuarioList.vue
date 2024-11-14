<template>
  <div class="usuarios">
    <h2>Gestión de Usuarios</h2>

    <!-- Formulario para Crear o Editar un Usuario -->
    <div v-if="modoCreacion || modoEdicion">
      <h3>{{ modoEdicion ? 'Editar Usuario' : 'Crear Usuario' }}</h3>
      <form @submit.prevent="guardarUsuario" enctype="multipart/form-data">
        <div>
          <label for="nombre">Nombre:</label>
          <input type="text" v-model="usuario.nombre" required />
        </div>
        <div>
          <label for="correo">Correo:</label>
          <input type="email" v-model="usuario.correo" required />
        </div>
        <div>
          <label for="password">Contraseña:</label>
          <input type="password" v-model="usuario.password" required />
        </div>
        <div>
          <label for="role">Rol:</label>
          <select v-model="usuario.role" required>
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div>
          <label for="foto">Foto:</label>
          <input type="file" @change="handleFileUpload" />
        </div>
        <button type="submit">{{ modoEdicion ? 'Actualizar Usuario' : 'Crear Usuario' }}</button>
        <button type="button" @click="cancelarOperacion">Cancelar</button>
      </form>
    </div>

    <!-- Lista de Usuarios -->
    <div v-else>
      <h3>Usuarios Existentes</h3>
      <ul>
        <li v-for="usuario in usuarios" :key="usuario.id">
          <div>
            <strong>{{ usuario.nombre }}</strong> - {{ usuario.correo }} 
            <button @click="editarUsuario(usuario)">Editar</button>
            <button @click="eliminarUsuario(usuario.id)">Eliminar</button>
          </div>
        </li>
      </ul>
      <button @click="modoCreacion = true">Crear Nuevo Usuario</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      usuarios: [],
      modoCreacion: false,
      modoEdicion: false,
      usuario: {
        nombre: '',
        correo: '',
        password: '',
        role: 'usuario',
        foto: null
      },
      usuarioEdicionId: null
    };
  },
  created() {
    this.obtenerUsuarios();
  },
  methods: {
    async obtenerUsuarios() {
      try {
        const response = await axios.get('/api/admin/usuarios');
        this.usuarios = response.data;
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        alert('Hubo un error al obtener los usuarios');
      }
    },
    async crearUsuario() {
      const formData = new FormData();
      formData.append('nombre', this.usuario.nombre);
      formData.append('correo', this.usuario.correo);
      formData.append('password', this.usuario.password);
      formData.append('role', this.usuario.role);
      if (this.usuario.foto) formData.append('foto', this.usuario.foto);

      try {
        const response = await axios.post('/api/admin/usuarios', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Usuario creado con éxito');
        this.modoCreacion = false;
        this.usuario = { nombre: '', correo: '', password: '', role: 'usuario', foto: null };
        await this.obtenerUsuarios();
      } catch (error) {
        console.error('Error al crear el usuario:', error);
        alert('Hubo un error al crear el usuario');
      }
    },
    async actualizarUsuario() {
      const formData = new FormData();
      formData.append('nombre', this.usuario.nombre);
      formData.append('correo', this.usuario.correo);
      formData.append('password', this.usuario.password);
      formData.append('role', this.usuario.role);
      if (this.usuario.foto) formData.append('foto', this.usuario.foto);

      try {
        await axios.put(`/api/admin/usuarios/${this.usuarioEdicionId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Usuario actualizado con éxito');
        this.modoEdicion = false;
        this.usuario = { nombre: '', correo: '', password: '', role: 'usuario', foto: null };
        await this.obtenerUsuarios();
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        alert('Hubo un error al actualizar el usuario');
      }
    },
    async eliminarUsuario(id) {
      if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        try {
          await axios.delete(`/api/admin/usuarios/${id}`);
          this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
          alert('Usuario eliminado con éxito');
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
          alert('Hubo un error al eliminar el usuario');
        }
      }
    },
    editarUsuario(usuario) {
      this.modoEdicion = true;
      this.usuario = { ...usuario };
      this.usuarioEdicionId = usuario.id;
    },
    cancelarOperacion() {
      this.modoCreacion = false;
      this.modoEdicion = false;
      this.usuario = { nombre: '', correo: '', password: '', role: 'usuario', foto: null };
    },
    handleFileUpload(event) {
      this.usuario.foto = event.target.files[0];
    },
    async guardarUsuario() {
      if (this.modoEdicion) {
        await this.actualizarUsuario();
      } else {
        await this.crearUsuario();
      }
    }
  }
};
</script>

<style scoped>
.usuarios {
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

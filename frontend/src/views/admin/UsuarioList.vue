<template>
  <div>
    <h1>Gestión de Usuarios</h1>

    <!-- Formulario de creación de usuario -->
    <form @submit.prevent="createUser" autocomplete="on">
      <div>
        <label for="nombre">Nombre</label>
        <input type="text" v-model="user.nombre" required autocomplete="name"/>
      </div>
      <div>
        <label for="correo">Correo</label>
        <input type="email" v-model="user.correo" required autocomplete="email"/>
      </div>
      <div>
        <label for="password">Contraseña</label>
        <input type="password" v-model="user.password" required autocomplete="new-password"/>
      </div>
      <div>
        <label for="role">Rol</label>
        <select v-model="user.role">
          <option value="usuario">Usuario</option>
          <option value="administrador">Administrador</option>
        </select>
      </div>
      <div>
        <label for="foto">Foto de Perfil</label>
        <input type="file" @change="onFileChange" />
      </div>
      <button type="submit">Crear Usuario</button>
    </form>

    <!-- Formulario de actualización de usuario -->
    <form v-if="editingUser" @submit.prevent="updateUser" autocomplete="on">
      <h2>Actualizar Usuario</h2>
      <div>
        <label for="nombre">Nombre</label>
        <input type="text" v-model="editingUser.nombre" required autocomplete="name"/>
      </div>
      <div>
        <label for="correo">Correo</label>
        <input type="email" v-model="editingUser.correo" required autocomplete="email"/>
      </div>
      <div>
        <label for="password">Contraseña</label>
        <input type="password" v-model="editingUser.password" autocomplete="new-password"/>
      </div>
      <div>
        <label for="role">Rol</label>
        <select v-model="editingUser.role">
          <option value="usuario">Usuario</option>
          <option value="administrador">Administrador</option>
        </select>
      </div>
      <div>
        <label for="foto">Foto de Perfil</label>
        <input type="file" @change="onFileChangeUpdate" />
      </div>
      <button type="submit">Actualizar Usuario</button>
    </form>

    <!-- Lista de usuarios -->
    <h2>Usuarios Registrados</h2>
    <div v-if="users.length === 0">No hay usuarios registrados.</div>
    <ul>
      <li v-for="user in users" :key="user.id">
        <p><strong>{{ user.nombre }}</strong></p>
        <p>{{ user.correo }}</p>
        <p>{{ user.role }}</p>
        <img v-if="user.foto" :src="'data:image/jpeg;base64,' + user.foto" alt="Foto de perfil" width="100" />
        <button @click="deleteUser(user.id)">Eliminar</button>
        <button @click="editUser(user)">Editar</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        nombre: '',
        correo: '',
        password: '',
        role: 'usuario',
        foto: null,
      },
      users: [],
      editingUser: null,
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('/api/admin/usuarios');
        this.users = response.data;
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.user.foto = reader.result.split(',')[1]; // Convertir imagen a base64
        };
        reader.readAsDataURL(file);
      }
    },

    onFileChangeUpdate(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.editingUser.foto = reader.result.split(',')[1]; // Convertir imagen a base64
        };
        reader.readAsDataURL(file);
      }
    },

    async createUser() {
      const confirmation = confirm('¿Estás seguro de que deseas crear este usuario?');
      if (confirmation) {
        try {
          const formData = new FormData();
          formData.append('nombre', this.user.nombre);
          formData.append('correo', this.user.correo);
          formData.append('password', this.user.password);
          formData.append('role', this.user.role);
          if (this.user.foto) {
            const base64Image = this.user.foto.split(',')[1]; // Convertir imagen base64
            formData.append('foto', base64Image);
          }

          await axios.post('/api/admin/usuarios', formData);
          this.fetchUsers();
          this.resetForm();
          alert('Usuario creado con éxito.');
        } catch (error) {
          console.error('Error al crear el usuario:', error);
          alert('Hubo un error al crear el usuario.');
        }
      }
    },

    async updateUser() {
      const confirmation = confirm('¿Estás seguro de que deseas actualizar este usuario?');
      if (confirmation) {
        try {
          const formData = new FormData();
          formData.append('nombre', this.editingUser.nombre);
          formData.append('correo', this.editingUser.correo);
          if (this.editingUser.password) {
            formData.append('password', this.editingUser.password);
          }
          formData.append('role', this.editingUser.role);
          if (this.editingUser.foto) {
            const base64Image = this.editingUser.foto.split(',')[1];
            formData.append('foto', base64Image);
          }

          await axios.put(`/api/admin/usuarios/${this.editingUser.id}`, formData);
          this.fetchUsers();
          this.editingUser = null;
          alert('Usuario actualizado con éxito.');
        } catch (error) {
          console.error('Error al actualizar el usuario:', error);
          alert('Hubo un error al actualizar el usuario.');
        }
      }
    },

    async deleteUser(id) {
      const confirmation = confirm('¿Estás seguro de que deseas eliminar este usuario?');
      if (confirmation) {
        try {
          await axios.delete(`/api/admin/usuarios/${id}`);
          this.fetchUsers();
          alert('Usuario eliminado con éxito.');
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
          alert('Hubo un error al eliminar el usuario.');
        }
      }
    },

    editUser(user) {
      this.editingUser = { ...user };
    },

    resetForm() {
      this.user = {
        nombre: '',
        correo: '',
        password: '',
        role: 'usuario',
        foto: null,
      };
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
form {
  margin-bottom: 20px;
}

input,
select {
  margin-bottom: 10px;
}

button {
  margin-top: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}
</style>

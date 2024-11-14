<template>
  <div v-if="userRole === 'admin'">
    <div class="dashboard">
      <h1>{{ message }}</h1>
    </div>

    <!-- Navegación de secciones -->
    <nav>
      <button 
        @click="currentSection = 'canchas'" 
        :class="{'active': currentSection === 'canchas'}">Gestionar Canchas</button>
      <button 
        @click="currentSection = 'clientes'" 
        :class="{'active': currentSection === 'clientes'}">Gestionar Clientes</button>
      <button 
        @click="currentSection = 'preguntas'" 
        :class="{'active': currentSection === 'preguntas'}">Gestionar Preguntas</button>
      <button 
        @click="currentSection = 'reservas'" 
        :class="{'active': currentSection === 'reservas'}">Gestionar Reservas</button>
      <button 
        @click="currentSection = 'usuarios'" 
        :class="{'active': currentSection === 'usuarios'}">Gestionar Usuarios</button>
      
      <!-- Botón de cerrar sesión -->
      <button @click="logout">Cerrar sesión</button>
    </nav>

    <!-- Renderizar sección correspondiente -->
    <div v-if="currentSection === 'canchas'">
      <h2>Gestionar Canchas</h2>
      <CanchaList @fetchData="fetchData" />
    </div>
    <div v-if="currentSection === 'clientes'">
      <h2>Gestionar Clientes</h2>
      <ClienteList @fetchData="fetchData" />
    </div>
    <div v-if="currentSection === 'preguntas'">
      <h2>Gestionar Preguntas</h2>
      <PreguntaList @fetchData="fetchData" />
    </div>
    <div v-if="currentSection === 'reservas'">
      <h2>Gestionar Reservas</h2>
      <ReservaList @fetchData="fetchData" />
    </div>
    <div v-if="currentSection === 'usuarios'">
      <h2>Gestionar Usuarios</h2>
      <UsuarioList @fetchData="fetchData" />
    </div>
  </div>

  <!-- Mensaje si el usuario no tiene acceso -->
  <div v-else>
    <p>No tienes acceso a esta página.</p>
  </div>
</template>

<script>
import axios from 'axios';
import CanchaList from './views/admin/CanchaList.vue';
import ClienteList from './views/admin/ClienteList.vue';
import PreguntaList from './views/admin/PreguntaList.vue';
import ReservaList from './views/admin/ReservaList.vue';
import UsuarioList from './views/admin/UsuarioList.vue';

export default {
  data() {
    return {
      message: 'Cargando...', // Mensaje predeterminado mientras se hace la solicitud
      currentSection: 'canchas', // Sección inicial
    };
  },
  async created() {
    try {
      const response = await axios.get('/api/admin/dashboard'); // Ruta de tu API
      this.message = response.data.message; // Establecer el mensaje recibido desde el servidor
    } catch (error) {
      console.error('Error al cargar el dashboard:', error);
      this.message = 'Error al cargar el dashboard'; // Mensaje de error si algo falla
    }
  },
  computed: {
    userRole() {
      return this.$store.getters.userRole; // Obtener el rol desde Vuex
    }
  },
  methods: {
    fetchData() {
      // Este método se puede conectar a cada componente para recargar datos si es necesario
      console.log("Recargando datos...");
    },
    logout() {
      // Eliminar el token de localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('userRole');
      
      // Limpiar también el estado de la sección activa y la autenticación en Vuex
      this.$store.commit('CLEAR_AUTH_TOKEN');
      
      // Redirigir al usuario a la página de login
      this.$router.push('/login');
    }
  },
  components: {
    CanchaList,
    ClienteList,
    PreguntaList,
    ReservaList,
    UsuarioList,
  }
};
</script>

<style scoped>
/* Aquí puedes agregar tus estilos para el dashboard */
button.active {
  background-color: #42b983;
}
</style>




<style scoped>
.dashboard {
  text-align: center;
  padding: 20px;
}
h1 {
  font-size: 24px;
  color: #333;
}

nav {
  margin-bottom: 1rem;
}

button.active {
  background-color: #42b983; /* O cualquier color que desees para resaltar */
  color: white;
}
button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
button.active {
  background-color: #3d668f; /* Cambio de color cuando el botón está activo */
}
button:hover {
  background-color: #e67e22; /* Color en hover */
}
</style>

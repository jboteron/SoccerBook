<template>
  <div v-if="userRole === 'admin'">
    <div class="dashboard">
      <h1>Dashboard del Administrador</h1>
      <div class="stats">
        <div v-if="dashboardData" class="stat">
          <p>Total de Canchas: {{ dashboardData.totalCanchas }}</p>
          <p>Total de Clientes: {{ dashboardData.totalClientes }}</p>
          <p>Total de Reservas: {{ dashboardData.totalReservas }}</p>
          <p>Total de Preguntas: {{ dashboardData.totalPreguntas }}</p>
          <p>Total de usuarios: {{ dashboardData.totalUsuarios }}</p>
        </div>
        <div v-else>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
      <div class="top-data">
        <h2>Canchas más reservadas</h2>
        <ul>
          <li v-for="cancha in topCanchas" :key="cancha.nombre">
            {{ cancha.nombre }} - {{ cancha.reservasCount }} reservas
          </li>
        </ul>
        <h2>Clientes más activos</h2>
        <ul>
          <li v-for="cliente in topClientes" :key="cliente.nombre">
            {{ cliente.nombre }} - {{ cliente.reservasCount }} reservas
          </li>
        </ul>
      </div>
    </div>

    <!-- Botón para abrir/cerrar la barra de navegación -->
    <button class="toggle-button" @click="toggleSidebar">☰</button>

    <!-- Barra de navegación desplegable -->
    <div class="sidebar" :class="{ open: isOpen }">
      <NavigationButton
        v-for="section in sections"
        :key="section.name"
        :label="section.label"
        :section="section.name"
        :active="currentSection === section.name"
        @changeSection="currentSection = $event"
      />
      <!-- Botón de cerrar sesión -->
      <button class="logout-btn" @click="logout">Cerrar sesión</button>
    </div>

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
import axios from "axios";
import CanchaList from "./views/admin/CanchaList.vue";
import ClienteList from "./views/admin/ClienteList.vue";
import PreguntaList from "./views/admin/PreguntaList.vue";
import ReservaList from "./views/admin/ReservaList.vue";
import UsuarioList from "./views/admin/UsuarioList.vue";
import NavigationButton from "./components/NavigationButton.vue";

export default {
  data() {
    return {
      dashboardData: null,
      topCanchas: [],
      topClientes: [],
      currentSection: "canchas", // Sección inicial
      isOpen: false, // Controla si la barra de navegación está abierta o cerrada
      sections: [
        { name: "canchas", label: "Gestionar Canchas" },
        { name: "clientes", label: "Gestionar Clientes" },
        { name: "preguntas", label: "Gestionar Preguntas" },
        { name: "reservas", label: "Gestionar Reservas" },
        { name: "usuarios", label: "Gestionar Usuarios" },
      ],
    };
  },
  created() {
    this.fetchDashboardData();
    this.fetchTopCanchasReservadas();
    this.fetchTopClientesActivos();
  },
  computed: {
    userRole() {
      return this.$store.getters.userRole; // Obtener el rol desde Vuex
    },
  },
  methods: {
    async fetchDashboardData() {
      try {
        const response = await axios.get("/api/admin/dashboard");
        this.dashboardData = response.data;
      } catch (error) {
        console.error("Error al obtener las estadísticas del dashboard", error);
      }
    },
    async fetchTopCanchasReservadas() {
      try {
        const response = await axios.get("/api/admin/top-canchas");
        this.topCanchas = response.data;
      } catch (error) {
        console.error("Error al obtener las canchas más reservadas", error);
      }
    },
    async fetchTopClientesActivos() {
      try {
        const response = await axios.get("/api/admin/top-clientes");
        this.topClientes = response.data;
      } catch (error) {
        console.error("Error al obtener los clientes más activos", error);
      }
    },
    fetchData() {
      console.log("Recargando datos...");
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("userRole");
      this.$store.commit("CLEAR_AUTH_TOKEN");
      this.$router.push("/login");
    },
    toggleSidebar() {
      this.isOpen = !this.isOpen; // Cambia entre abierto y cerrado
    },
  },
  components: {
    CanchaList,
    ClienteList,
    PreguntaList,
    ReservaList,
    UsuarioList,
    NavigationButton,
  },
};
</script>

<style scoped>
.dashboard {
  text-align: center;
  padding: 20px;
}
.stats, .top-data {
  margin-bottom: 1rem;
}
nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  background-color: #42b983;
  color: white;
  border: none;
  transition: background-color 0.3s;
}
button.active {
  background-color: #3d668f;
}
button:hover {
  background-color: #e67e22;
}
.logout-btn {
  background-color: red;
}
.toggle-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 4px;
  z-index: 1000;
  transition: background-color 0.3s;
}
.toggle-button:hover {
  background-color: #3d668f;
}
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 250px;
  background-color: #333;
  color: white;
  padding: 1rem;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 999;
}
.sidebar.open {
  transform: translateX(0); /* Muestra la barra */
}
.sidebar button {
  display: block;
  margin: 1rem 0;
  background-color: transparent;
  color: white;
  text-align: left;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.sidebar button.active {
  background-color: #42b983;
}
.sidebar button:hover {
  background-color: #3d668f;
}
</style>

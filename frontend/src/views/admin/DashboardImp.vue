<template>
    <div class="dashboard">
      <h1>Dashboard del Administrador</h1>
      <div class="stats">
        <div v-if="dashboardData" class="stat">
          <p>Total de Canchas: {{ dashboardData.totalCanchas }}</p>
          <p>Total de Clientes: {{ dashboardData.totalClientes }}</p>
          <p>Total de Reservas: {{ dashboardData.totalReservas }}</p>
          <p>Total de Preguntas: {{ dashboardData.totalPreguntas }}</p>
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
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        dashboardData: null,
        topCanchas: [],
        topClientes: []
      };
    },
    created() {
      this.fetchDashboardData();
      this.fetchTopCanchasReservadas();
      this.fetchTopClientesActivos();
    },
    methods: {
      async fetchDashboardData() {
        try {
          const response = await axios.get('/api/admin/dashboard');
          this.dashboardData = response.data;
        } catch (error) {
          console.error("Error al obtener las estadísticas del dashboard", error);
        }
      },
      async fetchTopCanchasReservadas() {
        try {
          const response = await axios.get('/api/admin/dashboard/top-canchas');
          this.topCanchas = response.data;
        } catch (error) {
          console.error("Error al obtener las canchas más reservadas", error);
        }
      },
      async fetchTopClientesActivos() {
        try {
          const response = await axios.get('/api/admin/dashboard/top-clientes');
          this.topClientes = response.data;
        } catch (error) {
          console.error("Error al obtener los clientes más activos", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .dashboard {
    padding: 20px;
  }
  .stats, .top-data {
    margin-top: 20px;
  }
  .stat {
    margin-bottom: 10px;
  }
  h2 {
    margin-top: 20px;
  }
  </style>
  
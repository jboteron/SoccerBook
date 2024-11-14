<template>
  <div class="reservas">
    <h2>Gestión de Reservas</h2>

    <!-- Formulario para Crear o Editar una Reserva -->
    <div v-if="modoCreacion || modoEdicion">
      <h3>{{ modoEdicion ? 'Editar Reserva' : 'Crear Reserva' }}</h3>
      <form @submit.prevent="guardarReserva">
        <div>
          <label for="cancha_id">Cancha:</label>
          <input type="number" v-model="reserva.cancha_id" required />
        </div>
        <div>
          <label for="fecha">Fecha:</label>
          <input type="date" v-model="reserva.fecha" required />
        </div>
        <div>
          <label for="hora_inicio">Hora de Inicio:</label>
          <input type="time" v-model="reserva.hora_inicio" required />
        </div>
        <div>
          <label for="hora_fin">Hora de Fin:</label>
          <input type="time" v-model="reserva.hora_fin" required />
        </div>
        <div>
          <label for="nombre_cliente">Nombre del Cliente:</label>
          <input type="text" v-model="reserva.nombre_cliente" required />
        </div>
        <button type="submit">{{ modoEdicion ? 'Actualizar Reserva' : 'Crear Reserva' }}</button>
        <button type="button" @click="cancelarOperacion">Cancelar</button>
      </form>
    </div>

    <!-- Lista de Reservas -->
    <div v-else>
      <h3>Reservas Existentes</h3>
      <ul>
        <li v-for="reserva in reservas" :key="reserva.id">
          <div>
            <strong>{{ reserva.nombre_cliente }}</strong> - {{ reserva.fecha }} 
            de {{ reserva.hora_inicio }} a {{ reserva.hora_fin }}
            <button @click="editarReserva(reserva)">Editar</button>
            <button @click="eliminarReserva(reserva.id)">Eliminar</button>
          </div>
        </li>
      </ul>
      <button @click="modoCreacion = true">Crear Nueva Reserva</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      reservas: [],
      modoCreacion: false,
      modoEdicion: false,
      reserva: {
        cancha_id: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        nombre_cliente: ''
      },
      reservaEdicionId: null
    };
  },
  created() {
    this.obtenerReservas();
  },
  methods: {
    async obtenerReservas() {
      try {
        const response = await axios.get('/api/admin/reservas');
        this.reservas = response.data;
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
        alert('Hubo un error al obtener las reservas');
      }
    },
    async crearReserva() {
      try {
        const response = await axios.post('/api/admin/reservas', this.reserva);
        alert('Reserva creada con éxito');
        this.modoCreacion = false;
        this.reserva = { cancha_id: '', fecha: '', hora_inicio: '', hora_fin: '', nombre_cliente: '' };
        await this.obtenerReservas();
      } catch (error) {
        console.error('Error al crear la reserva:', error);
        alert('Hubo un error al crear la reserva');
      }
    },
    async actualizarReserva() {
      try {
        await axios.put(`/api/admin/reservas/${this.reservaEdicionId}`, this.reserva);
        alert('Reserva actualizada con éxito');
        this.modoEdicion = false;
        this.reserva = { cancha_id: '', fecha: '', hora_inicio: '', hora_fin: '', nombre_cliente: '' };
        await this.obtenerReservas();
      } catch (error) {
        console.error('Error al actualizar la reserva:', error);
        alert('Hubo un error al actualizar la reserva');
      }
    },
    async eliminarReserva(id) {
      if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
        try {
          await axios.delete(`/api/admin/reservas/${id}`);
          this.reservas = this.reservas.filter(reserva => reserva.id !== id);
          alert('Reserva eliminada con éxito');
        } catch (error) {
          console.error('Error al eliminar la reserva:', error);
          alert('Hubo un error al eliminar la reserva');
        }
      }
    },
    editarReserva(reserva) {
      this.modoEdicion = true;
      this.reserva = { ...reserva };
      this.reservaEdicionId = reserva.id;
    },
    cancelarOperacion() {
      this.modoCreacion = false;
      this.modoEdicion = false;
      this.reserva = { cancha_id: '', fecha: '', hora_inicio: '', hora_fin: '', nombre_cliente: '' };
    },
    async guardarReserva() {
      if (this.modoEdicion) {
        await this.actualizarReserva();
      } else {
        await this.crearReserva();
      }
    }
  }
};
</script>

<style scoped>
.reservas {
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

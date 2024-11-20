<template>
  <div>
    <h1>Gestión de Reservas</h1>

    <!-- Lista de Reservas -->
    <div>
      <h2>Reservas Actuales</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cancha</th>
            <th>Fecha</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Cliente</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reserva in reservas" :key="reserva.id">
            <td>{{ reserva.id }}</td>
            <td>{{ reserva.nombre_cancha }}</td>
            <td>{{ reserva.fecha }}</td>
            <td>{{ reserva.hora_inicio }}</td>
            <td>{{ reserva.hora_fin }}</td>
            <td>{{ reserva.nombre_cliente }}</td>
            <td>{{ reserva.fecha_creacion }}</td>
            <td>
              <button @click="editReserva(reserva.id)">Editar</button>
              <button @click="deleteReserva(reserva.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Formulario para editar una reserva -->
    <div v-if="isEditMode">
      <h2>{{ formTitle }}</h2>
      <form @submit.prevent="submitForm">
        <label for="cancha_id">Cancha:</label>
        <input type="text" id="cancha_id" v-model="form.cancha_id" required />
        
        <label for="fecha">Fecha:</label>
        <input type="date" id="fecha" v-model="form.fecha" required />
        
        <label for="hora_inicio">Hora Inicio:</label>
        <input type="time" id="hora_inicio" v-model="form.hora_inicio" required />
        
        <label for="hora_fin">Hora Fin:</label>
        <input type="time" id="hora_fin" v-model="form.hora_fin" required />
        
        <label for="nombre_cliente">Nombre Cliente:</label>
        <input type="text" id="nombre_cliente" v-model="form.nombre_cliente" required />
        
        <button type="submit">Actualizar Reserva</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reservas: [],
      form: {
        id: null,
        cancha_id: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        nombre_cliente: '',
      },
      isEditMode: false,
      formTitle: 'Editar Reserva',
    };
  },
  methods: {
    // Cargar las reservas al cargar el componente
    async loadReservas() {
      try {
        const response = await fetch('/api/admin/reservas');
        const data = await response.json();
        this.reservas = data;
      } catch (error) {
        console.error('Error al cargar las reservas:', error);
      }
    },

    // Mostrar los datos de una reserva para editar
    async editReserva(id) {
      try {
        const response = await fetch(`/api/admin/reservas/${id}`);
        const data = await response.json();
        this.form = { ...data };
        this.isEditMode = true;
        this.formTitle = 'Editar Reserva';
      } catch (error) {
        console.error('Error al obtener la reserva:', error);
      }
    },

    // Actualizar la reserva
    async submitForm() {
      try {
        const method = 'PUT';
        const url = `/api/admin/reservas/${this.form.id}`;
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.form),
        });

        if (response.ok) {
          this.resetForm();
          this.loadReservas();
        } else {
          const data = await response.json();
          console.error('Error al actualizar la reserva:', data.error);
        }
      } catch (error) {
        console.error('Error al enviar los datos:', error);
      }
    },

    // Eliminar una reserva
    async deleteReserva(id) {
      try {
        const response = await fetch(`/api/admin/reservas/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          this.loadReservas();
        } else {
          const data = await response.json();
          console.error('Error al eliminar la reserva:', data.error);
        }
      } catch (error) {
        console.error('Error al eliminar la reserva:', error);
      }
    },

    // Restablecer el formulario
    resetForm() {
      this.form = {
        id: null,
        cancha_id: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        nombre_cliente: '',
      };
      this.isEditMode = false;
      this.formTitle = 'Editar Reserva';
    },
  },
  mounted() {
    this.loadReservas();
  },
};
</script>

<style scoped>
/* Estilos para el componente */
h1, h2 {
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

button {
  margin: 5px;
  padding: 5px 10px;
  background-color: #e67e22;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #f39c12;
}
</style>

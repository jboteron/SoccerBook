<template>
  <div class="preguntas">
    <h2>Gestionar Preguntas</h2>

    <!-- Formulario para Crear Pregunta -->
    <div v-if="modoCreacion">
      <h3>Crear Pregunta</h3>
      <form @submit.prevent="crearPregunta">
        <div>
          <label for="nombre">Nombre:</label>
          <input type="text" v-model="nuevaPregunta.nombre" required />
        </div>
        <div>
          <label for="correo">Correo:</label>
          <input type="email" v-model="nuevaPregunta.correo" required />
        </div>
        <div>
          <label for="mensaje">Mensaje:</label>
          <textarea v-model="nuevaPregunta.mensaje" required></textarea>
        </div>
        <button type="submit">Enviar Pregunta</button>
        <button @click="cancelarCreacion">Cancelar</button>
      </form>
    </div>

    <!-- Lista de Preguntas -->
    <div v-else>
      <h3>Preguntas Recibidas</h3>
      <ul>
        <li v-for="pregunta in preguntas" :key="pregunta.id">
          <div>
            <strong>{{ pregunta.nombre }}</strong> - {{ pregunta.correo }}
            <p>{{ pregunta.mensaje }}</p>
            <button @click="eliminarPregunta(pregunta.id)">Eliminar</button>
          </div>
        </li>
      </ul>
      <button @click="modoCreacion = true">Crear Pregunta</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      preguntas: [],
      modoCreacion: false,
      nuevaPregunta: {
        nombre: '',
        correo: '',
        mensaje: ''
      }
    };
  },
  async created() {
    await this.obtenerPreguntas();
  },
  methods: {
    async obtenerPreguntas() {
      try {
        const response = await axios.get('/api/admin/preguntas');
        this.preguntas = response.data;
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        alert('Hubo un error al obtener las preguntas');
      }
    },
    async crearPregunta() {
      try {
        await axios.post('/api/admin/preguntas', this.nuevaPregunta);
        alert('Pregunta enviada con éxito');
        this.modoCreacion = false;
        this.nuevaPregunta = { nombre: '', correo: '', mensaje: '' };
        await this.obtenerPreguntas(); // Actualizar la lista de preguntas
      } catch (error) {
        console.error('Error al crear la pregunta:', error);
        alert('Hubo un error al enviar la pregunta');
      }
    },
    async eliminarPregunta(id) {
      if (confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
        try {
          await axios.delete(`/api/admin/preguntas/${id}`);
          this.preguntas = this.preguntas.filter(pregunta => pregunta.id !== id);
          alert('Pregunta eliminada con éxito');
        } catch (error) {
          console.error('Error al eliminar la pregunta:', error);
          alert('Hubo un error al eliminar la pregunta');
        }
      }
    },
    cancelarCreacion() {
      this.modoCreacion = false;
      this.nuevaPregunta = { nombre: '', correo: '', mensaje: '' };
    }
  }
};
</script>

<style scoped>
.preguntas {
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

textarea {
  width: 100%;
  height: 100px;
  margin-top: 5px;
}
</style>

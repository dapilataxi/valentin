const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Configurar conexión a PostgreSQL usando variables de entorno
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Usar la variable DATABASE_URL proporcionada por Railway
  ssl: {
    rejectUnauthorized: false, // Necesario para conexiones seguras en producción
  },
});

// Ruta para recibir la respuesta
app.post("/respuesta", async (req, res) => {
  const { respuesta } = req.body;
  try {
    await pool.query("INSERT INTO respuestas (respuesta) VALUES ($1)", [respuesta]);
    res.json({ message: "Respuesta guardada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para ver respuestas (Opcional)
app.get("/respuestas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM respuestas");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Puerto dinámico para producción
const PORT = process.env.PORT || 5000; // Railway asignará un puerto dinámico en producción
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

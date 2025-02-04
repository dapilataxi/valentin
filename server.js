const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "san_valentin",
  password: "diego123",
  port: 5432,
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

app.listen(5000, () => console.log("Servidor corriendo en http://localhost:5000"));

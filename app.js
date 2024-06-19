const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 8080;

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "whoaomi",
  password: "12345678", // Cambia esto por tu contraseña
  database: "sms",
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL");
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rutas
app.post("/messages", (req, res) => {
  const { text, user_id } = req.body;
  console.log("🚀 ~ app.post ~ user_id:", user_id);
  const sql = "INSERT INTO messages (text, user_id) VALUES (?, ?)";
  db.query(sql, [text, user_id], (err, result) => {
    if (err) {
      console.error("Error al insertar el mensaje:", err);
      res.status(500).send("Error al insertar el mensaje");
      return;
    }
    res.status(201).send({ id: result.insertId, text, user_id });
  });
});

app.get("/messages", (req, res) => {
  const sql =
    "SELECT * FROM sms.messages join usuario on usuario.id=user_id order by messages.id";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener los mensajes:", err);
      res.status(500).send("Error al obtener los mensajes");
      return;
    }
    res.status(200).send(results);
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

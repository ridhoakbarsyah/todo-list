const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// 🔌 Koneksi ke database MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // ganti dengan user MySQL kamu
  password: "", // ganti jika pakai password
  database: "todo_db", // pastikan database ini sudah dibuat
});

db.connect((err) => {
  if (err) {
    console.error("❌ Koneksi ke database gagal:", err);
  } else {
    console.log("✅ Terkoneksi ke database MySQL");
  }
});

// 🔹 GET /todos
app.get("/todos", (req, res) => {
  db.query("SELECT * FROM todos", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 🔹 POST /todos
app.post("/todos", (req, res) => {
  const { title } = req.body;
  const query = "INSERT INTO todos (title, completed) VALUES (?, false)";
  db.query(query, [title], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    const newTodo = {
      id: result.insertId,
      title,
      completed: false,
    };
    res.status(201).json(newTodo);
  });
});

// 🔹 PUT /todos/:id
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  db.query("UPDATE todos SET completed = ? WHERE id = ?", [completed, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.sendStatus(200);
  });
});

// 🔹 DELETE /todos/:id
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM todos WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

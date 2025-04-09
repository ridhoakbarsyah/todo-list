const db = require("../config/db");

exports.getTodos = (req, res) => {
  db.query("SELECT * FROM todos", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

exports.addTodo = (req, res) => {
  const { title } = req.body;
  db.query("INSERT INTO todos (title, completed) VALUES (?, ?)", [title, false], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, title, completed: false });
  });
};

exports.updateTodo = (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.query("UPDATE todos SET completed = ? WHERE id = ?", [completed, id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ id, completed });
  });
};

exports.deleteTodo = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM todos WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ id });
  });
};

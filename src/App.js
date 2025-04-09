import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Gagal mengambil data tugas", err);
    }
  };

  const showMessage = (text, duration = 2000) => {
    setMessage(text);
    setTimeout(() => setMessage(null), duration);
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/todos", { title });
      setTodos([...todos, res.data]);
      setTitle("");
      showMessage("✅ Tugas berhasil ditambahkan!");
    } catch (err) {
      console.error("Gagal menambahkan tugas", err);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/todos/${id}`, { completed: !completed });
      fetchTodos();
    } catch (err) {
      console.error("Gagal mengubah status tugas", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      fetchTodos();
      showMessage("🗑️ Tugas berhasil dihapus!");
    } catch (err) {
      console.error("Gagal menghapus tugas", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center p-6 transition-all">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">📝 To-Do List</h1>

      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mb-6 flex gap-2">
        <input type="text" className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tambahkan tugas baru..." />
        <button onClick={addTodo} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
          Tambah
        </button>
      </div>

      {message && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 shadow transition">{message}</div>}

      <ul className="w-full max-w-md space-y-2">
        {todos.length === 0 && <p className="text-gray-500 text-center">Belum ada tugas.</p>}

        {todos.map((todo) => (
          <li key={todo.id} className={`flex justify-between items-center p-3 rounded shadow-sm bg-white transition-all ${todo.completed ? "opacity-70" : "hover:bg-gray-50"}`}>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id, todo.completed)} className="w-4 h-4 text-blue-500" />
              <span className={`text-md ${todo.completed ? "line-through text-gray-500" : "text-gray-800"}`}>{todo.title}</span>
            </div>
            <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-700 transition" title="Hapus tugas">
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

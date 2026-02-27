import { useEffect, useState } from "react";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

const API = "http://localhost:5000/todos";

const App = () => {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const getTodos = async () => {
    try {
      const res = await axios.get(API);
      setTodos(res.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API, { description, completed: false });
      setDescription("");
      getTodos();
    } catch (error) {
      console.error(error.message);
    }
  };

  // ✅ DELETE
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      // Optimistic update (optional), then refresh
      setTodos((prev) => prev.filter((t) => t.todo_id !== id));
      // getTodos(); // you can keep only one approach; filter is faster
    } catch (error) {
      console.error(error.message);
    }
  };

  // ✅ Start editing
  const startEditing = (todo) => {
    setEditingTodo(todo.todo_id);
    setEditedText(todo.description);
  };

  // ✅ Cancel editing
  const cancelEditing = () => {
    setEditingTodo(null);
    setEditedText("");
  };

  // ✅ SAVE edit
  const saveEdit = async (todo) => {
    const trimmed = editedText.trim();
    if (!trimmed) return;

    try {
      await axios.put(`${API}/${todo.todo_id}`, {
        description: trimmed,
        completed: todo.completed, // keep existing completed value
      });

      setEditingTodo(null);
      setEditedText("");
      getTodos();
    } catch (error) {
      console.error(error.message);
    }
  };

  // ✅ Toggle completed (bonus)
  const toggleCompleted = async (todo) => {
    try {
      await axios.put(`${API}/${todo.todo_id}`, {
        description: todo.description,
        completed: !todo.completed,
      });
      // Optimistic update
      setTodos((prev) =>
        prev.map((t) =>
          t.todo_id === todo.todo_id ? { ...t, completed: !t.completed } : t
        )
      );
      // getTodos(); // optional if optimistic
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4">
      <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">PERN TODO APP</h1>

        <form
          onSubmit={onSubmitForm}
          className="flex items-center gap-2 shadow-sm border p-2 rounded-lg mb-6"
        >
          <input
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What needs to be done"
            required
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer">
            Add Task
          </button>
        </form>

        <div>
          {todos.length === 0 ? (
            <p className="text-gray-600">No tasks available. Add a new task!</p>
          ) : (
            <div className="flex flex-col gap-y-4">
              {todos.map((todo) => (
                <div key={todo.todo_id} className="pb-4">
                  {editingTodo === todo.todo_id ? (
                    // ✅ EDIT MODE UI
                    <div className="flex items-center gap-2">
                      <input
                        className="flex-1 outline-none px-3 py-2 text-gray-700 border rounded-lg"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(todo);
                          if (e.key === "Escape") cancelEditing();
                        }}
                      />
                      <button
                        onClick={() => saveEdit(todo)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md font-medium"
                        type="button"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md font-medium"
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    // ✅ VIEW MODE UI
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-x-4">
                        <button
                          type="button"
                          onClick={() => toggleCompleted(todo)}
                          className={`h-6 w-6 border-2 rounded-full flex items-center justify-center ${
                            todo.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                          aria-label="Toggle completed"
                        >
                          {todo.completed && <MdOutlineDone />}
                        </button>

                        <span className={`${todo.completed ? "line-through text-gray-500" : ""}`}>
                          {todo.description}
                        </span>
                      </div>

                      <div className="flex gap-x-2">
                        <button
                          type="button"
                          onClick={() => startEditing(todo)}
                          className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200"
                          aria-label="Edit todo"
                        >
                          <MdModeEditOutline />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteTodo(todo.todo_id)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200"
                          aria-label="Delete todo"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
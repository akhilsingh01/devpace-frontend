import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    topic: "",
    time_spent: "",
    notes: "",
  });
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    topic: "",
    time_spent: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("study-logs/", formData);

      // Add new log to UI immediately
      setLogs([response.data, ...logs]);

      // Clear form
      setFormData({
        topic: "",
        time_spent: "",
        notes: "",
      });
    } catch (error) {
      console.error("Failed to create log");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`study-logs/${id}/`);

      // Remove from UI
      setLogs(logs.filter((log) => log.id !== id));
    } catch (error) {
      console.error("Failed to delete log");
    }
  };

  const startEdit = (log) => {
    setEditingId(log.id);
    setEditData({
      topic: log.topic,
      time_spent: log.time_spent,
      notes: log.notes,
    });
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await API.patch(`study-logs/${id}/`, editData);

      setLogs(logs.map((log) => (log.id === id ? response.data : log)));

      setEditingId(null);
    } catch (error) {
      console.error("Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };

  // Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await API.get("study-logs/");
        setLogs(response.data);
      } catch (err) {
        console.error("Failed to fetch logs");
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <button
            onClick={() => navigate("/profile")}
            className="text-sm text-blue-600 mr-4 hover:underline"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-4">Add Study Log</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="topic"
            placeholder="Topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="number"
            name="time_spent"
            placeholder="Time Spent in minutes(e.g. 20)"
            value={formData.time_spent}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Log
          </button>
        </form>
      </div>
      <div className="space-y-4">
        {logs.length === 0 ? (
          <p>No study logs yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-white p-4 rounded shadow">
              {editingId === log.id ? (
                <>
                  <input
                    type="text"
                    name="topic"
                    value={editData.topic}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded mb-2"
                  />

                  <input
                    type="number"
                    name="time_spent"
                    value={editData.time_spent}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded mb-2"
                  />

                  <textarea
                    name="notes"
                    value={editData.notes}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded mb-2"
                  />

                  <button
                    onClick={() => handleUpdate(log.id)}
                    className="text-green-600 mr-3"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h2 className="font-semibold text-lg">{log.topic}</h2>
                  <p>Time Spent: {log.time_spent} minutes</p>
                  <p className="text-sm text-gray-600">{log.notes}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(log.created_at).toLocaleString()}
                  </p>

                  <button
                    onClick={() => startEdit(log)}
                    className="text-blue-600 mr-3 mt-3"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(log.id)}
                    className="text-red-600 mt-3"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

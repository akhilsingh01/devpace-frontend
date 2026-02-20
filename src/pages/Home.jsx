import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  BookOpen,
  Clock,
  Calendar,
  FileText,
} from "lucide-react";
import API from "../api/axios";

export default function Home() {
  const [formData, setFormData] = useState({
    topic: "",
    time_spent: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    topic: "",
    time_spent: "",
    notes: "",
  });
  const [logs, setLogs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // handle new study log change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle new study log and save them
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

  // handle the deletion of study logs
  const handleDelete = async (id) => {
    try {
      await API.delete(`study-logs/${id}/`);

      // Remove from UI
      setLogs(logs.filter((log) => log.id !== id));
    } catch (error) {
      console.error("Failed to delete log");
    }
  };

  // use to edit a specific study log
  const startEdit = (log) => {
    setEditingId(log.id);
    setEditData({
      topic: log.topic,
      time_spent: log.time_spent,
      notes: log.notes,
    });
  };

  // handle edit change
  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  // update the edited change of a study log
  const handleUpdate = async (id) => {
    try {
      const response = await API.patch(`study-logs/${id}/`, editData);

      setLogs(logs.map((log) => (log.id === id ? response.data : log)));

      setEditingId(null);
    } catch (error) {
      console.error("Update failed");
    }
  };

  // Fetch logs (insures all the study log shown in realtime)
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-semibold text-gray-900">
              Study Sessions
            </h1>
          </div>

          {/* Toggle Study Session Card */}
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
          >
            {showAddForm ? (
              "Cancel"
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add Study Session
              </>
            )}
          </button>
        </div>

        {/* Add Study Session Card */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Add Study Session
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="topic"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  Topic
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="timeSpent"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                >
                  <Clock className="w-4 h-4 text-gray-500" />
                  Time Spent (minutes)
                </label>
                <input
                  type="number"
                  name="time_spent"
                  value={formData.time_spent}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                  required
                  min="1"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  Notes
                </label>
                <textarea
                  name="notes"
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Add Session
              </button>
            </form>
          </div>
        )}

        {/* Study Sessions List */}
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">
                No study sessions yet. Add your first session above!
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="bg-white rounded-xl shadow-sm p-6">
                {editingId === log.id ? (
                  // Edit Mode

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="topic"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                      >
                        <FileText className="w-4 h-4 text-gray-500" />
                        Topic
                      </label>
                      <input
                        type="text"
                        name="topic"
                        value={editData.topic}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-600 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="timeSpent"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                      >
                        <Clock className="w-4 h-4 text-gray-500" />
                        Time Spent (minutes)
                      </label>
                      <input
                        type="number"
                        name="time_spent"
                        value={editData.time_spent}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                        min="1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="notes"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                      >
                        <FileText className="w-4 h-4 text-gray-500" />
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={editData.notes}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdate(log.id)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {log.topic}
                      </h3>
                      <span className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        <Clock className="w-4 h-4" />
                        {log.time_spent} min
                      </span>
                    </div>
                    {log.notes && (
                      <p className="text-gray-700 mb-4">{log.notes}</p>
                    )}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                      <div className="flex gap-4">
                        <button
                          onClick={() => startEdit(log)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition font-medium text-sm border border-blue-200"
                        >
                          <Pencil className="w-4 h-4" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(log.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:text-red-700 transition font-medium text-sm border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

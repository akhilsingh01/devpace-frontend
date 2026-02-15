import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("profile/");
        setUser(response.data);
        setEmail(response.data.email || "");
      } catch (error) {
        console.error("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await API.put("profile/", {
        email: email,
      });

      setUser(response.data);
      alert("Email updated successfully");
    } catch (error) {
      console.error("Update failed");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      await API.post("change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      alert("Password updated successfully");

      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      alert("Password update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-white p-6 rounded shadow w-96">
        <p className="mb-4">
          <strong>Username:</strong> {user.username}
        </p>

        <form onSubmit={handleUpdate}>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Email
          </button>
        </form>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>

          <form onSubmit={handlePasswordChange}>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 border rounded mb-3"
              required
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              required
            />

            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Loader2, Mail, Lock, User as UserIcon, Shield } from 'lucide-react';
import API from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

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

  // Email success timer
  useEffect(() => {
    let emailTimer;

    if (emailSuccess) {
      emailTimer = setTimeout(() => {
        setEmailSuccess(false);
      }, 3000);
    }

    return () => clearTimeout(emailTimer);
  }, [emailSuccess]);

  // Password success timer
  useEffect(() => {
    let passwordTimer;

    if (passwordSuccess) {
      passwordTimer = setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    }

    return () => clearTimeout(passwordTimer);
  }, [passwordSuccess]);

  // handle email change
  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailLoading(true);

    try {
      const response = await API.put("profile/", {
        email: email,
      });

      setUser(response.data);
      setEmailSuccess(true);
    } catch (error) {
      console.error("Update failed");
    } finally {
      setEmailLoading(false);
    }
  };

  // handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);

    try {
      await API.post("change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      setPasswordSuccess(true);

      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      alert("Password update failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Profile</h1>

        {/* Profile Information Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <UserIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Profile Information
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                Username
              </label>
              <input
                type="text"
                value={user.username}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <form onSubmit={handleEmailChange}>
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <Mail className="w-4 h-4 text-gray-500" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition mb-4"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={emailLoading}
              >
                {emailLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {emailLoading ? "Updating..." : "Update Email"}
              </button>
            </form>
            {emailSuccess && (
              <p className="text-green-600 text-sm font-medium">
                Email updated successfully!
              </p>
            )}
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Change Password
            </h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label
                htmlFor="oldPassword"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <Lock className="w-4 h-4 text-gray-500" />
                Old Password
              </label>
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <Lock className="w-4 h-4 text-gray-500" />
                New Password
              </label>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-700 transition font-medium disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={passwordLoading}
            >
              {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
          {passwordSuccess && (
            <p className="text-green-600 text-sm font-medium mt-2">
              Password changed successfully!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

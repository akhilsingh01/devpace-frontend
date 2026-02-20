import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from 'lucide-react';
import logo from "../assets/DevPace_logo.png";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center">
              <img src={logo} alt="DevPace Logo" className="h-10 w-auto" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="text-white bg-gray-600 hover:bg-gray-700 rounded-2xl transition p-1.5"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-medium text-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

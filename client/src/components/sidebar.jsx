import { useEffect, useState } from "react";
import { Home, Calendar, Dumbbell, User, BarChart2, Settings, LogOut, Film, Plus } from "lucide-react";
import "../css/sidebar.css";

export default function Sidebar({ activeView, setActiveView }) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserRole(parsedUser.role);
      } catch (err) {
        console.error("Failed to parse user data from localStorage:", err);
      }
    }
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
  ];

  const instructorItems = [
    { id: "workout-plan", label: "Manage Courses", icon: Film },
    { id: "add-course-video", label: "Add Course Video", icon: Plus },
  ];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        {/* Add your logo here if needed */}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`nav-item ${activeView === item.id ? "active" : ""}`}
                >
                  <Icon size={20} className="nav-icon" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Instructor Section (only if user is coach) */}
      {userRole === "coach" && (
        <div className="sidebar-section">
          <h2 className="section-title">Instructor</h2>
          <ul className="nav-list">
            {instructorItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveView(item.id)}
                    className={`nav-item ${activeView === item.id ? "active" : ""}`}
                  >
                    <Icon size={20} className="nav-icon" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* User Actions */}
      <div className="sidebar-user">
        <div className="user-actions">
          <button className="user-action-btn">
            <Settings size={18} className="action-icon" />
            <span className="action-text">Settings</span>
          </button>
          <button className="user-action-btn">
            <LogOut size={18} className="action-icon" />
            <span className="action-text">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

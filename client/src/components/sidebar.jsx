"use client"

import { Home, Calendar, Dumbbell, User, BarChart2, Settings, LogOut } from "lucide-react"
import "../css/sidebar.css"

export default function Sidebar({ activeView, setActiveView }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "workouts", label: "Workouts", icon: Dumbbell },
    { id: "profile", label: "Profile", icon: User },
    { id: "stats", label: "Statistics", icon: BarChart2 },
  ]

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <h1 className="logo-text">Flowin</h1>
        <p className="logo-subtext">Fitness Tracker</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon
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
            )
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar"></div>
          <div>
            <p className="user-name">Iike Savran</p>
            <p className="user-role">Pro Member</p>
          </div>
        </div>
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
  )
}

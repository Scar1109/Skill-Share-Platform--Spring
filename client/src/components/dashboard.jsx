"use client"

import { useState } from "react"
import { Clock, Award, ChevronRight, Calendar, Dumbbell, Flame } from "lucide-react"
import "../css/dashboard.css"

export default function Dashboard({ onClassSelect }) {
  const [activeDay, setActiveDay] = useState(2) // 0-6 for days of week

  const days = [
    { day: "Mon", date: 21 },
    { day: "Tue", date: 22 },
    { day: "Wed", date: 23 },
    { day: "Thu", date: 24 },
    { day: "Fri", date: 25 },
    { day: "Sat", date: 26 },
    { day: "Sun", date: 27 },
  ]

  const classes = [
    {
      id: 1,
      title: "Hatha Basics",
      level: "Beginner",
      completed: 27,
      image: "/placeholder.svg?height=200&width=300",
      duration: "30 min",
      instructor: "Jane Brunetti",
      description:
        "Perfect for beginners, this class focuses on the fundamentals of Hatha yoga, helping you build a strong foundation.",
    },
    {
      id: 2,
      title: "Energizing Morning Flow",
      level: "Beginner",
      completed: 15,
      image: "/placeholder.svg?height=200&width=300",
      duration: "25 min",
      instructor: "Jane Brunetti",
      description:
        "Discover the gentle art of flexibility in our beginner-friendly yoga class. This soothing session focuses on increasing your range of motion through slow, mindful stretches and poses.",
    },
    {
      id: 3,
      title: "Balance",
      level: "Moderate",
      completed: 5,
      image: "/placeholder.svg?height=200&width=300",
      duration: "40 min",
      instructor: "Mike Chen",
      description:
        "Improve your stability and core strength with this balanced workout that combines yoga and pilates elements.",
    },
    {
      id: 4,
      title: "Flexibility",
      level: "Beginner",
      completed: 10,
      image: "/placeholder.svg?height=200&width=300",
      duration: "35 min",
      instructor: "Sarah Johnson",
      description: "Focus on increasing your flexibility and range of motion with gentle stretches and holds.",
    },
  ]

  const stats = {
    calories: 1849,
    minutes: 319,
    classes: 28,
    streak: 12,
    progress: 78,
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Track your fitness journey</p>
        </div>
        <div className="header-actions">
          <div className="header-action-btn">
            <Calendar size={20} />
          </div>
          <div className="header-action-btn">
            <Dumbbell size={20} />
          </div>
          <div className="header-avatar"></div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-header">
              <div className="stat-icon green">
                <Award size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Current Streak</p>
                <p className="stat-value">{stats.streak} days</p>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-indicator" style={{ width: `${stats.progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-header">
              <div className="stat-icon red">
                <Flame size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Calories Burned</p>
                <p className="stat-value">{stats.calories}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-header">
              <div className="stat-icon blue">
                <Clock size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Active Minutes</p>
                <p className="stat-value">{stats.minutes}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-header">
              <div className="stat-icon purple">
                <Dumbbell size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Classes Completed</p>
                <p className="stat-value">{stats.classes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="calendar-card">
        <div className="card-content">
          <div className="section-header">
            <h2 className="section-title">Weekly Schedule</h2>
            <button className="view-all-btn">
              View Calendar <ChevronRight size={16} />
            </button>
          </div>
          <div className="week-days">
            {days.map((day, index) => (
              <div
                key={index}
                onClick={() => setActiveDay(index)}
                className={`day-item ${index === activeDay ? "active" : ""}`}
              >
                <span className="day-name">{day.day}</span>
                <span className="day-date">{day.date}</span>
                <span className="day-indicator">{index === activeDay ? "Today" : ""}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Classes */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Recent Classes</h2>
          <button className="view-all-btn">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="classes-grid">
          {classes.slice(0, 3).map((classItem) => (
            <div key={classItem.id} className="class-card" onClick={() => onClassSelect(classItem)}>
              <div className="class-image">
                <img
                  src={classItem.image || "/placeholder.svg"}
                  alt={classItem.title}
                  className="image-cover"
                />
              </div>
              <div className="class-content">
                <div className="class-meta">
                  <span className={`class-level ${classItem.level.toLowerCase()}`}>{classItem.level}</span>
                  <span className="class-duration">{classItem.duration}</span>
                </div>
                <h3 className="class-title">{classItem.title}</h3>
                <p className="class-instructor">with {classItem.instructor}</p>
                <p className="class-description">{classItem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Classes */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Recommended For You</h2>
          <button className="view-all-btn">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="recommended-grid">
          {classes.map((classItem) => (
            <div key={classItem.id} className="recommended-card" onClick={() => onClassSelect(classItem)}>
              <div className="recommended-image">
                <img
                  src={classItem.image || "/placeholder.svg"}
                  alt={classItem.title}
                  className="image-cover"
                />
                <div className="duration-badge">{classItem.duration}</div>
              </div>
              <div className="recommended-content">
                <span className={`class-level ${classItem.level.toLowerCase()}`}>{classItem.level}</span>
                <h3 className="recommended-title">{classItem.title}</h3>
                <p className="recommended-instructor">with {classItem.instructor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

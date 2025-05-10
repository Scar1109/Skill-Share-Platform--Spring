"use client"
import { useState, useEffect } from "react"
import { BarChart2, Clock, Award, Calendar, Settings, Trash2 } from "lucide-react"
import "../css/profile.css"

export default function Profile() {
  const [classHistory, setClassHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const stats = {
    calories: 1849,
    minutes: 319,
    classes: 28,
    streak: 12,
  }

  const achievements = [
    { id: 1, name: "Early Bird", description: "Complete 5 morning workouts", progress: 80 },
    { id: 2, name: "Consistency King", description: "Workout for 10 days in a row", progress: 100 },
    { id: 3, name: "Flexibility Master", description: "Complete 15 flexibility classes", progress: 60 },
    { id: 4, name: "Strength Builder", description: "Complete 20 strength workouts", progress: 45 },
  ]

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }

    async function fetchUserProgress() {
      try {
        const progressResponse = await fetch("http://localhost:8080/api/progress")
        const progressData = await progressResponse.json()

        const userId = JSON.parse(userData)?.id || ""
        const userProgress = progressData.filter(p => p.userId === userId)

        const coursesResponse = await fetch("http://localhost:8080/api/courses")
        const coursesData = await coursesResponse.json()

        const history = userProgress.map((progress, index) => {
          const course = coursesData.find(course => course.id === progress.courseId)
          if (!course) return null

          const date = new Date()
          date.setDate(date.getDate() - index)
          const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

          return {
            id: progress.id,
            day: formattedDate,
            name: course.courseTitle || "Untitled Course",
            duration: `${course.durationMinutes || 0} min`,
            level: course.level || "Unknown",
          }
        }).filter(Boolean)

        setClassHistory(history)
      } catch (error) {
        console.error("Error fetching user progress:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProgress()
  }, [])

  const handleDeleteActivity = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/progress/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      setClassHistory(classHistory.filter(item => item.id !== id))
    } catch (error) {
      console.error("Error deleting activity:", error)
      alert("Failed to delete activity. Please try again.")
    }
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h1 className="page-title">Profile</h1>
        <button className="settings KING-button">
          <Settings size={20} />
        </button>
      </div>

      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-info">
              <div className="profile-avatar-container" style={{ width: "180px", height: "180px", margin: "0 auto" }}>
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={`${user.firstName || "User"}'s avatar`}
                    className="image-cover"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "100%",
                      fontSize: "48px"
                    }}
                  />
                ) : (
                  <div
                    className="avatar-placeholder image-cover"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "100%",
                      fontSize: "64px",
                      backgroundColor: "#ccc",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {user?.firstName?.charAt(0) || "U"}
                  </div>
                )}
              </div>

              <h2 className="profile-name" style={{ textAlign: "center", marginTop: "16px" }}>
                {user?.firstName || ""} {user?.lastName || ""}
              </h2>
              <p className="profile-date" style={{ textAlign: "center" }}>
                {user ? "Member since Jan 2024" : "Member"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          <div className="tabs-container">
            <div className="tabs-header">
              <button className="tab-button active">Activity</button>
              <button className="tab-button">Achievements</button>
              <button className="tab-button">Detailed Stats</button>
            </div>

            <div className="tab-content">
              <div className="activity-tab">
                <div className="content-card">
                  <h3 className="content-title">Recent Activity</h3>
                  {loading ? (
                    <div>Loading...</div>
                  ) : classHistory.length === 0 ? (
                    <div>No recent activity found.</div>
                  ) : (
                    <div className="activity-list">
                      {classHistory.map((item) => (
                        <div key={item.id} className="activity-item">
                          <div className="activity-date">
                            <p className="date-month">{item.day.split(" ")[0]}</p>
                            <p className="date-day">{item.day.split(" ")[1]}</p>
                          </div>
                          <div className="activity-details">
                            <p className="activity-name">{item.name}</p>
                            <div className="activity-meta">
                              <span className={`activity-level ${item.level.toLowerCase()}`}>{item.level}</span>
                              <span className="activity-duration">{item.duration}</span>
                            </div>
                          </div>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteActivity(item.id)}
                            style={{
                              background: "#ff4d4f",
                              border: "none",
                              color: "white",
                              borderRadius: "6px",
                              padding: "6px 10px",
                              cursor: "pointer",
                              transition: "background 0.3s",
                            }}
                            title="Delete activity"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="achievements-tab" style={{ display: "none" }}>
                {/* existing achievement section */}
              </div>

              <div className="stats-tab" style={{ display: "none" }}>
                {/* existing stats section */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

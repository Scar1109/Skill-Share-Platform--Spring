"use client"
import { useState, useEffect } from "react"
import { BarChart2, Clock, Award, Calendar, Settings, Edit, Trash2 } from "lucide-react"
import "../css/profile.css"

export default function Profile() {
  const [classHistory, setClassHistory] = useState([])
  const [loading, setLoading] = useState(true)

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

  // Mock current user ID (replace with actual user ID from auth context)
  const currentUserId = "user123"

  // Fetch course progress and course details
  useEffect(() => {
    async function fetchUserProgress() {
      try {
        // Fetch all course progress records
        const progressResponse = await fetch("http://localhost:8080/api/progress")
        if (!progressResponse.ok) {
          throw new Error(`HTTP error! status: ${progressResponse.status}`)
        }
        const progressData = await progressResponse.json()

        // Filter progress records for the current user
        const userProgress = progressData.filter(progress => progress.userId === currentUserId)

        // Fetch all courses
        const coursesResponse = await fetch("http://localhost:8080/api/courses")
        if (!coursesResponse.ok) {
          throw new Error(`HTTP error! status: ${coursesResponse.status}`)
        }
        const coursesData = await coursesResponse.json()

        // Map progress to course details
        const history = userProgress.map((progress, index) => {
          const course = coursesData.find(course => course.id === progress.courseId)
          if (!course) return null

          // Format date (placeholder: use current台灣 minus index days for demo)
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
        }).filter(item => item !== null)

        setClassHistory(history)
      } catch (error) {
        console.error("Error fetching user progress:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProgress()
  }, [])

  // Handle deletion of a course progress record
  const handleDeleteActivity = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/progress/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      // Remove the deleted item from classHistory
      setClassHistory(classHistory.filter(item => item.id !== id))
    } catch (error) {
      console.error("Error deleting activity:", error)
      // Optionally, show an error message to the user
      alert("Failed to delete activity. Please try again.")
    }
  }

  return (
    <div className="profile">
      {/* Header */}
      <div className="profile-header">
        <h1 className="page-title">Profile</h1>
        <button className="settings KING-button">
          <Settings size={20} />
        </button>
      </div>

      <div className="profile-layout">
        {/* Profile Info */}
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-info">
              <div className="profile-avatar-container">
                <img src="/placeholder.svg?height=128&width=128" alt="Profile" className="image-cover" />
                <button className="edit-button">
                  <Edit size={16} />
                </button>
              </div>
              <div className="profile-badge">PRO</div>
              <h2 className="profile-name">Iike Savran</h2>
              <p className="profile-date">Member since January 2023</p>
            </div>

            <div className="profile-sections">
              <div className="profile-section">
                <h3 className="section-label">Bio</h3>
                <p className="profile-bio">
                  Fitness enthusiast focused on yoga and mindfulness. Working on improving flexibility and strength
                  through daily practice. Love sharing my journey with the community.
                </p>
              </div>

              <div className="profile-section">
                <h3 className="section-label">Stats</h3>
                <div className="stats-grid">
                  <div className="stat-box">
                    <div className="stat-header">
                      <Calendar size={16} className="stat-icon green" />
                      <span className="stat-name">Current Streak</span>
                    </div>
                    <p className="stat-value">{stats.streak} days</p>
                  </div>
                  <div className="stat-box">
                    <div className="stat-header">
                      <Award size={16} className="stat-icon purple" />
                      <span className="stat-name">Classes</span>
                    </div>
                    <p className="stat-value">{stats.classes}</p>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3 className="section-label">Interests</h3>
                <div className="interests-container">
                  <span className="interest-tag">Yoga</span>
                  <span className="interest-tag">Meditation</span>
                  <span className="interest-tag">HIIT</span>
                  <span className="interest-tag">Running</span>
                  <span className="interest-tag">Pilates</span>
                </div>
              </div>
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
                            title="Delete activity"
                          >
                            <Trash2 size={16} className="delete-icon" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="achievements-tab" style={{ display: "none" }}>
                <div className="content-card">
                  <h3 className="content-title">Your Achievements</h3>
                  <div className="achievements-grid">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="achievement-card">
                        <div className="achievement-header">
                          <div className="achievement-icon">
                            <Award className="icon green" size={20} />
                          </div>
                          <div>
                            <h4 className="achievement-name">{achievement.name}</h4>
                            <p className="achievement-desc">{achievement.description}</p>
                          </div>
                        </div>
                        <div className="achievement-progress">
                          <div className="progress-header">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <div className="progress-bar">
                            <div
                              className={`progress-indicator ${achievement.progress === 100 ? "complete" : ""}`}
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="stats-tab" style={{ display: "none" }}>
                <div className="content-card">
                  <h3 className="content-title">Detailed Statistics</h3>
                  <div className="detailed-stats">
                    <div className="stat-column">
                      <div className="stat-circle">
                        <BarChart2 className="stat-icon green" size={24} />
                      </div>
                      <p className="stat-number">{stats.calories}</p>
                      <p className="stat-label">CALORIES</p>
                    </div>

                    <div className="stat-column">
                      <div className="stat-circle">
                        <Clock className="stat-icon blue" size={24} />
                      </div>
                      <p className="stat-number">{stats.minutes}</p>
                      <p className="stat-label">MINUTES</p>
                    </div>

                    <div className="stat-column">
                      <div className="stat-circle">
                        <Award className="stat-icon purple" size={24} />
                      </div>
                      <p className="stat-number">{stats.classes}</p>
                      <p className="stat-label">CLASSES</p>
                    </div>
                  </div>

                  {/* Placeholder for charts */}
                  <div className="charts-placeholder">
                    <p>Activity charts would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
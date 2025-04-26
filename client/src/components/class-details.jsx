"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  Heart,
  Calendar,
  Share2,
  Bookmark,
  Play,
  Clock,
  User,
  CheckCircle,
  ChevronRight,
  BarChart2,
} from "lucide-react"
import "../css/class-details.css"

export default function ClassDetails({ classData, onBack }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [completedVideos, setCompletedVideos] = useState([])
  const [overallProgress, setOverallProgress] = useState(0)

  // Mock video series data
  const videoSeries = [
    {
      id: 1,
      title: "Introduction & Warm-up",
      duration: "5:30",
      description: "Get ready for your practice with gentle movements to warm up your body.",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 2,
      title: "Foundation & Alignment",
      duration: "8:45",
      description: "Learn the proper alignment and foundation for the main poses in this class.",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 3,
      title: "Main Sequence",
      duration: "15:20",
      description: "The core workout sequence focusing on strength and flexibility.",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 4,
      title: "Advanced Variations",
      duration: "7:15",
      description: "Optional advanced variations for those looking for more challenge.",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 5,
      title: "Cool Down & Relaxation",
      duration: "6:10",
      description: "Gentle stretches and relaxation to complete your practice.",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

  // Calculate overall progress whenever completedVideos changes
  useEffect(() => {
    const progress = (completedVideos.length / videoSeries.length) * 100
    setOverallProgress(progress)
  }, [completedVideos])

  const handleVideoComplete = () => {
    if (!completedVideos.includes(currentVideoIndex)) {
      const newCompletedVideos = [...completedVideos, currentVideoIndex]
      setCompletedVideos(newCompletedVideos)
    }

    // Move to next video if not the last one
    if (currentVideoIndex < videoSeries.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1)
    }
  }

  const handleVideoSelect = (index) => {
    setCurrentVideoIndex(index)
  }

  const currentVideo = videoSeries[currentVideoIndex]

  const relatedClasses = [
    {
      id: 101,
      title: "Advanced Flow",
      level: "Advanced",
      duration: "45 min",
      image: "/placeholder.svg?height=150&width=250",
    },
    {
      id: 102,
      title: "Gentle Stretch",
      level: "Beginner",
      duration: "20 min",
      image: "/placeholder.svg?height=150&width=250",
    },
    {
      id: 103,
      title: "Power Yoga",
      level: "Intermediate",
      duration: "35 min",
      image: "/placeholder.svg?height=150&width=250",
    },
  ]

  return (
    <div className="class-details">
      {/* Header with back button */}
      <div className="details-header">
        <button onClick={onBack} className="back-button">
          <ChevronLeft size={20} />
        </button>
        <h1 className="details-title">Course Details</h1>
      </div>

      <div className="details-layout">
        {/* Main content */}
        <div className="details-main">
          {/* Course progress */}
          <div className="course-progress">
            <div className="progress-header">
              <h3>Course Progress</h3>
              <span className="progress-percentage">{Math.round(overallProgress)}% Complete</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }}></div>
              </div>
            </div>
          </div>

          {/* Current video section */}
          <div className="video-container">
            <img src={currentVideo.thumbnail || "/placeholder.svg"} alt={currentVideo.title} className="image-cover" />
            <div className="video-overlay">
              <button className="play-button">
                <Play size={24} className="play-icon" />
              </button>
            </div>
            <div className="video-progress-indicator">
              <span>
                Video {currentVideoIndex + 1} of {videoSeries.length}
              </span>
            </div>
          </div>

          {/* Current video info */}
          <div className="video-info">
            <div className="video-meta">
              <h2 className="video-title">{currentVideo.title}</h2>
              <span className="video-duration">
                <Clock size={14} className="meta-icon" /> {currentVideo.duration}
              </span>
            </div>
            <p className="video-description">{currentVideo.description}</p>

            <div className="video-actions">
              <button className="complete-button" onClick={handleVideoComplete}>
                {completedVideos.includes(currentVideoIndex) ? "Completed" : "Mark as Complete"}
              </button>

              <div className="navigation-buttons">
                <button
                  className="nav-button"
                  disabled={currentVideoIndex === 0}
                  onClick={() => setCurrentVideoIndex(currentVideoIndex - 1)}
                >
                  <ChevronLeft size={18} /> Previous
                </button>
                <button
                  className="nav-button"
                  disabled={currentVideoIndex === videoSeries.length - 1}
                  onClick={() => setCurrentVideoIndex(currentVideoIndex + 1)}
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Video series list */}
          <div className="video-series-section">
            <h2 className="section-title">Course Content</h2>
            <div className="video-series-list">
              {videoSeries.map((video, index) => (
                <div
                  key={video.id}
                  className={`video-item ${index === currentVideoIndex ? "active" : ""} ${completedVideos.includes(index) ? "completed" : ""}`}
                  onClick={() => handleVideoSelect(index)}
                >
                  <div className="video-item-thumbnail">
                    <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} />
                    {completedVideos.includes(index) && (
                      <div className="completed-overlay">
                        <CheckCircle size={20} />
                      </div>
                    )}
                  </div>
                  <div className="video-item-info">
                    <div className="video-item-header">
                      <h3 className="video-item-title">
                        {index + 1}. {video.title}
                      </h3>
                      <span className="video-item-duration">{video.duration}</span>
                    </div>
                    <p className="video-item-description">{video.description}</p>
                  </div>
                  <div className="video-item-status">
                    {completedVideos.includes(index) ? (
                      <CheckCircle size={18} className="completed-icon" />
                    ) : (
                      <span className="status-text">{index === currentVideoIndex ? "Current" : "Upcoming"}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class info */}
          <div className="class-info">
            <div className="class-meta">
              <span className={`class-level ${classData.level.toLowerCase()}`}>{classData.level}</span>
              <span className="meta-item">
                <Clock size={14} className="meta-icon" /> {classData.duration}
              </span>
              <span className="meta-item">
                <User size={14} className="meta-icon" /> {classData.instructor}
              </span>
            </div>

            <h1 className="class-title">{classData.title}</h1>
            <p className="class-description">{classData.description}</p>

            <div className="class-actions">
              <button
                className={`favorite-button ${isFavorite ? "active" : ""}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart size={18} className="action-icon" />
                {isFavorite ? "Favorited" : "Favorite"}
              </button>
            </div>
          </div>

          {/* Instructor */}
          <div className="instructor-section">
            <h2 className="section-title">About the Instructor</h2>
            <div className="instructor-card">
              <div className="instructor-profile">
                <div className="instructor-avatar"></div>
                <div>
                  <h3 className="instructor-name">{classData.instructor}</h3>
                  <p className="instructor-role">Yoga & Fitness Instructor</p>
                  <p className="instructor-bio">
                    Experienced instructor specializing in yoga and mindfulness practices. Certified in Hatha, Vinyasa,
                    and Restorative yoga with over 5 years of teaching experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="details-sidebar">
          {/* Course stats */}
          <div className="sidebar-card">
            <h2 className="sidebar-title">Course Stats</h2>
            <div className="course-stats">
              <div className="stat-item">
                <BarChart2 size={20} className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-label">Total Duration</span>
                  <span className="stat-value">43 minutes</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrapper">
                  <span className="video-count">{videoSeries.length}</span>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Videos</span>
                  <span className="stat-value">{completedVideos.length} completed</span>
                </div>
              </div>
            </div>
            <div className="progress-summary">
              <div className="progress-circle-container">
                <svg className="progress-circle" width="80" height="80" viewBox="0 0 80 80">
                  <circle className="progress-circle-bg" cx="40" cy="40" r="36" />
                  <circle
                    className="progress-circle-fill"
                    cx="40"
                    cy="40"
                    r="36"
                    strokeDasharray="226.2"
                    strokeDashoffset={226.2 - (226.2 * overallProgress) / 100}
                  />
                </svg>
                <div className="progress-circle-text">
                  <span className="progress-percentage-large">{Math.round(overallProgress)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="sidebar-card">
            <h2 className="sidebar-title">Course Actions</h2>
            <div className="action-grid">
              <button
                className={`action-button ${isBookmarked ? "active" : ""}`}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark size={24} className="action-icon" />
                <span className="action-label">Save</span>
              </button>
              <button className="action-button">
                <Calendar size={24} className="action-icon" />
                <span className="action-label">Schedule</span>
              </button>
              <button className="action-button">
                <Share2 size={24} className="action-icon" />
                <span className="action-label">Share</span>
              </button>
              <button className="action-button">
                <Heart size={24} className="action-icon" />
                <span className="action-label">Like</span>
              </button>
            </div>
          </div>

          {/* Related classes */}
          <div className="sidebar-card">
            <h2 className="sidebar-title">Related Courses</h2>
            <div className="related-classes">
              {relatedClasses.map((relClass) => (
                <div key={relClass.id} className="related-class">
                  <div className="related-image">
                    <img src={relClass.image || "/placeholder.svg"} alt={relClass.title} className="image-cover" />
                  </div>
                  <div className="related-info">
                    <h3 className="related-title">{relClass.title}</h3>
                    <div className="related-meta">
                      <span className={`related-level ${relClass.level.toLowerCase()}`}>{relClass.level}</span>
                      <span className="related-duration">{relClass.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

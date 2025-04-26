"use client"

import { useState } from "react"
import { ChevronLeft, Heart, Calendar, Share2, Bookmark, Play, Clock, User } from "lucide-react"
import "../css/class-details.css"

export default function ClassDetails({ classData, onBack }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

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
        <h1 className="details-title">Class Details</h1>
      </div>

      <div className="details-layout">
        {/* Main content */}
        <div className="details-main">
          {/* Video section */}
          <div className="video-container">
            <img
              src={classData.image || "/placeholder.svg"}
              alt={classData.title}
              className="image-cover"
            />
            <div className="video-overlay">
              <button className="play-button">
                <Play size={24} className="play-icon" />
              </button>
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
              <button className="start-button">Start Class</button>
              <button
                className={`favorite-button ${isFavorite ? "active" : ""}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart size={18} className="action-icon" />
                {isFavorite ? "Favorited" : "Favorite"}
              </button>
            </div>
          </div>

          {/* Class breakdown */}
          <div className="breakdown-section">
            <h2 className="section-title">Class Breakdown</h2>
            <div className="breakdown-grid">
              <div className="breakdown-card">
                <h3 className="breakdown-label">Warm Up</h3>
                <p className="breakdown-value">5 minutes</p>
              </div>
              <div className="breakdown-card">
                <h3 className="breakdown-label">Main Workout</h3>
                <p className="breakdown-value">20 minutes</p>
              </div>
              <div className="breakdown-card">
                <h3 className="breakdown-label">Cool Down</h3>
                <p className="breakdown-value">5 minutes</p>
              </div>
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
          {/* Actions */}
          <div className="sidebar-card">
            <h2 className="sidebar-title">Class Actions</h2>
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
            <h2 className="sidebar-title">Related Classes</h2>
            <div className="related-classes">
              {relatedClasses.map((relClass) => (
                <div key={relClass.id} className="related-class">
                  <div className="related-image">
                    <img
                      src={relClass.image || "/placeholder.svg"}
                      alt={relClass.title}
                      className="image-cover"
                    />
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

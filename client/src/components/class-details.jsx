import React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, Heart, Calendar, Share2, Bookmark, Play, Clock, User, CheckCircle, ChevronRight, BarChart2, Edit, Trash2, Send } from 'lucide-react'
import "../css/class-details.css"

export default function ClassDetails({ classData, onBack }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [completedVideos, setCompletedVideos] = useState([])
  const [overallProgress, setOverallProgress] = useState(0)
  
  // Comment states
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Mock user ID - in a real app, this would come from authentication
  const currentUserId = "user123"

  // Mock class data - in a real app, this would come from props or API
  const mockClassData = {
    id: 143443533534,
    title: "Yoga for Beginners",
    level: "Beginner",
    duration: "30 min",
    instructor: "Jane Doe",
    description: "A gentle introduction to yoga, focusing on basic poses and breathing techniques.",
  }

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
  
  // Fetch comments when component mounts or courseId changes
  useEffect(() => {
    if (mockClassData && mockClassData.id) {
      fetchComments(mockClassData.id)
    }
  }, [classData.id])
  
  // Fetch comments from the API
  const fetchComments = async (courseId) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/comments/course/${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      } else {
        console.error("Failed to fetch comments")
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    try {
      const commentData = {
        courseId: mockClassData.id,
        userId: currentUserId,
        comment: newComment
      }
      
      const response = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
      })
      
      if (response.ok) {
        const createdComment = await response.json()
        setComments([...comments, createdComment])
        setNewComment("")
      } else {
        console.error("Failed to add comment")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }
  
  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId))
      } else {
        console.error("Failed to delete comment")
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }
  
  // Start editing a comment
  const handleStartEdit = (comment) => {
    setEditingComment(comment.id)
    setEditText(comment.comment)
  }
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditText("")
  }
  
  // Save edited comment
  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return
    
    try {
      const commentData = {
        comment: editText
      }
      
      const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
      })
      
      if (response.ok) {
        const updatedComment = await response.json()
        setComments(comments.map(comment => 
          comment.id === commentId ? updatedComment : comment
        ))
        setEditingComment(null)
        setEditText("")
      } else {
        console.error("Failed to update comment")
      }
    } catch (error) {
      console.error("Error updating comment:", error)
    }
  }

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

  // Format date for comments
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

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

          {/* Comments Section */}
          <div className="comments-section">
            <h2 className="section-title">Comments</h2>
            
            {/* Add new comment form */}
            <div className="comment-form-container">
              <form onSubmit={handleAddComment} className="comment-form">
                <div className="comment-input-container">
                  <textarea 
                    className="comment-input"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="comment-form-actions">
                  <button type="submit" className="comment-submit-button" disabled={!newComment.trim()}>
                    <Send size={16} className="comment-submit-icon" />
                    Post Comment
                  </button>
                </div>
              </form>
            </div>
            
            {/* Comments list */}
            <div className="comments-list">
              {isLoading ? (
                <div className="comments-loading">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="no-comments">No comments yet. Be the first to comment!</div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      <div className="comment-avatar-placeholder">
                        {comment.userId.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <div className="comment-user-info">
                          <span className="comment-username">User {comment.userId}</span>
                          <span className="comment-date">{formatDate(new Date())}</span>
                        </div>
                        
                        {/* Only show edit/delete for current user's comments */}
                        {comment.userId === currentUserId && (
                          <div className="comment-actions">
                            <button 
                              className="comment-action-button"
                              onClick={() => handleStartEdit(comment)}
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              className="comment-action-button delete"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {editingComment === comment.id ? (
                        <div className="comment-edit-container">
                          <textarea
                            className="comment-edit-input"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                          />
                          <div className="comment-edit-actions">
                            <button 
                              className="comment-edit-button cancel"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                            <button 
                              className="comment-edit-button save"
                              onClick={() => handleSaveEdit(comment.id)}
                              disabled={!editText.trim()}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="comment-text">{comment.comment}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
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
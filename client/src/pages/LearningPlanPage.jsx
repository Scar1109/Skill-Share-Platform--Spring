import React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, Heart, Calendar, Share2, Bookmark, Play, Clock, User, CheckCircle, ChevronRight, BarChart2, Edit, Trash2, Send } from 'lucide-react'
import "../css/class-details.css"

export default function ClassDetails({ onBack }) {
  const navigate = useNavigate()
  
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [completedVideos, setCompletedVideos] = useState([])
  const [overallProgress, setOverallProgress] = useState(0)
  const [course, setCourse] = useState(null)
  const [videoSeries, setVideoSeries] = useState([])
  const [progressId, setProgressId] = useState(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  // Comment states
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Mock user ID - in a real app, this would come from authentication
  const currentUserId = "user123"
  const { courseId } = useParams();
  // Fetch course details and progress when component mounts
  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true)
      try {
        // 1. Fetch course details
        const courseResponse = await fetch(`http://localhost:8080/api/courses/${courseId}`)
        if (!courseResponse.ok) throw new Error("Failed to fetch course")
        
        const courseData = await courseResponse.json()
        setCourse(courseData)
        
        // 2. Fetch all posts for the course content
        if (courseData.courses && courseData.courses.length > 0) {
          const postsPromises = courseData.courses.map(postId => 
            fetch(`http://localhost:8080/api/posts/${postId}`).then(res => {
              if (!res.ok) throw new Error(`Failed to fetch post ${postId}`)
              return res.json()
            }))
          const posts = await Promise.all(postsPromises)
          
          // Transform posts into video series format
          const formattedVideos = posts.map(post => ({
            id: post.id || post._id, // Handle both id and _id from backend
            title: post.title,
            duration: "5:00", // Default duration - you might calculate this from video length
            description: post.description,
            videoUrl: post.videoUrl,
            thumbnail: post.thumbnail || courseData.thumbnail // Fallback to course thumbnail
          }))
          
          setVideoSeries(formattedVideos)
        }

        // 3. Fetch user progress (only after we have the course data)
        const progressResponse = await fetch(`http://localhost:8080/api/progress/course/${courseId}?userId=${currentUserId}`)
        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          // Find or create progress record
          if (progressData.length > 0) {
            const userProgress = progressData.find(p => p.userId === currentUserId)
            if (userProgress) {
              setProgressId(userProgress.id)
              setCompletedVideos(userProgress.completedVideos || [])
              setOverallProgress(userProgress.overallProgress || 0)
            } else if (isInitialLoad) {
              // Only create new progress on initial load if none exists
              await createNewProgress()
            }
          } else if (isInitialLoad) {
            await createNewProgress()
          }
        }
        
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
        setIsInitialLoad(false)
      }
    }
    
    fetchCourseData()
  }, [courseId])

  // Helper function to create new progress record
  const createNewProgress = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUserId,
          courseId: courseId,
          completedVideos: [],
          overallProgress: 0
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setProgressId(data.id)
      }
    } catch (error) {
      console.error("Error creating progress:", error)
    }
  }

  // Calculate overall progress whenever completedVideos changes
  useEffect(() => {
    if (videoSeries.length === 0) return
    
    const progress = (completedVideos.length / videoSeries.length) * 100
    setOverallProgress(progress)
    updateProgressInBackend(progress)
  }, [completedVideos, videoSeries.length])

  // Update progress in backend
  const updateProgressInBackend = async (progress) => {
    if (!progressId) return
    
    try {
      const response = await fetch(`http://localhost:8080/api/progress/${progressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completedVideos,
          overallProgress: progress
        })
      })
      
      if (!response.ok) {
        console.error("Failed to update progress")
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  // Mark video as complete
  const handleVideoComplete = async () => {
    if (!completedVideos.includes(currentVideoIndex)) {
      const newCompletedVideos = [...completedVideos, currentVideoIndex]
      setCompletedVideos(newCompletedVideos)
      
      try {
        // Call the mark-as-complete endpoint
        const response = await fetch(`http://localhost:8080/api/progress/${progressId}/complete/${currentVideoIndex}`, {
          method: 'PUT'
        })
        
        if (!response.ok) {
          console.error("Failed to mark video as complete")
        }
      } catch (error) {
        console.error("Error marking video as complete:", error)
      }
    }

    // Move to next video if not the last one
    if (currentVideoIndex < videoSeries.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1)
    }
  }

  // Fetch comments when component mounts or courseId changes
  useEffect(() => {
    const fetchComments = async () => {
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
    
    if (courseId) {
      fetchComments()
    }
  }, [courseId])
  
  // Add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    try {
      const commentData = {
        courseId: courseId,
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

  const handleVideoSelect = (index) => {
    setCurrentVideoIndex(index)
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (isLoading || !course) {
    return <div className="loading">Loading course details...</div>
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
            {videoSeries.length > 0 && videoSeries[currentVideoIndex]?.videoUrl ? (
              <video 
                src={videoSeries[currentVideoIndex].videoUrl} 
                controls
                className="video-player"
                poster={videoSeries[currentVideoIndex].thumbnail || course.thumbnail}
              />
            ) : (
              <img src={course.thumbnail || "/placeholder.svg"} alt={course.courseTitle} className="image-cover" />
            )}
            {videoSeries.length > 0 && (
              <div className="video-progress-indicator">
                <span>
                  Video {currentVideoIndex + 1} of {videoSeries.length}
                </span>
              </div>
            )}
          </div>

          {/* Current video info */}
          {videoSeries.length > 0 && (
            <div className="video-info">
              <div className="video-meta">
                <h2 className="video-title">{videoSeries[currentVideoIndex]?.title}</h2>
                <span className="video-duration">
                  <Clock size={14} className="meta-icon" /> {videoSeries[currentVideoIndex]?.duration}
                </span>
              </div>
              <p className="video-description">{videoSeries[currentVideoIndex]?.description || "No description available"}</p>

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
          )}

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
                    <img 
                      src={video.thumbnail || course.thumbnail || "/placeholder.svg"} 
                      alt={video.title} 
                    />
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
                    <p className="video-item-description">{video.description || "No description available"}</p>
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
              <span className={`class-level ${course.level?.toLowerCase()}`}>{course.level}</span>
              <span className="meta-item">
                <Clock size={14} className="meta-icon" /> {course.durationMinutes} min
              </span>
              <span className="meta-item">
                <User size={14} className="meta-icon" /> {course.trainerUserId}
              </span>
            </div>

            <h1 className="class-title">{course.courseTitle}</h1>
            <p className="class-description">{course.courseDescription}</p>

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
                          <span className="comment-date">{formatDate(comment.createdAt || new Date())}</span>
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
                  <span className="stat-label"> VALIGN="TOP">Total Duration</span>
                  <span className="stat-value">{course.durationMinutes} minutes</span>
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
        </div>
      </div>
    </div>
  )
}
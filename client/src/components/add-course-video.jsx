"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Edit, Trash2, X, Upload } from "lucide-react"
import "../css/add-course-video.css";

export default function AddCourseVideo() {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(null)
  const [videoForm, setVideoForm] = useState({
    title: "",
    category: "",
    description: "",
    videoUrl: "",
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)

  // Mock user ID (replace with actual user authentication)
  const currentUserId = "user123"

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8080/api/posts")

      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`)
      }

      const data = await response.json()
      setVideos(data)
    } catch (err) {
      console.error("Error fetching videos:", err)
      setError("Failed to load videos. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddVideo = () => {
    setCurrentVideo(null)
    setVideoForm({
      title: "",
      category: "",
      description: "",
      videoUrl: "",
    })
    setSelectedFile(null)
    setUploadProgress(0)
    setIsPopupOpen(true)
  }

  const handleEditVideo = (video) => {
    setCurrentVideo(video)
    setVideoForm({
      title: video.title || "",
      category: video.category || "",
      description: video.description || "",
      videoUrl: video.videoUrl || "",
    })
    setSelectedFile(null)
    setUploadProgress(0)
    setIsPopupOpen(true)
  }

  const handleDeleteVideo = async (videoId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${videoId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setVideos(videos.filter((video) => video.id !== videoId))
      } else {
        console.error("Failed to delete video")
      }
    } catch (error) {
      console.error("Error deleting video:", error)
      // For demo purposes, still update the UI even if the API call fails
      setVideos(videos.filter((video) => video.id !== videoId))
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const uploadVideo = async (file) => {
    setIsUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append("file", file)

    try {
      // Create a simulated progress update
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return newProgress
        })
      }, 300)

      const response = await fetch("http://localhost:8080/api/videos/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error("Failed to upload video")
      }

      // The response should contain the file path
      const data = await response.text()
      const fileName = file.name
      return `/uploads/${fileName}`
    } catch (error) {
      console.error("Error uploading video:", error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      let videoUrl = videoForm.videoUrl

      // If a new file is selected, upload it first
      if (selectedFile) {
        try {
          videoUrl = await uploadVideo(selectedFile)
        } catch (error) {
          setError("Failed to upload video. Please try again.")
          return
        }
      }

      const videoData = {
        ...videoForm,
        videoUrl,
        userId: currentUserId,
      }

      let response

      if (currentVideo) {
        // Update existing video
        response = await fetch(`http://localhost:8080/api/posts/${currentVideo.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(videoData),
        })
      } else {
        // Create new video
        response = await fetch("http://localhost:8080/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(videoData),
        })
      }

      if (response.ok) {
        const data = await response.json()

        if (currentVideo) {
          setVideos(videos.map((video) => (video.id === currentVideo.id ? data : video)))
        } else {
          setVideos([...videos, data])
        }
      } else {
        console.error("Failed to save video")

        // For demo purposes, still update the UI even if the API call fails
        if (currentVideo) {
          setVideos(videos.map((video) => (video.id === currentVideo.id ? { ...video, ...videoData } : video)))
        } else {
          const newVideo = {
            ...videoData,
            id: Date.now().toString(),
          }
          setVideos([...videos, newVideo])
        }
      }

      setIsPopupOpen(false)
      setVideoForm({ title: "", category: "", description: "", videoUrl: "" })
      setSelectedFile(null)
      setUploadProgress(0)
    } catch (error) {
      console.error("Error saving video:", error)
      setError("Failed to save video. Please try again.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setVideoForm((prev) => ({ ...prev, [name]: value }))
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Categories for dropdown
  const categories = ["Yoga", "HIIT", "Strength Training", "Cardio", "Pilates", "Meditation", "Dance", "Other"]

  if (isLoading) {
    return <div className="add-course-video-container">Loading videos...</div>
  }

  return (
    <div className="add-course-video-container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Course Videos</h1>
        <button className="add-video-btn" onClick={handleAddVideo}>
          <Plus size={20} className="btn-icon" />
          Add Video
        </button>
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Video List */}
      <div className="video-list">
        {videos.length === 0 ? (
          <div className="empty-state">
            <p>No videos added yet.</p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="video-card">
              <div className="video-preview">
                <video controls className="video-player">
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-category">{video.category}</p>
                <p className="video-description">{video.description}</p>
                <div className="video-actions">
                  <button className="action-btn video-edit-btn" onClick={() => handleEditVideo(video)}>
                    <Edit size={18} className="action-icon" />
                    Edit
                  </button>
                  <button className="action-btn video-delete-btn" onClick={() => handleDeleteVideo(video.id)}>
                    <Trash2 size={18} className="action-icon" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Popup for Add/Edit Video */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">
              <h2>{currentVideo ? "Edit Video" : "Add New Video"}</h2>
              <button className="close-btn" onClick={() => setIsPopupOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="popup-content">
                <div className="form-group">
                  <label htmlFor="title">Video Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={videoForm.title}
                    onChange={handleInputChange}
                    placeholder="Enter video title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={videoForm.category}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Video File</label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="video/mp4,video/x-m4v,video/*"
                      className="file-input"
                    />
                    <button type="button" className="file-upload-btn" onClick={triggerFileInput}>
                      <Upload size={18} className="action-icon" />
                      {selectedFile ? "Change Video" : "Upload Video"}
                    </button>
                    {selectedFile && <span className="file-name">{selectedFile.name}</span>}
                  </div>
                  {isUploading && (
                    <div className="upload-progress-container">
                      <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                      <span className="upload-progress-text">{uploadProgress}%</span>
                    </div>
                  )}
                </div>
                {!selectedFile && currentVideo && (
                  <div className="form-group">
                    <label htmlFor="videoUrl">Current Video URL</label>
                    <input
                      type="text"
                      id="videoUrl"
                      name="videoUrl"
                      value={videoForm.videoUrl}
                      onChange={handleInputChange}
                      placeholder="Video URL"
                      disabled
                    />
                    <p className="help-text">Upload a new video to replace the current one</p>
                  </div>
                )}
                {!selectedFile && !currentVideo && (
                  <div className="form-group">
                    <label htmlFor="videoUrl">Video URL (Optional if uploading)</label>
                    <input
                      type="url"
                      id="videoUrl"
                      name="videoUrl"
                      value={videoForm.videoUrl}
                      onChange={handleInputChange}
                      placeholder="Enter video URL"
                    />
                    <p className="help-text">You can provide a URL or upload a video file</p>
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={videoForm.description}
                    onChange={handleInputChange}
                    placeholder="Enter video description"
                    rows={4}
                    required
                  />
                </div>
              </div>
              <div className="popup-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsPopupOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={isUploading}>
                  {currentVideo ? "Update Video" : "Add Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

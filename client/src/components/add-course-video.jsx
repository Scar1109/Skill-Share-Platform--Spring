import { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import "../css/add-course-video.css";

export default function AddCourseVideo() {
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: "Beginner Yoga Flow",
      url: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL for demo
      description: "A 30-minute yoga session designed for beginners to improve flexibility and relaxation.",
    },
    {
      id: 2,
      title: "HIIT Cardio Blast",
      url: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL for demo
      description: "High-intensity interval training to boost cardiovascular health and burn calories.",
    },
    {
      id: 3,
      title: "Strength Training Basics",
      url: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL for demo
      description: "Learn the fundamentals of strength training with this guided workout.",
    },
  ]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoForm, setVideoForm] = useState({
    title: "",
    url: "",
    description: "",
  });

  const handleAddVideo = () => {
    setCurrentVideo(null);
    setVideoForm({ title: "", url: "", description: "" });
    setIsPopupOpen(true);
  };

  const handleEditVideo = (video) => {
    setCurrentVideo(video);
    setVideoForm({
      title: video.title,
      url: video.url,
      description: video.description,
    });
    setIsPopupOpen(true);
  };

  const handleDeleteVideo = (videoId) => {
    setVideos(videos.filter((video) => video.id !== videoId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentVideo) {
      // Update existing video
      setVideos(
        videos.map((video) =>
          video.id === currentVideo.id
            ? { ...video, ...videoForm, id: video.id }
            : video
        )
      );
    } else {
      // Add new video
      setVideos([
        ...videos,
        {
          id: Date.now(),
          ...videoForm,
        },
      ]);
    }
    setIsPopupOpen(false);
    setVideoForm({ title: "", url: "", description: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoForm((prev) => ({ ...prev, [name]: value }));
  };

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
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-description">{video.description}</p>
                <div className="video-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEditVideo(video)}
                  >
                    <Edit size={18} className="action-icon" />
                    Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteVideo(video.id)}
                  >
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
              <button
                className="close-btn"
                onClick={() => setIsPopupOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
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
                />
              </div>
              <div className="form-group">
                <label htmlFor="url">Video URL</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={videoForm.url}
                  onChange={handleInputChange}
                  placeholder="Enter video URL"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={videoForm.description}
                  onChange={handleInputChange}
                  placeholder="Enter video description"
                  rows={4}
                />
              </div>
            </div>
            <div className="popup-actions">
              <button
                className="cancel-btn"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </button>
              <button className="submit-btn" onClick={handleSubmit}>
                {currentVideo ? "Update Video" : "Add Video"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
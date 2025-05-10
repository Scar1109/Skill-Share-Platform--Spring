import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    Edit,
    Trash2,
    Send,
} from "lucide-react";
import "../css/class-details.css";

export default function ClassDetails({ onBack }) {
    const navigate = useNavigate();

    const [isFavorite, setIsFavorite] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [completedVideos, setCompletedVideos] = useState([]);
    const [overallProgress, setOverallProgress] = useState(0);
    const [course, setCourse] = useState(null);
    const [videoSeries, setVideoSeries] = useState([]);
    const [progressId, setProgressId] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Comment states
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Share state
    const [isSharing, setIsSharing] = useState(false);

    const raw = localStorage.getItem("user");
    const userId = raw ? JSON.parse(raw).id : null;

    console.log("current user ID:", userId);
    const currentUserId = userId;
    const { id } = useParams();

    // Fetch course details and progress when component mounts
    useEffect(() => {
        const fetchCourseData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch course details
                const courseResponse = await fetch(
                    `http://localhost:8080/api/courses/${id}`
                );
                if (!courseResponse.ok)
                    throw new Error("Failed to fetch course");

                const courseData = await courseResponse.json();
                setCourse(courseData);

                // Check if current user has liked or saved this course
                if (
                    courseData.likedBy &&
                    courseData.likedBy.includes(currentUserId)
                ) {
                    setIsFavorite(true);
                }

                if (
                    courseData.savedBy &&
                    courseData.savedBy.includes(currentUserId)
                ) {
                    setIsBookmarked(true);
                }

                // 2. Fetch all posts for the course content
                if (courseData.courses && courseData.courses.length > 0) {
                    const postsPromises = courseData.courses.map((postId) =>
                        fetch(`http://localhost:8080/api/posts/${postId}`).then(
                            (res) => {
                                if (!res.ok)
                                    throw new Error(
                                        `Failed to fetch post ${postId}`
                                    );
                                return res.json();
                            }
                        )
                    );
                    const posts = await Promise.all(postsPromises);

                    // Transform posts into video series format
                    const formattedVideos = posts.map((post) => ({
                        id: post.id || post._id, // Handle both id and _id from backend
                        title: post.title,
                        duration: "5:00", // Default duration - you might calculate this from video length
                        description: post.description,
                        videoUrl: post.videoUrl,
                        thumbnail: post.thumbnail || courseData.thumbnail, // Fallback to course thumbnail
                    }));

                    setVideoSeries(formattedVideos);
                }

                // 3. Fetch user progress (only after we have the course data)
                const progressResponse = await fetch(
                    `http://localhost:8080/api/progress/course/${id}?userId=${currentUserId}`
                );
                if (progressResponse.ok) {
                    const progressData = await progressResponse.json();
                    // Find or create progress record
                    if (progressData.length > 0) {
                        const userProgress = progressData.find(
                            (p) => p.userId === currentUserId
                        );
                        if (userProgress) {
                            setProgressId(userProgress.id);
                            setCompletedVideos(
                                userProgress.completedVideos || []
                            );
                            setOverallProgress(
                                userProgress.overallProgress || 0
                            );
                        } else if (isInitialLoad) {
                            // Only create new progress on initial load if none exists
                            await createNewProgress();
                        }
                    } else if (isInitialLoad) {
                        await createNewProgress();
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
                setIsInitialLoad(false);
            }
        };

        fetchCourseData();
    }, [id]);

    // Helper function to create new progress record
    const createNewProgress = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/progress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: currentUserId,
                    courseId: id,
                    completedVideos: [],
                    overallProgress: 0,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setProgressId(data.id);
            }
        } catch (error) {
            console.error("Error creating progress:", error);
        }
    };

    // Calculate overall progress whenever completedVideos changes
    useEffect(() => {
        if (videoSeries.length === 0) return;

        const progress = (completedVideos.length / videoSeries.length) * 100;
        setOverallProgress(progress);
    }, [completedVideos, videoSeries.length]);

    // Update progress in backend
    // const updateProgressInBackend = async (progress) => {
    //     if (!progressId) return;

    //     try {
    //         const response = await fetch(
    //             `http://localhost:8080/api/progress/${progressId}`,
    //             {
    //                 method: "PUT",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     completedVideos,
    //                     overallProgress: progress,
    //                 }),
    //             }
    //         );

    //         if (!response.ok) {
    //             console.error("Failed to update progress");
    //         }
    //     } catch (error) {
    //         console.error("Error updating progress:", error);
    //     }
    // };

    // Handle like toggle
    
    const handleLikeToggle = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/courses/${id}/like/${currentUserId}`,
                {
                    method: "PUT",
                }
            );

            if (response.ok) {
                const updatedCourse = await response.json();
                const hasLiked =
                    updatedCourse.likedBy &&
                    updatedCourse.likedBy.includes(currentUserId);
                setIsFavorite(hasLiked);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    // Handle save toggle
    const handleSaveToggle = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/courses/${id}/save/${currentUserId}`,
                {
                    method: "PUT",
                }
            );

            if (response.ok) {
                const updatedCourse = await response.json();
                const hasSaved =
                    updatedCourse.savedBy &&
                    updatedCourse.savedBy.includes(currentUserId);
                setIsBookmarked(hasSaved);
            }
        } catch (error) {
            console.error("Error toggling save:", error);
        }
    };

    // Handle share
    const handleShare = () => {
        // Get course image URL
        const imageUrl =
            course.thumbnail ||
            (videoSeries[0] && videoSeries[0].thumbnail) ||
            "";
        const title = course.courseTitle || "Check out this course";
        const description =
            course.courseDescription || "I found this interesting course";
        const url = window.location.href;

        // Check if Web Share API is available and supports files/images
        if (navigator.share) {
            // Try to share with image if possible
            if (imageUrl) {
                // Fetch the image to share it as a file
                fetch(imageUrl)
                    .then((res) => res.blob())
                    .then((blob) => {
                        const file = new File([blob], "course-image.jpg", {
                            type: "image/jpeg",
                        });

                        // Try to share with the image
                        navigator
                            .share({
                                title: title,
                                text: description,
                                url: url,
                                files: [file],
                            })
                            .catch((error) => {
                                // If sharing with files fails, fall back to sharing without files
                                console.warn(
                                    "Sharing with files failed, falling back to text sharing",
                                    error
                                );
                                navigator
                                    .share({
                                        title: title,
                                        text: description,
                                        url: url,
                                    })
                                    .catch((error) => {
                                        console.error("Error sharing:", error);
                                        showSocialShareOptions(
                                            imageUrl,
                                            title,
                                            description,
                                            url
                                        );
                                    });
                            });
                    })
                    .catch((error) => {
                        console.error("Error fetching image:", error);
                        // Fall back to sharing without image
                        navigator
                            .share({
                                title: title,
                                text: description,
                                url: url,
                            })
                            .catch((error) => {
                                console.error("Error sharing:", error);
                                showSocialShareOptions(
                                    imageUrl,
                                    title,
                                    description,
                                    url
                                );
                            });
                    });
            } else {
                // Share without image
                navigator
                    .share({
                        title: title,
                        text: description,
                        url: url,
                    })
                    .catch((error) => {
                        console.error("Error sharing:", error);
                        showSocialShareOptions(
                            imageUrl,
                            title,
                            description,
                            url
                        );
                    });
            }

            setIsSharing(true);
            setTimeout(() => setIsSharing(false), 2000);
        } else {
            // Fall back to custom share modal
            showSocialShareOptions(imageUrl, title, description, url);
        }
    };

    // Add this new function for showing social share options
    const showSocialShareOptions = (imageUrl, title, description, url) => {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        const encodedDescription = encodeURIComponent(description);
        const encodedImageUrl = encodeURIComponent(imageUrl);

        // Create social media share URLs with image where supported
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodedDescription}&url=${encodedUrl}`,
            whatsapp: `https://api.whatsapp.com/send?text=${encodedDescription}%20${encodedUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImageUrl}&description=${encodedDescription}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedDescription}`,
            email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
        };

        // Create and show the share modal
        const modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        modal.style.display = "flex";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.zIndex = "1000";

        const modalContent = document.createElement("div");
        modalContent.style.backgroundColor = "white";
        modalContent.style.padding = "20px";
        modalContent.style.borderRadius = "8px";
        modalContent.style.maxWidth = "90%";
        modalContent.style.width = "400px";
        modalContent.style.maxHeight = "90vh";
        modalContent.style.overflowY = "auto";

        const modalHeader = document.createElement("div");
        modalHeader.style.display = "flex";
        modalHeader.style.justifyContent = "space-between";
        modalHeader.style.alignItems = "center";
        modalHeader.style.marginBottom = "15px";

        const modalTitle = document.createElement("h3");
        modalTitle.textContent = "Share this course";
        modalTitle.style.margin = "0";

        const closeButton = document.createElement("button");
        closeButton.textContent = "×";
        closeButton.style.background = "none";
        closeButton.style.border = "none";
        closeButton.style.fontSize = "24px";
        closeButton.style.cursor = "pointer";
        closeButton.onclick = () => document.body.removeChild(modal);

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        // Add course preview
        const previewContainer = document.createElement("div");
        previewContainer.style.marginBottom = "20px";
        previewContainer.style.border = "1px solid #eee";
        previewContainer.style.borderRadius = "8px";
        previewContainer.style.overflow = "hidden";

        if (imageUrl) {
            const previewImage = document.createElement("img");
            previewImage.src = imageUrl;
            previewImage.alt = title;
            previewImage.style.width = "100%";
            previewImage.style.height = "180px";
            previewImage.style.objectFit = "cover";
            previewContainer.appendChild(previewImage);
        }

        const previewInfo = document.createElement("div");
        previewInfo.style.padding = "12px";

        const previewTitle = document.createElement("h4");
        previewTitle.textContent = title;
        previewTitle.style.margin = "0 0 8px 0";
        previewTitle.style.fontSize = "16px";

        const previewDescription = document.createElement("p");
        previewDescription.textContent =
            description.length > 100
                ? description.substring(0, 97) + "..."
                : description;
        previewDescription.style.margin = "0";
        previewDescription.style.fontSize = "14px";
        previewDescription.style.color = "#666";

        previewInfo.appendChild(previewTitle);
        previewInfo.appendChild(previewDescription);
        previewContainer.appendChild(previewInfo);

        const shareOptions = document.createElement("div");
        shareOptions.style.display = "grid";
        shareOptions.style.gridTemplateColumns = "repeat(3, 1fr)";
        shareOptions.style.gap = "10px";

        // Add share buttons
        const platforms = [
            { name: "Facebook", url: shareUrls.facebook, color: "#3b5998" },
            { name: "Twitter", url: shareUrls.twitter, color: "#1da1f2" },
            { name: "WhatsApp", url: shareUrls.whatsapp, color: "#25d366" },
            { name: "LinkedIn", url: shareUrls.linkedin, color: "#0077b5" },
            { name: "Pinterest", url: shareUrls.pinterest, color: "#e60023" },
            { name: "Telegram", url: shareUrls.telegram, color: "#0088cc" },
            { name: "Email", url: shareUrls.email, color: "#dd4b39" },
        ];

        platforms.forEach((platform) => {
            const button = document.createElement("a");
            button.href = platform.url;
            button.target = "_blank";
            button.rel = "noopener noreferrer";
            button.style.display = "flex";
            button.style.flexDirection = "column";
            button.style.alignItems = "center";
            button.style.padding = "10px";
            button.style.textDecoration = "none";
            button.style.color = "white";
            button.style.backgroundColor = platform.color;
            button.style.borderRadius = "4px";
            button.style.textAlign = "center";

            const buttonText = document.createElement("span");
            buttonText.textContent = platform.name;
            buttonText.style.marginTop = "5px";

            button.appendChild(buttonText);
            shareOptions.appendChild(button);

            // For email, prevent default and handle manually
            if (platform.name === "Email") {
                button.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = platform.url;
                };
            }
        });

        // Add copy link option
        const copyLinkContainer = document.createElement("div");
        copyLinkContainer.style.marginTop = "15px";
        copyLinkContainer.style.display = "flex";
        copyLinkContainer.style.alignItems = "center";
        copyLinkContainer.style.gap = "10px";

        const linkInput = document.createElement("input");
        linkInput.value = url;
        linkInput.readOnly = true;
        linkInput.style.flex = "1";
        linkInput.style.padding = "8px";
        linkInput.style.borderRadius = "4px";
        linkInput.style.border = "1px solid #ddd";

        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy";
        copyButton.style.padding = "8px 12px";
        copyButton.style.backgroundColor = "#007bff";
        copyButton.style.color = "white";
        copyButton.style.border = "none";
        copyButton.style.borderRadius = "4px";
        copyButton.style.cursor = "pointer";

        copyButton.onclick = () => {
            linkInput.select();
            document.execCommand("copy");
            copyButton.textContent = "Copied!";
            setTimeout(() => {
                copyButton.textContent = "Copy";
            }, 2000);
        };

        copyLinkContainer.appendChild(linkInput);
        copyLinkContainer.appendChild(copyButton);

        // Add note about Open Graph tags
        const ogNote = document.createElement("div");
        ogNote.style.marginTop = "15px";
        ogNote.style.fontSize = "12px";
        ogNote.style.color = "#666";
        ogNote.style.padding = "10px";
        ogNote.style.backgroundColor = "#f8f9fa";
        ogNote.style.borderRadius = "4px";
        ogNote.innerHTML =
            "Note: For best sharing experience with images on social media, ensure your website has proper Open Graph meta tags.";

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(previewContainer);
        modalContent.appendChild(shareOptions);
        modalContent.appendChild(copyLinkContainer);
        modalContent.appendChild(ogNote);
        modal.appendChild(modalContent);

        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        // Show sharing indicator
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 2000);
    };

    // Mark video as complete
    const handleVideoComplete = async () => {
        if (!completedVideos.includes(currentVideoIndex)) {
            const newCompletedVideos = [...completedVideos, currentVideoIndex];
            setCompletedVideos(newCompletedVideos);

            try {
                // Call the mark-as-complete endpoint
                const response = await fetch(
                    `http://localhost:8080/api/progress/${progressId}/complete/${currentVideoIndex}`,
                    {
                        method: "PUT",
                    }
                );

                if (!response.ok) {
                    console.error("Failed to mark video as complete");
                }
            } catch (error) {
                console.error("Error marking video as complete:", error);
            }
        }

        // Move to next video if not the last one
        if (currentVideoIndex < videoSeries.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
        }
    };

    // Fetch comments when component mounts or id changes
    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:8080/api/comments/course/${id}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setComments(data);
                } else {
                    console.error("Failed to fetch comments");
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchComments();
        }
    }, [id]);

    // Add a new comment
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const commentData = {
                courseId: id,
                userId: currentUserId,
                comment: newComment,
            };

            const response = await fetch("http://localhost:8080/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(commentData),
            });

            if (response.ok) {
                const createdComment = await response.json();
                setComments([...comments, createdComment]);
                setNewComment("");
            } else {
                console.error("Failed to add comment");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    // Delete a comment
    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/comments/${commentId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                setComments(
                    comments.filter((comment) => comment.id !== commentId)
                );
            } else {
                console.error("Failed to delete comment");
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    // Start editing a comment
    const handleStartEdit = (comment) => {
        setEditingComment(comment.id);
        setEditText(comment.comment);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingComment(null);
        setEditText("");
    };

    // Save edited comment
    const handleSaveEdit = async (commentId) => {
        if (!editText.trim()) return;

        try {
            const commentData = {
                comment: editText,
            };

            const response = await fetch(
                `http://localhost:8080/api/comments/${commentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(commentData),
                }
            );

            if (response.ok) {
                const updatedComment = await response.json();
                setComments(
                    comments.map((comment) =>
                        comment.id === commentId ? updatedComment : comment
                    )
                );
                setEditingComment(null);
                setEditText("");
            } else {
                console.error("Failed to update comment");
            }
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const handleVideoSelect = (index) => {
        setCurrentVideoIndex(index);
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (isLoading || !course) {
        return <div className="loading">Loading course details...</div>;
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
                            <span className="progress-percentage">
                                {Math.round(overallProgress)}% Complete
                            </span>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-bg">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${overallProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Current video section */}
                    <div className="video-container">
                        {videoSeries.length > 0 &&
                        videoSeries[currentVideoIndex]?.videoUrl ? (
                            <video
                                src={videoSeries[currentVideoIndex].videoUrl}
                                controls
                                className="video-player"
                                poster={
                                    videoSeries[currentVideoIndex].thumbnail ||
                                    course.thumbnail
                                }
                            />
                        ) : (
                            <img
                                src={course.thumbnail || "/placeholder.svg"}
                                alt={course.courseTitle}
                                className="image-cover"
                            />
                        )}
                        {videoSeries.length > 0 && (
                            <div className="video-progress-indicator">
                                <span>
                                    Video {currentVideoIndex + 1} of{" "}
                                    {videoSeries.length}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Current video info */}
                    {videoSeries.length > 0 && (
                        <div className="video-info">
                            <div className="video-meta">
                                <h2 className="video-title">
                                    {videoSeries[currentVideoIndex]?.title}
                                </h2>
                                <span className="video-duration">
                                    <Clock size={14} className="meta-icon" />{" "}
                                    {videoSeries[currentVideoIndex]?.duration}
                                </span>
                            </div>
                            <p className="video-description">
                                {videoSeries[currentVideoIndex]?.description ||
                                    "No description available"}
                            </p>

                            <div className="video-actions">
                                <button
                                    className="complete-button"
                                    onClick={handleVideoComplete}
                                >
                                    {completedVideos.includes(currentVideoIndex)
                                        ? "Completed"
                                        : "Mark as Complete"}
                                </button>

                                <div className="navigation-buttons">
                                    <button
                                        className="nav-button"
                                        disabled={currentVideoIndex === 0}
                                        onClick={() =>
                                            setCurrentVideoIndex(
                                                currentVideoIndex - 1
                                            )
                                        }
                                    >
                                        <ChevronLeft size={18} /> Previous
                                    </button>
                                    <button
                                        className="nav-button"
                                        disabled={
                                            currentVideoIndex ===
                                            videoSeries.length - 1
                                        }
                                        onClick={() =>
                                            setCurrentVideoIndex(
                                                currentVideoIndex + 1
                                            )
                                        }
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
                                    className={`video-item ${
                                        index === currentVideoIndex
                                            ? "active"
                                            : ""
                                    } ${
                                        completedVideos.includes(index)
                                            ? "completed"
                                            : ""
                                    }`}
                                    onClick={() => handleVideoSelect(index)}
                                >
                                    <div className="video-item-thumbnail">
                                        <img
                                            src={
                                                video.thumbnail ||
                                                course.thumbnail ||
                                                "/placeholder.svg"
                                            }
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
                                            <span className="video-item-duration">
                                                {video.duration}
                                            </span>
                                        </div>
                                        <p className="video-item-description">
                                            {video.description ||
                                                "No description available"}
                                        </p>
                                    </div>
                                    <div className="video-item-status">
                                        {completedVideos.includes(index) ? (
                                            <CheckCircle
                                                size={18}
                                                className="completed-icon"
                                            />
                                        ) : (
                                            <span className="status-text">
                                                {index === currentVideoIndex
                                                    ? "Current"
                                                    : "Upcoming"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Class info */}
                    <div className="class-info">
                        <div className="class-meta">
                            <span
                                className={`class-level ${course.level?.toLowerCase()}`}
                            >
                                {course.level}
                            </span>
                            <span className="meta-item">
                                <Clock size={14} className="meta-icon" />{" "}
                                {course.durationMinutes} min
                            </span>
                            <span className="meta-item">
                                <User size={14} className="meta-icon" />{" "}
                                {course.trainerUserId}
                            </span>
                        </div>

                        <h1 className="class-title">{course.courseTitle}</h1>
                        <p className="class-description">
                            {course.courseDescription}
                        </p>

                        <div className="class-actions">
                            <button
                                className={`favorite-button ${
                                    isFavorite ? "active" : ""
                                }`}
                                onClick={handleLikeToggle}
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
                            <form
                                onSubmit={handleAddComment}
                                className="comment-form"
                            >
                                <div className="comment-input-container">
                                    <textarea
                                        className="comment-input"
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) =>
                                            setNewComment(e.target.value)
                                        }
                                        rows={3}
                                    />
                                </div>
                                <div className="comment-form-actions">
                                    <button
                                        type="submit"
                                        className="comment-submit-button"
                                        disabled={!newComment.trim()}
                                    >
                                        <Send
                                            size={16}
                                            className="comment-submit-icon"
                                        />
                                        Post Comment
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Comments list */}
                        <div className="comments-list">
                            {isLoading ? (
                                <div className="comments-loading">
                                    Loading comments...
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="no-comments">
                                    No comments yet. Be the first to comment!
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="comment-item"
                                    >
                                        <div className="comment-avatar">
                                            <div className="comment-avatar-placeholder">
                                                {comment.userId
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="comment-content">
                                            <div className="comment-header">
                                                <div className="comment-user-info">
                                                    <span className="comment-username">
                                                        User {comment.userId}
                                                    </span>
                                                    <span className="comment-date">
                                                        {formatDate(
                                                            comment.createdAt ||
                                                                new Date()
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Only show edit/delete for current user's comments */}
                                                {comment.userId ===
                                                    currentUserId && (
                                                    <div className="comment-actions">
                                                        <button
                                                            className="comment-action-button"
                                                            onClick={() =>
                                                                handleStartEdit(
                                                                    comment
                                                                )
                                                            }
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            className="comment-action-button delete"
                                                            onClick={() =>
                                                                handleDeleteComment(
                                                                    comment.id
                                                                )
                                                            }
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
                                                        onChange={(e) =>
                                                            setEditText(
                                                                e.target.value
                                                            )
                                                        }
                                                        rows={3}
                                                    />
                                                    <div className="comment-edit-actions">
                                                        <button
                                                            className="comment-edit-button cancel"
                                                            onClick={
                                                                handleCancelEdit
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="comment-edit-button save"
                                                            onClick={() =>
                                                                handleSaveEdit(
                                                                    comment.id
                                                                )
                                                            }
                                                            disabled={
                                                                !editText.trim()
                                                            }
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="comment-text">
                                                    {comment.comment}
                                                </p>
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
                                    <span className="stat-label">
                                        Total Duration
                                    </span>
                                    <span className="stat-value">
                                        {course.durationMinutes} minutes
                                    </span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon-wrapper">
                                    <span className="video-count">
                                        {videoSeries.length}
                                    </span>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Videos</span>
                                    <span className="stat-value">
                                        {completedVideos.length} completed
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="progress-summary">
                            <div className="progress-circle-container">
                                <svg
                                    className="progress-circle"
                                    width="80"
                                    height="80"
                                    viewBox="0 0 80 80"
                                >
                                    <circle
                                        className="progress-circle-bg"
                                        cx="40"
                                        cy="40"
                                        r="36"
                                    />
                                    <circle
                                        className="progress-circle-fill"
                                        cx="40"
                                        cy="40"
                                        r="36"
                                        strokeDasharray="226.2"
                                        strokeDashoffset={
                                            226.2 -
                                            (226.2 * overallProgress) / 100
                                        }
                                    />
                                </svg>
                                <div className="progress-circle-text">
                                    <span className="progress-percentage-large">
                                        {Math.round(overallProgress)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="sidebar-card">
                        <h2 className="sidebar-title">Course Actions</h2>
                        <div className="action-grid">
                            <button
                                className={`action-button ${
                                    isBookmarked ? "active" : ""
                                }`}
                                onClick={handleSaveToggle}
                            >
                                <Bookmark size={24} className="action-icon" />
                                <span className="action-label">
                                    {isBookmarked ? "Saved" : "Save"}
                                </span>
                            </button>
                            <button className="action-button">
                                <Calendar size={24} className="action-icon" />
                                <span className="action-label">Schedule</span>
                            </button>
                            <button
                                className={`action-button ${
                                    isSharing ? "active" : ""
                                }`}
                                onClick={handleShare}
                            >
                                <Share2 size={24} className="action-icon" />
                                <span className="action-label">
                                    {isSharing ? "Shared!" : "Share"}
                                </span>
                            </button>
                            <button
                                className={`action-button ${
                                    isFavorite ? "active" : ""
                                }`}
                                onClick={handleLikeToggle}
                            >
                                <Heart size={24} className="action-icon" />
                                <span className="action-label">
                                    {isFavorite ? "Liked" : "Like"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

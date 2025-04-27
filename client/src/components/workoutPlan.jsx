import { useState, useEffect, useRef } from "react";
import { ChevronRight, Plus, Edit, Trash2, Upload } from "lucide-react";
import "../css/workoutplan.css";

function WorkoutPlan({ onClassSelect }) {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        courseTitle: "",
        courseDescription: "",
        trainerUserId: "",
        courses: [],
        courseDetail: "",
        durationMinutes: 30,
        level: "Beginner",
        targetCalery: 0,
        thumbnail: null,
        thumbnailFile: null,
        category: "Yoga",
    });

    // Fetch plans from the API
    const fetchPlans = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:8080/api/courses");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            const mappedData = data.map((plan) => ({
                id: plan.id,
                title: plan.courseTitle,
                level: plan.level,
                completed: 0,
                image:
                    plan.thumbnail || "/placeholder.svg?height=200&width=300",
                duration: `${plan.durationMinutes} min`,
                instructor: plan.trainerUserId,
                description: plan.courseDescription,
                courseTitle: plan.courseTitle,
                courseDescription: plan.courseDescription,
                trainerUserId: plan.trainerUserId,
                courses: plan.courses || [],
                courseDetail: plan.courseDetail || "",
                durationMinutes: plan.durationMinutes,
                targetCalery: plan.targetCalery,
                thumbnail: plan.thumbnail,
                category: plan.category || "Yoga",
            }));

            setPlans(mappedData);
        } catch (error) {
            console.error("Error fetching plans:", error);
            setError("Failed to load workout plans: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;

        if (type === "number") {
            setFormData((prev) => ({
                ...prev,
                [name]: value === "" ? "" : Number(value),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Handle image upload via backend
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type and size
        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/bmp",
        ];
        if (!validTypes.includes(file.type)) {
            setError("Please upload a valid image (JPEG, PNG, GIF, BMP)");
            return;
        }
        if (file.size > 32 * 1024 * 1024) {
            setError("Image size must be less than 32MB");
            return;
        }

        // Create local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setFormData((prev) => ({
                ...prev,
                thumbnailFile: file,
            }));
        };
        reader.readAsDataURL(file);

        // Upload to backend
        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch(
                "http://localhost:8080/api/courses/upload-image",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Image upload failed! Status: ${response.status}, Message: ${errorText}`
                );
            }

            const imageUrl = await response.text();
            setFormData((prev) => ({
                ...prev,
                thumbnail: imageUrl, // Store backend-provided ImgBB URL
            }));
        } catch (error) {
            console.error("Error uploading image:", error);
            setError("Failed to upload image: " + error.message);
        }
    };

    const handleAddPlan = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const planData = {
                courseTitle: formData.courseTitle,
                courseDescription: formData.courseDescription,
                trainerUserId: formData.trainerUserId,
                courses: formData.courses || [],
                courseDetail: formData.courseDetail || "",
                durationMinutes: Number(formData.durationMinutes),
                level: formData.level,
                targetCalery: Number(formData.targetCalery),
                thumbnail: formData.thumbnail, // ImgBB URL or null
                category: formData.category,
            };

            const response = await fetch("http://localhost:8080/api/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(planData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `HTTP error! Status: ${response.status}, Message: ${errorText}`
                );
            }

            const newPlan = await response.json();
            fetchPlans();
            setShowAddModal(false);
            resetForm();
            alert("Workout plan added successfully");
        } catch (error) {
            setError("Failed to add workout plan: " + error.message);
            alert("Failed to add workout plan: " + error.message);
        }
    };

    const handleEditPlan = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const planData = {
                id: currentPlan.id,
                courseTitle: formData.courseTitle,
                courseDescription: formData.courseDescription,
                trainerUserId: formData.trainerUserId,
                courses: formData.courses || [],
                courseDetail: formData.courseDetail || "",
                durationMinutes: Number(formData.durationMinutes),
                level: formData.level,
                targetCalery: Number(formData.targetCalery),
                thumbnail: formData.thumbnail, // ImgBB URL or null
                category: formData.category,
            };

            const response = await fetch(
                `http://localhost:8080/api/courses/${currentPlan.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(planData),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `HTTP error! Status: ${response.status}, Message: ${errorText}`
                );
            }

            const updatedPlan = await response.json();
            fetchPlans();
            setShowEditModal(false);
            resetForm();
            alert("Workout plan updated successfully");
        } catch (error) {
            setError("Failed to update workout plan: " + error.message);
            alert("Failed to update workout plan: " + error.message);
        }
    };

    const handleDeletePlan = async (id, e) => {
        e.stopPropagation();
        setPlanToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeletePlan = async () => {
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:8080/api/courses/${planToDelete}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `HTTP error! Status: ${response.status}, Message: ${errorText}`
                );
            }

            fetchPlans();
            setShowDeleteModal(false);
            setPlanToDelete(null);
            alert("Workout plan deleted successfully");
        } catch (error) {
            setError("Failed to delete workout plan: " + error.message);
            alert("Failed to delete workout plan: " + error.message);
        }
    };

    const openEditModal = (plan, e) => {
        e.stopPropagation();
        let durationMinutes = plan.durationMinutes;
        if (!durationMinutes && plan.duration) {
            const durationMatch = plan.duration.match(/(\d+)/);
            durationMinutes = durationMatch
                ? Number.parseInt(durationMatch[1])
                : 30;
        }

        setCurrentPlan(plan);
        setFormData({
            courseTitle: plan.courseTitle || "",
            courseDescription: plan.courseDescription || "",
            trainerUserId: plan.trainerUserId || "",
            courses: plan.courses || [],
            courseDetail: plan.courseDetail || "",
            durationMinutes: durationMinutes || 30,
            level: plan.level || "Beginner",
            targetCalery: plan.targetCalery || 0,
            thumbnail: plan.thumbnail || null,
            thumbnailFile: null,
            category: plan.category || "Yoga",
        });
        setImagePreview(plan.thumbnail || null);
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            courseTitle: "",
            courseDescription: "",
            trainerUserId: "",
            courses: [],
            courseDetail: "",
            durationMinutes: 30,
            level: "Beginner",
            targetCalery: 0,
            thumbnail: null,
            thumbnailFile: null,
            category: "Yoga",
        });
        setImagePreview(null);
        setCurrentPlan(null);
        setError(null);
    };

    const PlanModal = ({ isOpen, onClose, title, onSubmit }) => {
        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>{title}</h2>
                        <button
                            className="close-btn"
                            onClick={() => {
                                onClose();
                                resetForm();
                            }}
                        >
                            ×
                        </button>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={onSubmit} className="plan-form">
                        <div className="form-group">
                            <label htmlFor="courseTitle">Title</label>
                            <input
                                type="text"
                                id="courseTitle"
                                name="courseTitle"
                                value={formData.courseTitle}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="courseDescription">
                                Description
                            </label>
                            <textarea
                                id="courseDescription"
                                name="courseDescription"
                                value={formData.courseDescription}
                                onChange={handleInputChange}
                                rows={3}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="trainerUserId">
                                    Instructor
                                </label>
                                <input
                                    type="text"
                                    id="trainerUserId"
                                    name="trainerUserId"
                                    value={formData.trainerUserId}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="level">Level</label>
                                <select
                                    id="level"
                                    name="level"
                                    value={formData.level}
                                    onChange={handleInputChange}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Intermediate">
                                        Intermediate
                                    </option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="durationMinutes">
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    id="durationMinutes"
                                    name="durationMinutes"
                                    value={formData.durationMinutes}
                                    onChange={handleInputChange}
                                    min={1}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="targetCalery">
                                    Target Calories
                                </label>
                                <input
                                    type="number"
                                    id="targetCalery"
                                    name="targetCalery"
                                    value={formData.targetCalery}
                                    onChange={handleInputChange}
                                    min={0}
                                    step={0.1}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="Yoga">Yoga</option>
                                <option value="Pilates">Pilates</option>
                                <option value="Cardio">Cardio</option>
                                <option value="Strength">Strength</option>
                                <option value="Stretching">Stretching</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Thumbnail Image</label>
                            <div className="image-upload-container">
                                {imagePreview && (
                                    <div className="image-preview">
                                        <img
                                            src={
                                                imagePreview ||
                                                "/placeholder.svg"
                                            }
                                            alt="Preview"
                                        />
                                    </div>
                                )}
                                <div className="upload-button-container">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        style={{ display: "none" }}
                                    />
                                    <button
                                        type="button"
                                        className="upload-btn"
                                        onClick={() =>
                                            fileInputRef.current.click()
                                        }
                                    >
                                        <Upload size={16} />
                                        {imagePreview
                                            ? "Change Image"
                                            : "Upload Image"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="courseDetail">
                                Additional Details
                            </label>
                            <textarea
                                id="courseDetail"
                                name="courseDetail"
                                value={formData.courseDetail}
                                onChange={handleInputChange}
                                rows={2}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                {currentPlan ? "Update Plan" : "Add Plan"}
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    onClose();
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div
                    className="delete-confirm-modal"
                    style={{
                        backgroundColor: "var(--color-card-bg)",
                        borderRadius: "var(--border-radius)",
                        width: "90%",
                        maxWidth: "400px",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        padding: "1rem",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    }}
                >
                    <div
                        className="modal-header"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "1rem",
                            borderBottom: "1px solid var(--color-card-border)",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: 600,
                                color: "#ef4444",
                                margin: 0,
                            }}
                        >
                            Confirm Deletion
                        </h2>
                        <button
                            className="close-btn"
                            onClick={onClose}
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: "1.5rem",
                                cursor: "pointer",
                                color: "var(--color-text-secondary)",
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <div
                        className="modal-body"
                        style={{
                            padding: "1rem",
                            textAlign: "center",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "0.875rem",
                                color: "var(--color-text-muted)",
                                margin: 0,
                                lineHeight: 1.5,
                            }}
                        >
                            Are you sure you want to delete this workout plan?
                        </p>
                    </div>
                    <div
                        className="form-actions"
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "1rem",
                            padding: "1rem",
                            borderTop: "1px solid var(--color-card-border)",
                        }}
                    >
                        <button
                            className="submit-btn"
                            onClick={onConfirm}
                            style={{
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "0.25rem",
                                padding: "0.5rem 1rem",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                            }}
                        >
                            Delete
                        </button>
                        <button
                            className="cancel-btn"
                            onClick={onClose}
                            style={{
                                backgroundColor: "transparent",
                                border: "1px solid var(--color-card-border)",
                                borderRadius: "0.25rem",
                                padding: "0.5rem 1rem",
                                cursor: "pointer",
                                color: "white",
                                fontSize: "0.875rem",
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard">
            {/* Recent Classes */}
            <div className="section">
                <div className="section-header">
                    <h2 className="section-title">Recent Plans</h2>
                    <div className="header-actions">
                        <button
                            className="add-plan-btn"
                            onClick={() => setShowAddModal(true)}
                        >
                            <Plus size={16} />
                            Add Plan
                        </button>
                        <button className="view-all-btn">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
                <div className="classes-grid">
                    {isLoading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : plans.length === 0 ? (
                        <div className="no-data-message">
                            No workout plans found. Add your first plan!
                        </div>
                    ) : (
                        plans.slice(0, 3).map((classItem) => (
                            <div
                                key={classItem.id}
                                className="class-card"
                                onClick={() => onClassSelect(classItem)}
                            >
                                <div className="class-image">
                                    <img
                                        src={
                                            classItem.image ||
                                            "/placeholder.svg"
                                        }
                                        alt={classItem.title}
                                        className="image-cover"
                                    />
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={(e) =>
                                            openEditModal(classItem, e)
                                        }
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={(e) =>
                                            handleDeletePlan(classItem.id, e)
                                        }
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="class-content">
                                    <div className="class-meta">
                                        <span
                                            className={`class-level ${classItem.level.toLowerCase()}`}
                                        >
                                            {classItem.level}
                                        </span>
                                        <span className="class-duration">
                                            {classItem.duration}
                                        </span>
                                    </div>
                                    <h3 className="class-title">
                                        {classItem.title}
                                    </h3>
                                    <p className="class-instructor">
                                        with {classItem.instructor}
                                    </p>
                                    <p className="class-description">
                                        {classItem.description}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
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
                    {isLoading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : plans.length === 0 ? (
                        <div className="no-data-message">
                            No workout plans found. Add your first plan!
                        </div>
                    ) : (
                        plans.map((classItem) => (
                            <div
                                key={classItem.id}
                                className="recommended-card"
                                onClick={() => onClassSelect(classItem)}
                            >
                                <div className="recommended-image">
                                    <img
                                        src={
                                            classItem.image ||
                                            "/placeholder.svg"
                                        }
                                        alt={classItem.title}
                                        className="image-cover"
                                    />
                                    <div className="duration-badge">
                                        {classItem.duration}
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="edit-btn small"
                                        onClick={(e) =>
                                            openEditModal(classItem, e)
                                        }
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        className="delete-btn small"
                                        onClick={(e) =>
                                            handleDeletePlan(classItem.id, e)
                                        }
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="recommended-content">
                                    <span
                                        className={`class-level ${classItem.level.toLowerCase()}`}
                                    >
                                        {classItem.level}
                                    </span>
                                    <h3 className="recommended-title">
                                        {classItem.title}
                                    </h3>
                                    <p className="recommended-instructor">
                                        with {classItem.instructor}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Plan Modal */}
            <PlanModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add New Workout Plan"
                onSubmit={handleAddPlan}
            />

            {/* Edit Plan Modal */}
            <PlanModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Workout Plan"
                onSubmit={handleEditPlan}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setPlanToDelete(null);
                }}
                onConfirm={confirmDeletePlan}
            />
        </div>
    );
}

export default WorkoutPlan;

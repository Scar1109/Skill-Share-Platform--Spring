import { useState, useEffect, useRef } from "react"
import { ChevronRight, Plus, Edit, Trash2, Upload } from "lucide-react"
import { Modal, Form, Input, Select, InputNumber, Button, Upload as AntUpload } from "antd"
import "../css/workoutplan.css"
import "../css/antd-modal.css" // We'll create this file for custom styling

const { TextArea } = Input
const { Option } = Select

function WorkoutPlan({ onClassSelect }) {
    const [plans, setPlans] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [planToDelete, setPlanToDelete] = useState(null)
    const [currentPlan, setCurrentPlan] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)
    const [error, setError] = useState(null)
    const [form] = Form.useForm() // Ant Design form instance

    // Fetch plans from the API
    const fetchPlans = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch("http://localhost:8080/api/courses")
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            const data = await response.json()

            const mappedData = data.map((plan) => ({
                id: plan.id,
                title: plan.courseTitle,
                level: plan.level,
                completed: 0,
                image: plan.thumbnail || "/placeholder.svg?height=200&width=300",
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
            }))

            setPlans(mappedData)
        } catch (error) {
            console.error("Error fetching plans:", error)
            setError("Failed to load workout plans: " + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPlans()
    }, [])

    // Handle image upload via backend
    const handleImageUpload = async (file) => {
        if (!file) return

        // Validate file type and size
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp"]
        if (!validTypes.includes(file.type)) {
            setError("Please upload a valid image (JPEG, PNG, GIF, BMP)")
            return
        }
        if (file.size > 32 * 1024 * 1024) {
            setError("Image size must be less than 32MB")
            return
        }

        // Create local preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)

        // Upload to backend
        try {
            const formData = new FormData()
            formData.append("image", file)

            const response = await fetch("http://localhost:8080/api/courses/upload-image", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Image upload failed! Status: ${response.status}, Message: ${errorText}`)
            }

            const imageUrl = await response.text()
            form.setFieldsValue({ thumbnail: imageUrl })
            return imageUrl
        } catch (error) {
            console.error("Error uploading image:", error)
            setError("Failed to upload image: " + error.message)
            return null
        }
    }

    const handleAddPlan = async (values) => {
        setError(null)
        try {
            const planData = {
                courseTitle: values.courseTitle,
                courseDescription: values.courseDescription,
                trainerUserId: values.trainerUserId,
                courses: values.courses || [],
                courseDetail: values.courseDetail || "",
                durationMinutes: Number(values.durationMinutes),
                level: values.level,
                targetCalery: Number(values.targetCalery),
                thumbnail: values.thumbnail, // ImgBB URL or null
                category: values.category,
            }

            const response = await fetch("http://localhost:8080/api/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(planData),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`)
            }

            const newPlan = await response.json()
            fetchPlans()
            setShowAddModal(false)
            resetForm()
            alert("Workout plan added successfully")
        } catch (error) {
            setError("Failed to add workout plan: " + error.message)
            alert("Failed to add workout plan: " + error.message)
        }
    }

    const handleEditPlan = async (values) => {
        setError(null)
        try {
            const planData = {
                id: currentPlan.id,
                courseTitle: values.courseTitle,
                courseDescription: values.courseDescription,
                trainerUserId: values.trainerUserId,
                courses: values.courses || [],
                courseDetail: values.courseDetail || "",
                durationMinutes: Number(values.durationMinutes),
                level: values.level,
                targetCalery: Number(values.targetCalery),
                thumbnail: values.thumbnail, // ImgBB URL or null
                category: values.category,
            }

            const response = await fetch(`http://localhost:8080/api/courses/${currentPlan.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(planData),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`)
            }

            const updatedPlan = await response.json()
            fetchPlans()
            setShowEditModal(false)
            resetForm()
            alert("Workout plan updated successfully")
        } catch (error) {
            setError("Failed to update workout plan: " + error.message)
            alert("Failed to update workout plan: " + error.message)
        }
    }

    const handleDeletePlan = async (id, e) => {
        e.stopPropagation()
        setPlanToDelete(id)
        setShowDeleteModal(true)
    }

    const confirmDeletePlan = async () => {
        setError(null)
        try {
            const response = await fetch(`http://localhost:8080/api/courses/${planToDelete}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`)
            }

            fetchPlans()
            setShowDeleteModal(false)
            setPlanToDelete(null)
            alert("Workout plan deleted successfully")
        } catch (error) {
            setError("Failed to delete workout plan: " + error.message)
            alert("Failed to delete workout plan: " + error.message)
        }
    }

    const openEditModal = (plan, e) => {
        e.stopPropagation()
        let durationMinutes = plan.durationMinutes
        if (!durationMinutes && plan.duration) {
            const durationMatch = plan.duration.match(/(\d+)/)
            durationMinutes = durationMatch ? Number.parseInt(durationMatch[1]) : 30
        }

        setCurrentPlan(plan)
        setImagePreview(plan.thumbnail || null)

        // Set form values for editing
        form.setFieldsValue({
            courseTitle: plan.courseTitle || "",
            courseDescription: plan.courseDescription || "",
            trainerUserId: plan.trainerUserId || "",
            courseDetail: plan.courseDetail || "",
            durationMinutes: durationMinutes || 30,
            level: plan.level || "Beginner",
            targetCalery: plan.targetCalery || 0,
            thumbnail: plan.thumbnail || null,
            category: plan.category || "Yoga",
        })

        setShowEditModal(true)
    }

    const resetForm = () => {
        form.resetFields()
        setImagePreview(null)
        setCurrentPlan(null)
        setError(null)
    }

    // Custom upload button for Ant Design Upload component
    const customUploadButton = (
        <div className="upload-btn">
            <Upload size={16} />
            <span>{imagePreview ? "Change Image" : "Upload Image"}</span>
        </div>
    )

    // Plan Modal using Ant Design components
    const PlanModal = ({ isOpen, onClose, title, onFinish }) => {
        return (
            <Modal
                title={title}
                open={isOpen}
                onCancel={() => {
                    onClose()
                    resetForm()
                }}
                footer={null}
                width={600}
                className="workout-plan-modal"
                destroyOnClose={true}
            >
                {error && <div className="error-message">{error}</div>}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        courseTitle: "",
                        courseDescription: "",
                        trainerUserId: "",
                        courseDetail: "",
                        durationMinutes: 30,
                        level: "Beginner",
                        targetCalery: 0,
                        category: "Yoga",
                    }}
                    className="plan-form"
                >
                    <Form.Item label="Title" name="courseTitle" rules={[{ required: true, message: "Please enter a title" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="courseDescription"
                        rules={[{ required: true, message: "Please enter a description" }]}
                    >
                        <TextArea rows={3} />
                    </Form.Item>

                    <div className="form-row">
                        <Form.Item
                            label="Instructor"
                            name="trainerUserId"
                            rules={[{ required: true, message: "Please enter an instructor" }]}
                            className="form-group1"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label="Level" name="level" className="form-group1">
                            <Select className="custom-select-dark">
                                <Option value="Beginner">Beginner</Option>
                                <Option value="Moderate">Moderate</Option>
                                <Option value="Intermediate">Intermediate</Option>
                                <Option value="Advanced">Advanced</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="form-row">
                        <Form.Item
                            label="Duration (minutes)"
                            name="durationMinutes"
                            rules={[{ required: true, message: "Please enter duration" }]}
                            className="form-group1"
                        >
                            <InputNumber min={1} style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item
                            label="Target Calories"
                            name="targetCalery"
                            rules={[{ required: true, message: "Please enter target calories" }]}
                            className="form-group1"
                        >
                            <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
                        </Form.Item>
                    </div>

                    <Form.Item label="Category" name="category">
                        <Select className="custom-select-dark">
                            <Option value="Yoga">Yoga</Option>
                            <Option value="Pilates">Pilates</Option>
                            <Option value="Cardio">Cardio</Option>
                            <Option value="Strength">Strength</Option>
                            <Option value="Stretching">Stretching</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Thumbnail Image" name="thumbnail" valuePropName="file">
                        <div className="image-upload-container">
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
                                </div>
                            )}
                            <div className="upload-button-container">
                                <AntUpload
                                    name="thumbnail"
                                    listType="picture"
                                    showUploadList={false}
                                    beforeUpload={async (file) => {
                                        const url = await handleImageUpload(file)
                                        return false // Prevent default upload behavior
                                    }}
                                    accept="image/*"
                                >
                                    {customUploadButton}
                                </AntUpload>
                            </div>
                        </div>
                    </Form.Item>

                    <Form.Item label="Additional Details" name="courseDetail">
                        <TextArea rows={2} />
                    </Form.Item>

                    <div className="form-actions">
                        <Button type="primary" htmlType="submit" className="submit-btn">
                            {currentPlan ? "Update Plan" : "Add Plan"}
                        </Button>
                        <Button
                            className="cancel-btn"
                            onClick={() => {
                                onClose()
                                resetForm()
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Modal>
        )
    }

    // Delete Confirmation Modal using Ant Design
    const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
        return (
            <Modal
                title={<span style={{ color: "#ef4444" }}>Confirm Deletion</span>}
                open={isOpen}
                onCancel={onClose}
                footer={[
                    <Button key="cancel" onClick={onClose} className="cancel-btn">
                        Cancel
                    </Button>,
                    <Button key="delete" danger onClick={onConfirm} className="submit-btn delete-btn-modal">
                        Delete
                    </Button>,
                ]}
                className="delete-confirm-modal"
            >
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                    Are you sure you want to delete this workout plan?
                </p>
            </Modal>
        )
    }

    return (
        <div className="dashboard">
            {/* Recent Classes */}
            <div className="section">
                <div className="section-header">
                    <h2 className="section-title">Recent Plans</h2>
                    <div className="header-actions">
                        <button className="add-plan-btn" onClick={() => setShowAddModal(true)}>
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
                        <div className="no-data-message">No workout plans found. Add your first plan!</div>
                    ) : (
                        plans.slice(0, 3).map((classItem) => (
                            <div key={classItem.id} className="class-card" onClick={() => onClassSelect(classItem)}>
                                <div className="class-image">
                                    <img src={classItem.image || "/placeholder.svg"} alt={classItem.title} className="image-cover" />
                                </div>
                                <div className="card-actions">
                                    <button className="edit-btn" onClick={(e) => openEditModal(classItem, e)}>
                                        <Edit size={16} />
                                    </button>
                                    <button className="delete-btn" onClick={(e) => handleDeletePlan(classItem.id, e)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="class-content">
                                    <div className="class-meta">
                                        <span className={`class-level ${classItem.level.toLowerCase()}`}>{classItem.level}</span>
                                        <span className="class-duration">{classItem.duration}</span>
                                    </div>
                                    <h3 className="class-title">{classItem.title}</h3>
                                    <p className="class-instructor">with {classItem.instructor}</p>
                                    <p className="class-description">{classItem.description}</p>
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
                        <div className="no-data-message">No workout plans found. Add your first plan!</div>
                    ) : (
                        plans.map((classItem) => (
                            <div key={classItem.id} className="recommended-card" onClick={() => onClassSelect(classItem)}>
                                <div className="recommended-image">
                                    <img src={classItem.image || "/placeholder.svg"} alt={classItem.title} className="image-cover" />
                                    <div className="duration-badge">{classItem.duration}</div>
                                </div>
                                <div className="card-actions">
                                    <button className="edit-btn small" onClick={(e) => openEditModal(classItem, e)}>
                                        <Edit size={14} />
                                    </button>
                                    <button className="delete-btn small" onClick={(e) => handleDeletePlan(classItem.id, e)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="recommended-content">
                                    <span className={`class-level ${classItem.level.toLowerCase()}`}>{classItem.level}</span>
                                    <h3 className="recommended-title">{classItem.title}</h3>
                                    <p className="recommended-instructor">with {classItem.instructor}</p>
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
                onFinish={handleAddPlan}
            />

            {/* Edit Plan Modal */}
            <PlanModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Workout Plan"
                onFinish={handleEditPlan}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setPlanToDelete(null)
                }}
                onConfirm={confirmDeletePlan}
            />
        </div>
    )
}

export default WorkoutPlan

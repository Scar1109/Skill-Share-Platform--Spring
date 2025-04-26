import { useState } from "react"
import { Clock, Award, ChevronRight, Calendar, Dumbbell, Flame } from "lucide-react"
import "../css/workoutplan.css";

function WorkoutPlan({ onClassSelect }) {
    const classes = [
        {
            id: 1,
            title: "Hatha Basics",
            level: "Beginner",
            completed: 27,
            image: "/placeholder.svg?height=200&width=300",
            duration: "30 min",
            instructor: "Jane Brunetti",
            description:
                "Perfect for beginners, this class focuses on the fundamentals of Hatha yoga, helping you build a strong foundation.",
        },
        {
            id: 2,
            title: "Energizing Morning Flow",
            level: "Beginner",
            completed: 15,
            image: "/placeholder.svg?height=200&width=300",
            duration: "25 min",
            instructor: "Jane Brunetti",
            description:
                "Discover the gentle art of flexibility in our beginner-friendly yoga class. This soothing session focuses on increasing your range of motion through slow, mindful stretches and poses.",
        },
        {
            id: 3,
            title: "Balance",
            level: "Moderate",
            completed: 5,
            image: "/placeholder.svg?height=200&width=300",
            duration: "40 min",
            instructor: "Mike Chen",
            description:
                "Improve your stability and core strength with this balanced workout that combines yoga and pilates elements.",
        },
        {
            id: 4,
            title: "Flexibility",
            level: "Beginner",
            completed: 10,
            image: "/placeholder.svg?height=200&width=300",
            duration: "35 min",
            instructor: "Sarah Johnson",
            description:
                "Focus on increasing your flexibility and range of motion with gentle stretches and holds.",
        },
    ];

    const stats = {
        calories: 1849,
        minutes: 319,
        classes: 28,
        streak: 12,
        progress: 78,
    };

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Track your fitness journey</p>
                </div>
                <div className="header-actions">
                    <div className="header-action-btn">
                        <Calendar size={20} />
                    </div>
                    <div className="header-action-btn">
                        <Dumbbell size={20} />
                    </div>
                    <div className="header-avatar"></div>
                </div>
            </div>
            {/* Recent Classes */}
            <div className="section">
                <div className="section-header">
                    <h2 className="section-title">Recent Plans</h2>
                    <button className="view-all-btn">
                        View All <ChevronRight size={16} />
                    </button>
                </div>
                <div className="classes-grid">
                    {classes.slice(0, 3).map((classItem) => (
                        <div
                            key={classItem.id}
                            className="class-card"
                            onClick={() => onClassSelect(classItem)}
                        >
                            <div className="class-image">
                                <img
                                    src={classItem.image || "/placeholder.svg"}
                                    alt={classItem.title}
                                    className="image-cover"
                                />
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
                    ))}
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
                    {classes.map((classItem) => (
                        <div
                            key={classItem.id}
                            className="recommended-card"
                            onClick={() => onClassSelect(classItem)}
                        >
                            <div className="recommended-image">
                                <img
                                    src={classItem.image || "/placeholder.svg"}
                                    alt={classItem.title}
                                    className="image-cover"
                                />
                                <div className="duration-badge">
                                    {classItem.duration}
                                </div>
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
                    ))}
                </div>
            </div>
        </div>
    );
}
export default WorkoutPlan;

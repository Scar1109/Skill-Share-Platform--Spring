import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Dumbbell, Flame } from "lucide-react";
import "../css/workouts.css";

export default function Workouts({ onClassSelect }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeLevel, setActiveLevel] = useState("all");
    const [showLevelFilter, setShowLevelFilter] = useState(false);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Fetch all courses from the API
    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    "http://localhost:8080/api/courses"
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();

                // Map the API data to match our component's expected format
                const mappedCourses = data.map((course) => ({
                    id: course.id,
                    title: course.courseTitle,
                    category: course.category
                        ? course.category.toLowerCase()
                        : "other",
                    level: course.level || "Beginner",
                    duration: `${course.durationMinutes} min`,
                    calories: course.targetCalery || 0,
                    instructor: course.trainerUserId,
                    image:
                        course.thumbnail ||
                        "/placeholder.svg?height=200&width=300",
                    description: course.courseDescription,
                }));

                setCourses(mappedCourses);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setError("Failed to load courses. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Updated workout categories as requested
    const workoutCategories = [
        { id: "all", name: "All Workouts" },
        { id: "yoga", name: "Yoga" },
        { id: "pilates", name: "Pilates" },
        { id: "cardio", name: "Cardio" },
        { id: "strength", name: "Strength" },
        { id: "stretching", name: "Stretching" },
    ];

    const levelOptions = [
        { id: "all", name: "All Levels" },
        { id: "beginner", name: "Beginner" },
        { id: "moderate", name: "Moderate" },
        { id: "intermediate", name: "Intermediate" },
        { id: "advanced", name: "Advanced" },
    ];

    const filteredWorkouts = () => {
        return courses.filter((workout) => {
            // Filter by category
            const matchesCategory =
                activeCategory === "all" || workout.category === activeCategory;

            // Filter by level
            const matchesLevel =
                activeLevel === "all" ||
                workout.level.toLowerCase() === activeLevel.toLowerCase();

            // Filter by search query
            const matchesQuery =
                searchQuery === "" ||
                workout.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (workout.instructor &&
                    workout.instructor
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesLevel && matchesQuery;
        });
    };

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
    };

    const handleLevelChange = (levelId) => {
        setActiveLevel(levelId);
        setShowLevelFilter(false);
    };

    const toggleLevelFilter = () => {
        setShowLevelFilter(!showLevelFilter);
    };

    const handleWorkoutClick = (workout) => {
        // If onClassSelect prop is provided, use it
        if (onClassSelect) {
            onClassSelect(workout);
        } else {
            // Otherwise navigate to the learning plan page with the course id
            navigate(`/learning-plan/${workout.id}`);
        }
    };

    return (
        <div className="workouts-page">
            {/* Header */}
            <div className="workouts-header">
                <h1 className="page-title">Workouts</h1>
            </div>

            {/* Search and Filter */}
            <div className="search-container">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search workouts, instructors..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="filter-button" onClick={toggleLevelFilter}>
                    <Filter size={20} />
                </button>
            </div>

            {/* Workout Categories */}
            <div className="categories-tabs">
                {workoutCategories.map((category) => (
                    <button
                        key={category.id}
                        className={`category-tab ${
                            activeCategory === category.id ? "active" : ""
                        }`}
                        onClick={() => handleCategoryChange(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Level Filter - Only shown when filter button is clicked */}
            {showLevelFilter && (
                <div
                    className="categories-tabs"
                    style={{ marginBottom: "1rem" }}
                >
                    {levelOptions.map((level) => (
                        <button
                            key={level.id}
                            className={`category-tab ${
                                activeLevel === level.id ? "active" : ""
                            }`}
                            onClick={() => handleLevelChange(level.id)}
                        >
                            {level.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="empty-state">
                    <div style={{ fontSize: "1rem", marginBottom: "1rem" }}>
                        Loading workouts...
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="empty-state">
                    <div
                        style={{
                            color: "var(--color-red, #ef4444)",
                            marginBottom: "1rem",
                        }}
                    >
                        {error}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: "var(--color-card-bg)",
                            border: "1px solid var(--color-card-border)",
                            borderRadius: "0.375rem",
                            padding: "0.5rem 1rem",
                            color: "var(--color-text-primary)",
                            cursor: "pointer",
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Workouts Grid */}
            {!isLoading && !error && (
                <div className="workouts-grid">
                    {filteredWorkouts().map((workout) => (
                        <div
                            key={workout.id}
                            className="workout-card"
                            onClick={() => handleWorkoutClick(workout)}
                        >
                            <div className="workout-image">
                                <img
                                    src={workout.image || "/placeholder.svg"}
                                    alt={workout.title}
                                    className="image-cover"
                                />
                                <div className="duration-badge">
                                    {workout.duration}
                                </div>
                            </div>
                            <div className="workout-content">
                                <div className="workout-meta">
                                    <span
                                        className={`workout-level ${workout.level.toLowerCase()}`}
                                    >
                                        {workout.level}
                                    </span>
                                    <div className="calories-info">
                                        <Flame
                                            size={12}
                                            className="calories-icon"
                                        />
                                        <span>{workout.calories} cal</span>
                                    </div>
                                </div>
                                <h3 className="workout-title">
                                    {workout.title}
                                </h3>
                                <p className="workout-instructor">
                                    with {workout.instructor}
                                </p>
                                <p className="workout-description">
                                    {workout.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && !error && filteredWorkouts().length === 0 && (
                <div className="empty-state">
                    <Dumbbell size={48} className="empty-icon" />
                    <h3 className="empty-title">No workouts found</h3>
                    <p className="empty-message">
                        Try adjusting your search or filters
                    </p>
                </div>
            )}
        </div>
    );
}

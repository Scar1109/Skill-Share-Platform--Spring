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
        <div className="workouts-page123">
            {/* Header */}
            <div className="workouts-header456">
                <h1 className="page-title789">Workouts</h1>
            </div>

            {/* Search and Filter */}
            <div className="search-container012">
                <div className="search-input-wrapper345">
                    <Search className="search-icon678" size={18} />
                    <input
                        type="text"
                        placeholder="Search workouts, instructors..."
                        className="search-input901"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    className="filter-button234"
                    onClick={toggleLevelFilter}
                >
                    <Filter size={20} />
                </button>
            </div>

            {/* Workout Categories */}
            <div className="categories-tabs567">
                {workoutCategories.map((category) => (
                    <button
                        key={category.id}
                        className={`category-tab890 ${
                            activeCategory === category.id ? "active123" : ""
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
                    className="categories-tabs567"
                    style={{ marginBottom: "1rem" }}
                >
                    {levelOptions.map((level) => (
                        <button
                            key={level.id}
                            className={`category-tab890 ${
                                activeLevel === level.id ? "active123" : ""
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
                <div className="empty-state456">
                    <div style={{ fontSize: "1rem", marginBottom: "1rem" }}>
                        Loading workouts...
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="empty-state456">
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

            {/* Workouts Grid - Updated to match recommended styling */}
            {!isLoading && !error && (
                <div className="recommended-grid789">
                    {filteredWorkouts().map((workout) => (
                        <div
                            key={workout.id}
                            className="recommended-card012"
                            onClick={() => handleWorkoutClick(workout)}
                        >
                            <div className="recommended-image345">
                                <img
                                    src={workout.image || "/placeholder.svg"}
                                    alt={workout.title}
                                    className="image-cover678"
                                />
                                <div className="duration-badge901">
                                    {workout.duration}
                                </div>
                            </div>
                            <div className="recommended-content234">
                                <span
                                    className={`workout-level567 ${workout.level.toLowerCase()}`}
                                >
                                    {workout.level}
                                </span>
                                <h3 className="recommended-title890">
                                    {workout.title}
                                </h3>
                                <p className="recommended-instructor123">
                                    with {workout.instructor}
                                </p>
                                <div className="calories-info456">
                                    <Flame
                                        size={12}
                                        className="calories-icon789"
                                    />
                                    <span>{workout.calories} cal</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && !error && filteredWorkouts().length === 0 && (
                <div className="empty-state456">
                    <Dumbbell size={48} className="empty-icon789" />
                    <h3 className="empty-title012">No workouts found</h3>
                    <p className="empty-message345">
                        Try adjusting your search or filters
                    </p>
                </div>
            )}
        </div>
    );
}

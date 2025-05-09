// "use client"

// import { useState } from "react"
// import { Search, Filter, Dumbbell, Flame } from "lucide-react"
// import "../css/workouts.css"

// export default function Workouts({ onClassSelect }) {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [activeCategory, setActiveCategory] = useState("all")

//   const workoutCategories = [
//     { id: "all", name: "All Workouts" },
//     { id: "yoga", name: "Yoga" },
//     { id: "hiit", name: "HIIT" },
//     { id: "strength", name: "Strength" },
//     { id: "cardio", name: "Cardio" },
//     { id: "flexibility", name: "Flexibility" },
//   ]

//   const workouts = [
//     {
//       id: 1,
//       title: "Hatha Basics",
//       category: "yoga",
//       level: "Beginner",
//       duration: "30 min",
//       calories: 150,
//       instructor: "Jane Brunetti",
//       image: "/placeholder.svg?height=200&width=300",
//       description: "Perfect for beginners, this class focuses on the fundamentals of Hatha yoga.",
//     },
//     {
//       id: 2,
//       title: "Energizing Morning Flow",
//       category: "yoga",
//       level: "Beginner",
//       duration: "25 min",
//       calories: 120,
//       instructor: "Jane Brunetti",
//       image: "/placeholder.svg?height=200&width=300",
//       description: "Start your day with this energizing flow to wake up your body and mind.",
//     },
//     {
//       id: 3,
//       title: "HIIT Cardio Blast",
//       category: "hiit",
//       level: "Intermediate",
//       duration: "20 min",
//       calories: 250,
//       instructor: "Mike Chen",
//       image: "/placeholder.svg?height=200&width=300",
//       description: "High intensity interval training to maximize calorie burn in minimal time.",
//     },
//     {
//       id: 4,
//       title: "Full Body Strength",
//       category: "strength",
//       level: "Intermediate",
//       duration: "45 min",
//       calories: 300,
//       instructor: "Sarah Johnson",
//       image: "/placeholder.svg?height=200&width=300",
//       description: "Build strength throughout your entire body with this comprehensive workout.",
//     },
//     {
//       id: 5,
//       title: "Flexibility Flow",
//       category: "flexibility",
//       level: "Beginner",
//       duration: "35 min",
//       calories: 180,
//       instructor: "Emma Wilson",
//       image: "/placeholder.svg?height=200&width=300",
//       description: "Improve your range of motion and prevent injuries with this flexibility routine.",
//     },
//     {
//       id: 6,
//       title: "Cardio Kickboxing",
//       category: "cardio",
//       level: "Advanced",
//       duration: "40 min",
//       calories: 350,
//       instructor: "Jason Lee",
//       image: "/placeholder.svg?height=200&width=300",
//       description: "Combine martial arts techniques with fast-paced cardio for an intense workout.",
//     },
//     {
//       id: 7,
//       title: "Power Yoga",
//       category: "yoga",
//       level: "Advanced",
//       duration: "50 min",
//       calories: 280,
//       instructor: "Jane Brunetti",
//       image: "/placeholder.svg?height=200&width=300",
//       description: "A vigorous, fitness-based approach to vinyasa-style yoga.",
//     },
//     {
//       id: 8,
//       title: "Core Crusher",
//       category: "strength",
//       level: "Intermediate",
//       duration: "25 min",
//       calories: 200,
//       instructor: "Mike Chen",
//       image: "/placeholder.svg?height=200&width=300",
//       description: "Focus on strengthening your core with this targeted workout.",
//     },
//   ]

//   const filteredWorkouts = () => {
//     return workouts.filter((workout) => {
//       const matchesCategory = activeCategory === "all" || workout.category === activeCategory
//       const matchesQuery =
//         searchQuery === "" ||
//         workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         workout.instructor.toLowerCase().includes(searchQuery.toLowerCase())

//       return matchesCategory && matchesQuery
//     })
//   }

//   const handleCategoryChange = (categoryId) => {
//     setActiveCategory(categoryId)
//   }

//   return (
//     <div className="workouts-page">
//       {/* Header */}
//       <div className="workouts-header">
//         <h1 className="page-title">Workouts</h1>
//       </div>

//       {/* Search and Filter */}
//       <div className="search-container">
//         <div className="search-input-wrapper">
//           <Search className="search-icon" size={18} />
//           <input
//             type="text"
//             placeholder="Search workouts, instructors..."
//             className="search-input"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <button className="filter-button">
//           <Filter size={20} />
//         </button>
//       </div>

//       {/* Workout Categories */}
//       <div className="categories-tabs">
//         {workoutCategories.map((category) => (
//           <button
//             key={category.id}
//             className={`category-tab ${activeCategory === category.id ? "active" : ""}`}
//             onClick={() => handleCategoryChange(category.id)}
//           >
//             {category.name}
//           </button>
//         ))}
//       </div>

//       {/* Workouts Grid */}
//       <div className="workouts-grid">
//         {filteredWorkouts().map((workout) => (
//           <div key={workout.id} className="workout-card" onClick={() => onClassSelect(workout)}>
//             <div className="workout-image">
//               <img
//                 src={workout.image || "/placeholder.svg"}
//                 alt={workout.title}
//                 className="image-cover"
//               />
//               <div className="duration-badge">{workout.duration}</div>
//             </div>
//             <div className="workout-content">
//               <div className="workout-meta">
//                 <span className={`workout-level ${workout.level.toLowerCase()}`}>{workout.level}</span>
//                 <div className="calories-info">
//                   <Flame size={12} className="calories-icon" />
//                   <span>{workout.calories} cal</span>
//                 </div>
//               </div>
//               <h3 className="workout-title">{workout.title}</h3>
//               <p className="workout-instructor">with {workout.instructor}</p>
//               <p className="workout-description">{workout.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredWorkouts().length === 0 && (
//         <div className="empty-state">
//           <Dumbbell size={48} className="empty-icon" />
//           <h3 className="empty-title">No workouts found</h3>
//           <p className="empty-message">Try adjusting your search or filters</p>
//         </div>
//       )}
//     </div>
//   )
// }

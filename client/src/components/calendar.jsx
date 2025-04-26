import { ChevronLeft, ChevronRight } from "lucide-react"
import "../css/calendar.css"

export default function Calendar() {
  // Mock data for calendar
  const currentMonth = "April 2023"
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Generate calendar days (example for April)
  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    hasWorkout: Math.random() > 0.6, // Random workout days for demo
    isToday: i + 1 === 23, // Assuming today is the 23rd
  }))

  // Add empty days for proper alignment (April 2023 starts on Saturday)
  const emptyDays = 5 // Number of empty days at the start
  const calendarDays = [...Array(emptyDays).fill(null), ...days]

  return (
    <div className="calendar-page">
      {/* Header */}
      <div className="calendar-header">
        <h1 className="page-title">Calendar</h1>
        <div className="month-selector">
          <button className="month-nav-button">
            <ChevronLeft size={20} />
          </button>
          <span className="current-month">{currentMonth}</span>
          <button className="month-nav-button">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="calendar-card">
        <div className="calendar-content">
          {/* Days of week header */}
          <div className="weekdays-header">
            {daysOfWeek.map((day) => (
              <div key={day} className="weekday-name">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="calendar-grid">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${
                  day ? (day.isToday ? "today" : day.hasWorkout ? "has-workout" : "") : "empty"
                }`}
              >
                {day && (
                  <>
                    <span className="day-number">{day.day}</span>
                    {day.hasWorkout && !day.isToday && <div className="workout-indicator"></div>}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming workouts */}
      <div className="upcoming-section">
        <h2 className="section-title">Upcoming Workouts</h2>
        <div className="upcoming-list">
          <div className="upcoming-item">
            <div className="upcoming-date">
              <p className="date-month">Apr</p>
              <p className="date-day">24</p>
            </div>
            <div className="upcoming-details">
              <p className="upcoming-title">Morning Flow</p>
              <p className="upcoming-time">7:00 AM - 7:30 AM</p>
            </div>
            <div className="upcoming-level beginner">Beginner</div>
          </div>

          <div className="upcoming-item">
            <div className="upcoming-date">
              <p className="date-month">Apr</p>
              <p className="date-day">25</p>
            </div>
            <div className="upcoming-details">
              <p className="upcoming-title">Power Yoga</p>
              <p className="upcoming-time">6:00 PM - 6:45 PM</p>
            </div>
            <div className="upcoming-level intermediate">Intermediate</div>
          </div>

          <div className="upcoming-item">
            <div className="upcoming-date">
              <p className="date-month">Apr</p>
              <p className="date-day">27</p>
            </div>
            <div className="upcoming-details">
              <p className="upcoming-title">Flexibility Training</p>
              <p className="upcoming-time">5:30 PM - 6:15 PM</p>
            </div>
            <div className="upcoming-level beginner">Beginner</div>
          </div>
        </div>
      </div>
    </div>
  )
}

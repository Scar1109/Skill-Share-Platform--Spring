import { useState } from "react";
import Sidebar from "../components/sidebar";
import Dashboard from "../components/dashboard";
import ClassDetails from "../components/class-details";
import Profile from "../components/profile";
import Calendar from "../components/calendar";
import AddCourseVideo from "../components/add-course-video";
import "../css/profilepage.css";
import WorkoutPlan from "../components/workoutPlan";

function ProfilePage() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedClass, setSelectedClass] = useState(null);

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setActiveView("classDetails");
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard onClassSelect={handleClassSelect} />;
      case "classDetails":
        return (
          selectedClass && (
            <ClassDetails
              classData={selectedClass}
              onBack={() => setActiveView("dashboard")}
            />
          )
        );
      case "profile":
        return <Profile />;
      case "calendar":
        return <Calendar />;
      case "add-course-video":
        return <AddCourseVideo />;
        case "workout-plan":
        return <WorkoutPlan />;
      default:
        return <Dashboard onClassSelect={handleClassSelect} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">{renderContent()}</div>
      </div>
    </div>
  );
}

export default ProfilePage;

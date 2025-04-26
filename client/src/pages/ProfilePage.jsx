import { useState } from "react";
import Sidebar from "../components/sidebar";
import Dashboard from "../components/dashboard";
import ClassDetails from "../components/class-details";
import Profile from "../components/profile";
import Calendar from "../components/calendar";
import Workouts from "../components/workouts";
import "../css/profilepage.css";

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
        return selectedClass && <ClassDetails classData={selectedClass} onBack={() => setActiveView("dashboard")} />;
      case "profile":
        return <Profile />;
      case "calendar":
        return <Calendar />;
      case "workouts":
        return <Workouts onClassSelect={handleClassSelect} />;
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

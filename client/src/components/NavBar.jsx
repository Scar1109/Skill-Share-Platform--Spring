"use client";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, User, LogOut, Settings, ChevronDown } from "lucide-react";
import "../css/navbar.css"; // Import the navbar CSS

function NavBar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const profileDropdownRef = useRef(null);
    const notificationsRef = useRef(null);

    // Check authentication status when component mounts and when localStorage changes
    useEffect(() => {
        checkAuthStatus();

        // Add event listener for storage changes (in case user logs in/out in another tab)
        window.addEventListener("storage", checkAuthStatus);

        return () => {
            window.removeEventListener("storage", checkAuthStatus);
        };
    }, []);

    // Add scroll and click outside listeners
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        // Close dropdowns when clicking outside
        const handleClickOutside = (event) => {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target)
            ) {
                setIsProfileDropdownOpen(false);
            }
            if (
                notificationsRef.current &&
                !notificationsRef.current.contains(event.target)
            ) {
                setIsNotificationsOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);

        // Load mock notifications if authenticated
        if (isAuthenticated) {
            loadMockNotifications();
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isAuthenticated]);

    const checkAuthStatus = () => {
        // Check if user is authenticated by looking for token in localStorage
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("user");

        console.log("Checking auth status:", { token, userData });

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setIsAuthenticated(true);
                setUser(parsedUser);
                console.log("User is authenticated:", parsedUser);
            } catch (error) {
                console.error("Error parsing user data:", error);
                setIsAuthenticated(false);
                setUser(null);
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
            console.log("User is not authenticated");
        }
    };

    const loadMockNotifications = () => {
        // Mock notifications for demonstration
        const mockNotifications = [
            {
                id: 1,
                title: "New follower",
                message: "John Doe started following you",
                time: "2 minutes ago",
                read: false,
                type: "follow",
            },
            {
                id: 2,
                title: "New comment",
                message: "Sarah commented on your post",
                time: "1 hour ago",
                read: false,
                type: "comment",
            },
            {
                id: 3,
                title: "System update",
                message: "New features have been added",
                time: "1 day ago",
                read: true,
                type: "system",
            },
        ];

        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter((n) => !n.read).length);
    };

    const markAsRead = (id) => {
        setNotifications(
            notifications.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(
            notifications.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
        setUnreadCount(0);
    };

    const handleLogout = () => {
        console.log("Logging out...");
        // Remove auth data from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        // Update state
        setIsAuthenticated(false);
        setUser(null);

        // Close dropdown
        setIsProfileDropdownOpen(false);

        // Redirect to login page
        navigate("/login");
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
        if (isNotificationsOpen) setIsNotificationsOpen(false);
    };

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
    };

    console.log("NavBar render state:", { isAuthenticated, user });

    return (
        <header
            className={`header456 ${isScrolled ? "header-scrolled789" : ""}`}
        >
            <div className="logo-container012">
                <Link to="/" className="logo345">
                    FitShare
                </Link>
            </div>
            <div
                className={`menu-toggle678 ${isMenuOpen ? "active901" : ""}`}
                onClick={toggleMenu}
            >
                <span className="bar234"></span>
                <span className="bar234"></span>
                <span className="bar234"></span>
            </div>
            <nav className={`navigation567 ${isMenuOpen ? "active901" : ""}`}>
                <ul className="nav-list890">
                    <li className="nav-item123">
                        <a href="/" className="nav-link456">
                            Home
                        </a>
                    </li>
                    <li className="nav-item123">
                        <a href="#features" className="nav-link456">
                            Features
                        </a>
                    </li>
                    <li className="nav-item123">
                        <a href="#skills" className="nav-link456">
                            Workouts
                        </a>
                    </li>
                    <li className="nav-item123">
                        <a href="#how-it-works" className="nav-link456">
                            How It Works
                        </a>
                    </li>
                    <li className="nav-item123">
                        <a href="#testimonials" className="nav-link456">
                            Testimonials
                        </a>
                    </li>
                    {isAuthenticated && (
                        <li className="nav-item123">
                            <Link to="/learning-plans" className="nav-link456">
                                Learning Plans
                            </Link>
                        </li>
                    )}
                </ul>

                <div className="auth-buttons789">
                    {isAuthenticated && user ? (
                        <div className="user-profile-container">
                            {/* Notifications Icon */}
                            <div
                                className="notification-icon-wrapper"
                                ref={notificationsRef}
                            >
                                <button
                                    className="notification-button"
                                    onClick={toggleNotifications}
                                    aria-label="Notifications"
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="notification-badge">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {isNotificationsOpen && (
                                    <div className="notifications-dropdown">
                                        <div className="notifications-header">
                                            <h3>Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button
                                                    className="mark-all-read"
                                                    onClick={markAllAsRead}
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <div className="notifications-list">
                                            {notifications.length > 0 ? (
                                                notifications.map(
                                                    (notification) => (
                                                        <div
                                                            key={
                                                                notification.id
                                                            }
                                                            className={`notification-item ${
                                                                !notification.read
                                                                    ? "unread"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                markAsRead(
                                                                    notification.id
                                                                )
                                                            }
                                                        >
                                                            <div className="notification-content">
                                                                <h4>
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </h4>
                                                                <p>
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </p>
                                                                <span className="notification-time">
                                                                    {
                                                                        notification.time
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <div className="no-notifications">
                                                    <p>No notifications yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            <div
                                className="profile-dropdown-container"
                                ref={profileDropdownRef}
                            >
                                <button
                                    className="profile-dropdown-trigger"
                                    onClick={toggleProfileDropdown}
                                    aria-label="User profile"
                                >
                                    <div className="user-avatar">
                                        {user?.profileImageUrl ? (
                                            <img
                                                src={
                                                    user.profileImageUrl ||
                                                    "/placeholder.svg"
                                                }
                                                alt={`${user.firstName}'s avatar`}
                                                className="avatar-image"
                                            />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {user?.firstName?.charAt(0) ||
                                                    "U"}
                                            </div>
                                        )}
                                    </div>
                                    <span className="user-name">
                                        {user?.firstName || "User"}
                                    </span>
                                    <ChevronDown size={16} />
                                </button>

                                {isProfileDropdownOpen && (
                                    <div className="profile-dropdown-menu">
                                        <Link
                                            to="/profile"
                                            className="dropdown-item"
                                            onClick={() =>
                                                setIsProfileDropdownOpen(false)
                                            }
                                        >
                                            <User size={16} />
                                            <span>Profile</span>
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="dropdown-item"
                                            onClick={() =>
                                                setIsProfileDropdownOpen(false)
                                            }
                                        >
                                            <Settings size={16} />
                                            <span>Settings</span>
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button
                                            className="dropdown-item logout-item"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <button
                                className="login-btn012"
                                onClick={() => navigate("/login")}
                            >
                                Log In
                            </button>
                            <button
                                className="signup-btn345"
                                onClick={() => navigate("/register")}
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default NavBar;

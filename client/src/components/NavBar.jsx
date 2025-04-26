import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
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
                            Skills
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
                </ul>
                <div className="auth-buttons789">
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
                </div>
            </nav>
        </header>
    );
}

export default NavBar;

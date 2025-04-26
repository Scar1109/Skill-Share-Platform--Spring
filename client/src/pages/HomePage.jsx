import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../css/home.css";

const HomePage = () => {
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
        <div className="container123">
            {/* Navigation */}
            <header
                className={`header456 ${
                    isScrolled ? "header-scrolled789" : ""
                }`}
            >
                <div className="logo-container012">
                    <h1 className="logo345">FitShare</h1>
                </div>
                <div
                    className={`menu-toggle678 ${
                        isMenuOpen ? "active901" : ""
                    }`}
                    onClick={toggleMenu}
                >
                    <span className="bar234"></span>
                    <span className="bar234"></span>
                    <span className="bar234"></span>
                </div>
                <nav
                    className={`navigation567 ${isMenuOpen ? "active901" : ""}`}
                >
                    <ul className="nav-list890">
                        <li className="nav-item123">
                            <a href="#home" className="nav-link456">
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

            {/* Hero Section */}
            <section className="hero-section678" id="home">
                <div className="hero-content901">
                    <h1 className="hero-title234">
                        Share Your Fitness Skills, Grow Together
                    </h1>
                    <p className="hero-subtitle567">
                        Connect with fitness enthusiasts, share your expertise,
                        and learn new skills from the best in the community.
                    </p>
                    <div className="hero-buttons890">
                        <button className="primary-btn123">Get Started</button>
                        <button className="secondary-btn456">
                            Explore Skills
                        </button>
                    </div>
                </div>
                <div className="hero-image789">
                    {/* This would be an image in production */}
                    <div className="image-placeholder012"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section345" id="features">
                <div className="section-header678">
                    <h2 className="section-title901">Why Choose FitShare?</h2>
                    <p className="section-subtitle234">
                        Our platform offers unique features designed for fitness
                        enthusiasts
                    </p>
                </div>
                <div className="features-grid567">
                    <div className="feature-card890">
                        <div className="feature-icon123">
                            <div className="icon-placeholder456"></div>
                        </div>
                        <h3 className="feature-title789">Skill Exchange</h3>
                        <p className="feature-description012">
                            Trade your expertise with others and learn new
                            techniques without spending money
                        </p>
                    </div>
                    <div className="feature-card890">
                        <div className="feature-icon123">
                            <div className="icon-placeholder456"></div>
                        </div>
                        <h3 className="feature-title789">Community Ratings</h3>
                        <p className="feature-description012">
                            Find the best trainers and classes based on
                            authentic community feedback
                        </p>
                    </div>
                    <div className="feature-card890">
                        <div className="feature-icon123">
                            <div className="icon-placeholder456"></div>
                        </div>
                        <h3 className="feature-title789">
                            Personalized Matching
                        </h3>
                        <p className="feature-description012">
                            Our algorithm connects you with the perfect
                            skill-sharing partners
                        </p>
                    </div>
                    <div className="feature-card890">
                        <div className="feature-icon123">
                            <div className="icon-placeholder456"></div>
                        </div>
                        <h3 className="feature-title789">Progress Tracking</h3>
                        <p className="feature-description012">
                            Monitor your improvement and celebrate milestones
                            with the community
                        </p>
                    </div>
                </div>
            </section>

            {/* Popular Skills Section */}
            <section className="skills-section345" id="skills">
                <div className="section-header678">
                    <h2 className="section-title901">Popular Skills</h2>
                    <p className="section-subtitle234">
                        Discover trending fitness skills being shared in our
                        community
                    </p>
                </div>
                <div className="skills-grid567">
                    <div className="skill-card890">
                        <div className="skill-image123">
                            <div className="image-placeholder456"></div>
                        </div>
                        <div className="skill-content789">
                            <h3 className="skill-title012">
                                Olympic Weightlifting
                            </h3>
                            <p className="skill-description345">
                                Master the snatch and clean & jerk with expert
                                guidance
                            </p>
                            <div className="skill-meta678">
                                <span className="skill-level901">
                                    Intermediate
                                </span>
                                <span className="skill-users234">
                                    128 Users
                                </span>
                            </div>
                            <button className="skill-btn567">Learn More</button>
                        </div>
                    </div>
                    <div className="skill-card890">
                        <div className="skill-image123">
                            <div className="image-placeholder456"></div>
                        </div>
                        <div className="skill-content789">
                            <h3 className="skill-title012">Calisthenics</h3>
                            <p className="skill-description345">
                                Build strength using only your bodyweight with
                                advanced techniques
                            </p>
                            <div className="skill-meta678">
                                <span className="skill-level901">
                                    All Levels
                                </span>
                                <span className="skill-users234">
                                    215 Users
                                </span>
                            </div>
                            <button className="skill-btn567">Learn More</button>
                        </div>
                    </div>
                    <div className="skill-card890">
                        <div className="skill-image123">
                            <div className="image-placeholder456"></div>
                        </div>
                        <div className="skill-content789">
                            <h3 className="skill-title012">
                                Mobility Training
                            </h3>
                            <p className="skill-description345">
                                Improve flexibility and prevent injuries with
                                specialized routines
                            </p>
                            <div className="skill-meta678">
                                <span className="skill-level901">Beginner</span>
                                <span className="skill-users234">
                                    176 Users
                                </span>
                            </div>
                            <button className="skill-btn567">Learn More</button>
                        </div>
                    </div>
                </div>
                <div className="view-all-container890">
                    <button className="view-all-btn123">View All Skills</button>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section456" id="how-it-works">
                <div className="section-header678">
                    <h2 className="section-title901">How It Works</h2>
                    <p className="section-subtitle234">
                        Start sharing your fitness skills in just a few simple
                        steps
                    </p>
                </div>
                <div className="steps-container789">
                    <div className="step-card012">
                        <div className="step-number345">1</div>
                        <h3 className="step-title678">Create Your Profile</h3>
                        <p className="step-description901">
                            Sign up and list the skills you can teach and those
                            you want to learn
                        </p>
                    </div>
                    <div className="step-connector234"></div>
                    <div className="step-card012">
                        <div className="step-number345">2</div>
                        <h3 className="step-title678">Match With Others</h3>
                        <p className="step-description901">
                            Our system will connect you with compatible
                            skill-sharing partners
                        </p>
                    </div>
                    <div className="step-connector234"></div>
                    <div className="step-card012">
                        <div className="step-number345">3</div>
                        <h3 className="step-title678">Schedule Sessions</h3>
                        <p className="step-description901">
                            Arrange in-person or virtual sessions at your
                            convenience
                        </p>
                    </div>
                    <div className="step-connector234"></div>
                    <div className="step-card012">
                        <div className="step-number345">4</div>
                        <h3 className="step-title678">Share & Learn</h3>
                        <p className="step-description901">
                            Exchange knowledge, track progress, and grow
                            together
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section567" id="testimonials">
                <div className="section-header678">
                    <h2 className="section-title901">
                        What Our Community Says
                    </h2>
                    <p className="section-subtitle234">
                        Real experiences from FitShare members
                    </p>
                </div>
                <div className="testimonials-grid890">
                    <div className="testimonial-card123">
                        <div className="testimonial-content456">
                            <p className="testimonial-text789">
                                "I've been able to improve my powerlifting
                                technique dramatically by connecting with a
                                national-level competitor on FitShare. In
                                return, I helped him with his mobility work.
                                It's a win-win!"
                            </p>
                        </div>
                        <div className="testimonial-author012">
                            <div className="author-image345">
                                <div className="image-placeholder456 small678"></div>
                            </div>
                            <div className="author-info901">
                                <h4 className="author-name234">Michael K.</h4>
                                <p className="author-title567">
                                    Fitness Enthusiast
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card123">
                        <div className="testimonial-content456">
                            <p className="testimonial-text789">
                                "As a yoga instructor, I wanted to incorporate
                                more strength training. Through FitShare, I
                                connected with a personal trainer who taught me
                                everything I needed. The community here is
                                incredibly supportive!"
                            </p>
                        </div>
                        <div className="testimonial-author012">
                            <div className="author-image345">
                                <div className="image-placeholder456 small678"></div>
                            </div>
                            <div className="author-info901">
                                <h4 className="author-name234">Sarah L.</h4>
                                <p className="author-title567">
                                    Yoga Instructor
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card123">
                        <div className="testimonial-content456">
                            <p className="testimonial-text789">
                                "I was struggling with my nutrition plan until I
                                met a dietitian on FitShare who helped me create
                                a sustainable approach. In exchange, I taught
                                him Olympic lifting techniques. This platform is
                                revolutionary!"
                            </p>
                        </div>
                        <div className="testimonial-author012">
                            <div className="author-image345">
                                <div className="image-placeholder456 small678"></div>
                            </div>
                            <div className="author-info901">
                                <h4 className="author-name234">David R.</h4>
                                <p className="author-title567">
                                    CrossFit Athlete
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section890">
                <div className="cta-content123">
                    <h2 className="cta-title456">
                        Ready to Share Your Fitness Journey?
                    </h2>
                    <p className="cta-subtitle789">
                        Join our community of fitness enthusiasts today and
                        start exchanging skills
                    </p>
                    <button className="cta-btn012">Join FitShare Now</button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer345">
                <div className="footer-content678">
                    <div className="footer-logo901">
                        <h2 className="logo345">FitShare</h2>
                        <p className="footer-tagline234">
                            Connect. Share. Grow.
                        </p>
                    </div>
                    <div className="footer-links567">
                        <div className="footer-links-column890">
                            <h3 className="footer-links-title123">Platform</h3>
                            <ul className="footer-links-list456">
                                <li>
                                    <a href="#" className="footer-link789">
                                        How it Works
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link789">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link789">
                                        Skills
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link789">
                                        Community
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-links-column890">
                            <h3 className="footer-links-title123">Support</h3>
                            <ul className="footer-links-list456">
                                <li>
                                    <a href="#" className="footer-link789">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link789">
                                        Safety Tips
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link789">
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link789">
                                        FAQs
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-links-column890">
                            <h3 className="footer-links-title123">Legal</h3>
                            <ul className="footer-links-list456">
                                <li>
                                    <a href="#" className="footer-link789">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link789">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link789">
                                        Cookie Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link789">
                                        Guidelines
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-social012">
                        <h3 className="footer-social-title345">
                            Connect With Us
                        </h3>
                        <div className="social-icons678">
                            <a href="#" className="social-icon901"></a>
                            <a href="#" className="social-icon901"></a>
                            <a href="#" className="social-icon901"></a>
                            <a href="#" className="social-icon901"></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom234">
                    <p className="copyright567">
                        © {new Date().getFullYear()} FitShare. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import('../css/login.css');


function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login with:", { email, password, rememberMe })
  }

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log("Login with Google")
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="login-title">Hi, Welcome Back</h1>
        <p className="login-subtitle">Enter your credentials to continue</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              type="email"
              value={email}
              style={{ backgroundColor: "#2D2D2D", color: "white" }}
              onChange={handleEmailChange}
              placeholder="User Name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              style={{ backgroundColor: "#2D2D2D", color: "white" }}
              onChange={handlePasswordChange}
              placeholder="Password"
              className="form-input"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye className="eye-icon" /> : <EyeOff className="eye-icon" />}
            </button>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} className="checkbox" />
              <span className="checkbox-label">Remember me</span>
            </label>
            <a href="#forgot-password" className="forgot-password">
              Forgot Password
            </a>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="signup-option">
          <span>Don't have an account? </span>
          <a href="/register" className="signup-link">
            Sign up
          </a>
        </div>

        <div className="divider">
          <span>Or login with</span>
        </div>

        <div className="social-login">
          <button type="button" className="google-login-button" onClick={handleGoogleLogin}>
            <svg className="google-icon" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span style={{ color: "white" }}>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage


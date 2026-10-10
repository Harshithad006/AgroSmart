import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/languageState";

export default function Login() {
  const navigate = useNavigate();
  const { login, guestLogin } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    guestLogin();
    navigate("/dashboard");
  };

  return (
    <div className="auth-app">
      {/* Dark Overlay */}
      <div className="auth-overlay"></div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="auth-card"
      >
        
        <h1>AgroSmart</h1>
        
        <p className="auth-subtitle">
          {t("AI Powered Smart Agriculture Platform")}
        </p>

        <form onSubmit={handleLogin}>
          {/* Email Box */}
          <div className="auth-input-box">
            <Mail size={22} />
            <input
              type="email"
              placeholder={t("Email Address")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Box */}
          <div className="auth-input-box">
            <Lock size={22} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("Password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="auth-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </span>
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-login-btn" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                {mode === "login" ? t("Signing in...") : t("Signing up...")}
              </span>
            ) : (
              mode === "login" ? t("Login") : t("Sign Up")
            )}
          </button>
        </form>

        {/* Mode Toggle Link */}
        <p className="auth-mode-toggle">
          {mode === "login" ? t("Don't have an account?") : t("Already have an account?")}
          <span onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? t("Sign Up") : t("Login")}
          </span>
        </p>

        {/* Divider */}
        <div className="auth-divider">
          <span>{t("OR")}</span>
        </div>

        {/* Guest Login Button */}
        <button type="button" className="auth-google-btn" onClick={handleGuest}>
          {t("Continue as Guest")}
        </button>

        {/* Footer */}
        <p className="auth-footer">
          🚁 {t("Smart Farming • AI • IoT • Drone Monitoring")}
        </p>
      </motion.div>

      {/* Full-Screen Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="text-center text-white z-30">
              <Loader2 className="mx-auto mb-4 animate-spin" size={48} />
              <p className="font-semibold">{t("Entering your farm dashboard...")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

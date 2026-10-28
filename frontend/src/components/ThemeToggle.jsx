import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
    >
      <span className="theme-toggle-icon" aria-hidden="true">{isDark ? "☾" : "☀"}</span>
      <span className="theme-toggle-label">{isDark ? "Dark" : "Light"}</span>
      <span className={`theme-switch ${isDark ? "is-dark" : ""}`} aria-hidden="true"><span /></span>
    </button>
  );
}

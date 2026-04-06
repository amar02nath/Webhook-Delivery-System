import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button
      className={styles.toggleBtn}
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === "light" ? (
        <Moon className={styles.icon} size={20} />
      ) : (
        <Sun className={styles.icon} size={20} />
      )}
    </button>
  );
};

export default ThemeToggle;

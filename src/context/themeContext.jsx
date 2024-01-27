// useDarkMode.js
import { useEffect, useState } from "react";

const useDarkMode = () => {
  const [currentTheme, setCurrentTheme] = useState("");

  useEffect(() => {
    const applyTheme = (theme) => {
      document.documentElement.classList.add(theme);
      localStorage.theme = theme;
      setCurrentTheme(theme);
    };

    const removeTheme = () => {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("theme");
      setCurrentTheme("");
    };

    const handleMediaQuery = (event) => {
      if (event.matches) {
        applyTheme("dark");
      } else {
        removeTheme();
      }
    };

    const initialTheme =
      localStorage.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    applyTheme(initialTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addListener(handleMediaQuery);

    return () => {
      mediaQuery.removeListener(handleMediaQuery);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    document.documentElement.classList.toggle("dark");
    localStorage.theme = newTheme;
    setCurrentTheme(newTheme);
    // console.log("Current Theme:", newTheme);
  };

  return { currentTheme, toggleTheme };
};

export default useDarkMode;

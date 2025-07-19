import React, {
  createContext,
  FC,
  useContext,
  useState,
  useEffect,
} from "react";

interface IThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeState | undefined>(undefined);

export const ThemeState = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("themeContext must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return savedTheme as "light" | "dark";
    }
    return "light"; // Default theme for SSR
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

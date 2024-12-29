import { useState, useEffect } from "react";

const ThemeToggle = () => {
	const [theme, setTheme] = useState(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme) {
			return savedTheme;
		}
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		return prefersDark ? "dark" : "light";
	});

	useEffect(() => {
		const root = document.documentElement;
		if (theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
	};

	return (
		<button onClick={toggleTheme}>
			{theme === "dark" ? "🌞" : "🌜"}
		</button>
	);
};

export default ThemeToggle;

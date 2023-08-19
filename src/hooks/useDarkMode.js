import { useEffect, useState } from "react";

export default function useDarkMode() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const colorTheme = 'light';
    
    useEffect(()=>{
        const root = window.document.documentElement;

        root.classList.remove(colorTheme);

        localStorage.setItem('theme', theme);
        root.classList.add(theme);
    },[colorTheme, theme]);

    return [colorTheme, setTheme];
}
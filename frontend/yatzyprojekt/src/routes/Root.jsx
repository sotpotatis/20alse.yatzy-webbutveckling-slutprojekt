/* Root.jsx
Renderar saker som finns på alla sidor. */
import { Outlet } from "react-router-dom"
import { useState } from "react"
import { useCookies } from "react-cookie";
import SettingsButton from "../components/Settings/SettingsButton";
export default function Root() {
    // Hämta typsnitt och tema (inställningsbart av användaren)
    const [cookies, setCookies] = useCookies(["selectedTheme", "selectedFont"])
    // Ställ in defaults om cookisarna inte ställts in
    let selectedFont = cookies.selectedFont
    let selectedTheme = cookies.selectedTheme
    // Sätt cookies om de inte redan är inställda
    if (!selectedFont) {
        selectedFont = "main"
        setCookies("selectedFont", selectedFont)
    }
    if (!selectedTheme) {
        // Kolla vad användarens webbläsare föredrar först.
        const userPrefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        selectedTheme = userPrefersDarkMode ? "dark": "light"
        setCookies("selectedTheme", selectedTheme)
    }
    // Skapa en lista med klasser som ska appliceras för tema och typsnitt
    const themeClass = selectedTheme === "dark" ? "dark" : ""
    const fontClass = selectedFont === "main" ? "font-main" : "font-dyslexic"
    return <main
        className={`${[themeClass, fontClass].join(" ")} h-screen w-screen max-h-full max-w-full bg-background`}
    >
        <Outlet />
        <SettingsButton/>
    </main>
}
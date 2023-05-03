/* Root.jsx
Renderar saker som finns på alla sidor.
En "layout"-komponent kan man kalla det! */
import { Outlet } from "react-router-dom"
import { useCookies } from "react-cookie";
import SettingsButton from "../components/Settings/SettingsButton";
import {useEffect} from "react";
import {Helmet} from "react-helmet";
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
        <Helmet>
            <title>20alse's Yatzy!</title>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#6b7280"/>
            <meta name="msapplication-TileColor" content="#2b5797"/>
            <meta name="theme-color" content="#ffffff"/>
        </Helmet>
        <Outlet />
        <SettingsButton/>
    </main>
}
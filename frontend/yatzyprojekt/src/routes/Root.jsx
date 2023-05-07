/* Root.jsx
Renderar saker som finns på alla sidor.
En "layout"-komponent kan man kalla det! */
import { Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import SettingsButton from "../components/Settings/SettingsButton";
import { useEffect } from "react";
export default function Root() {
  // Hämta typsnitt och tema (inställningsbart av användaren)
  const [cookies, setCookies] = useCookies(["selectedTheme", "selectedFont"]);
  // Ställ in defaults om cookisarna inte ställts in
  let selectedFont = cookies.selectedFont;
  let selectedTheme = cookies.selectedTheme;
  // Sätt cookies om de inte redan är inställda
  if (!selectedFont) {
    selectedFont = "main";
    setCookies("selectedFont", selectedFont);
  }
  if (!selectedTheme) {
    // Kolla vad användarens webbläsare föredrar först.
    const userPrefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    selectedTheme = userPrefersDarkMode ? "dark" : "light";
    setCookies("selectedTheme", selectedTheme);
  }
  // Skapa en lista med klasser som ska appliceras för tema och typsnitt
  const themeClass = selectedTheme === "dark" ? "dark" : "";
  const fontClass = selectedFont === "main" ? "font-main" : "font-dyslexic";
  return (
    <main
      className={`${[themeClass, fontClass].join(
        " "
      )} bg-background min-h-screen`}
    >
      <Outlet />
      <SettingsButton />
    </main>
  );
}

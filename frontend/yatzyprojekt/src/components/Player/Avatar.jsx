/* Avatar.jsx
För att generera avatarer för användare använder jag mig av en extern hemsida.
Den accepterar ett namn och genererar sedan en unik avatar för det namnet. Supersmart! */
export default function Avatar({ playerName, widthClass, heightClass }) {
    // Generera länken som ska användas för avataren. Den är lång för att jag har anpassat den för att ge avatarer
    // som matchar med spelets färgtema och vibbar (inga ledsna avatarer genereras!)
    const avatarURL = `https://api.dicebear.com/6.x/avataaars/svg?seed=${playerName}&mouth=smile,default,tongue,twinkle,grimace&backgroundColor=06b6d4,0d9488,059669,be123c&eyes=default,eyeRoll,happy,hearts,side,squint,wink,winkWacky,closed`
    return <img src={avatarURL} alt={`Avatar för spelaren ${playerName}`} className={`rounded-full ${widthClass} ${heightClass}`
}/>
}
Avatar.defaultProps = {
    widthClass: "w-16",
    heightClass: "h-16"
}
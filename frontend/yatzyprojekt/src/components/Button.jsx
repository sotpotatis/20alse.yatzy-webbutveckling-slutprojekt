/* Button.jsx
Filnamnet säger det mesta! En knapp. Som man kan klicka på.
Med stöd för lite olika färger och annat gott! */
import {Icon} from "@iconify/react"
const colors = { // Definera färgerna på ram och bakgrund för olika knappar
    blue: "border-blue-700 bg-blue-600 text-black",
    lightBlue: "border-blue-300 bg-sky-400 text-black",
    green: "border-green-400 bg-green-500 text-black",
    lightGreen: "border-green-400 bg-emerald-400 text-black",
    gray: "border-gray-400 bg-slate-400 text-black",
    lightGray: "border-gray-200 bg-slate-200 text-black",
    link: "text-gray-500 hover:underline border-black",
    red: "border-red-300 bg-red-400 text-black",
}
export default function Button({ text, onClick, color, additionalClasses, icon, type, disabled, title, circle }) {
    const colorClassesToApply = colors[color]
    let otherClassesToApply = ""
    if (icon !== null) {
        icon = <Icon icon={icon} /> // Valfri ikon
        otherClassesToApply += "flex flex-row items-center gap-2"
    }
    if (disabled) {
        otherClassesToApply += " hover:cursor-not-allowed"
    }
    // Lägg till klass för antingen om knappen ska vara i formen av en cirkel eller "vanligt" avrundad
    otherClassesToApply += circle ? " rounded-full" :  " rounded-md"
    return <button type={type} disabled={disabled} title={title}  onClick={onClick} className={`font-semibold border-2 px-3 py-3 hover:cursor-pointer disabled:opacity-50 ${colorClassesToApply} ${additionalClasses} ${otherClassesToApply}`}>
        {icon}        
        {text}
    </button>
}
Button.defaultProps = {
    color: "blue",
    type: "button",
    icon: null,
    additionalClasses: "",
    disabled: false,
    title: null,
    textVisible: false
}
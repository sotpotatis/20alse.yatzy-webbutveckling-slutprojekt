/* Button.jsx
Filnamnet säger det mesta! En knapp. Som man kan klicka på.
Med stöd för lite olika färger och annat gott! */
import {Icon} from "@iconify/react"
const colors = { // Definera färgerna på ram och bakgrund för olika knappar
    blue: "border-blue-400 bg-blue-500 text-white",
    lightBlue: "border-blue-300 bg-sky-400 text-white",
    green: "border-green-400 bg-green-500 text-white",
    lightGreen: "border-green-400 bg-emerald-400 text-white",
    link: "text-gray-400 hover:underline border-none"
}
export default function Button(props) {
    const text = props.text
    const onClick = props.onClick
    const colorClassesToApply = colors[props.color]
    let additionalClasses = props.additionalClasses !== undefined ? props.additionalClasses : "" // Valfria externa klasser
    let icon = null
    if (props.icon !== undefined) {
        icon = <Icon icon={props.icon} /> // Valfri ikon
        additionalClasses += " flex flex-row items-center gap-2"
    }
    
    return <button onClick={onClick} className={`${colorClassesToApply} ${additionalClasses} font-bold border-2 rounded-sm px-3 py-1 hover:cursor-pointer`}>
        {icon}        
        {text}
    </button>
}
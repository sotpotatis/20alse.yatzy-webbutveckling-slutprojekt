/* Badge.jsx
Ett "badge"-liknande element, liknande det Bootstrap kallar en badge. */
// Mappings: färgnamn --> färgklasser
const colorMappings = {
    "blue": "bg-sky-400 text-black",
    "green": "bg-green-400 text-black",
    "red": "bg-red-400 text-white",
    "gray": "bg-gray-400 text-black",
}
export default function Badge({ color, text, additionalClasses, onClick}) {
    return <div className={`px-1 py-3 font-bold rounded-lg px-3 ${colorMappings[color]}` + (additionalClasses !== null ? ` ${additionalClasses}`: "")} onClick={onClick}>
        <p>{text}</p>
    </div>
}
Badge.defaultProps = {
    color: "blue",
    additionalClasses: null,
    onClick: null
}
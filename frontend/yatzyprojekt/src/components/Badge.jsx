/* Badge.jsx
Ett "badge"-liknande element, liknande det Bootstrap kallar en badge. */
// Mappings: färgnamn --> färgklasser
const colorMappings = {
    "blue": "bg-sky-400 text-white",
    "green": "bg-green-400 text-white"
}
export default function Badge({ color, text, additionalClasses}) {
    return <div className={`px-1 py-3 font-bold rounded-lg px-3 ${colorMappings[color]}` + (additionalClasses !== null ? additionalClasses: "")}>
        <p>{text}</p>
    </div>
}
Badge.defaultProps = {
    color: "blue",
    additionalClasses: null
}
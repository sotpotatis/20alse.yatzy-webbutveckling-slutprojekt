/* Badge.jsx
Ett "badge"-liknande element, liknande det Bootstrap kallar en badge. */
// Mappings: färgnamn --> färgklasser
const colorMappings = {
    "blue": "bg-turqoise-200 text-white"
}
export default function Badge({ color, text }) {
    return <div className={`px-1 py-3 rounded-md font-bold ${colorMappings[color]}`}>
        <p>{text}</p>
    </div>
}
/* Heading.jsx
Eftersom Tailwind inte har olika storlekar för olika rubriker så gör jag en komponent
som har koll på det. */
const sizeClasses = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: ""
}
export default function Heading(props) {
    const sizeClass = props.size
    return <p>TODO</p>
}
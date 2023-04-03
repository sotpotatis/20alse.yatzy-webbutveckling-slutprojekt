/* Heading.jsx
Eftersom Tailwind inte har olika storlekar för olika rubriker så gör jag en komponent
som har koll på det. */
import React from "react";
const sizeClasses = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: ""
}
const commonClasses = "font-bold"
export default function Heading({size, children}) {
    const sizeClass = sizeClasses[size]
    return React.createElement( // Skapa ett element som matchar med den storlek som vi har valt
        `h${size}`,
        {
            className: sizeClass + " " + commonClasses
        },
        children
    )
}
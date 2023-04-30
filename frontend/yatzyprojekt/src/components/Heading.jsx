/* Heading.jsx
Eftersom Tailwind inte har olika storlekar för olika rubriker så gör jag en komponent
som har koll på det. */
import React from "react";
import { Children } from "react";
import { Icon } from "@iconify/react";
const sizeClasses = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: ""
}
const commonClasses = "font-bold"
export default function Heading({size, children, icon}) {
    let headingClasses = sizeClasses[size]
    let childrenElements = Children.toArray(children)
    // Lägg till en ikon om den är definierad.
    if (icon) {
        childrenElements.splice(0, 0, <Icon icon={icon}/>) // Lägg till en ikon som första element.
        // Dessa klasser krävs för att hålla ikon och text på samma rad
        headingClasses += " flex flex-row"
    }
    return React.createElement( // Skapa ett element som matchar med den storlek som vi har valt
        `h${size}`,
        {
            className: headingClasses + " " + commonClasses
        },
        childrenElements
    )
}
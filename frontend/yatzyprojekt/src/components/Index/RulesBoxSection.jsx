/* RulesBoxSection.jsx
Regelboxen är indelad i olika sektioner så man inte blir presenterad med en vägg av text när man använder sidan.
Dessa sektioner är uppdelade i komponenter. */
import {useState} from "react";
import Heading from "../Heading.jsx";
import {Icon} from "@iconify/react";
import {runOnEnterPress} from "../../lib/utils.js";

export default function RulesBoxSection({title, icon, children}){
    const [isCollapsed, setCollapsed] = useState(true) // Göm innehåll som standard
    const onInteract = ()=>{setCollapsed(!isCollapsed)} // Skapa en funktion när elementet iterageras med
    let allElementsToRender = [
        <div key={`${title}-heading`} className="grid grid-cols-2">
            <Heading level={2} size={3} icon={icon}>
        {title}
        </Heading>
    <Icon icon={!isCollapsed ? "mdi:chevron-down": "mdi:chevron-up"} className="text-4xl text-gray-400 hover:text-gray-500 hover:cursor-pointer justify-self-end"
    onClick={onInteract} onKeyDown={(event)=>{runOnEnterPress(event, onInteract)}} tabIndex="0"/>
        </div>,
    <hr className="border-2 w-full" />,
        ...[
        !isCollapsed ? children: [] // Lägg till övriga element om innehållet är expanderat
        ]
    ]
    return allElementsToRender
}
/* Container.jsx
En Container är ett element som i form av en vit box som kan ha olika höjd och bredd.
Den får innehåll att "stå ut" från resterande saker på sidan. */
import { Icon } from "@iconify/react"
import Heading from "./Heading"
import CloseButton from "./CloseButton.jsx";
export default function Container({title, children, classes, align, icon,
                                  closeButton, onClose, width, height}) {
    // Klasser som ska appliceras på rotelementet
    let additionalClasses = classes !== undefined ? classes.join(" ") + " " : ""
    // Man kan ställa in om man vill aligna innehåll på något sätt.
    if (align === "center"){
        additionalClasses += "text-center items-center"
    }
    // Skapa titelelementet. Om vi har en stängingsknapp aktiverad (via propen closeButton),
    // lägg till den
    if (closeButton){
        title = <span className="min-w-full flex flex-row justify-between">
            {title}
            <CloseButton onClose={onClose} className="ml-auto"/>
        </span>
    }
    let titleElement = <Heading size={2} level={1} icon={icon}>{title}</Heading>
    // Lägg in ikon om en sådan finns
    return <div className={`flex flex-col shrink-0 bg-white max-w-full max-h-full ${width} ${height} overflow-scroll border-gray-200 border-2 rounded-lg ${additionalClasses}`}>
        <div className={"sticky top-0 bg-white w-full p-12 pb-0"} key="container-title">
        {titleElement}
        <hr className="w-full border-gray-300 mt-4"/>
        </div>
        <div key="container-children" className="flex flex-col p-12 gap-y-4 justify-center items-center">
          {children}
        </div>
    </div>
}
Container.defaultProps = {
    align: "center",
    icon: null,
    closeButton: false,
    onClose: null,
    width: "w-auto",
    height: "h-auto"
}
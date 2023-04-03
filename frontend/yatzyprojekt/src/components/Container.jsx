/* Container.jsx
En Container är ett element som i form av en vit box som kan ha olika höjd och bredd.
Den får innehåll att "stå ut" från resterande saker på sidan. */
import Heading from "./Heading"
export default function Container({title, children, classes, align}) {
    // Klasser som ska appliceras på rotelementet
    let additionalClasses = classes !== undefined ? classes.join(" ") : ""
    // Man kan ställa in om man vill aligna innehåll på något sätt.
    if (align === "center"){
        additionalClasses += "text-center items-center justify-evenly"
    }
    return <div className={`${additionalClasses} flex flex-col w-1/4 h-1/4 bg-white p-12 gap-y-2 border-gray-200 border-2 rounded-lg`}>
        <Heading size={2}>{title}</Heading>
        <hr className="w-full border-gray-300" />
        {children}
    </div>
}
Container.defaultProps = {
    align: "center"
}
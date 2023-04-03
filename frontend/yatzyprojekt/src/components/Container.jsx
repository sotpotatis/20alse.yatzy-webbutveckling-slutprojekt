/* Container.jsx
En Container är ett element som i form av en vit box som kan ha olika höjd och bredd.
Den får innehåll att "stå ut" från resterande saker på sidan. */
export default function Container(props) {
    const title = props.title // Titeln som containern ska ha
    const children = props.children // Element som ska renderas inuti containern
    // Klasser som ska appliceras på rotelementet
    const additionalClasses = props.classes !== undefined ? props.classes.join(" ") : ""
    return <div className={`${additionalClasses} bg-white p-5 border-gray-200 border-2 rounded-lg`}>
        <h2>{title}</h2>
        <hr className="w-full border-gray-300" />
        {children}
    </div>
}
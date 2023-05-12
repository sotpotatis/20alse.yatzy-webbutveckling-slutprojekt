/* TextBanner.jsx
En liten banner som visar en text.
Denna komponent är just nu oanvänd. */
export default function TextBanner({title, message, index}){
    return <div className="flex flex-row bg-gray-200 rounded-lg p-3 border-2 border-gray-700 text-black" key={`text-banner-${index}`}>
        <div key={`text-banner-${index}content`}>
            <h2 className="text-xl font-bold">{title}</h2>
            <p>{message}</p>
        </div>
    </div>
}
TextBanner.defaultProps = {
    index: 1
}
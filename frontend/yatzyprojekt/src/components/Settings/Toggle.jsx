/* Toggle.jsx
En "toggle"-liknande inställning.
 */
export default function Toggle({ onSet, value }) {
    const isChecked = value === true
    return <div className={`rounded-full text-white border-2 hover:cursor-pointer px-3 ` + (isChecked ? `text-right bg-green-400 text-white` : `bg-gray-800`)} role="button" aria-label="Checkbox"
        onClick={() => {
        onSet(!value)
    }}>
        <p className={`w-12 text-2xl p-0 m-0`}>&#9679;</p>
    </div>
}
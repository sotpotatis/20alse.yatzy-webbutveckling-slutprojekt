/* InputField.js
En stylad input med en label. */
export default function InputField(props) {
    const type = props.type // Inputelementets typattribut
    const value = props.value // Värdet på elementet
    const placeholder = props.placeholder || "" // En placeholder (om någon)
    const label = props.label // Beskrivande text till inputelementet
    const id = props.id // Ett ID som elementet ska ha.
    const onChange = props.onChange
    return [
        <label className="font-bold mr-3" for={`${id}`}>{label}</label>,
        <input className="px-3 py-1 rounded-lg border-2 border-gray-800 " value={value} type={type} placeholder={placeholder} onChange={onChange} />
    ]
}
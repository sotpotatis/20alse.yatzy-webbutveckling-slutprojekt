export default function Toggle({onSet, value}){
    const isChecked = value === true
    return <div className={`rounded-full text-white border-2 hover:cursor-pointer ` + isChecked ? `text-right bg-green-400 text-white` : `bg-gray-800`} role="button"
        onClick={() => {
        onSet(!value)
    }}>
        <p className={`w-24 px-3`}>&#9679;</p>
    </div>
}
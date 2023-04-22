export default function Toggle({onSet, value}){
    const isChecked = value === true
    return <div className={`rounded-full w-32 text-white ` + isChecked ? `bg-green-600`: `bg-gray-800`}>
        <p className="">O</p>
    </div>
}
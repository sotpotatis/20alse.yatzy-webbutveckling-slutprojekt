import Toggle from "./Toggle";

export default function Setting({type, title,value, setter, }){
    let settingElement = null
    if (type === "toggle"){
        settingElement = <Toggle value={value} onSet={setter}/>
    }
    return <div className="flex flex-row">
        <p className="text-gray-200">{title}</p>
        {settingElement}
    </div>
}
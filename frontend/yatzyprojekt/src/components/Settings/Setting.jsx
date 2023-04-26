/* Setting.jsx 
Renderar en inställning i inställningsmenyn. Innehåller en titel
och renderar en inställning med en "value" och en "setter", dvs. inställningens
värde och en funktion sopm kallas när den uppdateras. Beroende på vilket typ av
inställning så skiljer sig argumentet till denna. Just nu är bara toggle implementerat. */
import Toggle from "./Toggle";

export default function Setting({type, title,value, setter}){
    let settingElement = null
    if (type === "toggle"){
        settingElement = <Toggle value={value} onSet={setter}/>
    }
    return <div className="flex flex-row gap-x-3 py-3">
        <p className="text-gray-400">{title}</p>
        {settingElement}
    </div>
}
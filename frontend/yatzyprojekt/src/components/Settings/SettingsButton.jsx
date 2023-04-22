import {useState} from "react";
import {Icon} from "@iconify/react";
import SettingsMenu from "./SettingsMenu";
export default function SettingsButton(props){
    const [menuExpanded, setMenuExpanded] = useState(false)
    let children = [<Icon icon="material-symbols:settings"/> ]
    if (menuExpanded){
        children.push(<SettingsMenu/>)
    }
    return <div key="settingsButton" role={"button"} className="absolute static text-white bg-blue-400 max-w-min right-0 bottom-0 p-4 m-12 rounded-full text-3xl" onClick={()=>{setMenuExpanded(!menuExpanded)}}>
        {children}
    </div>
}
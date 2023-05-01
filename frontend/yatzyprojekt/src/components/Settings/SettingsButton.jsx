/* SettingsButton.jsx
* En knapp längst ner i vänstra hörnet för några inställningar relaterade till sidan.
*/
import { useState } from "react";
import {Icon} from "@iconify/react";
import SettingsMenu from "./SettingsMenu";
import Setting from "./Setting";
import { useCookies } from "react-cookie";
export default function SettingsButton(props){
    const [menuExpanded, setMenuExpanded] = useState(false)
    // Hämta cookies relaterade till font
    const [cookies, setCookies] = useCookies(["selectedTheme", "selectedFont"])
    let children = [<div key="settingsButton" role={"button"} className="absolute static text-white bg-blue-400 shadow-lg max-w-min right-0 bottom-0 p-4 m-12 rounded-full text-3xl z-30"
        onClick={() => { setMenuExpanded(!menuExpanded) }}>
        <Icon icon="material-symbols:settings"/>
    </div>]
    if (menuExpanded){
        children.push(<SettingsMenu
            settings={ 
                [
                    <Setting type="toggle"
                        title="Dyslexi-font"
                        value={ 
                            cookies.selectedFont === "dyslexic"
                        }
                        setter={ 
                            (isToggled) => { // Sätt font baserat på värde.
                                setCookies("selectedFont", isToggled ? "dyslexic" : "main")
                            }
                        } />
                ]
            } />)
    }
    return children
}
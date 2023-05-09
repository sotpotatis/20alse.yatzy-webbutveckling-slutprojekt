/* SettingsButton.jsx
 * En knapp längst ner i vänstra hörnet för några inställningar relaterade till sidan.
 */
import { useState } from "react";
import { Icon } from "@iconify/react";
import SettingsMenu from "./SettingsMenu";
import Setting from "./Setting";
import { useCookies } from "react-cookie";
export default function SettingsButton(props) {
  const [menuExpanded, setMenuExpanded] = useState(false);
  // Hämta cookies relaterade till font
  const [cookies, setCookies] = useCookies(["selectedTheme", "selectedFont"]);
  // Rendera två olika inställningsknappar beroende på om vi har mobil eller dator.
  const onSettingsButtonClick = () => {
    setMenuExpanded(!menuExpanded);
  };
  let children = [
    <div
      key="settingsButtonComputer"
      role={"button"}
      className="absolute invisible md:visible text-white bg-blue-400 shadow-lg max-w-min right-0 bottom-0 p-4 m-12 rounded-full text-3xl z-30"
      aria-label="Inställningsknapp"
      onClick={onSettingsButtonClick}
    >
      <Icon icon="material-symbols:settings" />
    </div>,
    <div
      key="settingButtonMobile"
      role="button"
      className="absolute top-0 grid-cols-1 w-full"
      aria-label="Inställningsknapp"
      onClick={onSettingsButtonClick}
    >
      <div className="flex flex-row gap-x-2 w-min text-sm mx-auto text-black md:hidden bg-blue-400 p-2 rounded-full">
        <Icon icon="material-symbols:settings" />
        <p>Inställningar</p>
      </div>
    </div>,
  ];
  if (menuExpanded) {
    children.push(
      <SettingsMenu
        settings={[
          <Setting
            type="toggle"
            title="Dyslexi-font"
            value={cookies.selectedFont === "dyslexic"}
            setter={(isToggled) => {
              // Sätt font baserat på värde.
              setCookies("selectedFont", isToggled ? "dyslexic" : "main");
            }}
          />,
        ]}
      />
    );
  }
  return children;
}

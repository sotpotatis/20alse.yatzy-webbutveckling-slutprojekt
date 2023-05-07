/* SettingsMenu.jsx
Om man klickar på knappen SettingsButton.jsx så vill vi visa en meny. Den renderas här.
*/
import Heading from "../Heading";

export default function SettingsMenu({ settings }) {
  return (
    <div className="z-20 absolute static right-2 bottom-2 md:right-24 md:bottom-24 bg-white border-2 border-gray-300 p-3 rounded-lg">
      <Heading size={3} className="text-gray-400">
        Inställningar
      </Heading>
      <hr className="w-full border-2 border-gray-300" />
      {settings}
    </div>
  );
}

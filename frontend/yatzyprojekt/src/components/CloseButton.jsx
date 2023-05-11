/* CloseButton.jsx
 * En "stängningsknapp" för diverse tillfällen. */
import { Icon } from "@iconify/react";
import { runOnEnterPress } from "../lib/utils.js";
export default function CloseButton({ onClose }) {
  return (
    <Icon
      icon="material-symbols:close"
      className="text-gray-400 hover:cursor-pointer hover:text-gray-500"
      onClick={onClose}
      role="button"
      tabIndex="1"
      onKeyDown={(event) => {
        // Aktivera för att undvika keyboard traps.
        runOnEnterPress(event, onClose);
      }}
    />
  );
}

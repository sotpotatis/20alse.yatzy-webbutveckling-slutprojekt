/* CloseButton.jsx
 * En "stängningsknapp" för diverse tillfällen. */
import { Icon } from "@iconify/react";
export default function CloseButton({ onClose }) {
  return (
    <Icon
      icon="material-symbols:close"
      className="text-gray-300 hover:cursor-pointer hover:text-gray-400"
      onClick={onClose}
      role="button"
    />
  );
}

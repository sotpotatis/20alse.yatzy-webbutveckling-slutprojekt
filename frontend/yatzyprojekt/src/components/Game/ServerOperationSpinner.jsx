/* ServerOperationSpinner.jsx
En spinner som visas när servern kontaktas eller en sak utförs. */
import { Icon } from "@iconify/react";
export default function ServerOperationSpinner({ message }) {
  return (
    <div className="absolute left-0 bottom-0 m-3 z-60 px-3 py-1 items-center flex flex-row text-bold border-2 border-gray-200 rounded-full bg-white">
      <Icon
        icon="material-symbols:circle"
        className="animate-ping text-blue-800 pr-1"
      />
      <span className="text-black">{message}</span>
    </div>
  );
}
ServerOperationSpinner.defaultProps = {
  message: "Kontaktar server...",
};

/* LoadingSpinner.jsx
En laddningsskärm. */
import { Icon } from "@iconify/react";
export default function LoadingSpinner({ fullPage, text }) {
  const textElement =
    text !== null ? (
      <>
        <p className="pt-3">{text}</p>
      </>
    ) : null;
  const loadingIcon = (
    <p className="text-white">
      <Icon icon="eos-icons:loading" className="text-7xl w-full" />
      {textElement}
    </p>
  );
  if (fullPage) {
    // fullPage-propen kan användas för att få en laddningsskärm som tar upp hela skärmen
    return (
      <div className="w-full h-screen flex justify-center items-center text-center">
        {loadingIcon}
      </div>
    );
  } else {
    return loadingIcon;
  }
}
LoadingSpinner.defaultProps = {
  text: null,
};

import Button from "../Button";

/* ScoreboardExpandButton.jsx
En expanderingsknapp för poängvisaren */
export default function ScoreboardExpandButton({ isCollapsed, setCollapsed }) {
  // Avgör vilken ikon som ska visas
  const iconName = !isCollapsed
    ? "ic:baseline-keyboard-arrow-left"
    : "ic:baseline-keyboard-arrow-right";
  return (
    <Button
      text=""
      screenReaderText={
        isCollapsed ? "Öppna poäng- och spelarvy" : "Stäng poäng- och spelarvy."
      }
      color="gray"
      icon={iconName}
      additionalClasses="invisible md:visible absolute right-0 top-1/2 z-30 border-2 border-gray-800 w-min h-min text-2xl rounded-r-none shadow-sm"
      circle={true}
      onClick={() => {
        setCollapsed(!isCollapsed);
      }}
    />
  );
}

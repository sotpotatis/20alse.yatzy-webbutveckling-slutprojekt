/* LobbyHeading.jsx
En rubrik när man väntar på ett spel som innehåller information om hur man kan få andra att ansluta. */
import Heading from "../../Heading";
import { copyTextToClipboard } from "../../../lib/utils.js";
import { useEffect, useState } from "react";

export default function LobbyHeading({ baseURL, gameCode }) {
  const [linkCopiedToClipboard, setlinkCopiedToClipboard] = useState(false);
  const [gameCodeCopiedToClipboard, setgameCodeCopiedToClipboard] =
    useState(false);
  const lobbyURL = `${baseURL.trim("/")}/lobby`;
  // Skapa en laddningsanimation när man läser in
  const [numberOfDots, setNumberOfDots] = useState(0);
  const updateNumberOfDots = () => {
    if (numberOfDots < 3) {
      setNumberOfDots(numberOfDots + 1);
    } else {
      setNumberOfDots(0);
    }
  };
  let children = [
    <Heading size={1}>Väntar på spelare{`.`.repeat(numberOfDots)}</Heading>,
    <p>Låt dina kompisar gå med i spelet genom att skicka följande länk:</p>,
    <p
      className="select-all px-3 py-1 rounded-full bg-gray-700 w-auto hover:cursor-pointer"
      onClick={() => {
        copyTextToClipboard(lobbyURL, (textCopied) => {
          setlinkCopiedToClipboard(textCopied);
        });
      }}
    >
      {lobbyURL}
    </p>,
    <p>Ange kod:</p>,
    <p
      className="select-all px-3 py-1 text-xl rounded-full bg-gray-700 w-min font-bold hover:cursor-pointer"
      onClick={() => {
        copyTextToClipboard(gameCode, (textCopied) => {
          setgameCodeCopiedToClipboard(textCopied);
        });
      }}
    >
      {gameCode}
    </p>,
  ];
  useEffect(() => {
    setTimeout(updateNumberOfDots, 750);
  });
  // Visa ett meddelande om spelkoden för spelet kopierats till klippbordet
  if (gameCodeCopiedToClipboard) {
    children.push(
      <p className="text-blue-200 text-sm">Kopierad till urklipp!</p>
    );
  }
  // Visa ett meddelande om länk för spelet kopierats till klippbordet
  if (linkCopiedToClipboard) {
    children.splice(
      3,
      0,
      <p className="text-blue-200 text-sm">Kopierad till urklipp!</p>
    );
  }
  return (
    <div className="text-white" key="gameLobbyHeading">
      {children}
    </div>
  );
}

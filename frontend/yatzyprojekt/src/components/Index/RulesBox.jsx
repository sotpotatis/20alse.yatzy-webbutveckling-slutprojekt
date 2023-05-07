/* RulesBox.jsx
Visar en "regelbox" med information om regler.*/
import { possibleDiceStates } from "20alse-yatzy-shared-code";
import Heading from "../Heading";
import Container from "../Container.jsx";
export default function RulesBox({ onClose }) {
  // Skapa text för varje kombination
  let combinationElements = [];
  for (const combination of Object.values(possibleDiceStates)) {
    combinationElements.push(
      <li>
        <b>{combination.information.name}:</b>{" "}
        {combination.information.description}
      </li>
    );
  }
  const children = [
    <Heading level={2} size={3} icon="mingcute:video-fill">
      Video
    </Heading>,
    <hr className="border-2 w-full" />,
    <p>Föredrar du videoformat? Kolla på videon nedan!</p>,
    <iframe
      width="560"
      height="315"
      src="https://www.youtube-nocookie.com/embed/LEY_E8MRK4o"
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>,
    <Heading level={2} size={3} icon="mdi:file-document">
      Text
    </Heading>,
    <hr className="border-2 w-full" />,
    <p>
      Varmt välkommen till Yatzy - ett spel där ditt uppdrag är att{" "}
      <i>kasta tärningar</i> och <i>få poäng genom att få kombinationer!</i>
    </p>,
    <Heading level={3} size={4}>
      Grunder
    </Heading>,
    <p>
      I Yatzy ingår 5 stycken tärningar. Spelet spelas i turordning där varje
      spelare har maximalt 3 tärningskast per tur. Man kan välja att avsluta sin
      tur tidigare, dvs. efter 1 eller 2 kast om man vill.
    </p>,
    <Heading level={3} size={4}>
      Spara tärningar
    </Heading>,
    <p>
      Efter varje kast får du "spara" hur många tärningar du vill. I min
      implementation så klickar du på en tärning för att spara den. Detta kommer
      innebära att endast de osparade tärningarna kommer kastas om nästa gång.
      På så sätt kan du tänka strategiskt och få högre poäng på något av spelets{" "}
      <i>kombinationer</i>.
    </p>,
    <Heading level={3} size={4}>
      Lista över kombinationer
    </Heading>,
    <p>Så vilka kombinationer kan man få? En lista hittar du nedan.</p>,
    <ul className="list-disc text-left">{combinationElements}</ul>,
  ];
  return (
    <Container
      title="Yatzy-regler"
      children={children}
      closeButton={true}
      onClose={onClose}
      width="md:w-3/4"
      height="md:h-3/4"
      classes={["break-words"]}
    ></Container>
  );
}

import { openURL } from "../../lib/utils";
import Button from "../Button";
import Container from "../Container";
import {redirect} from "react-router-dom"
/* GameModePrompt.jsx
Frågar användaren om vilket spelläge de vill använda. */
export default function GameModePrompt(props) {
    // Definiera funktion för att skapa spel
    const createGame = (gameType) => {
        // Omdirigera baserat på vilket spel.
        console.log(`Skapar ett spel av stypen ${gameType}...`)
        if (gameType === "multiplayer") {
            openURL("/yatzy/lobby") // Omdirigera till en spellobby där man kan vänta på sina vänner
        }
        else {
            openURL("/yatzy/game?mode=singleplayer") // Omdirigera till själva spelplanen.
        }
    }
    return <Container title="Välj spelläge"
        children={[
            <Button color="lightGreen" text="1 spelare" icon="mdi:person-circle" onClick={
                () => {createGame("singleplayer")}
            }/>,
            <Button color="lightBlue" text="Flera spelare" icon="material-symbols:group" onClick={() => {createGame("multiplayer")}
        }/>,
        ]} />
}
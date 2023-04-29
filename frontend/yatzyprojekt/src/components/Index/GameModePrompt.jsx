/* GameModePrompt.jsx
Frågar användaren om vilket spelläge de vill använda. */
import { openURL } from "../../lib/utils";
import Button from "../Button";
import Container from "../Container";
import {redirect, useNavigate} from "react-router-dom";
import {useState} from "react";
export default function GameModePrompt(props) {
    // Det finns två olika steg:
    // Steg 1:
    // Fråga om användaren vill spela som enskild spelare eller spela som flera spelare.
    // Steg 2 (endast om användaren vill spela som flera spelare):
    // Fråga om användaren vill skapa ett nytt spel eller har en spelkod för att gå med.
    const [currentStep, setCurrentStep] = useState(1) // Vi vill såklart börja på steg 1!
    const navigate = useNavigate()
    // Definiera funktion för att skapa spel
    const createGame = (gameType) => {
        // Omdirigera baserat på vilket spel.
        console.log(`Skapar ett spel av typen ${gameType}...`)
        if (gameType === "multiplayer") {
            navigate("/yatzy/lobby" ) // Omdirigera till en spellobby där man kan vänta på sina vänner
        }
        else {
            navigate("/yatzy/game?mode=local") // Omdirigera till själva spelplanen.
        }
    }
    let title = null
    let children = null
    if (currentStep === 1){
        title = "Välj spelläge"
        children = [
            <Button color="lightGreen" text="Lokalt" icon="clarity:computer-solid" onClick={
                () => {createGame("local")}
            }/>,
            <Button color="lightBlue" text="Online" icon="material-symbols:link" onClick={() => {setCurrentStep(2)}
        }/>
        ]
    }
    else if (currentStep === 2){
        title = "Vad vill du göra?"
        children = [
            <Button color="lightBlue" text="Gå med i ett spel" icon="material-symbols:group-add" onClick={
                () => {createGame("multiplayer")}
            }/>,
            <Button color="lightGreen" text="Skapa ett nytt spel" icon="material-symbols:add-circle" onClick={
                () => {
                    navigate("/yatzy/lobby?gameCode=new") // Omdirigera till lobbyn med en gameCode på "new" som automatiskt skapar ett nytt spel.
                }
            }/>,

        ]
    }
    return <Container title={title}
        children={children} />
}
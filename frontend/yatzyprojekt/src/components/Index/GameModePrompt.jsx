/* GameModePrompt.jsx
Frågar användaren om vilket spelläge de vill använda. */
import { openURL } from "../../lib/utils";
import Button from "../Button";
import Container from "../Container";
import {redirect, useNavigate} from "react-router-dom";
import {useState} from "react";
import Heading from "../Heading";
export default function GameModePrompt(props) {
    // Det finns två olika steg:
    // Steg 1:
    // Fråga om användaren vill spela lokalt eller online.
    // Steg 2:
    // Om användaren vill spela som flera spelare:
    // - Fråga om användaren vill skapa ett nytt spel eller har en spelkod för att gå med.
    // Om användaren vill spela lokalt:
    // - Fråga hur många spelare användaren vill ha
    const [currentStep, setCurrentStep] = useState(1) // Vi vill såklart börja på steg 1!
    const [userChoices, setUserChoices] = useState({}) // Vi vet inte än...
    const navigate = useNavigate()
    // Definiera funktion för att omdirigera till ett spel spel
    const openGame = () => {
        // Omdirigera baserat på vilket spel.
        console.log(`Navigerar till ett spel av typen ${userChoices.gameType}...`)
        if (userChoices.gameType === "multiplayer") {
            navigate("/lobby" ) // Omdirigera till en spellobby där man kan vänta på sina vänner
        }
        else if (userChoices.gameType === "singleplayer"){
            navigate(`/game?mode=local&numberOfPlayers=${userChoices.numberOfPlayers}`) // Omdirigera till själva spelplanen.
        }
    }
    let title = null
    let children = null
    if (currentStep === 1){
        title = "Välj spelläge"
        children = [
            <Button color="lightGreen" text="Lokalt" icon="clarity:computer-solid" onClick={
                () => {
                    setUserChoices({
                        gameType: "singleplayer",
                        numberOfPlayers: 2
                    })
                    setCurrentStep(2)}
            }/>,
            <Button color="lightBlue" text="Online" icon="material-symbols:link" onClick={() => {
                setUserChoices({
                        gameType: "multiplayer"
                    })
                setCurrentStep(2)}
        }/>
        ]
    }
    else if (currentStep === 2){
        // Vad vi visar här beror på vilket spelläge som användaren vill ha
        if (userChoices.gameType === "multiplayer"){
            title = "Vad vill du göra?"
            children = [
                <Button color="lightBlue" text="Gå med i ett spel" icon="material-symbols:group-add" onClick={
                    () => {openGame()}
                }/>,
                <Button color="lightGreen" text="Skapa ett nytt spel" icon="material-symbols:add-circle" onClick={
                    () => {
                        navigate("/lobby?gameCode=new") // Omdirigera till lobbyn med en gameCode på "new" som automatiskt skapar ett nytt spel.
                    }
                }/>
            ]
        }
        else if (userChoices.gameType === "singleplayer"){
            title = "Hur många spelare?"
            // Kolla om användaren kan lägga till fler spelare
            const canAddPlayers = userChoices.numberOfPlayers < 8
            const canRemovePlayers = userChoices.numberOfPlayers > 2
            children = [
                <div className="grid grid-cols-3">
                <Button color="lightBlue" circle={true} icon="ic:baseline-minus"
                    disabled={!canRemovePlayers} onClick={canRemovePlayers?
                    () => {
                        // Ta bort en spelare
                        let newUserChoices = {...userChoices}
                        newUserChoices.numberOfPlayers -= 1
                        setUserChoices(newUserChoices)
                    }:null
                }/>
                <Heading size={2}>{userChoices.numberOfPlayers}</Heading>
                <Button color="lightBlue" circle={true} icon="material-symbols:add"
                        disabled={!canAddPlayers} onClick={canAddPlayers?
                    () => {
                        // Lägg till en spelare
                        let newUserChoices = {...userChoices}
                        newUserChoices.numberOfPlayers += 1
                        setUserChoices(newUserChoices)
                    }:null
                }/>
                </div>,
                <Button color="lightGreen" text="Starta spelet!" onClick={
                    () => {
                        openGame()
                    }
                }/>
            ]
        }


    }
    return <Container title={title}
        children={children} />
}
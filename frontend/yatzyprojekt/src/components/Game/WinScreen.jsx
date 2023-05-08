import { useNavigate } from "react-router-dom"
import Container from "../Container"
import Player from "../Player/Player"

/* WinScreen.jsx
En skärm som visar vilken spelare som har vunnit spelet. */
export default function WinScreen({ gameState }) {
    const navigate = useNavigate()
    // Iterera över varje spelare, beräkna dess totalpoäng, och sortera sedan listan efter vinnare
    let playerElements = []
    let lastDifferentScore = {
        score: null,
        index: null
    }
    for (let i = 1; i <= gameState.players.length; i++) {
        const player = gameState.players[i-1]
        // Beräkna totalpoäng för varje användare
        let playerScore = 0
        for (const score of player.scores) {
            playerScore += score.points
        }
        if (playerScore != lastDifferentScore.score) {
            lastDifferentScore.score = playerScore
            lastDifferentScore.index = i
        }
        playerElements.push(<Player type="compact" numbered={true} number={lastDifferentScore.index}  name={player.name} index={i} score={playerScore}/>)
        
    }
    playerElements.sort((a, b) => { // Jämför två spelare för att sortera poäng
        if (a.score > b.score) {
            return 1 // a är större än b
        }
        else if (a.score < b.score) {
            return -1 // a är mindre än b
        }
        return 0 // Lika
    })
    return <div className="flex justify-center items-center h-screen"><Container title="Resultat" align="center" children={
            playerElements
    } closeButton={true} onClose={() => {
        navigate("/")
    }}/></div>
}
import Heading from "../Heading";
import Player from "../Player/Player";
import {createRef, useEffect, useState} from "react";
import {findDOMNode} from "react-dom";
import {useNavigate, useSearchParams} from "react-router-dom";
/* PlayerWrapper.jsx
En behållare för spelare som är med i spelet. */
export default function PlayerWrapper({players, currentPlayerName, playerName}) {
    const navigate = useNavigate()
    const [params = setParams] = useSearchParams()
    // Skapa spelarelement (element för varje spelare i spelet)
    let playerElements = []
    let activePlayerIndex = 0
    for (let i=0;i<players.length;i++) {
        const player = players[i]
        // Beräkna spelarens totala poäng.
        let playerTotalScore = 0
        for (const score of player.scores) {
            playerTotalScore += score.points
        }
        const playerKey = `player-${player.name}`
        const isCurrentTurn = player.name === currentPlayerName
        let playerElement = <Player index={i+1} id={playerKey} key={playerKey} type="compact" name={player.name} score={playerTotalScore} isMe={player.name === playerName}
        isCurrentTurn={isCurrentTurn} />
        if (isCurrentTurn){
            activePlayerIndex = i+1
        }
        playerElements.push(
            playerElement
        )
    }
    useEffect(()=>{
        let prevURL = "?"
        console.log(params)
        for (const [parameterName, parameterValue] of params){
            prevURL += `${prevURL === "?" ? "": "&"}${parameterName}=${parameterValue}`
        }
        prevURL.trim(`&`)
        navigate(`${prevURL}#player-${activePlayerIndex}`)
    }, [activePlayerIndex])
    return <div className="p-3 overflow-auto">
        <div className="pt-3 " key="players">
            {playerElements}
        </div>
    </div>
}
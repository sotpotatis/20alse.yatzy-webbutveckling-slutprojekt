/* Rules.jsx 
Visar en "regelbox".*/
import { possibleDiceStates } from "20alse-yatzy-shared-code";
import Heading from "../Heading";
export default function Rules() {
    return <div>
        <Heading size={1}>Yatzy-regler</Heading>
        <Heading size={2}>Video</Heading>
        <hr className="border-4"/>
        <Heading size={2}>Text</Heading>
        <hr className="border-4"/>
    </div>
}
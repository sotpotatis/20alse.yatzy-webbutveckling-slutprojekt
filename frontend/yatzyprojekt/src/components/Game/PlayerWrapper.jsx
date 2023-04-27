import Heading from "../Heading";
import Player from "../Player/Player";
/* PlayerWrapper.jsx
En behållare för spelare som är med i spelet. */
export default function PlayerWrapper({players}) {
    return <div className="p-3">
        <Heading size={2}>Spelare</Heading>
        <div className="pt-3" key="players">
        <Player type="compact" name="Test" score={4} />
        <Player type="compact" name="ExtraordinärKaffedrickare56" score={4} />
        <Player type="compact" name="SuperbExempel123" score={10} />
        </div>
    </div>
}
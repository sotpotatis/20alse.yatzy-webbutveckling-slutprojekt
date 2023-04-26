import ScoreBoard from "./Scoreboard";

/* ScoreBoardWrapper.jsx
Innehåller poängtabellerna samt information om andra spelare. */
export default function ScoreBoardWrapper() {
    return <div className="col-span-2 bg-white border-gray-200 p-3 rounded-lg h-full min-h-full">
        <ScoreBoard/>
    </div>
}
import { useCookies } from "react-cookie"
import GameModePrompt from "../components/Index/GameModePrompt"
import RulePrompt from "../components/Index/RulePrompt"

/* index.jsx
Renderar startsidan för Yatzyprojektet. */
export default function Index() {
    // På startsidan vill vi fråga användaren om hen vill ha en guide på regler eller inte.
    // Annars vill vi direkt ge användaren möjligheten att börja spela.
    // Vi spårar om användaren tidigare sätt introt med cookies
    const [cookies, setCookies] = useCookies()
    function onRulePromptButtonClick(showRules) {
        if (showRules) {
            console.log("Visar Yatzy-regler...")
            // TODO
        }
        else {
            console.log("Användaren vill inte visa Yatzyregler.")
        }
        setCookies("rulePromtShown", "true") // Ställ in att användaren har klickat i frågan om regler
    }
    const showRulePrompt = cookies.rulePromtShown === undefined // En cookie sätts när användaren har visat "regelprompten"
    let elementToRender = showRulePrompt ? <RulePrompt onClick={onRulePromptButtonClick} /> : <GameModePrompt/>
    return <div className="w-full h-full flex items-center justify-center">
        {elementToRender}
    </div>
    
}
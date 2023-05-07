import { useCookies } from "react-cookie";
import GameModePrompt from "../components/Index/GameModePrompt";
import RulePrompt from "../components/Index/RulePrompt";
import RulesBox from "../components/Index/RulesBox";
import { useState } from "react";

/* index.jsx
Renderar startsidan för Yatzyprojektet. */
// Konstanta namn för några olika element
const rulePrompt = "rulePrompt"; // Element för att fråga om man vill läsa reglerna
const gameModePrompt = "gameModePrompt"; // Element för att välja spelläge
const rules = "rules"; // Element för att visa regler
export default function Index() {
  // På startsidan vill vi fråga användaren om hen vill ha en guide på regler eller inte.
  // Annars vill vi direkt ge användaren möjligheten att börja spela.
  // Vi spårar om användaren tidigare sätt introt med cookies
  const [cookies, setCookies] = useCookies();
  // En cookie sätts när användaren har visat "regelprompten"/introt
  // Avgör vad vi ska rendera.
  // Cookies avgör det initiala: om vi ska fråga om användaren vill läsa reglerna eller ifall vi vill be de att välja spelläge.
  let [currentElement, setCurrentElement] = useState(
    cookies.rulePromptShown === undefined ? rulePrompt : gameModePrompt
  );
  let elementToRender = null;
  // Nedan renderas de olika elementen.
  const onRulePromptShown = () => {
    // Funktion som körs när användaren visat reglerna eller tackat nej till att visa de
    setCookies("rulePromptShown", "true"); // Ställ in att användaren har klickat i frågan om regler
    setCurrentElement(gameModePrompt);
  };
  if (currentElement === rulePrompt) {
    /**
     * Funktion som körs när användaren har valt om hen vill läsa reglerna eller inte.
     * @param showRules true om reglerna ska visas, false om de inte ska det.
     */
    function onRulePromptButtonClick(showRules) {
      if (showRules) {
        console.log("Visar Yatzy-regler...");
        setCurrentElement(rules);
      } else {
        console.log("Användaren vill inte visa Yatzyregler.");
        onRulePromptShown();
      }
    }
    elementToRender = <RulePrompt onClick={onRulePromptButtonClick} />;
  } else if (currentElement === gameModePrompt) {
    elementToRender = <GameModePrompt />;
  } else if (currentElement === rules) {
    elementToRender = <RulesBox onClose={onRulePromptShown} />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      {elementToRender}
    </div>
  );
}

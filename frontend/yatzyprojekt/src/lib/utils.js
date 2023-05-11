/* utils.js
Blandade hjälpfunktioner för sidan. */
/**
 * Ställer in ett värde till ett standardvärde om det inte är definierat.
 * Används av mig bland annat då props är valfria.
 * @param {*} value Värdet att kolla om det är definierat eller inte.
 * @param {*} defaultValue Standrdvärde om värdet på value inte är definierat.
 * @returns Anpassat värde eller ett standardvärde
 */
export function setDefaults(value, defaultValue) {
  return value !== undefined ? value : defaultValue;
}
/**
 *
 * @param {*} url Länken som ska öppnas.
 * @param {*} newWindow Om länken ska öppnas i en ny flik eller inte.
 */
export function openURL(url, newWindow = false) {
  window.open(url, newWindow ? "_blank" : null);
}
/**
 * Funktion för att kopiera en text till klippbordet om möjligt.
 * @param text Texten som ska kopieras.
 * @param callbackFunction En funktion som kallas med true kopieringen lyckades och false om den misslyckades
 */
export function copyTextToClipboard(text, callbackFunction) {
  try {
    navigator.clipboard.writeText(text);
    callbackFunction(true);
  } catch (e) {
    console.warn(
      `Misslyckades med att kopiera en text till klippbordet. Följande fel inträffade (${e}).`
    );
    callbackFunction(false);
  }
}

/**
 * Hämtar sparad autentisering från localStorage. Används för multiplayer.
 * @return {str|null} autentiserings-tokenen om en sparad autentisering hittades, annars null
 */
export function getSavedAuthentication() {
  return localStorage.userSecret !== undefined ? localStorage.userSecret : null;
}
/**
 * Sparar en autentiseringstoken i localStorage. Används för multiplayer.
 * @param key Autentiserings-tokenen som ska användas
 */
export function saveAuthentication(key) {
  localStorage.userSecret = key;
}

/**
 * Kör en funktion endast om enter-tangenten har tryckts ned.
 * @param event Eventet som tagits emot av tangentrelaterade händelsen.
 * @param onEnterPress Funktionen som ska köras om enter har tryckts på.
 */
export function runOnEnterPress(event, onEnterPress){
  if (event.key === "Enter"){
    onEnterPress()
  }
}
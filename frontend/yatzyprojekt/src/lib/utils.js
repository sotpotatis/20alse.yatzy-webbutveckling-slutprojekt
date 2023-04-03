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
    return value !== undefined ? value : defaultValue
}
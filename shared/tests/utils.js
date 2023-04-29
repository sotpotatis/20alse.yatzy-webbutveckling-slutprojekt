/**
 * Genererar ett slumpmässigt nummer.
 * @param {*} start Lägsta numret som ska genereras.
 * @param {*} end Största numret som ska genereras.
 * @returns Det slumpmässiga numret. 
 */
function randomNumber(start, end) {
    return Math.floor(Math.random() * (end-start+1) +start)
}
/**
 * Genererar ett slumpmässigt nummer förutom en eller flera nummer som exkluderas.
 * @param {number} start Lägsta numret som ska genereras.
 * @param {number} end Största numret som ska genereras.
 * @param {object} exclusions Det eller de nummer som inte ska genereras.
 */
function randomNumberExcept(start, end, exclusions) {
    if (!Array.isArray(exclusions)) { // Konvertera enskilda argument till en lista.
        exclusions = [exclusions]
    }
    while (true) { // Tills ett nummer som inte är exkluderat genererats
        const generatedNumber = randomNumber(start, end) 
        if (!exclusions.includes(generatedNumber)) { // Om numret som genereras inte ska exkluderas, returnera det
            return generatedNumber
        }
    }
}
module.exports = {randomNumber, randomNumberExcept}
# Iterationer inom Yatzyprojektet

Instruktioner: *Arbetet ska delas upp och planeras i iterationer, där varje iteration börjar
med en planering av vad som ska göras under den iterationen, och
avslutas med tester där ni kontrollerar så att det som gjorts fungerar
(användartester, automatiska tester eller manuella tester beroende på
vad som passar den iterationen).*

___

## Iteration 1

**Vad ska göras:** Lägga grunderna för hemsidan. Implementera kod för att undersidor fungerar, men de behöver inte ha något innehåll. Relevanta verktyg ska vara installerade (kodrelaterade verktyg). Man ska kunna komma åt alla undersidor (startsida, spelsida, multiplayer-join-sida).
Koden för servern (i JavaScript) som tillhandahåller multiplayer-funktionalitet ska fungera så att man kan skapa ett spel via testverktyg för Socket.IO men inte vara implementerat på hemsidan.

**Notera:** Förarbete för iteration 1 innehåller även framtagning av utkast till en grafisk profil.

**Tester:** Manuella tester för att se att alla länkar fungerar som de ska samt att servern fungerar.

**Planerad tidsåtgång:** 1 vecka

**Faktisk tidsåtgång:** 1 vecka

___

## Iteration 2

**Vad ska göras:** Skapa uppkopplingen mellan hemsidan och multiplayer-servern. Gör så att man kan skapa spel, gå med i spel, samt skicka spelkommandon. Lös eventuella buggar eller andra problem som upptäckts med multiplayer-servern. Designa de enklare sidorna såsom sidan för att gå med i multiplayerspel. 

**Tester:** Automatiska tester för att testa funktioner såsom att gå med i spel.

**Planerad tidsåtgång:** 1 vecka

**Faktisk tidsåtgång:** --
___

## Iteration 3

**Vad ska göras:** Designa själva spelgränsnittet och koppla funktionerna för att interagera med multiplayer-servern till ett fysiskt användargränsnitt. Här inkluderar att designa element såsom tärningskastanimationer, sidebars i spelgränsnittet, en poängplan, och liknande.

**Tester:** Användartester för att testa det ursprungliga gränsnittet.

___

## Iteration 4

**Vad ska göras:** Implementera övriga element på hemsidan såsom instruktion för hur man spelar Yatzy samt en typsnitts- och temaväljare. Gör ändringar baserat på användares feedback i Iteration 3.

**Tester:** Användartester för att fråga användarna som testat om vad de tycker om förändringarna samt eventuellt några fler användartester.

___

## Iteration 5

**Vad ska göras:** Bufferiteration där appens slutgiltiga version kodas. De sista problemen och visuella fixarna implementeras.

**Tester:** Användartester om nödvändigt.
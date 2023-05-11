---

> NOTE: This repository is shared on the Node Package Manager (NPM) online so I can easily keep it in sync
> between multiple folders and infrastructure. If you're reading this on npm, please ignore this package, it
> just includes some calculations for me.

---

# Delad kod

För att slippa duplicering så delas lite kod mellan backendet och frontendet. Detta är för att singleplayer-läget ska kunna köra på webbläsaren men att multiplayer-läget ska kunna köra på servern för att motverka fusk. Här finns funktion för att detektera olika lägen i spelet.

## För att testa beräkningar

För att testa att alla beräkningar med olika utfall fungerar, testa att köra `npm run test`. Det är så jag kontrollerar att min kod för att beräkna saker är korrekt. Testerna använder Jest, ett ramverk för testning av JavaScript-kod.

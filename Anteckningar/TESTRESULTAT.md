# Resultat av manuella och automatiska tester

På hemsidan har jag utfört flertalet typer av tester som dokumenteras nedan.

### Automatiska tester

För att testa att hemsidan följer etablerade regelverk som WCAG och etablerade standarder inom HTML, CSS och liknande så har jag använt flera testverktyg. Nedan följer dokumentation av de olika verktygen

##### Accessibility Checker

Detta testverktyg testar att hemsidan följer WCAG-riktlinjer. Jag har tidigare använt WAVE (Web Accessibility Evaluation Tools), men det fungerande inte med React då sidan är beroende av att JavaScript körs för att innehåll ska renderas. Vid första testet fick min hemsida ett testresultat runt 60%, vilket jag sedan åtgärdade.

##### Jest

Jag använder vertyget [Jest](https://jestjs.io/) som likt React har utvecklats av Meta (tidigare Facebook) och används för att testa JavaScript. Jest testar inte själva hemsidans innehåll utan är koncentrerad till JavaScript-koden som tillhandahåller beräkningen av poäng i yatzyt. Det finns testscenarion för [alla poäng](/shared/tests/), och genom ett kommando kan man säkerhetsställa att alla poäng räknas ut som de ska. Slutgilltiga testresultatet var självklart att alla tester lyckades.

##### Lighthouse

Jag använder verktyget Lighthouse via hemsidan PageSpeed Insights som är utvecklat för Google för att testa en kombination av sidhastighet, prestanda, HTML-riktlinjer och SEO. 


### Manuella tester

##### Test av beräkning

Detta test omfattar att jag går in på hemsidan, kastar tärningar och ser att poäng beräknas korrekt.

##### Test av inställningsflöde

Detta test omfattar att jag går in på hemsidan och kontrollerar att både single- och multiplayerspel går att skapa utan problem.
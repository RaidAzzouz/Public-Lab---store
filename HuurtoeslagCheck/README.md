# HuurtoeslagCheck

webapp waarmee je in een paar simpele stappen ontdekt of je
mogelijk recht hebt op huurtoeslag zonder account, zonder DigiD, in gewone taal.

Gebouwd voor de Public Lab-opdracht (Fase 2), als vervolg op de reflectie dat
digitalisering diensten *beschikbaar* maakt, maar niet automatisch *toegankelijk*.

## Gebruiken

Open `index.html` gewoon in je browser (dubbelklikken). De gecompileerde
JavaScript bestanden staan al in `dist/`, dus je hoeft niets te installeren of te
bouwen om de app te bekijken.

Liever via `http://localhost` in plaats van een `file://`-pad?

```
npm install
npm start
```

Dit start een lokale server op `http://localhost:5500` en opent automatisch je
browser. Stoppen doe je met Ctrl+C in de terminal.

## Ontwikkelen

De logica is geschreven in TypeScript (`src/`) en gecompileerd naar JavaScript
(`dist/`). Alleen nodig als je iets in `src/` wijzigt:

```
npm install
npm run build
```

(`npm run watch` compileert automatisch opnieuw bij elke wijziging.)

## Hoe het werkt

- **index.html** — stap-voor-stap vragenlijst (1 vraag per scherm, met voortgangsbalk):
  leeftijd, woonsituatie, kale huur, huishoudgrootte, fiscaal partner, jaarinkomen, vermogen.
- **resultaat.html** — toont op basis van de antwoorden of je waarschijnlijk WEL,
  MISSCHIEN, of waarschijnlijk NIET in aanmerking komt, met uitleg in gewone taal en
  concrete vervolgstappen.
- **Geen opslag**: de antwoorden worden nooit opgeslagen (geen localStorage, geen
  database, geen cookies) — ze gaan via URL-parameters van `index.html` naar
  `resultaat.html`. Na het sluiten van de pagina is alles weg.
- De berekening in `src/rules.ts` is een **indicatie**, gebaseerd op vereenvoudigde
  2026-grenzen voor inkomen, vermogen en huur — geen officiële berekening. Voor een
  exacte uitkomst verwijst de app door naar de proefberekening van de Belastingdienst.

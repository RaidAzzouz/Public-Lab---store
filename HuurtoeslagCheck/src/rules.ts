// Rule-engine voor de huurtoeslag-indicatie.
// Deze functie geeft alleen een indicatie (WEL / MISSCHIEN / NIET)

type Woonsituatie =
  | "alleen"
  | "met_partner"
  | "met_huisgenoten"
  | "onderhuur_kamer"
  | "studentenkamer";

interface Antwoorden {
  leeftijd: number;
  woonsituatie: Woonsituatie;
  kaleHuur: number;
  huishoudgrootte: number;
  fiscaalPartner: boolean;
  jaarinkomen: number;
  vermogen: number;
}

type Verdict = "WEL" | "MISSCHIEN" | "NIET";

interface Resultaat {
  verdict: Verdict;
  titel: string;
  uitleg: string[];
  vervolgstappen: string[];
  disclaimers: string[];
}

// Indicatieve 2026-grenzen (bron: rijksoverheid.nl / overtoeslagen.nl, nov. 2025 indexering).
const MIN_LEEFTIJD = 18;

const VERMOGENSGRENS_ALLEENSTAAND = 38_479;
const VERMOGENSGRENS_MET_PARTNER = 76_958;

const REKENHUURGRENS_21PLUS = 879.66;
const KWALITEITSKORTINGSGRENS_18_20 = 454.47;

// Drieledige inkomensband in plaats van één harde grens: de echte regeling
// bouwt geleidelijk af, dus onder/tussen/boven geeft een realistischer beeld
// dan een simpele ja/nee-grens.
const INKOMENSGRENS_COMFORTABEL = 31_750;
const INKOMENSGRENS_RUIM = 60_525;

const PROEFBEREKENING_URL = "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/toeslagen/proefberekening_toeslagen";

const ALTIJD_VERVOLGSTAPPEN: string[] = [
  `Doe de officiële proefberekening op de site van de Belastingdienst: ${PROEFBEREKENING_URL}`,
  "Kom je er niet uit? Vraag gratis hulp bij de bibliotheek of het gemeenteloket bij jou in de buurt.",
];

const ALTIJD_DISCLAIMERS: string[] = [
  "Dit is een indicatie, geen officiële berekening.",
  "De echte regels zijn ingewikkelder (glijdende schaal). Doe bij twijfel altijd de proefberekening van de Belastingdienst.",
];

function bepaalVerdict(a: Antwoorden): Resultaat {
  if (a.leeftijd < MIN_LEEFTIJD) {
    return {
      verdict: "NIET",
      titel: "Je bent nog geen 18",
      uitleg: [
        "Huurtoeslag kun je pas zelfstandig aanvragen vanaf je 18de verjaardag.",
      ],
      vervolgstappen: [
        "Vraag je ouders of voogd of zij eventueel iets kunnen regelen.",
        "Kom terug zodra je 18 wordt om je situatie opnieuw te checken.",
      ],
      disclaimers: ALTIJD_DISCLAIMERS,
    };
  }

  const vermogensgrens = a.fiscaalPartner
    ? VERMOGENSGRENS_MET_PARTNER
    : VERMOGENSGRENS_ALLEENSTAAND;

  if (a.vermogen > vermogensgrens) {
    return {
      verdict: "NIET",
      titel: "Je vermogen is te hoog",
      uitleg: [
        `Je (gezamenlijk) vermogen van €${a.vermogen.toLocaleString("nl-NL")} ligt boven de grens van €${vermogensgrens.toLocaleString("nl-NL")} die voor jouw situatie geldt.`,
        "Vermogen boven deze grens sluit huurtoeslag helaas uit, ongeacht je inkomen of huur.",
      ],
      vervolgstappen: ALTIJD_VERVOLGSTAPPEN,
      disclaimers: ALTIJD_DISCLAIMERS,
    };
  }

  const redenenWel: string[] = [];
  const redenenTwijfel: string[] = [];
  const redenenNiet: string[] = [];

  const huurgrens =
    a.leeftijd < 21 ? KWALITEITSKORTINGSGRENS_18_20 : REKENHUURGRENS_21PLUS;

  if (a.kaleHuur <= huurgrens) {
    redenenWel.push("Je kale huur past binnen de gangbare rekenhuurgrens.");
  } else {
    redenenTwijfel.push(
      "Je huur ligt boven de rekenhuurgrens. De toeslag wordt dan lager berekend, maar je wordt er sinds 2026 niet meer automatisch om afgewezen."
    );
  }

  if (a.jaarinkomen <= INKOMENSGRENS_COMFORTABEL) {
    redenenWel.push("Je (gezamenlijk) inkomen valt ruim binnen de grens.");
  } else if (a.jaarinkomen <= INKOMENSGRENS_RUIM) {
    redenenTwijfel.push(
      "Je inkomen ligt in een grijs gebied — of je in aanmerking komt hangt af van de exacte berekening."
    );
  } else {
    redenenNiet.push("Je (gezamenlijk) inkomen ligt boven de ruimere 2026-grens.");
  }

  if (a.huishoudgrootte > 1 || a.fiscaalPartner) {
    redenenTwijfel.push(
      "Met een groter huishouden of een fiscaal partner kan de uitkomst anders liggen dan bij een alleenstaande."
    );
  }

  let verdict: Verdict;
  if (redenenNiet.length > 0 && redenenWel.length === 0) {
    verdict = "NIET";
  } else if (redenenNiet.length > 0 || redenenTwijfel.length >= 2) {
    verdict = "MISSCHIEN";
  } else if (redenenWel.length > 0 && redenenTwijfel.length === 0) {
    verdict = "WEL";
  } else {
    verdict = "MISSCHIEN";
  }

  const titels: Record<Verdict, string> = {
    WEL: "Je komt waarschijnlijk in aanmerking",
    MISSCHIEN: "Het is niet zeker — een twijfelgeval",
    NIET: "Je komt waarschijnlijk niet in aanmerking",
  };

  return {
    verdict,
    titel: titels[verdict],
    uitleg: [...redenenWel, ...redenenTwijfel, ...redenenNiet],
    vervolgstappen: ALTIJD_VERVOLGSTAPPEN,
    disclaimers: ALTIJD_DISCLAIMERS,
  };
}

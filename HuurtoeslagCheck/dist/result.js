"use strict";
// Rendering voor resultaat.html leest antwoorden uit de URL, roept bepaalVerdict() aan
// (uit rules.js, globaal geladen) en toont het resultaat. Slaat niks op.
const GELDIGE_WOONSITUATIES = [
    "alleen",
    "met_partner",
    "met_huisgenoten",
    "onderhuur_kamer",
    "studentenkamer",
];
function isGeldigeWoonsituatie(waarde) {
    return GELDIGE_WOONSITUATIES.includes(waarde);
}
function leesAntwoordenUitURL() {
    const params = new URLSearchParams(window.location.search);
    const verplicht = [
        "leeftijd",
        "woonsituatie",
        "kaleHuur",
        "huishoudgrootte",
        "fiscaalPartner",
        "jaarinkomen",
        "vermogen",
    ];
    for (const veld of verplicht) {
        if (!params.has(veld)) {
            return null;
        }
    }
    const woonsituatie = params.get("woonsituatie");
    if (!isGeldigeWoonsituatie(woonsituatie)) {
        return null;
    }
    const leeftijd = Number(params.get("leeftijd"));
    const kaleHuur = Number(params.get("kaleHuur"));
    const huishoudgrootte = Number(params.get("huishoudgrootte"));
    const jaarinkomen = Number(params.get("jaarinkomen"));
    const vermogen = Number(params.get("vermogen"));
    if ([leeftijd, kaleHuur, huishoudgrootte, jaarinkomen, vermogen].some((n) => Number.isNaN(n))) {
        return null;
    }
    return {
        leeftijd,
        woonsituatie,
        kaleHuur,
        huishoudgrootte,
        fiscaalPartner: params.get("fiscaalPartner") === "1",
        jaarinkomen,
        vermogen,
    };
}
const BADGE_LABEL = {
    WEL: "Waarschijnlijk WEL",
    MISSCHIEN: "MISSCHIEN",
    NIET: "Waarschijnlijk NIET",
};
function vulLijst(element, items) {
    element.innerHTML = "";
    for (const item of items) {
        const li = document.createElement("li");
        li.textContent = item;
        element.appendChild(li);
    }
}
const URL_PATROON = /(https?:\/\/\S+)/;
function vulVervolgstappenLijst(element, items) {
    element.innerHTML = "";
    for (const item of items) {
        const li = document.createElement("li");
        const match = item.match(URL_PATROON);
        if (!match) {
            li.textContent = item;
            element.appendChild(li);
            continue;
        }
        const url = match[0];
        li.appendChild(document.createTextNode(item.slice(0, match.index)));
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "Belastingdienst.nl";
        li.appendChild(link);
        element.appendChild(li);
    }
}
function render() {
    const antwoorden = leesAntwoordenUitURL();
    const resultaatContainer = document.getElementById("resultaat-container");
    const geenAntwoorden = document.getElementById("geen-antwoorden");
    if (antwoorden === null) {
        resultaatContainer.hidden = true;
        geenAntwoorden.hidden = false;
        return;
    }
    geenAntwoorden.hidden = true;
    resultaatContainer.hidden = false;
    const resultaat = bepaalVerdict(antwoorden);
    const badge = document.getElementById("badge");
    badge.textContent = BADGE_LABEL[resultaat.verdict];
    badge.className = `badge badge-${resultaat.verdict.toLowerCase()}`;
    document.getElementById("titel").textContent = resultaat.titel;
    vulLijst(document.getElementById("uitleg-lijst"), resultaat.uitleg);
    vulVervolgstappenLijst(document.getElementById("vervolgstappen-lijst"), resultaat.vervolgstappen);
    const disclaimerBox = document.getElementById("disclaimer-box");
    disclaimerBox.innerHTML = "";
    for (const tekst of resultaat.disclaimers) {
        const p = document.createElement("p");
        p.textContent = tekst;
        disclaimerBox.appendChild(p);
    }
}
document.addEventListener("DOMContentLoaded", render);

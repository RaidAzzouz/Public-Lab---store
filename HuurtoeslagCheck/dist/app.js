"use strict";
let huidigeStap = 0;
const form = document.getElementById("vragenlijst");
const stappen = Array.from(document.querySelectorAll(".stap"));
const totaalStappen = stappen.length;
const voortgangBalk = document.getElementById("voortgang-balk");
const stapTeller = document.getElementById("stap-teller");
const knopVorige = document.getElementById("knop-vorige");
const knopVolgende = document.getElementById("knop-volgende");
function toonStap(index) {
    stappen.forEach((stap, i) => {
        stap.hidden = i !== index;
    });
    const percentage = ((index + 1) / totaalStappen) * 100;
    voortgangBalk.style.width = `${percentage}%`;
    stapTeller.textContent = `Vraag ${index + 1} van ${totaalStappen}`;
    knopVorige.disabled = index === 0;
    knopVolgende.textContent = index === totaalStappen - 1 ? "Bekijk resultaat" : "Volgende";
    const eersteVeld = stappen[index].querySelector("input, select");
    if (eersteVeld) {
        eersteVeld.focus();
    }
}
function valideerHuidigeStap() {
    const stap = stappen[huidigeStap];
    const velden = Array.from(stap.querySelectorAll("input, select"));
    const radiogroep = stap.querySelector("input[type=radio]");
    if (radiogroep) {
        const naam = radiogroep.name;
        const gekozen = stap.querySelector(`input[name="${naam}"]:checked`);
        if (!gekozen) {
            window.alert("Kies een van de twee opties om verder te gaan.");
            return false;
        }
        return true;
    }
    for (const veld of velden) {
        if (!veld.checkValidity()) {
            veld.reportValidity();
            return false;
        }
    }
    return true;
}
function verzamelAntwoorden() {
    const formData = new FormData(form);
    return {
        leeftijd: Number(formData.get("leeftijd")),
        woonsituatie: formData.get("woonsituatie"),
        kaleHuur: Number(formData.get("kaleHuur")),
        huishoudgrootte: Number(formData.get("huishoudgrootte")),
        fiscaalPartner: formData.get("fiscaalPartner") === "ja",
        jaarinkomen: Number(formData.get("jaarinkomen")),
        vermogen: Number(formData.get("vermogen")),
    };
}
function verzendNaarResultaat() {
    const antwoorden = verzamelAntwoorden();
    const params = new URLSearchParams({
        leeftijd: String(antwoorden.leeftijd),
        woonsituatie: antwoorden.woonsituatie,
        kaleHuur: String(antwoorden.kaleHuur),
        huishoudgrootte: String(antwoorden.huishoudgrootte),
        fiscaalPartner: antwoorden.fiscaalPartner ? "1" : "0",
        jaarinkomen: String(antwoorden.jaarinkomen),
        vermogen: String(antwoorden.vermogen),
    });
    window.location.href = `resultaat.html?${params.toString()}`;
}
function volgende() {
    if (!valideerHuidigeStap()) {
        return;
    }
    if (huidigeStap === totaalStappen - 1) {
        verzendNaarResultaat();
        return;
    }
    huidigeStap++;
    toonStap(huidigeStap);
}
function vorige() {
    if (huidigeStap === 0) {
        return;
    }
    huidigeStap--;
    toonStap(huidigeStap);
}
form.addEventListener("submit", (e) => {
    e.preventDefault();
    volgende();
});
knopVorige.addEventListener("click", vorige);
toonStap(0);


let huidigeStap = 0;

const form = document.getElementById("vragenlijst") as HTMLFormElement;
const stappen: HTMLElement[] = Array.from(document.querySelectorAll(".stap"));
const totaalStappen = stappen.length;

const voortgangBalk = document.getElementById("voortgang-balk") as HTMLElement;
const stapTeller = document.getElementById("stap-teller") as HTMLElement;
const knopVorige = document.getElementById("knop-vorige") as HTMLButtonElement;
const knopVolgende = document.getElementById("knop-volgende") as HTMLButtonElement;

function toonStap(index: number): void {
  stappen.forEach((stap, i) => {
    stap.hidden = i !== index;
  });

  const percentage = ((index + 1) / totaalStappen) * 100;
  voortgangBalk.style.width = `${percentage}%`;
  stapTeller.textContent = `Vraag ${index + 1} van ${totaalStappen}`;

  knopVorige.disabled = index === 0;
  knopVolgende.textContent = index === totaalStappen - 1 ? "Bekijk resultaat" : "Volgende";

  const eersteVeld = stappen[index].querySelector<HTMLElement>("input, select");
  if (eersteVeld) {
    eersteVeld.focus();
  }
}

function valideerHuidigeStap(): boolean {
  const stap = stappen[huidigeStap];
  const velden = Array.from(stap.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select"));

  const radiogroep = stap.querySelector<HTMLInputElement>("input[type=radio]");
  if (radiogroep) {
    const naam = radiogroep.name;
    const gekozen = stap.querySelector<HTMLInputElement>(`input[name="${naam}"]:checked`);
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

function verzamelAntwoorden(): Antwoorden {
  const formData = new FormData(form);

  return {
    leeftijd: Number(formData.get("leeftijd")),
    woonsituatie: formData.get("woonsituatie") as Woonsituatie,
    kaleHuur: Number(formData.get("kaleHuur")),
    huishoudgrootte: Number(formData.get("huishoudgrootte")),
    fiscaalPartner: formData.get("fiscaalPartner") === "ja",
    jaarinkomen: Number(formData.get("jaarinkomen")),
    vermogen: Number(formData.get("vermogen")),
  };
}

function verzendNaarResultaat(): void {
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

function volgende(): void {
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

function vorige(): void {
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

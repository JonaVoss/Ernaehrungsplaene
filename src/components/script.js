// Funktion zum Umschalten zwischen Tabs (Rezept vs. Ernährungsplan)
document.getElementById("plan-tab").addEventListener("click", () => {
    document.getElementById("plan-section").classList.remove("hidden");
    document.getElementById("result-section").classList.add("hidden");
});

// Funktion für den Button "Plan erstellen"
document.getElementById("generate-button").addEventListener("click", async () => {
    const userData = {
        tierischeProdukte: document.getElementById("tierischeProdukte").value, 
        kosten_min: document.getElementById("kosten_min").value,
        kosten_max: document.getElementById("kosten_max").value,
        kocherfahrung: document.getElementById("kocherfahrung_value").value,
        zeit_min: document.getElementById("zeit_min").value,
        zeit_max: document.getElementById("zeit_max").value,
        anzahlMahlzeitenProTag: document.getElementById("anzahlMahlzeitenProTag").value,
        snacks: document.getElementById("snacks-ja").checked ? "Ja" : "Nein",
        allergien: getAllergienData,
        kcal_min: document.getElementById("kcal_min").value,
        kcal_max: document.getElementById("kcal_max").value,
        protein_min: document.getElementById("protein_min").value,
        protein_max: document.getElementById("protein_max").value,
        nachhaltigkeit: document.getElementById("nachhaltigkeit_value").value,
        saisonalität: document.getElementById("saisonalität_value").value,
        vorlieben: document.getElementById("preferences").value,
        aktivitäten: document.getElementById("activity").value,
    };


    // Anfrage an die API senden
    try {
        const response = await fetch("http://127.0.0.1:8000/generate-plan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById("plan-output").textContent = data.plan;
            document.getElementById("result-section").classList.remove("hidden");
        } else {
            alert("Fehler beim Generieren des Plans!");
        }
    } catch (error) {
        console.error("Fehler:", error);
        alert("Es gab ein Problem mit der Anfrage.");
    }
});



const kocherfahrungSlider = document.getElementById('kocherfahrung');
const kocherfahrungValue = document.getElementById('kocherfahrung_value');

kocherfahrungSlider.addEventListener('input', () => {
  const labels = ["Sehr gering", "Gering", "Mittel", "Erfahren", "Sehr erfahren"];
  kocherfahrungValue.textContent = labels[kocherfahrungSlider.value - 1];
});

const nachhaltigkeitSlider = document.getElementById('nachhaltigkeit');
const nachhaltigkeitValue = document.getElementById('nachhaltigkeit_value');

nachhaltigkeitSlider.addEventListener('input', () => {
  const labels = ["Sehr unwichtig", "Unwichtig", "Neutral", "Wichtig", "Sehr wichtig"];
  nachhaltigkeitValue.textContent = labels[nachhaltigkeitSlider.value - 1];
});

const saisonalitaetSlider = document.getElementById('saisonalitaet');
const saisonalitaetValue = document.getElementById('saisonalitaet_value');

saisonalitaetSlider.addEventListener('input', () => {
  const labels = ["Sehr unwichtig", "Unwichtig", "Neutral", "Wichtig", "Sehr wichtig"];
  saisonalitaetValue.textContent = labels[saisonalitaetSlider.value - 1];
});



const minSlider = document.getElementById('zeit_min');
const maxSlider = document.getElementById('zeit_max');
const rangeLabels = document.getElementById('range-labels');
const sliderContainer = document.querySelector('.slider-container');

function updateRange() {
  const minValue = parseInt(minSlider.value);
  const maxValue = parseInt(maxSlider.value);

  // Überschneidung verhindern
  if (minValue >= maxValue) {
    minSlider.value = maxValue - 5;
  }

  // Dynamisch den gefüllten Bereich des Sliders anpassen
  const minPercent = ((minSlider.value - minSlider.min) / (minSlider.max - minSlider.min)) * 100;
  const maxPercent = ((maxSlider.value - maxSlider.min) / (maxSlider.max - maxSlider.min)) * 100;

  sliderContainer.style.setProperty('--min-percent', `${minPercent}%`);
  sliderContainer.style.setProperty('--max-percent', `${maxPercent}%`);

  // Label aktualisieren
  rangeLabels.textContent = `${minSlider.value} Min - ${maxSlider.value} Min`;
}

minSlider.addEventListener('input', updateRange);
maxSlider.addEventListener('input', updateRange);

// Initiales Setzen der Werte
updateRange();



const sonstigeCheckbox = document.getElementById('allergie-sonstige');
const sonstigeContainer = document.getElementById('sonstige-container');
const sonstigeInput = document.getElementById('allergie-sonstige-text');

// Zeige oder verstecke das Input-Feld, wenn die Checkbox "Sonstige" ausgewählt wird
sonstigeCheckbox.addEventListener('change', () => {
  if (sonstigeCheckbox.checked) {
    sonstigeContainer.style.display = "block";
  } else {
    sonstigeContainer.style.display = "none";
    sonstigeInput.value = ""; // Lösche den Text, wenn die Checkbox deaktiviert wird
  }
});

// Funktion zum Sammeln aller Allergien-Daten
function getAllergienData() {
  const selectedAllergien = [];
  const allergienCheckboxes = document.querySelectorAll('input[name="allergien"]:checked');

  allergienCheckboxes.forEach(checkbox => {
    if (checkbox.value === "Sonstige" && sonstigeInput.value.trim() !== "") {
      selectedAllergien.push(sonstigeInput.value.trim());
    } else if (checkbox.value !== "Sonstige") {
      selectedAllergien.push(checkbox.value);
    }
  });

  return selectedAllergien;
}

// Beispiel: Allergien-Daten speichern
const user_data = {};
user_data.allergien = getAllergienData();

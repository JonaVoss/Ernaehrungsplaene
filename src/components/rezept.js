// Datenquelle
/*const testData = {
    plan: [
      {
        tag: "Montag",
        gerichte: [
          {
            speise: "Frühstück",
            name: "Avocado-Toast mit Tomaten",
            rezept: {
              zutaten: ["2 Scheiben Vollkornbrot", "1 reife Avocado", "1 kleine Tomate", "Salz", "Pfeffer", "Olivenöl"],
              schritte: [
                "Vollkornbrot toasten.",
                "Avocado halbieren, entkernen und das Fruchtfleisch in eine Schüssel geben. Mit einer Gabel zerdrücken.",
                "Tomate klein schneiden.",
                "Avocadopüree auf die getoasteten Brotscheiben streichen, mit Tomaten belegen und mit Salz, Pfeffer und Olivenöl abschmecken."
              ]
            }
          }
        ]
      }
    ]
};*/

// Bereinigte Daten aus sessionStorage abrufen
const cleanedLlmResult = sessionStorage.getItem("cleanedLlmResult");

if (cleanedLlmResult) {
  const data = JSON.parse(cleanedLlmResult); // JSON parsen
  console.log(data); // Überprüfen
} else {
  console.error("Keine bereinigten Daten im Session Storage gefunden.");
}



document.addEventListener("DOMContentLoaded", () => {
    // Query-Parameter aus der URL lesen
    const params = new URLSearchParams(window.location.search);
    const rezeptName = params.get("name");
  
    if (!rezeptName) {
      alert("Kein Rezeptname angegeben!");
      return;
    }
  
    // Rezeptdaten aus dem Session Storage laden
    const storedData = sessionStorage.getItem("cleanedLlmResult");
    if (!storedData) {
      alert("Keine Rezeptdaten verfügbar!");
      return;
    }
  
    // JSON-Daten parsen
    const data = JSON.parse(storedData);
  
    // Gericht suchen
    let gericht;
    for (const day of data.plan) {
      gericht = day.gerichte.find(meal => meal.name === rezeptName);
      if (gericht) break;
    }
  
    if (!gericht) {
      alert("Gericht nicht gefunden!");
      return;
    }
  
    // Rezeptname anzeigen
    document.getElementById("rezeptName").textContent = gericht.name;
  
    console.log(gericht);
    // Zutaten anzeigen
    const zutatenListe = document.getElementById("zutaten");
    gericht.rezept.zutaten.forEach(zutat => {
      const li = document.createElement("li");
      li.textContent = zutat;
      zutatenListe.appendChild(li);
    });
  
    // Zubereitungsschritte anzeigen
    const schrittListe = document.getElementById("schritte");
    gericht.rezept.schritte.forEach(schritt => {
      const li = document.createElement("li");
      li.textContent = schritt;
      schrittListe.appendChild(li);
    });
});
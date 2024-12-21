document.addEventListener("DOMContentLoaded", () => {
    // LLM-Ergebnis aus sessionStorage abrufen
    const llmResult = sessionStorage.getItem("llmResult");

    // Vor dem Parsen (damit das JSON-Format richtig gelesen werden kann):
    let cleanedOutput = llmResult.replace(/```json/g, "").replace(/```/g, "");
    
    // JSON parsen
    console.log(cleanedOutput);
    const data = JSON.parse(cleanedOutput);

    
    // Gespeicherte, bereinigte Daten für spätere Nutzung in Rezept.js
    sessionStorage.setItem("cleanedLlmResult", cleanedOutput); 


    // Wochentage sammeln
    const tage = data.plan.map(entry => entry.tag);

    // Maximale Anzahl Mahlzeiten pro Tag ermitteln
    let maxMeals = 0;
    data.plan.forEach(day => {
    if (day.gerichte.length > maxMeals) {
        maxMeals = day.gerichte.length;
    }
    });

    // Tabelle dynamisch erstellen
    const table = document.createElement("table");

    // Kopfzeile: Erster leerer Header + Spalten für Wochentage
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const emptyHeader = document.createElement("th");
    headerRow.appendChild(emptyHeader);

    tage.forEach(tag => {
        const th = document.createElement("th");
        th.textContent = tag;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Körper: Zeilen für jede Mahlzeiten-Position
    const tbody = document.createElement("tbody");
    for (let i = 0; i < maxMeals; i++) {
        const row = document.createElement("tr");
  
        // Erste Spalte: Name der Mahlzeit-Position (optional, z. B. "Mahlzeit 1")
        const mealTypeCell = document.createElement("td");
        mealTypeCell.textContent = `Mahlzeit ${i+1}`;
        row.appendChild(mealTypeCell);

        // Für jeden Tag die entsprechende Mahlzeit eintragen
        data.plan.forEach(day => {
            const cell = document.createElement("td");
            const meal = day.gerichte[i];

            if (meal) {
                // Später als Link:
                const link = document.createElement("a");
                link.href = `rezept.html?name=${encodeURIComponent(meal.name)}`;
                link.textContent = meal.name;
                cell.appendChild(link);
            } else {
                cell.textContent = "—"; // Kein Gericht vorhanden
            }

            row.appendChild(cell);
        });
  
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    document.body.appendChild(table);


/*
    // Ergebnis anzeigen
    if (llmResult) {
        document.getElementById("llm-result").textContent = llmResult;
    } else {
        document.getElementById("llm-result").textContent = "Es gab ein Problem. Kein Plan verfügbar.";
    }
*/
});
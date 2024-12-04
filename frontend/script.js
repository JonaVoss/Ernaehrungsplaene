// Funktion zum Umschalten zwischen Tabs (Rezept vs. Ernährungsplan)
document.getElementById("plan-tab").addEventListener("click", () => {
    document.getElementById("plan-section").classList.remove("hidden");
    document.getElementById("result-section").classList.add("hidden");
});

// Funktion für den Button "Plan erstellen"
document.getElementById("generate-button").addEventListener("click", async () => {
    const userData = {
        kcal_min: document.getElementById("kcal-min").value,
        kcal_max: document.getElementById("kcal-max").value,
        preferences: document.getElementById("preferences").value,
        activity: document.getElementById("activity").value
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
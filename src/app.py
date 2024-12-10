from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import openai  # Für die LLM-Kommunikation
import json

# Initialisiere die FastAPI-App
app = FastAPI()


# OpenAI API-Key (sichere Speicherung z. B. in einer .env-Datei empfohlen)
openai.api_key = "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"


# Funktion zum Lesen des Prompt-Templates
def load_prompt_template():
    with open("assets/prompt_template.txt", "r", encoding="utf-8") as file:
        return file.read()

# Endpunkt zur Generierung des Ernährungsplans
@app.post("/generate-plan")
async def generate_plan(request: Request):
    try:
        # 1. Eingaben vom Benutzer empfangen
        user_data = await request.json()
        print("Eingaben erhalten:", user_data)
        

        # 2. Prompt-Template laden
        prompt_template = load_prompt_template()
        

        # 3. Benutzer-Eingaben in das Template einfügen
        prompt = prompt_template.format(

            tierischeProdukte = user_data.get("tierischeProdukte", "nicht angegeben"),
            kosten_min = user_data.get("kosten_min", "nicht angegeben"),
            kosten_max = user_data.get("kosten_max", "nicht angegeben"),
            kocherfahrung = user_data.get("kocherfahrung", "nicht angegeben"),
            zeit_min = user_data.get("zeit_min", "nicht angegeben"),
            zeit_max = user_data.get("zeit_max", "nicht angegeben"),
            anzahlMahlzeitenProTag = user_data.get("anzahlMahlzeitenProTag", "nicht angegeben"),
            snacks = user_data.get("snacks", "nicht angegeben"),
            allergien = user_data.get("allergien", "nicht angegeben"),
            kcal_min = user_data.get("kcal_min", "nicht angegeben"),
            kcal_max  = user_data.get("kcal_max", "nicht angegeben"),
            protein_min = user_data.get("protein_min", "nicht angegeben"),
            protein_max = user_data.get("protein_max", "nicht angegeben"),
            nachhaltigkeit = user_data.get("nachhaltigkeit", "nicht angegeben"),
            saisonalität = user_data.get("saisonalität", "nicht angegeben"),
            vorlieben = user_data.get("vorlieben", "nicht angegeben"),
            aktivitäten = user_data.get("aktivitäten", "nicht angegeben"),
            
        )
        print("Generierter Prompt:\n", prompt)
        

        # 4. Anfrage an das LLM senden
        response = openai.Completion.create(
            engine="text-davinci-003",  # Beispiel für GPT-3.5
            prompt=prompt,
            max_tokens=300
        )
        
        # 5. Plan aus der LLM-Antwort extrahieren
        llm_output = response.choices[0].text.strip()
        

        # 6. Plan zurückgeben
        return JSONResponse(content={"plan": llm_output})
    

    except Exception as e:
        print("Fehler:", e)
        raise HTTPException(status_code=500, detail="Fehler bei der Generierung des Plans")

# Beispielhafter Start der FastAPI-App (für lokales Testen)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)


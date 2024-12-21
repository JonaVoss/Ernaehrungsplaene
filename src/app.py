from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import openai
from openai import OpenAI  # Für die LLM-Kommunikation
import json
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware


# .env-Datei laden
#load_dotenv()

# API-Key aus der Umgebungsvariable
#apiKey = os.getenv("OPENAI_API_KEY")

# Initialisiere die FastAPI-App
app = FastAPI()

openai.api_key = "[Hier musst du den API-Key einfügen]"

# CORS-Konfiguration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # Erlaube Frontend-URL
    allow_credentials=True,
    allow_methods=["*"],  # Erlaube alle Methoden (GET, POST, usw.)
    allow_headers=["*"],  # Erlaube alle Header
)


# Funktion zum Lesen des Prompt-Templates
def load_prompt_template():
    with open("assets/prompt_v3.txt", "r", encoding="utf-8") as file:
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
        #print(prompt_template)
        
        # 3. Benutzer-Eingaben in das Template einfügen
        prompt = prompt_template.format(

            tierischeProdukte = user_data.get("tierischeProdukte", "nicht angegeben") or "nicht angegeben",
            kosten_min = user_data.get("kosten_min", "nicht angegeben") or "nicht angegeben",
            kosten_max = user_data.get("kosten_max", "nicht angegeben") or "nicht angegeben",
            kocherfahrung = user_data.get("kocherfahrung", "nicht angegeben") or "nicht angegeben",
            zeit_min = user_data.get("zeit_min", "nicht angegeben") or "nicht angegeben",
            zeit_max = user_data.get("zeit_max", "nicht angegeben") or "nicht angegeben",
            anzahlMahlzeitenProTag = user_data.get("anzahlMahlzeitenProTag", "nicht angegeben") or "nicht angegeben",
            snacks = user_data.get("snacks", "nicht angegeben") or "nicht angegeben",
            allergien = user_data.get("allergien", "nicht angegeben") or "nicht angegeben",
            kcal_min = user_data.get("kcal_min", "nicht angegeben") or "nicht angegeben",
            kcal_max  = user_data.get("kcal_max", "nicht angegeben") or "nicht angegeben",
            protein_min = user_data.get("protein_min", "nicht angegeben") or "nicht angegeben",
            protein_max = user_data.get("protein_max", "nicht angegeben") or "nicht angegeben",
            nachhaltigkeit = user_data.get("nachhaltigkeit", "nicht angegeben") or "nicht angegeben",
            saisonalitaet = user_data.get("saisonalitaet", "nicht angegeben") or "nicht angegeben",
            vorlieben = user_data.get("vorlieben", "nicht angegeben") or "nicht angegeben",
            aktivitäten = user_data.get("aktivitäten", "nicht angegeben") or "nicht angegeben",
        )
        
        #print("Generierter Prompt:\n", prompt)
        

        # 4. Anfrage an das LLM senden
        #response = client.completions.create(
        #    model="gpt-3.5-turbo-instruct",  # Beispiel für GPT-3.5
        #    prompt=prompt,
        #    max_tokens=300
        #)

        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=4000
        )
        
        # 5. Plan aus der LLM-Antwort extrahieren
        #llm_output = response.choices[0].text.strip()
        llm_output = response.choices[0].message.content.strip()
        print(llm_output)

        # 6. Plan zurückgeben
        return JSONResponse(content={"plan": llm_output})
    

    except Exception as e:
        print("Fehler:", e)
        raise HTTPException(status_code=500, detail="Fehler bei der Generierung des Plans")

# Beispielhafter Start der FastAPI-App (für lokales Testen)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)


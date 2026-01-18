from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse
from nlp.medical_ai import ai_soap_summary


import shutil
import os

from openai import OpenAI

from stt.whisper_stt import transcribe_audio
from nlp.soap_formatter import format_to_soap

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


app = FastAPI(title="AI Medical Scribe")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/", response_class=HTMLResponse)
def home():
    with open("frontend/index.html", "r") as f:
        return f.read()

def root():
    return {"message": "AI Medical Scribe backend is running successfully"}

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = transcribe_audio(file_path)
    soap = generate_soap_notes(text)

    return {
        "transcript": text,
        "soap_notes": soap
    }

def generate_soap_notes(transcription: str):
    prompt = f"""
You are a medical assistant.

Convert the following doctor-patient conversation into SOAP notes.

Transcription:
{transcription}

Return output in this exact format:

Subjective:
Objective:
Assessment:
Plan:
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content


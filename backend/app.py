from fastapi import FastAPI, UploadFile, File
import shutil
import os

from stt.whisper_stt import transcribe_audio

app = FastAPI(title="AI Medical Scribe")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def root():
    return {"message": "AI Medical Scribe backend is running successfully"}

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = transcribe_audio(file_path)

    return {
        "filename": file.filename,
        "transcription": text
    }

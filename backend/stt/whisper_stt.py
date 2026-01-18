import whisper

# Load Whisper model once
model = whisper.load_model("base")

def transcribe_audio(audio_path: str) -> str:
    """
    Transcribe an audio file using Whisper
    """
    result = model.transcribe(audio_path)
    return result["text"]

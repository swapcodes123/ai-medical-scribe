import whisper

# Load model ONCE when the file is imported
model = whisper.load_model("base")

def transcribe_audio(audio_path: str) -> str:
    """
    Transcribes an audio file using Whisper
    and returns plain text.
    """
    result = model.transcribe(audio_path)
    return result["text"]

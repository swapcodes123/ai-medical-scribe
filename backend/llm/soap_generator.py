import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_soap_notes(transcript: str) -> dict:
    prompt = f"""
You are a medical scribe.

Convert the following doctor-patient conversation into SOAP notes.

Transcript:
{transcript}

Return strictly in this format:

Subjective:
Objective:
Assessment:
Plan:
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a professional medical documentation assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    soap_text = response.choices[0].message.content

    return {
        "soap_notes": soap_text
    }

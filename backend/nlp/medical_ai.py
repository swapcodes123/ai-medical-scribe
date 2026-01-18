from openai import OpenAI
client = OpenAI()

def ai_soap_summary(transcript: str):
    prompt = f"""
Convert the following doctor-patient conversation into SOAP notes:

Transcript:
{transcript}

Return strictly in JSON with keys:
Subjective, Objective, Assessment, Plan
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content

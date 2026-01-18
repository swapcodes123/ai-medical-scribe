def format_to_soap(transcript: str):
    return {
        "Subjective": transcript,
        "Objective": "Vitals and examination details not provided.",
        "Assessment": "Assessment to be determined based on symptoms.",
        "Plan": "Further tests or follow-up recommended."
    }

import { useState } from "react";
console.log("App.jsx loaded");

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>AI Medical Scribe</h1>
      <p>Upload an audio file to generate transcription and SOAP notes.</p>

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button
  disabled={!file || loading}
  onClick={async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Backend not reachable");
      console.error(error);
    }

    setLoading(false);
  }}
>
  {loading ? "Processing..." : "Upload & Transcribe"}
</button>




      <hr />

      {result && (
  <div style={{ marginTop: "20px", textAlign: "left" }}>
    <h3>Transcript</h3>
    <p>{result.transcript}</p>

    <h3>SOAP Notes</h3>
    <pre style={{ whiteSpace: "pre-wrap" }}>
      {result.soap_notes}
    </pre>
  </div>
)}

    </div>
  );
}

export default App;



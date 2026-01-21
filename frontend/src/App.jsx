import { useEffect, useState } from "react";
import jsPDF from "jspdf";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert("Backend not reachable");
      console.error(err);
    }

    setLoading(false);
  };

  // TXT export
  const downloadTXT = () => {
    const blob = new Blob([result.soap_notes], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SOAP_Notes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // PDF export
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Times", "Normal");
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(result.soap_notes, 180);
    doc.text(lines, 10, 20);

    doc.save("SOAP_Notes.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            🩺 AI Medical Scribe
          </h1>

          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600
                       text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Upload a doctor–patient audio recording to generate transcription and SOAP notes.
        </p>

        {/* Upload */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-700 dark:text-gray-200"
          />

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`mt-4 px-6 py-2 rounded-lg text-white font-medium
              ${loading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            {loading ? "Processing..." : "Upload & Transcribe"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                📝 Transcript
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-gray-700 dark:text-gray-200">
                {result.transcript}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                📋 SOAP Notes
              </h2>

              <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                {result.soap_notes}
              </pre>

              {/* Export buttons */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={downloadTXT}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  ⬇️ Download TXT
                </button>

                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  ⬇️ Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

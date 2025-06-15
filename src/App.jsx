import { BACKEND_URL } from "./config";
import { useState } from "react";

const tools = ["SQL", "Excel", "Power BI", "Python", "Tableau", "Looker", "Google Sheets", "Snowflake", "R"];

export default function App() {
  const [tool, setTool] = useState("SQL");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAgent = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("https://ai-agent-backend-7utn.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, question }),
      });

      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer("❌ Error connecting to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
      <h1 className="text-3xl font-bold mb-6 mt-6">AI Assistant for Analysts</h1>

      <select
        className="mb-4 p-2 rounded border bg-white"
        value={tool}
        onChange={(e) => setTool(e.target.value)}
      >
        {tools.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <textarea
        className="w-full max-w-md p-3 rounded border mb-4"
        rows={4}
        placeholder={`Ask a question about ${tool}...`}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={askAgent}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <div className="mt-6 w-full max-w-md bg-white p-4 rounded shadow">
          <strong>Answer:</strong>
          <pre className="whitespace-pre-wrap mt-2">{answer}</pre>
        </div>
      )}
    </div>
  );
}

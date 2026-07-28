"use client";

import { useState } from "react";

interface ScriptGeneratorProps {
  userProducts?: string[];
  userId?: string;
}

export default function ScriptGenerator({ userProducts = [], userId = "" }: ScriptGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("code");
  const [result, setResult] = useState<string>("");
  const [resultType, setResultType] = useState<"code" | "video" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasGameDevAccess = userProducts.includes("prod_2NCaLmIX3miCc");
  const hasVideoGenAccess = userProducts.includes("prod_rvBtXBKVYH9wR");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    if (type === "code" && !hasGameDevAccess) {
      setError("Game Development requires Zony AI Dev subscription");
      return;
    }

    if (type === "video" && !hasVideoGenAccess) {
      setError("Video generation requires Video Generation AI subscription");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type, userId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await response.json();
      setResult(data.result);
      setResultType(type as "code" | "video");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (resultType === "code") {
      navigator.clipboard.writeText(result);
      alert("Copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (resultType === "code") {
      const element = document.createElement("a");
      const file = new Blob([result], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `generated-code-${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else if (resultType === "video") {
      const link = document.createElement("a");
      link.href = result;
      link.download = `generated-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>🚀 Zony AI Generator</h1>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          Select Generation Type:
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", width: "100%", maxWidth: "400px" }}
        >
          <option value="code" disabled={!hasGameDevAccess}>
            💻 Game Development {!hasGameDevAccess ? "(Locked)" : "(Groq)"}
          </option>
          <option value="video" disabled={!hasVideoGenAccess}>
            🎬 Video Generation {!hasVideoGenAccess ? "(Locked)" : "(AI)"}
          </option>
        </select>
        {!hasGameDevAccess && (
          <p style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>
            💡 Game Development requires Zony AI Dev subscription
          </p>
        )}
        {!hasVideoGenAccess && (
          <p style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>
            💡 Video Generation requires Video Generation AI subscription
          </p>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          Enter Your Prompt:
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            type === "code"
              ? "Describe the game mechanic you want..."
              : "Describe the video concept..."
          }
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "10px",
            fontSize: "16px",
            fontFamily: "monospace",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          marginRight: "10px"
        }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <div style={{ color: "red", marginTop: "20px", fontWeight: "bold" }}>{error}</div>}

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>Result:</h3>
          {resultType === "code" && (
            <pre
              style={{
                backgroundColor: "#f5f5f5",
                padding: "15px",
                borderRadius: "4px",
                overflow: "auto",
                maxHeight: "400px",
                border: "1px solid #ddd",
                fontFamily: "monospace",
                fontSize: "14px"
              }}
            >
              {result}
            </pre>
          )}
          {resultType === "video" && (
            <video
              src={result}
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                borderRadius: "4px",
                border: "1px solid #ddd"
              }}
              controls
            />
          )}

          <div style={{ marginTop: "15px" }}>
            {resultType === "code" && (
              <>
                <button
                  onClick={handleCopy}
                  style={{
                    padding: "8px 16px",
                    marginRight: "10px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  📋 Copy
                </button>
              </>
            )}
            <button
              onClick={handleDownload}
              style={{
                padding: "8px 16px",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              ⬇️ Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

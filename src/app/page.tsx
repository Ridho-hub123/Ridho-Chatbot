"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: prompt }]);
    setLoading(true);
    setPrompt("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    const aiResponse = data.result || "Tidak ada jawaban";

    setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    setLoading(false);
  };

  return (
    <main
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #0d1b2a, #1b263b)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#112d4e",
          padding: "15px",
          display: "flex",
          alignItems: "center",
          color: "#e0eafc",
          fontWeight: "bold",
          borderBottom: "1px solid #1e3a5f",
        }}
      >
        <span style={{ marginRight: "10px", fontSize: "20px" }}>🤖</span>
        Ridho Chatbot
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          padding: "15px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background: msg.sender === "user" ? "#2563eb" : "#1b1f43ff",
              color: "#fff",
              padding: "10px 14px",
              borderRadius: "12px",
              maxWidth: "75%",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "#1b4332",
              color: "#a3d5ff",
              padding: "10px 14px",
              borderRadius: "12px",
              fontStyle: "italic",
            }}
          >
            Mengetik...
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          padding: "10px",
          background: "#112d4e",
          borderTop: "1px solid #1e3a5f",
        }}
      >
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ketik pesan..."
          style={{
            flex: 1,
            padding: "10px 14px",
            border: "none",
            outline: "none",
            borderRadius: "8px",
            background: "#1b263b",
            color: "#fff",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginLeft: "8px",
            padding: "0 18px",
            background: "#00d4ff",
            color: "#0a192f",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 0 10px rgba(0, 212, 255, 0.7)",
            transition: "0.2s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 212, 255, 1)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 212, 255, 0.7)")
          }
        >
          ➤
        </button>
      </form>
    </main>
  );
}

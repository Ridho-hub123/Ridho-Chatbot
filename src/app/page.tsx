"use client";
import { useState, useEffect } from "react";

type Message = { sender: "user" | "ai"; text: string };
type Chat = { id: number; title: string; messages: Message[] };

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ state untuk nama sambutan
  const [nama, setNama] = useState("Ridho");
  const [showSettings, setShowSettings] = useState(false); // ✅ tambahan setting

  // load dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ridho-chats");
    if (saved) {
      const parsed = JSON.parse(saved);
      setChats(parsed);
      setActiveChatId(parsed[0]?.id ?? null);
    }

    // ✅ load nama dari localStorage
    const savedNama = localStorage.getItem("ridho-nama");
    if (savedNama) setNama(savedNama);
  }, []);

  // simpan ke localStorage
  useEffect(() => {
    localStorage.setItem("ridho-chats", JSON.stringify(chats));
  }, [chats]);

  // ✅ simpan nama ke localStorage
  useEffect(() => {
    localStorage.setItem("ridho-nama", nama);
  }, [nama]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || activeChatId === null) return;

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              title:
                chat.messages.length === 0
                  ? prompt.slice(0, 20) + (prompt.length > 20 ? "..." : "")
                  : chat.title,
              messages: [...chat.messages, { sender: "user", text: prompt }],
            }
          : chat
      )
    );

    const currentPrompt = prompt;
    setPrompt("");
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: currentPrompt }),
    });

    const data = await res.json();
    const aiResponse = data.result || "Tidak ada jawaban";

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, { sender: "ai", text: aiResponse }],
            }
          : chat
      )
    );
    setLoading(false);
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now(),
      title: `Chat ${chats.length + 1}`,
      messages: [],
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  const handleDeleteChat = (id: number) => {
    const filtered = chats.filter((c) => c.id !== id);
    setChats(filtered);
    if (activeChatId === id) {
      setActiveChatId(filtered[0]?.id ?? null);
    }
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  const ideaQuestions = [
    "Apa itu AI?",
    "Bagaimana cara membuat website?",
    "Tips belajar cepat?",
    "Rekomendasi buku pengembangan diri?",
  ];

  return (
    <main
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        fontFamily: "'Roboto', sans-serif",
        background: "#0d1b2a",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          background: "#112d4e",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #1e3a5f",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={handleNewChat}
          style={{
            padding: "10px",
            background: "#00d4ff",
            color: "#0a192f",
            border: "none",
            borderRadius: "6px",
            margin: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + New Chat
        </button>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                cursor: "pointer",
                background:
                  chat.id === activeChatId ? "#1b263b" : "transparent",
                borderBottom: "1px solid #1e3a5f",
              }}
            >
              <span onClick={() => setActiveChatId(chat.id)}>{chat.title}</span>
              <button
                onClick={() => handleDeleteChat(chat.id)}
                style={{
                  marginLeft: "8px",
                  background: "transparent",
                  border: "none",
                  color: "#ff6b6b",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#112d4e",
            padding: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#e0eafc",
            fontWeight: "bold",
            borderBottom: "1px solid #1e3a5f",
          }}
        >
          <span>Ridho Chatbot</span>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* ✅ tombol setting */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ⚙️
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              {sidebarOpen ? "⏴" : "⏵"}
            </button>
          </div>
        </div>

        {/* ✅ Popup setting nama */}
        {showSettings && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: "20px",
              background: "#1b263b",
              padding: "16px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              zIndex: 20,
              color: "#fff",
              minWidth: "220px",
            }}
          >
            <label style={{ fontSize: "14px" }}>Nama Sambutan:</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #334",
                background: "#0d1b2a",
                color: "#fff",
              }}
            />
          </div>
        )}

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: "15px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            background: "linear-gradient(135deg, #0d1b2a, #1b263b)",
          }}
        >
          {/* Ide pertanyaan */}
          {activeChat?.messages.length === 0 && (
            <div
              style={{
                color: "#a3d5ff",
                textAlign: "center",
                marginTop: "40px",
              }}
            >
              <h3 style={{ marginBottom: "14px" }}>💡 Ide untuk ditanyakan:</h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                {ideaQuestions.map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(idea)}
                    style={{
                      padding: "10px 18px",
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "999px", // pill shape
                      color: "#1b263b",
                      cursor: "pointer",
                      fontWeight: 500,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {idea}
                  </button>
                ))}
              </div>

              {/* ✅ Sambutan personal */}
              <p
                style={{
                  marginTop: "24px",
                  fontSize: "16px",
                  color: "#e0eafc",
                  fontWeight: "500",
                }}
              >
                Bagaimana harimu,{" "}
                <span style={{ color: "#00d4ff" }}>{nama}</span>?
              </p>
            </div>
          )}

          {/* Pesan chat */}
          {activeChat?.messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                background: msg.sender === "user" ? "#2563eb" : "#1e293b",
                color: "#fff",
                padding: "12px 16px",
                borderRadius: "14px",
                maxWidth: "75%",
                boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
                whiteSpace: "pre-line",
                lineHeight: "1.6",
                fontSize: "15px",
                border: msg.sender === "ai" ? "1px solid #00d4ff55" : "none",
              }}
            >
              {msg.text}
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div
              style={{
                alignSelf: "flex-start",
                background: "#1b4332",
                padding: "10px 14px",
                borderRadius: "12px",
                display: "flex",
                gap: "4px",
                alignItems: "center",
              }}
            >
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <style jsx>{`
                .dot {
                  width: 6px;
                  height: 6px;
                  background: #a3d5ff;
                  border-radius: 50%;
                  display: inline-block;
                  animation: bounce 1.2s infinite;
                }
                .dot:nth-child(1) {
                  animation-delay: 0s;
                }
                .dot:nth-child(2) {
                  animation-delay: 0.2s;
                }
                .dot:nth-child(3) {
                  animation-delay: 0.4s;
                }
                @keyframes bounce {
                  0%,
                  80%,
                  100% {
                    transform: translateY(0);
                  }
                  40% {
                    transform: translateY(-6px);
                  }
                }
              `}</style>
            </div>
          )}
        </div>

        {/* Input */}
        {activeChat && (
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
              }}
            >
              ➤
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

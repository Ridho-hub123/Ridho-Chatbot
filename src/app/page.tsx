"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string; timestamp: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling to the bottom

  // Function to scroll to the bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll to the bottom whenever messages state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    const currentTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message to the messages state
    const userMessage = { sender: "user" as const, text: prompt, timestamp: currentTimestamp };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setPrompt(""); // Clear input after sending

    setLoading(true);
    setError(null);

    try {
      // Simulate API call to /api/generate
      // Ensure your /api/generate endpoint is functional and returns the correct data.
      // This is a placeholder for demonstration purposes.
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt }), // Send the actual prompt
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data?.error || "Gagal mendapatkan jawaban. Silakan coba lagi."
        );
      }

      // Add AI's answer to the messages state
      const aiMessage = { sender: "ai" as const, text: data.output, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-blue-950 font-sans antialiased">
      {/* Modern Dark Header */}
      <header className="flex items-center p-4 bg-gray-950 shadow-lg z-10 border-b border-gray-800">
        <div className="w-11 h-11 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-xl mr-3 shadow-md">
          R
        </div>
        <div className="flex-grow">
          <h1 className="text-xl font-bold text-white tracking-wide">Ridho FC Bot</h1>
          <p className="text-sm text-teal-400 font-medium">Online</p>
        </div>
        {/* Optional tech-themed icons on the right */}
        <div className="flex space-x-4 text-gray-400">
          <button className="hover:text-teal-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="hover:text-teal-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Chat Bubbles Area with Robot Background */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://placehold.co/600x400/2C3E50/E0F2F7/&text=Tech+Robot+Background')] bg-cover bg-center bg-fixed">
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full text-gray-300 text-center text-lg px-4">
            <p className="p-4 bg-gray-800 rounded-lg shadow-sm">
              Mulai percakapan dengan Ridho FC Bot untuk mendapatkan informasi terbaru!
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } animate-fade-in`}
          >
            <div
              className={`relative py-2 px-3 rounded-lg max-w-[75%] shadow-md text-sm ${
                msg.sender === "user"
                  ? "bg-teal-600 text-white rounded-br-none" // User's tech-blue bubble
                  : "bg-gray-700 text-gray-100 rounded-bl-none" // AI's dark neutral bubble
              }`}
              style={{
                // Subtle modern pointer bubble
                clipPath: msg.sender === "user"
                  ? "polygon(0% 0%, 100% 0%, 100% 100%, 15% 100%, 0% calc(100% - 8px), 0% 0%)"
                  : "polygon(0% 0%, 100% 0%, 100% calc(100% - 8px), 85% 100%, 0% 100%, 0% 0%)"
              }}
            >
              <p className="whitespace-pre-wrap pr-10">{msg.text}</p>
              <span className="absolute bottom-1 right-2 text-xs text-gray-200">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 p-2 rounded-lg max-w-[75%] shadow-sm text-gray-200 text-sm animate-pulse">
              <span className="">Bot sedang mengetik...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-sm">
              Error: {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Empty element for scrolling */}
      </main>

      {/* Modern Dark Input Area */}
      <form
        onSubmit={handleGenerate}
        className="flex items-center p-3 bg-gray-950 shadow-xl border-t border-gray-800 z-10"
      >
        <div className="relative flex-grow mr-2">
          <textarea
            className="w-full pl-5 pr-12 py-3 border border-gray-700 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-white bg-gray-800 shadow-inner"
            rows={1} // Default 1 row, can expand
            placeholder="Ketik pesan..."
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              e.target.style.height = 'auto'; // Reset height
              e.target.style.height = e.target.scrollHeight + 'px'; // Set height to scroll height
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { // Send on Enter, but not on Shift+Enter
                e.preventDefault();
                handleGenerate(e);
              }
            }}
            style={{ maxHeight: '120px' }} // Max height for textarea
          />
          {/* Icons inside the input field */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
            <button type="button" className="text-gray-500 hover:text-teal-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button type="button" className="text-gray-500 hover:text-teal-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13.5" />
              </svg>
            </button>
          </div>
        </div>
        <button
          className="p-3 rounded-full bg-teal-500 text-white shadow-lg flex-shrink-0 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 active:scale-95"
          disabled={loading || !prompt.trim()}
          type="submit"
        >
          {loading ? (
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transform -rotate-45" // Rotated for a modern send icon look
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

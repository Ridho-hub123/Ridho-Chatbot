import { NextResponse } from "next/server";

export const runtime = "nodejs"; // Supaya process.env bisa dipakai di Vercel

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: 'Field "prompt" wajib diisi (string).' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY belum diset di environment.");
      return NextResponse.json(
        { error: "GEMINI_API_KEY belum diset di environment." },
        { status: 500 }
      );
    }

    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`❌ Gemini API error ${res.status}:`, errText);
      return NextResponse.json(
        { error: `Gemini API error ${res.status}: ${errText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("✅ Gemini API response:", JSON.stringify(data, null, 2));

    // Ambil teks dari berbagai kemungkinan struktur respons
    let output = "Tidak ada jawaban.";
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      output = data.candidates[0].content.parts[0].text.trim();
    } else if (data?.candidates?.[0]?.output) {
      output = data.candidates[0].output.trim();
    }

    return NextResponse.json({ result: output });
  } catch (err: unknown) {
    console.error("❌ Server error:", err);
    if (err instanceof Error) {
      return NextResponse.json(
        { error: `${err.message} Terjadi kesalahan server.` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan server yang tidak diketahui." },
      { status: 500 }
    );
  }
}

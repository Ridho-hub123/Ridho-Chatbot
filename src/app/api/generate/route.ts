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
      throw new Error(`Gemini API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Tidak ada jawaban.";

    return NextResponse.json({ result: output });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: `${err.message} Terjadi kesalahan server.` },
        { status: 500 }
      );
    }
  }
}

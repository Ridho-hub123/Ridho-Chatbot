// src/app/api/generate/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt wajib diisi" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY belum diset di .env.local" },
        { status: 500 }
      );
    }

    // Inisialisasi SDK & pilih model (cepat & murah: 1.5-flash)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Panggil Gemini
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ output: text });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal memproses permintaan", detail: `${err?.message ?? err}` },
      { status: 500 }
    );
  }
}

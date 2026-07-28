import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const WHOP_API_KEY = process.env.WHOP_API_KEY;

const systemPrompts: Record<string, string> = {
  "groq-gamedev": "You are a game development code expert. Generate clean, optimized code for game mechanics, physics, AI, and graphics. Focus on Unity C#, Unreal Engine C++, or Godot GDScript.",
  "groq-videogen": "You are a video content creator and scriptwriter. Generate compelling video scripts, concepts, and ideas for YouTube, TikTok, and short-form content. Include hooks, pacing, and emotional beats."
};

async function generateWithGroq(prompt: string, model: string) {
  const systemPrompt = systemPrompts[model] || systemPrompts["groq-gamedev"];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 2048,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Groq API error");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response generated";
}

async function generateVideo(prompt: string) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b",
    {
      headers: { "Authorization": `Bearer ${process.env.HUGGING_FACE_API_KEY}` },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!response.ok) {
    throw new Error("Video generation failed");
  }

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:video/mp4;base64,${base64}`;
}

async function checkProductAccess(userId: string, productId: string) {
  try {
    const member = await fetch(`https://api.whop.com/api/v1/members/${userId}`, {
      headers: { "Authorization": `Bearer ${WHOP_API_KEY}` }
    });

    if (!member.ok) return false;

    const memberData = await member.json();
    const userProducts = memberData.memberships?.map((m: any) => m.product_id) || [];
    
    return userProducts.includes(productId);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, type = "code", userId } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Check access for locked features
    if (type === "code") {
      if (!userId || !await checkProductAccess(userId, "prod_2NCaLmIX3miCc")) {
        return NextResponse.json({ error: "Game Development requires Zony AI Dev subscription" }, { status: 403 });
      }
    } else if (type === "video") {
      if (!userId || !await checkProductAccess(userId, "prod_rvBtXBKVYH9wR")) {
        return NextResponse.json({ error: "Video generation requires Video Generation AI subscription" }, { status: 403 });
      }
    }

    let result: string;

    if (type === "code") {
      if (!GROQ_API_KEY) {
        return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
      }
      result = await generateWithGroq(prompt, "groq-gamedev");
    } else if (type === "video") {
      if (!process.env.HUGGING_FACE_API_KEY) {
        return NextResponse.json({ error: "Hugging Face API key not configured" }, { status: 500 });
      }
      result = await generateVideo(prompt);
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

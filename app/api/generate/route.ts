import Groq from "groq-sdk";
import { HfInference } from "@huggingface/inference";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: Request) {
  try {
    const { type, prompt } = await request.json();

    if (!type || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing type or prompt" }),
        { status: 400 }
      );
    }

    let result;

    if (type === "game-dev") {
      const systemPrompt = `You are an expert game developer. Generate clean, production-ready game code based on the user's request. Be flexible with languages - suggest and use Unity C#, Godot GDScript, or generic pseudocode as appropriate. Include comments explaining key sections.`;

      const message = await groq.chat.completions.create({
        model: "mixtral-8x7b-32768",
        max_tokens: 2048,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = message.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Groq returned empty content");
      }

      result = {
        type: "game-dev",
        content: content,
      };
    } else if (type === "video-gen") {
      try {
        const videoResponse = await hf.textToVideo({
          inputs: prompt,
          model: "damo-vilab/text-to-video-ms-1.7b",
          parameters: {
            negative_prompt: "low quality, blurry",
            num_inference_steps: 25,
            height: 576,
            width: 1024,
          },
        } as any);

        const videoBuffer = await (videoResponse as Blob).arrayBuffer();
        const base64Video = Buffer.from(videoBuffer).toString("base64");

        result = {
          type: "video-gen",
          content: base64Video,
          contentType: "video/mp4",
          message: "Video generated successfully.",
        };
      } catch (videoError) {
        console.error("Video generation error:", videoError);
        
        const scriptResponse = await groq.chat.completions.create({
          model: "mixtral-8x7b-32768",
          max_tokens: 1024,
          messages: [
            {
              role: "system",
              content: `You are a creative video scriptwriter and storyboard designer. Generate detailed video descriptions, storyboards, and scripts.`,
            },
            {
              role: "user",
              content: `Create a detailed video storyboard and script for: "${prompt}". Include scenes, timing, directions, effects, and dialogue.`,
            },
          ],
        });

        const content = scriptResponse.choices[0]?.message?.content;
        if (!content) {
          throw new Error("Groq script generation returned empty content");
        }

        result = {
          type: "video-gen",
          content: content,
          message: "Video script generated (video generation unavailable).",
        };
      }
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid type" }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Generation error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Generation failed",
        details: error
      }),
      { status: 500 }
    );
  }
}

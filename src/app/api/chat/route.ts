import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { CohereClient } from "cohere-ai";
import Groq from "groq-sdk";

const cohere  = new CohereClient({ token: process.env.COHERE_API_KEY! });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const groq    = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { question, conversationHistory = [] } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // ── Greeting detection — respond before hitting the RAG pipeline ──────────
    const greetingPattern = /^(hey|hi|hello|howdy|sup|what'?s up|greetings|yo|hiya|namaste|good (morning|afternoon|evening))[!?.,:]*$/i;
    if (greetingPattern.test(question.trim())) {
      const greetings = [
        "🏏 Hey there! I'm CricketIQ — your personal cricket expert. I know everything about cricket rules, tactics, formats, dismissals, and more.\n\nTry asking me something like:\n• \"What is the LBW rule?\"\n• \"How does the DLS method work?\"\n• \"What is Mankading?\"\n• \"Explain the Super Over rule\"\n\nWhat cricket question do you have for me?",
        "🏏 Hello! Welcome to CricketIQ — the cricket rulebook, made conversational.\n\nI'm here to answer all your cricket questions — from basic rules to complex tactics. Whether you're a die-hard fan or just starting out, just ask away!\n\nWhat would you like to know?",
        "🏏 Hi! I'm CricketIQ, and cricket is the only thing I talk about! 😄\n\nI've got answers on 40+ cricket topics — LBW, DLS, DRS, spin bowling, fielding positions, dismissals, power plays, and much more.\n\nGo ahead — ask me anything about cricket!",
      ];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      return NextResponse.json({
        answer: randomGreeting,
        sources: [],
        relevanceScores: [],
        chunksUsed: 0,
      });
    }
    // ── Step 1: Convert question to vector via Cohere ─────────────────────────
    const embedResponse = await cohere.embed({
      texts         : [question.trim()],
      model         : "embed-english-v3.0", // 1024 dims — matches Pinecone index
      inputType     : "search_query",       // asymmetric: query vs document
      embeddingTypes: ["float"],
    });

    const queryVector =
      ((embedResponse.embeddings as { float?: number[][] }).float ?? [])[0];

    if (!queryVector) {
      throw new Error("Failed to generate embedding for question.");
    }

    // ── Step 2: Search Pinecone for similar chunks ────────────────────────────
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME || "cricket-bot");

    const searchResults = await index.query({
      vector         : queryVector,
      topK           : 5,
      includeMetadata: true,
    });

    // ── Step 3: Extract relevant context ─────────────────────────────────────
    const relevantChunks = searchResults.matches
      .filter((match) => (match.score ?? 0) > 0.3)
      .map((match) => ({
        text : match.metadata?.text  as string,
        title: (match.metadata?.topic ?? match.metadata?.title) as string,
        score: match.score,
      }));

    const sources = [
      ...new Set(relevantChunks.map((c) => c.title).filter(Boolean)),
    ];

    const context = relevantChunks
      .map((c) => `[${c.title}]\n${c.text}`)
      .join("\n\n---\n\n");

    // ── Step 4: Send context + question to Groq (llama-3.3-70b) ──────────────
    // If no relevant chunks found, refuse early before calling Groq
    if (relevantChunks.length === 0) {
      return NextResponse.json({
        answer: "❌ I don't have information about that in my cricket knowledge base. I can only answer questions based on the 40 cricket topics I've been trained on — such as dismissal rules, DLS method, bowling techniques, fielding positions, power plays, DRS, the super over, ball tampering, and more. Please ask a cricket-specific question!",
        sources: [],
        relevanceScores: [],
        chunksUsed: 0,
      });
    }

    const systemPrompt = `You are CricketIQ — a cricket knowledge assistant that answers EXCLUSIVELY from the provided knowledge base context.

STRICT RULES — NEVER BREAK THESE:
1. You MUST only use the information in the KNOWLEDGE BASE CONTEXT below. Do NOT use your own training knowledge about cricket or anything else.
2. If the context does not contain enough information to answer, respond EXACTLY with: "I don't have information about that in my cricket knowledge base. Try asking about dismissal rules, DLS method, bowling types, fielding positions, power plays, DRS, super over, or ball tampering."
3. Do NOT add any facts, statistics, or details that are not explicitly present in the context.
4. Do NOT answer questions unrelated to cricket at all — respond with: "I can only answer cricket-related questions from my knowledge base."
5. Be enthusiastic and conversational, but stay strictly within the context provided.

KNOWLEDGE BASE CONTEXT (answer ONLY from this):
${context}`;
    interface ConversationMessage {
      role: "user" | "assistant";
      content: string;
    }
    const messages: ConversationMessage[] = [
      ...conversationHistory.slice(-6),
      { role: "user", content: question },
    ];

    const groqResponse = await groq.chat.completions.create({
      model   : "llama-3.3-70b-versatile", // fast, free, 70B — best on Groq
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.3,
      max_tokens : 1024,
    });

    const answer =
      groqResponse.choices[0]?.message?.content ??
      "Sorry, I could not generate a response.";

    return NextResponse.json({
      answer,
      sources,
      relevanceScores: relevantChunks.map((c) => ({
        title: c.title,
        score: Math.round((c.score ?? 0) * 100),
      })),
      chunksUsed: relevantChunks.length,
    });
  } catch (error: unknown) {
    console.error("[RAG API Error]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

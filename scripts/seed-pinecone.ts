/**
 * SEED SCRIPT — Reads cricket-knowledge.json and upserts to Pinecone
 * Embeddings: Cohere embed-english-v3.0 (1024 dims — no truncation needed)
 * Run once: npm run seed
 */

import { Pinecone, type PineconeRecord } from "@pinecone-database/pinecone";
import { CohereClient } from "cohere-ai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const EMBEDDING_MODEL = "embed-english-v3.0"; // natively 1024 dims
const EMBEDDING_DIM = 1024;

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY! });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// ─── Types ─────────────────────────────────────────────────────────────────────
interface CricketEntry {
  id: string;
  topic: string;
  content: string;
}

// ─── Chunking Helper ───────────────────────────────────────────────────────────
function chunkText(text: string, chunkSize = 120, overlap = 20): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];
  let i = 0;

  while (i < words.length) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
    i += chunkSize - overlap;
  }
  return chunks;
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function seedPinecone() {
  const indexName = process.env.PINECONE_INDEX_NAME || "cricket-bot";

  // ── 1. Load JSON ─────────────────────────────────────────────────────────
  const jsonPath = path.resolve("public/cricket-knowledge.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`JSON file not found at: ${jsonPath}`);
  }

  const documents: CricketEntry[] = JSON.parse(
    fs.readFileSync(jsonPath, "utf-8")
  );

  console.log(`\n🏏 Cricket RAG — Seeding Pinecone`);
  console.log(`   📂 Source : public/cricket-knowledge.json`);
  console.log(`   📦 Index  : ${indexName}`);
  console.log(`   📄 Topics : ${documents.length}`);
  console.log(`   🧠 Model  : Cohere ${EMBEDDING_MODEL} (dim=${EMBEDDING_DIM})`);
  console.log("\n" + "━".repeat(60));

  // ── 2. Create index if needed ─────────────────────────────────────────────
  const existing = await pinecone.listIndexes();
  const exists = existing.indexes?.some((idx) => idx.name === indexName);

  if (!exists) {
    console.log(`\n📦 Creating Pinecone index "${indexName}"...`);
    await pinecone.createIndex({
      name: indexName,
      dimension: EMBEDDING_DIM,
      metric: "cosine",
      spec: {
        serverless: { cloud: "aws", region: "us-east-1" },
      },
    });
    console.log("⌛ Waiting 12s for index to initialise...");
    await new Promise((r) => setTimeout(r, 12000));
  } else {
    console.log(`\n✅ Index "${indexName}" already exists — upserting into it.`);
  }

  const index = pinecone.index(indexName);

  // ── 3. Embed & upsert each document ──────────────────────────────────────
  let totalVectors = 0;

  for (const doc of documents) {
    console.log(`\n📄 [${doc.id.padStart(2, "0")}] ${doc.topic}`);

    const chunks = chunkText(doc.content);
    const vectors: PineconeRecord[] = [];

    // Cohere supports batch embedding — send all chunks at once per doc
    process.stdout.write(`   ⏳ Embedding ${chunks.length} chunk(s) via Cohere...\r`);

    const embedResponse = await cohere.embed({
      texts: chunks,
      model: EMBEDDING_MODEL,
      inputType: "search_document", // correct type for storage
      embeddingTypes: ["float"],
    });

    // embeddings array is at embedResponse.embeddings.float
    const embeddings =
      (embedResponse.embeddings as { float?: number[][] }).float ?? [];

    for (let ci = 0; ci < chunks.length; ci++) {
      vectors.push({
        id: `doc-${doc.id}-chunk-${ci}`,
        values: embeddings[ci],
        metadata: {
          text: chunks[ci],
          topic: doc.topic,
          docId: doc.id,
          chunkIndex: ci,
        },
      });
    }

    await index.upsert({ records: vectors });
    totalVectors += vectors.length;
    console.log(`   ✅ Upserted ${vectors.length} chunk(s)                         `);
  }

  // ── 4. Done ───────────────────────────────────────────────────────────────
  console.log("\n" + "━".repeat(60));
  console.log(`\n🎉 Seeding complete!`);
  console.log(`   📄 Topics embedded : ${documents.length}`);
  console.log(`   🔢 Vectors upserted: ${totalVectors}`);
  console.log(`   📦 Pinecone index  : ${indexName}`);
  console.log(`\n🚀 Your CricketIQ RAG is ready!\n`);
}

seedPinecone().catch((err) => {
  console.error("\n❌ Seed failed:", err.message ?? err);
  process.exit(1);
});

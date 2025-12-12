import fs from "fs";
import stringSimilarity from "string-similarity";

let chunks = [];
try {
  chunks = JSON.parse(fs.readFileSync("./website_chunks.json", "utf8"));
} catch (err) {
  console.log("❌ website_chunks.json not found. Run scrape first.");
}

export function getRelevantChunks(question, topN = 3) {
  if (!chunks.length) return [];

  const matches = stringSimilarity.findBestMatch(question, chunks);
  const sorted = matches.ratings
    .sort((a, b) => b.rating - a.rating)
    .slice(0, topN)
    .map((m) => m.target);

  return sorted;
}

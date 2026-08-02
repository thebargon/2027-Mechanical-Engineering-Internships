import { readFile, writeFile } from "fs/promises";

type Suggestion = Record<string, any>;

async function main() {
  const inPath = "./tmp_ats_suggestions.json";
  const outPath = "./tmp_ats_high_confidence.json";

  try {
    const raw = await readFile(inPath, "utf8");
    const data: Suggestion = JSON.parse(raw);
    const out: Record<string, any> = {};

    for (const [company, suggestions] of Object.entries(data)) {
      if (!suggestions || typeof suggestions !== "object") continue;
      const picked: Record<string, any> = {};
      for (const provider of ["greenhouse", "lever", "workday", "icims"]) {
        const val = (suggestions as any)[provider];
        if (!val) continue;
        // value may be { slug, confidence } or a raw slug string from older output
        if (typeof val === "string") {
          picked[provider] = { slug: val, confidence: 0.95 };
        } else if (val?.slug && typeof val.confidence === "number") {
          if (val.confidence >= 0.9) picked[provider] = val;
        }
      }
      if (Object.keys(picked).length) out[company] = picked;
    }

    await writeFile(outPath, JSON.stringify(out, null, 2), "utf8");
    console.log(`Wrote high-confidence suggestions to ${outPath}`);
  } catch (e) {
    console.error("Failed to extract suggestions:", e);
    process.exit(1);
  }
}

main();

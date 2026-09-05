import { COMPANIES } from "./companies";
import { writeFile } from "fs/promises";
import path from "path";

function slugCandidates(name: string) {
  const cleaned = name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const candidates = new Set<string>();

  // common forms
  candidates.add(parts.join(""));
  candidates.add(parts.join("-"));
  candidates.add(parts.join("_"));
  if (parts.length > 1) {
    candidates.add(parts[0]);
    candidates.add(parts[0] + parts.slice(1).map(p => p[0]).join(""));
  }

  // some orgs use short names
  if (cleaned.includes("inc")) candidates.add(cleaned.replace(/\s*inc$/, ""));

  return Array.from(candidates).slice(0, 8);
}

async function probeUrl(url: string) {
  try {
    const res = await fetch(url, { method: "GET", headers: { "User-Agent": "Mozilla/5.0" } });
    return { ok: res.ok, status: res.status, text: await res.text().catch(() => "") };
  } catch (e) {
    return { ok: false, status: 0, text: "" };
  }
}

async function checkGreenhouse(slug: string) {
  const url = `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } });
    if (!res.ok) return false;
    const json = await res.json().catch(() => null);
    return Array.isArray(json?.jobs);
  } catch {
    return false;
  }
}

async function checkLever(slug: string) {
  const url = `https://api.lever.co/v0/postings/${slug}?mode=json`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } });
    if (!res.ok) return false;
    const json = await res.json().catch(() => null);
    return Array.isArray(json);
  } catch {
    return false;
  }
}

async function checkICIMS(slug: string) {
  const url = `https://${slug}.icims.com/jobs`;
  const p = await probeUrl(url);
  if (!p.ok) return false;
  return /icims/i.test(p.text) || /job/i.test(p.text);
}

// Workday cannot be discovered from a tenant guess: copy its host, tenant, and
// external site from an employer-owned career link into companies.ts.
async function discoverForCompany(name: string) {
  const candidates = slugCandidates(name);
  const found: any = {};

  for (const c of candidates) {
    if (!found.greenhouse) {
      if (await checkGreenhouse(c)) found.greenhouse = { slug: c, confidence: 0.95 };
    }
    if (!found.lever) {
      if (await checkLever(c)) found.lever = { slug: c, confidence: 0.95 };
    }
    if (!found.icims) {
      if (await checkICIMS(c)) found.icims = { slug: c, confidence: 0.7 };
    }
    if (found.greenhouse && found.lever && found.icims) break;
  }

  return found;
}

async function main() {
  const results: Record<string, any> = {};
  const outPath = path.join(process.cwd(), "tmp_ats_suggestions.json");

  for (const company of COMPANIES) {
    console.log(`Probing: ${company.name}`);
    try {
      const r = await discoverForCompany(company.name);
      results[company.name] = r;
    } catch (e) {
      results[company.name] = { error: String(e) };
    }

    // write incremental results so we have partial data even if the script fails
    try {
      await writeFile(outPath, JSON.stringify(results, null, 2), "utf8");
    } catch (e) {
      console.error("Failed to write incremental results", e);
    }
  }

  console.log(`Wrote suggestions to ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

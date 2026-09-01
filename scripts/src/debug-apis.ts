// Quick debug script to test API endpoints
import { COMPANIES } from "./companies";

async function testApi(url: string, name: string) {
  try {
    console.log(`\n[TEST] ${name}`);
    console.log(`URL: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get("content-type")}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✓ Data returned:`, {
        type: typeof data,
        isArray: Array.isArray(data),
        length: Array.isArray(data) ? data.length : Object.keys(data).length,
        keys: Array.isArray(data) ? "array" : Object.keys(data).slice(0, 5),
      });
    } else {
      console.log(`✗ API returned ${response.status}`);
    }
  } catch (err) {
    console.log(`✗ Error:`, err instanceof Error ? err.message : String(err));
  }
}

async function main() {
  console.log("=== Testing ATS API Endpoints ===\n");

  // Test Greenhouse APIs for a few companies
  const greenhouseCompanies = COMPANIES.filter(c => c.greenhouse).slice(0, 3);
  for (const company of greenhouseCompanies) {
    if (company.greenhouse) {
      const url = `https://boards.greenhouse.io/api/v1/boards/${company.greenhouse}/jobs?content=true`;
      await testApi(url, `Greenhouse - ${company.name}`);
    }
  }

  // Test Lever APIs
  const leverCompanies = COMPANIES.filter(c => c.lever).slice(0, 3);
  for (const company of leverCompanies) {
    if (company.lever) {
      const url = `https://api.lever.co/v0/postings/${company.lever}?mode=json`;
      await testApi(url, `Lever - ${company.name}`);
    }
  }

  // Test Workday APIs
  const workdayCompanies = COMPANIES.filter(c => c.workday).slice(0, 3);
  for (const company of workdayCompanies) {
    if (company.workday) {
      const url = `https://${company.workday}.wd5.myworkdayjobs.com/wday/cxs/${company.workday}/jobs`;
      await testApi(url, `Workday (wd5) - ${company.name}`);
    }
  }

  // Test iCIMS
  const icimsCompanies = COMPANIES.filter(c => c.icims).slice(0, 2);
  for (const company of icimsCompanies) {
    if (company.icims) {
      const url = `https://${company.icims}.icims.com/jobs`;
      await testApi(url, `iCIMS - ${company.name}`);
    }
  }
}

main().catch(console.error);

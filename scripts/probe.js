const urls = [
  'https://www.spacex.com/careers',
  'https://careers.rivian.com/',
  'https://www.tesla.com/careers',
];
const patterns = [
  /workdayjobs\.com/gi,
  /wd5\.myworkdayjobs\.com/gi,
  /greenhouse\.io/gi,
  /lever\.co/gi,
  /jobvite\.com/gi,
  /icims\.com/gi,
  /talentlyft\.com/gi,
  /ngcareers\.com/gi,
  /workday/gi,
  /jobs\?/gi,
  /search\?/gi,
  /career(s)?/gi,
  /api\//gi,
  /jobPostings/gi,
  /"jobs"\s*:\s*\[/gi,
  /"job"\s*:\s*\{/gi,
  /window\.__/gi,
  /window\.__INITIAL_STATE__/gi,
  /window\.__DATA__/gi,
];

async function probe() {
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          Accept: 'text/html',
        },
      });
      const html = await res.text();
      console.log('\nURL', url, 'STATUS', res.status, 'LENGTH', html.length);

      const hrefs = [];
      for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
        hrefs.push(match[1]);
      }
      const uniqueHrefs = [...new Set(hrefs)];
      console.log('HREF COUNT', hrefs.length, 'UNIQUE', uniqueHrefs.length);
      const candidates = uniqueHrefs.filter((h) => /workdayjobs\.com|wd5\.myworkdayjobs\.com|greenhouse\.io|lever\.co|jobvite\.com|icims\.com|talentlyft\.com|ngcareers\.com|careers\.linkedin\.com|jobs\.linkedin\.com|jobvite\.com|workday|search\?|api\/|jobPostings|career(s)?/i.test(h));
      console.log('CANDIDATES', candidates.length);
      console.log(candidates.slice(0, 80).join('\n'));

      const scriptSrcs = [];
      for (const match of html.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
        scriptSrcs.push(match[1]);
      }
      const uniqueScripts = [...new Set(scriptSrcs)];
      console.log('SCRIPT COUNT', scriptSrcs.length, 'UNIQUE', uniqueScripts.length);
      console.log(uniqueScripts.filter((s) => /workdayjobs\.com|wd5\.myworkdayjobs\.com|greenhouse\.io|lever\.co|jobvite\.com|icims\.com|talentlyft\.com|search\?|api\/|jobPostings|career(s)?/i.test(s)).slice(0, 80).join('\n'));

      for (const pat of patterns) {
        const matches = html.match(pat);
        if (matches && matches.length > 0) {
          console.log('PATTERN', pat, matches.length, matches.slice(0, 5).join(' | '));
        }
      }
    } catch (error) {
      console.error('ERR', url, error.message);
    }
  }
}

probe().catch((error) => {
  console.error(error);
  process.exit(1);
});
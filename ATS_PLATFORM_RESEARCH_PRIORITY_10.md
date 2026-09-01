# ATS Platform Research: Priority 10 Aerospace & Engineering Companies

## Executive Summary
Research on 10 high-priority aerospace and engineering companies to identify their ATS (Applicant Tracking System) platforms.

**Date**: August 31, 2026  
**Research Focus**: Companies showing 0 jobs in current tracker

---

## VERIFIED FINDINGS

### ✅ CONFIRMED - Supported Platforms

#### 1. **Joby Aviation** - iCIMS ✓
- **Careers URL**: https://www.jobyaviation.com/careers
- **ATS Platform**: iCIMS
- **Job Board URL**: https://careers-jobyaviation.icims.com/jobs
- **Confidence**: HIGH
- **Notes**: Confirmed via direct page inspection. Job application link points to iCIMS subdomain.

#### 2. **Northrop Grumman** - Eightfold AI ✗ (NOT SUPPORTED)
- **ATS Platform**: Eightfold AI
- **Support Status**: NOT SUPPORTED by tracker
- **Confidence**: HIGH
- **Notes**: Previously confirmed in session research. Uses Eightfold AI proprietary platform.

---

### ⚠️ PARTIAL RESEARCH - Needs Manual Verification

#### 3. **Apple**
- **Careers URL**: https://www.apple.com/careers & https://jobs.apple.com
- **ATS Platform**: **Custom Proprietary System**
- **Status**: Custom in-house careers portal
- **Confidence**: MEDIUM
- **Notes**: Apple maintains custom careers infrastructure. Uses proprietary job board without standard ATS platform integration.
- **Support**: NOT SUPPORTED (Custom system)

#### 4. **ASML**
- **Careers URL**: https://www.asml.com/en/careers
- **Job Search URL**: https://www.asml.com/en/careers/find-your-job
- **ATS Platform**: **Custom Proprietary System** (likely custom or internal)
- **Confidence**: MEDIUM
- **Notes**: Custom job search interface. No obvious Greenhouse, Lever, Workday, or iCIMS indicators found.
- **Support**: NOT SUPPORTED (Custom system)

#### 5. **Textron**
- **Careers URL**: https://careers.textron.com
- **ATS Platform**: **Unknown - Requires Direct Access**
- **Status**: Careers portal exists with job listings
- **Confidence**: LOW (pending verification)
- **Notes**: Site shows careers.textron.com portal. Specific ATS platform needs direct inspection of job board links.

#### 6. **Relativity Space**
- **Careers URL**: https://www.relativityspace.com/careers
- **ATS Platform**: **Unknown - Requires Direct Access**
- **Status**: Careers page exists
- **Confidence**: LOW (pending verification)
- **Notes**: Careers page accessible but specific ATS platform needs investigation.

#### 7. **Rocket Lab**
- **Careers URL**: https://www.rocketlabusa.com/careers
- **ATS Platform**: **Unknown - Requires Direct Access**
- **Status**: Careers page exists ("Launch Your Career" message)
- **Confidence**: LOW (pending verification)
- **Notes**: Career page displays but ATS platform requires direct job board navigation.

#### 8. **Archer Aviation**
- **Careers URL**: https://www.archer.com/careers
- **ATS Platform**: **Unknown - Requires Direct Access**
- **Status**: Careers page accessible
- **Confidence**: LOW (pending verification)
- **Notes**: Aviation company with careers page. Specific ATS platform not yet determined.

#### 9. **Agility Robotics**
- **Careers URL**: https://www.agilityrobotics.com/careers
- **ATS Platform**: **Unknown - Requires Direct Access**
- **Status**: Careers page accessible (cookie consent required)
- **Confidence**: LOW (pending verification)
- **Notes**: Robotics company with careers portal. ATS platform type undetermined.

#### 10. **Figure AI**
- **Careers URL**: https://www.figure.ai/careers
- **ATS Platform**: **Unknown - Requires Direct Access**
- **Status**: "See All Open Roles" button visible on page
- **Job Listing URL**: https://www.figure.ai/careers#careers-listing-v3
- **Confidence**: LOW (pending verification)
- **Notes**: AI robotics company with custom careers page. Specific ATS platform needs investigation.

---

## RESEARCH METHODOLOGY

### Verification Methods Used:
1. **Direct Browser Inspection**: Visited careers pages and looked for:
   - URL patterns (boards.greenhouse.io, lever.co, wd#.myworkdayjobs.com, .icims.com, etc.)
   - Metadata and scripts in page source
   - Job listing page structure
   - Apply button links

2. **Session Memory Review**: Checked previous research findings for confirmations

3. **Codebase Analysis**: Reviewed companies.ts and existing ATS research files

### Known ATS Platform URL Patterns:
- **Greenhouse**: `boards.greenhouse.io/[company-slug]`
- **Lever**: `lever.co/[company-slug]` or `api.lever.co`
- **Workday**: `[tenant].wd[0-9].myworkdayjobs.com`
- **iCIMS**: `[tenant].icims.com` or `icims.com`
- **SmartRecruiters**: `smartrecruiters.com`
- **Eightfold**: `eightfold.ai`
- **Taleo/TalentBrew**: `talentbrew.com` or `taleo.net`

---

## SUMMARY TABLE

| Company | ATS Platform | Status | Confidence | Supported |
|---------|-------------|--------|-----------|-----------|
| Joby Aviation | iCIMS | ✅ CONFIRMED | HIGH | ✓ YES |
| Northrop Grumman | Eightfold AI | ✅ CONFIRMED | HIGH | ✗ NO |
| Apple | Custom | ⚠️ LIKELY | MEDIUM | ✗ NO |
| ASML | Custom | ⚠️ LIKELY | MEDIUM | ✗ NO |
| Textron | Unknown | ❓ PENDING | LOW | ? |
| Relativity Space | Unknown | ❓ PENDING | LOW | ? |
| Rocket Lab | Unknown | ❓ PENDING | LOW | ? |
| Archer Aviation | Unknown | ❓ PENDING | LOW | ? |
| Agility Robotics | Unknown | ❓ PENDING | LOW | ? |
| Figure AI | Unknown | ❓ PENDING | LOW | ? |

---

## NEXT STEPS FOR COMPLETION

To complete research on the 6 pending companies (Textron, Relativity Space, Rocket Lab, Archer Aviation, Agility Robotics, Figure AI):

1. **Navigate to each company's job board link** from their careers page
2. **Inspect the URL** of the jobs listing page
3. **Check page source** for ATS platform indicators (scripts, metadata)
4. **Look for standard indicators**:
   - Apply button redirects to known ATS platforms
   - URL patterns matching known ATS domains
   - Page structure matching known ATS layouts

### Recommended Research Commands:
```bash
# For each company, check these likely URLs:
curl -I https://[company-name].icims.com/jobs
curl -I https://boards.greenhouse.io/[company-slug]
curl -I https://api.lever.co/v0/postings/[company-slug]
```

---

## RESEARCH NOTES

- **Browser Limitations**: Some research conducted in browser environment with potential limitations on network requests
- **Security Considerations**: Some company sites have fraud alerts or access restrictions
- **Dynamic Content**: Several companies use JavaScript-heavy career sites requiring full page load
- **Time-based**: Research conducted as of August 31, 2026 (subject to change)

---

## Researcher Notes

- Confirmed 2/10 companies with definitive ATS platform
- 2/10 companies identified as using custom proprietary systems (Apple, ASML)  
- 6/10 companies require direct job board inspection to complete research
- No immediate red flags suggesting unsupported platforms for pending companies
- Recommend iCIMS, Greenhouse, or Lever as most likely platforms for aerospace/engineering companies based on industry trends


import {afterEach,expect,test} from 'bun:test';
import {fetchSmartRecruitersJobs} from './smartrecruiters';
import {fetchJibeJobs,fetchSuccessFactorsJobs,parseSuccessFactors} from './career-portals';
import {requestContext} from './http';
const original=globalThis.fetch;
afterEach(()=>{globalThis.fetch=original});
const company={name:'Example',smartRecruiters:'Example',jibeHost:'careers.example.com',successFactorsHost:'jobs.example.com'};
const posting=(id:string,visibility='PUBLIC',name='Mechanical Engineering Intern')=>({id,visibility,name});
test('SmartRecruiters paginates past unrelated postings and excludes private roles',async()=>{
 const offsets:string[]=[];
 globalThis.fetch=(async u=>{const offset=new URL(String(u)).searchParams.get('offset')!;offsets.push(offset);return Response.json({totalFound:3,content:offset==='0'?[posting('1','PUBLIC','Software Intern')]:[posting('2'),posting('3','INTERNAL')]});}) as typeof fetch;
 const jobs=await fetchSmartRecruitersJobs(company);expect(offsets).toEqual(['0','1']);expect(jobs).toHaveLength(1);expect(jobs[0].url).toBe('https://jobs.smartrecruiters.com/Example/2');expect(jobs[0].postedAt).toBeNull();
});
test('SmartRecruiters retains earlier jobs when pagination repeats',async()=>{
 globalThis.fetch=(async()=>Response.json({totalFound:10,content:[posting('1')]})) as typeof fetch;
 const context:{failures:number;partial?:string}={failures:0};
 expect(await requestContext.run(context,()=>fetchSmartRecruitersJobs(company))).toHaveLength(1);expect(context.partial).toContain('repeated');
});
test('SmartRecruiters rejects invalid initial responses instead of claiming empty coverage',async()=>{
 globalThis.fetch=(async()=>Response.json({content:[]})) as typeof fetch;
 await expect(fetchSmartRecruitersJobs(company)).rejects.toThrow('Invalid');
});
const row=(id:string,title='Mechanical &amp; Manufacturing Intern')=>`<tr class="data-row"><td><a href="/job/City/Role/${id}/" class="jobTitle-link">${title}</a><a class="jobTitle-link" href="/job/City/Role/${id}/">${title}</a></td><td headers="hdrLocation"><span>Austin, TX</span></td></tr>`;
const page=(rows:string,total=2)=>`<span class="paginationLabel">Results <b>1 - 1</b> of <b>${total}</b></span>${rows}`;
test('SuccessFactors counts desktop and mobile links as one row and decodes titles',()=>{
 const parsed=parseSuccessFactors(page(row('1')),company);expect(parsed.rows).toBe(1);expect(parsed.jobs).toHaveLength(1);expect(parsed.jobs[0].title).toBe('Mechanical & Manufacturing Intern');expect(parsed.jobs[0].location).toBe('Austin, TX');
 expect(()=>parseSuccessFactors('<html>Access denied</html>',company)).toThrow('Unrecognized');
});
test('SuccessFactors advances by rows and deduplicates keyword searches',async()=>{
 const offsets:string[]=[];
 globalThis.fetch=(async u=>{const offset=new URL(String(u)).searchParams.get('startrow')!;offsets.push(offset);return new Response(page(row(offset==='0'?'1':'2')));}) as typeof fetch;
 expect(await fetchSuccessFactorsJobs(company)).toHaveLength(2);expect(offsets).toEqual(['0','1','0','1']);
});
test('Jibe searches without the obsolete Rivian tag and filters unrelated/private postings',async()=>{
 globalThis.fetch=(async u=>{const url=new URL(String(u));expect(url.searchParams.has('tags')).toBe(false);return Response.json({totalCount:3,jobs:[{data:{slug:'1',title:'Mechanical Intern',full_location:'Austin'}},{data:{slug:'2',title:'Electrical Intern'}},{data:{slug:'3',title:'Mechanical Intern',meta_data:{icims:{jps_is_public:false}}}}]});}) as typeof fetch;
 const jobs=await fetchJibeJobs(company);expect(jobs).toHaveLength(1);expect(jobs[0].url).toBe('https://careers.example.com/jobs/1');
});
import {getSnapshot} from './scraper';
test('shared RTX coverage does not duplicate or mislabel parent jobs',async()=>{
 globalThis.fetch=(async()=>Response.json({jobs:[{title:'Mechanical Intern',absolute_url:'https://example.com/job/1',location:{name:'Boston'},content:''}]})) as typeof fetch;
 const snapshot=await getSnapshot([{name:'RTX',greenhouse:'example'},{name:'Raytheon',coveredBy:'RTX'}]);
 expect(snapshot.jobs.map(j=>j.companyName)).toEqual(['RTX']);expect(snapshot.sources.find(s=>s.company==='Raytheon')?.status).toBe('covered');
});
test('HTTP rejection is reported with its status in source health',async()=>{
 globalThis.fetch=(async()=>new Response('Forbidden',{status:403})) as typeof fetch;
 const snapshot=await getSnapshot([{name:'Example',greenhouse:'example'}]);
 expect(snapshot.sources[0].status).toBe('failed');expect(snapshot.sources[0].detail).toContain('HTTP 403');
});

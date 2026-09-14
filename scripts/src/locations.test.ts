import {expect,test} from 'bun:test';
import {isPreferredLocation,locationPriority} from './locations';
import {emptySnapshot,reconcile,filterSnapshot} from './history';
import type {Job} from './types';
test('supports employer location formats in California and Indiana',()=>{
 for(const s of ['Los Angeles, CA','Irvine, California, United States','US, CA, Santa Clara','US-CA-EL SEGUNDO','Santa Clara,CA','South Bay, Los Angeles','San Jose','Indianapolis, IN','West Lafayette, Indiana','US-IN-Fort Wayne','Remote - California','Boston, MA; Costa Mesa, California']) expect(isPreferredLocation(s)).toBe(true);
});
test('rejects other states, country-code lookalikes and unspecified locations',()=>{
 for(const s of [null,'','8 Locations','Remote','United States','Boston, MA','New Orleans, LA','CA-QC-LONGUEUIL-J01','CA-NS-HALIFAX','Costa Rica, San Jose','Toronto, Canada','Bangalore, India','San Jose, Costa Rica','Ontario, Canada']) expect(isPreferredLocation(s)).toBe(false);
});
test('LA and OC rank ahead of other California locations, then Indiana',()=>{
 expect(['Indianapolis, IN','San Jose, CA','Irvine, CA'].sort((a,b)=>locationPriority(a)-locationPriority(b))).toEqual(['Irvine, CA','San Jose, CA','Indianapolis, IN']);
});
test('live reconciliation and offline rebuild enforce geography without changing verification dates',()=>{
 const base:Job={companyName:'Example',companyUrl:null,title:'Mechanical Intern 2027',location:'Irvine, CA',url:'https://example.com/1',source:'Lever',postedAt:null,ageDays:null,category:'mechanical_design',score:5};
 const state=reconcile(emptySnapshot(),[base,{...base,location:'Boston, MA',url:'https://example.com/2'}],[],'2026-09-14T00:00:00Z');
 expect(state.jobs).toHaveLength(1);
 const filtered=filterSnapshot({...state,jobs:[...state.jobs,{...state.jobs[0],id:'old',location:'Boston, MA'}]});
 expect(filtered.jobs).toEqual(state.jobs);expect(filtered.updatedAt).toBe(state.updatedAt);
});

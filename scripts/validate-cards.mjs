import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const dir=process.argv[2]||'assets/cards';
for (const name of ['activity-light.svg','activity-dark.svg','languages-light.svg','languages-dark.svg']){
 const svg=await readFile(dir+'/'+name,'utf8');
 assert.ok(svg.length>500 && svg.length<150000,name);
 assert.match(svg,/<svg\b/);assert.match(svg,/<\/svg>\s*$/);
 assert.doesNotMatch(svg,/Something went wrong|Could not fetch|API rate limit|<script|<foreignObject|<!ENTITY|<!DOCTYPE|onload=|onerror=/i,name);
 assert.doesNotMatch(svg,/<(?:image|use)[^>]+(?:href|xlink:href)=["'](?:https?:|data:|\/\/)/i,name);
 assert.ok(svg.includes(name.startsWith('activity')?'GitHub activity':'Languages in my repositories'),name);
 if(name.startsWith('activity'))assert.doesNotMatch(svg,/class="rank-circle"|id="rank-circle"/,name);
}
console.log('Four self-contained cards validated.');

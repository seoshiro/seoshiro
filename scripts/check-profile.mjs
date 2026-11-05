import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
const readme=await readFile('README.md','utf8');
test('The requested introduction, learning context, and contact links remain native text',()=>{
  assert.ok(readme.includes('I create interactive websites and browser tools with AI. I shape the concept, visual direction, and user experience, then test and refine the result.'));
  assert.match(readme,/learning programming through my projects/);
  for (const section of ['Selected work','Approach','Contact']) assert.ok(readme.includes('## '+section));
  for (const url of ['https://seoshiro.github.io/','https://t.me/tserriednichs','mailto:beibars.ileskhan2405@gmail.com']) assert.ok(readme.includes(url));
  assert.doesNotMatch(readme,/<script|<iframe|style=|shields\.io|github-readme-stats|visitor-counter/i);
});
test('Theme covers and three actual product previews are complete, local and proportionate',async()=>{
  for (const [path,w,h] of [['lotus-cover-light.png',1600,680],['lotus-cover-dark.png',1600,680],['lotus-avatar.png',1024,1024],...['perch','selvedge','forme'].map(n=>[n+'-studio.png',1200,720])]) {
    const data=await readFile('assets/'+path);
    assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a',path);
    assert.equal(data.readUInt32BE(16),w,path);assert.equal(data.readUInt32BE(20),h,path);
    assert.ok(data.length<1500000,path);
    assert.ok(data.subarray(-12).includes(Buffer.from('IEND')),path);
  }
  assert.match(readme,/prefers-color-scheme: dark/);assert.match(readme,/prefers-color-scheme: light/);
  for(const match of readme.matchAll(/!\[([^\]]+)\]/g)) assert.ok(match[1].length>=35);
});
test('All three projects retain verified Demo, Source and Case study destinations',()=>{
 for (const name of ['perch','selvedge','forme']) {
  assert.ok(readme.includes('https://github.com/seoshiro/'+name+'-studio'));
  assert.ok(readme.includes('https://seoshiro.github.io/projects/'+name+'.html'));
 }
 for(const url of ['https://seoshiro.github.io/perch-studio/','https://seoshiro.github.io/selvedge-studio/','https://forme-studio-coral.vercel.app/'])assert.ok(readme.includes(url));
 assert.equal((readme.match(/Case study\]/g)||[]).length,3);
});

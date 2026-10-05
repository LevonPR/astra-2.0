const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const cwd=require('node:path').resolve(__dirname,'..');
(async()=>{const server=spawn(process.execPath,[cwd+'/node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3104'],{cwd});let browser;try{
await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('server timeout')),15000);server.stdout.on('data',b=>{if(b.toString().includes('Ready')){clearTimeout(timeout);resolve()}});server.on('error',reject)});
browser=await chromium.launch({executablePath:process.env.HUB_BROWSER_EXECUTABLE || undefined,args:['--disable-gpu','--disable-dev-shm-usage'],headless:true});
const page=await browser.newPage({viewport:{width:1536,height:960},reducedMotion:'no-preference'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:3104/hub');await page.getByRole('button',{name:'Pause motion'}).waitFor();await page.waitForTimeout(350);
const snap=()=>page.locator('canvas').evaluate(c=>c.toDataURL());const a=await snap();await page.waitForTimeout(250);assert.notEqual(await snap(),a,'Animation must advance');
await page.getByRole('button',{name:'Pause motion'}).click();await page.waitForTimeout(100);const b=await snap();await page.waitForTimeout(250);assert.equal(await snap(),b,'Pause must freeze canvas');
await page.getByRole('button',{name:'Resume motion'}).click();await page.waitForTimeout(200);assert.notEqual(await snap(),b,'Resume must advance');
await page.getByRole('textbox',{name:'Search role concepts'}).fill('Helix');assert.equal(await page.locator('.fleet-list button').count(),1);await page.locator('.fleet-list button').click();assert.match(await page.locator('.mesh-selection').innerText(),/NEXUS CORE/);await page.getByRole('textbox',{name:'Search role concepts'}).fill('');
await page.getByRole('combobox').selectOption('builder');await page.getByText('2 tasks shown').waitFor();assert.equal(await page.getByRole('link',{name:'Propose assignment'}).count(),2);
for(const width of [1536,1024,390,320]){await page.setViewportSize({width,height:960});await page.waitForTimeout(100);const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));console.log('viewport',overflow);assert.ok(overflow.scroll<=width,'Horizontal overflow at '+width)}
await page.setViewportSize({width:1536,height:960});
await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'Reduced motion'}).waitFor();await page.waitForTimeout(100);const c=await snap();await page.waitForTimeout(250);assert.equal(await snap(),c,'Reduced motion must freeze');assert.deepEqual(errors,[]);console.log('PASS animation, pause/resume, role search, selection, tasks, responsive widths, reduced motion, no JS errors');
}finally{await browser?.close();server.kill()}})().catch(e=>{console.error(e);process.exit(1)});

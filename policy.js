const sourceUS='https://www.oecd.org/en/publications/health-at-a-glance-2025_15a55280-en/united-states_3517f35e-en.html';const sourceJP='https://www.oecd.org/en/publications/health-at-a-glance-2025_15a55280-en/japan_319bfc39-en.html';
const peerRows=[
{name:'United States',life:78.4,spend:14885},
{name:'Japan',life:84.1,spend:5790},
{name:'South Korea',life:83.5,spend:4797},
{name:'Australia',life:83.0,spend:7469},
{name:'France',life:83.0,spend:7367},
{name:'Canada',life:81.7,spend:7301},
{name:'Germany',life:81.1,spend:9365},
{name:'Netherlands',life:81.9,spend:8436},
{name:'Sweden',life:83.4,spend:7871},
{name:'Switzerland',life:84.3,spend:9963},
{name:'OECD average',life:81.1,spend:5967}];
let metric='life';
const fmtLife=n=>n.toFixed(1);const fmtSpend=n=>'$'+n.toLocaleString('en-US');
function displayRows(){return [...peerRows].sort((a,b)=>metric==='spend'?b.spend-a.spend:metric==='life'?b.life-a.life:0)}
function linesForMetric(){return displayRows().map(r=>r.name+' — '+(metric==='spend'?fmtSpend(r.spend):metric==='life'?fmtLife(r.life)+' years':fmtLife(r.life)+' years; '+fmtSpend(r.spend)+' per person'))}
async function copyValue(s){try{await navigator.clipboard.writeText(s);return true}catch(e){let t=document.createElement('textarea');t.value=s;document.body.append(t);t.select();let ok=document.execCommand('copy');t.remove();return ok}}
function downloadBlob(blob,name){let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),3000)}
/* Policy article, share controls, and accessible hover/tap glossary */
const policyShort='The U.S. spends $14,885 per person on healthcare versus an OECD average of $5,967 (2024 or nearest year, adjusted for purchasing power). Higher medical prices and administrative complexity help explain the gap. In 2025, 26.7 million Americans were uninsured for the entire year. Sources: OECD Health at a Glance 2025; Peterson-KFF; U.S. Census Bureau. More: '+location.origin+location.pathname;
const policyStatus=document.getElementById('policyCopyStatus');
async function policyCopy(val,label){const ok=await copyValue(val);policyStatus.textContent=ok?label+' copied. Ready to paste.':'Unable to copy automatically; select the text instead.';}
document.getElementById('copyPolicyShort').addEventListener('click',()=>policyCopy(policyShort,'Short finding'));
document.getElementById('copyPolicyURL').addEventListener('click',()=>policyCopy(location.href.split('#')[0],'Direct article link'));
document.getElementById('copyPolicyFull').addEventListener('click',()=>{let article=document.querySelector('#cost-policy article');let content=article.innerText.replace(/📋 Copy short finding[\s\S]*?View glossary ↓/,'').trim();policyCopy(content+'\n\nRead original with source links: '+location.href.split('#')[0],'Article text');});
document.getElementById('copyAdmin').addEventListener('click',()=>policyCopy('2021 healthcare system administration costs (USD PPP per person): United States $925 (7.6% of health spending); comparable-country average $245 (3.8%). Excludes hospitals’ and clinicians’ internal administrative costs. Source: Peterson-KFF https://www.healthsystemtracker.org/brief/what-drives-health-spending-in-the-u-s-compared-to-other-countries/','Administration comparison'));
const glossaryTerms={OECD:['OECD','Organisation for Economic Co-operation and Development: a group of countries that collects and compares economic and social data.'],PPP:['Purchasing power parity','A price adjustment that makes spending figures more comparable across countries.'],'Universal coverage':['Universal coverage','All residents have coverage for a defined set of essential healthcare services. Not necessarily a single government insurer.'],'Uncompensated care':['Uncompensated care','Healthcare for which providers are not fully paid, including charity care and certain unpaid bills.'],'Cost shifting':['Cost shifting','When providers try to recover some costs by charging other payers more. Evidence varies by market.'],'Underinsured':['Underinsured','Has health insurance but faces large deductibles or out-of-pocket costs relative to income, under a study definition.']};
const glossPopup=document.getElementById('glossPopup');let activeGloss=null;
function showGloss(btn){const entry=glossaryTerms[btn.dataset.term];if(!entry)return;activeGloss=btn;glossPopup.replaceChildren();let strong=document.createElement('strong');strong.textContent=entry[0];let desc=document.createElement('span');desc.textContent=entry[1];glossPopup.append(strong,desc);glossPopup.hidden=false;let rect=btn.getBoundingClientRect(),w=glossPopup.offsetWidth,h=glossPopup.offsetHeight;glossPopup.style.left=Math.max(12,Math.min(innerWidth-w-12,rect.left))+'px';glossPopup.style.top=(rect.bottom+h+10<innerHeight?rect.bottom+8:Math.max(12,rect.top-h-8))+'px';}
function hideGloss(){glossPopup.hidden=true;activeGloss=null}
document.querySelectorAll('.gloss').forEach(btn=>{btn.setAttribute('aria-label',btn.textContent+': tap or hover for definition');btn.addEventListener('mouseenter',()=>showGloss(btn));btn.addEventListener('mouseleave',()=>{if(!btn.matches(':focus'))hideGloss()});btn.addEventListener('focus',()=>showGloss(btn));btn.addEventListener('blur',()=>setTimeout(()=>{if(!btn.matches(':hover'))hideGloss()},120));btn.addEventListener('click',e=>{e.stopPropagation();showGloss(btn)})});document.addEventListener('click',e=>{if(!e.target.closest('.gloss'))hideGloss()});document.addEventListener('keydown',e=>{if(e.key==='Escape')hideGloss()});window.addEventListener('scroll',()=>hideGloss(),{passive:true});
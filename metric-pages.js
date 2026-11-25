// Each metric has its own page. This script renders only the page's designated measure.
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
{name:'United Kingdom',life:81.0,spend:6747},
{name:'Denmark',life:81.8,spend:7071},
{name:'Norway',life:83.1,spend:9393},
{name:'Italy',life:83.5,spend:5164},
{name:'OECD average',life:81.1,spend:5967}];

const mortalityRows=[
{name:'United States',value:95},{name:'Japan',value:49},{name:'South Korea',value:45},
{name:'Australia',value:47},{name:'France',value:48},{name:'Canada',value:58},
{name:'Germany',value:66},{name:'Netherlands',value:49},{name:'Sweden',value:47},
{name:'Switzerland',value:34},{name:'United Kingdom',value:71},
{name:'Denmark',value:55},{name:'Norway',value:null},{name:'Italy',value:52},
{name:'OECD average',value:77}];

const panel=document.querySelector('[data-metric-page]');
if(panel){
const metric=panel.dataset.metricPage;
const sourceURL='https://www.oecd.org/en/publications/health-at-a-glance-2025_8f9e3f98-en.html';
const byMetric=(metric==='mortality'? mortalityRows.map(r=>({name:r.name,value:r.value})) : peerRows.map(r=>({name:r.name,value:metric==='life'?r.life:metric==='spend'?r.spend:null,life:r.life,spend:r.spend})));
const rows=[...byMetric].sort((a,b)=>{
  if(metric==='both')return b.life-a.life;
  if(a.value===null)return 1;if(b.value===null)return -1;
  return metric==='mortality'?b.value-a.value:b.value-a.value;
});
const fmtSpend=n=>'$'+Number(n).toLocaleString('en-US');
const pageLink='https://america-in-perspective.github.io/america-in-perspective/'+(metric==='life'?'health-metrics.html':metric==='spend'?'healthcare-spending.html':metric==='mortality'?'treatable-mortality.html':'spending-life-expectancy.html');
function val(r){return metric==='mortality'?(r.value==null?'N/A':String(r.value)):metric==='life'?r.value.toFixed(1):metric==='spend'?fmtSpend(r.value):r.life.toFixed(1)+' years · '+fmtSpend(r.spend)}
function tsv(){
 const header=metric==='both'?['Country','Life expectancy at birth (years)','Healthcare spending per person (USD PPP)']:['Country',metric==='mortality'?'Treatable deaths per 100,000 under 75':metric==='life'?'Life expectancy at birth (years)':'Healthcare spending per person (USD PPP)'];
 return [header,...rows.map(r=>metric==='both'?[r.name,r.life,r.spend]:[r.name,r.value==null?'N/A':r.value])].map(row=>row.join('\t')).join('\n');
}
function draw(){
 const chart=document.getElementById('metricChart'),tableDiv=document.getElementById('metricTable');
 if(metric==='life'){
  chart.classList.add('dot-plot');
  const min=75,max=86;
  const axis=document.createElement('div');axis.className='dot-axis';axis.innerHTML='<span></span><div class="dot-axis-ticks"><span>75</span><span>77</span><span>79</span><span>81</span><span>83</span><span>86 years</span></div><span></span>';chart.append(axis);
  rows.forEach(r=>{const line=document.createElement('div');line.className='dot-row'+(r.name==='United States'?' is-us':'');const label=document.createElement('span');label.textContent=r.name;const track=document.createElement('div');track.className='dot-track';const dot=document.createElement('i');dot.className='dot-marker';dot.style.left=((r.value-min)/(max-min)*100)+'%';track.append(dot);const number=document.createElement('b');number.textContent=r.value.toFixed(1);line.append(label,track,number);chart.append(line)});
  const note=document.createElement('p');note.className='chart-help';note.textContent='Scale: 75–86 years · OECD, Health at a Glance 2025. Country reporting years vary.';chart.append(note);
 }else if(metric!=='both'){
  const max=metric==='mortality'?100:16000;
  rows.forEach(r=>{const d=document.createElement('div');d.className='barrow deep'+(r.name==='OECD average'?' oecd':'');const t=document.createElement('span');t.textContent=r.name;const track=document.createElement('div');track.className='track';if(r.value!==null){const bar=document.createElement('div');bar.className='bar'+(r.name==='United States'?' us':'');bar.style.width=(100*r.value/max)+'%';track.append(bar)}const v=document.createElement('b');v.textContent=val(r);d.append(t,track,v);chart.append(d)});
  const note=document.createElement('p');note.className='chart-help';note.textContent='Bars begin at zero. OECD average covers all member countries.';chart.append(note);
 }else{
  const note=document.createElement('p');note.textContent='The comparison below displays life expectancy and spending side by side, using figures with varying reporting years.';chart.append(note);
 }
 const table=document.createElement('table');table.className='data-table';let thead=document.createElement('thead');let tr=document.createElement('tr');
 const heads=metric==='both'?['Country','Life expectancy (years)','Spending (USD PPP)']:['Country',metric==='life'?'Life expectancy (years)':metric==='spend'?'Spending (USD PPP)':'Treatable deaths per 100,000'];
 heads.forEach(x=>{let th=document.createElement('th');th.textContent=x;tr.append(th)});thead.append(tr);table.append(thead);
 const tbody=document.createElement('tbody');rows.forEach(r=>{let tr=document.createElement('tr');tr.className=r.name==='United States'?'us-row':r.name==='OECD average'?'oecd-row':'';let cols=metric==='both'?[r.name,r.life.toFixed(1),fmtSpend(r.spend)]:[r.name,val(r)];cols.forEach((x,i)=>{let td=document.createElement('td');td.textContent=x;if(i)td.className='num';tr.append(td)});tbody.append(tr)});table.append(tbody);tableDiv.append(table);
}
draw();
const feedback=document.getElementById('metricFeedback');
async function copy(s){try{await navigator.clipboard.writeText(s);return true}catch(e){const t=document.createElement('textarea');t.value=s;document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();return ok}}
function download(blob,filename){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),3000)}
const us=byMetric.find(r=>r.name==='United States'),oecd=byMetric.find(r=>r.name==='OECD average');
function finding(){
 let s='';
 if(metric==='life')s='Americans have a shorter life expectancy than people in many other wealthy nations. OECD Health at a Glance 2025 reports 78.4 years for the United States, 2.7 years below its 81.1-year average. The U.S. is lowest among the 14 comparison countries. That gap deserves examination, but these figures alone do not establish its causes.';
 if(metric==='spend')s='The United States spends roughly two and a half times the OECD average on healthcare per person ('+fmtSpend(us.value)+' versus '+fmtSpend(oecd.value)+', adjusted for purchasing power). The spending difference raises questions about medical prices, administration and how care is financed; it does not, by itself, tell us which factors are responsible.';
 if(metric==='both')s='Higher spending does not always coincide with longer life. The U.S. spends '+fmtSpend(us.spend)+' per person on healthcare versus an OECD average of '+fmtSpend(oecd.spend)+', while life expectancy is '+us.life.toFixed(1)+' versus '+oecd.life.toFixed(1)+' years. The pattern invites investigation, but these comparisons do not prove a particular policy caused it. Reporting years vary.';
 if(metric==='mortality')s='The U.S. records '+us.value+' deaths from treatable conditions per 100,000 people under 75, compared with the OECD average of '+oecd.value+' (age-standardized; 2023 or nearest). This difference raises questions about timely diagnosis and effective treatment, though it does not establish the cause of the gap.';
 return s+'\n\nSource: OECD, Health at a Glance 2025. '+sourceURL+'\nExplore the comparison: '+pageLink;
}
document.getElementById('copyFinding').onclick=async()=>{feedback.textContent=(await copy(document.getElementById('keyFinding').innerText.trim()+'\n'+pageLink))?'Finding copied.':'Unable to copy automatically.'};
document.getElementById('copyMetricTable').onclick=async()=>{feedback.textContent=(await copy(tsv()+'\nSource: '+sourceURL))?'Table copied.':'Unable to copy automatically.'};
document.getElementById('downloadCSV').onclick=()=>{const csv=tsv().split('\n').map(r=>r.split('\t').map(x=>'"'+String(x).replaceAll('"','""')+'"').join(',')).join('\r\n');download(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),'aip-'+metric+'.csv');feedback.textContent='CSV downloaded.'};
document.getElementById('saveChart').onclick=()=>{
 const W=1080,H=250+rows.length*(metric==='both'?42:47);let cv=document.createElement('canvas');cv.width=W*2;cv.height=H*2;let c=cv.getContext('2d');c.scale(2,2);c.fillStyle='#fff';c.fillRect(0,0,W,H);c.fillStyle='#17384b';c.font='bold 29px Georgia';c.fillText('America in Perspective',40,45);c.font='bold 23px system-ui';c.fillText(panel.querySelector('h2').textContent,40,85);c.font='14px system-ui';c.fillStyle='#596b76';c.fillText('14 countries plus OECD average · OECD, Health at a Glance 2025',40,113);
 rows.forEach((r,i)=>{const y=155+i*(metric==='both'?42:47);c.font=(r.name==='United States'||r.name==='OECD average'?'bold ':'')+'16px sans-serif';c.fillStyle='#17384b';c.fillText(r.name,40,y);if(metric==='life'){const min=75,max=86,x0=275,bw=590;const x=x0+(r.value-min)/(max-min)*bw;c.strokeStyle='#e6edf0';c.beginPath();c.moveTo(x0,y-8);c.lineTo(x0+bw,y-8);c.stroke();c.fillStyle=r.name==='United States'?'#a95143':'#247b93';c.beginPath();c.arc(x,y-8,7,0,Math.PI*2);c.fill();c.fillStyle='#17384b';c.textAlign='right';c.fillText(r.value.toFixed(1),1030,y);c.textAlign='left'}else if(metric==='both'){c.textAlign='right';c.fillText(r.life.toFixed(1)+' years',730,y);c.fillText(fmtSpend(r.spend),1030,y);c.textAlign='left'}else{const max=metric==='mortality'?100:metric==='life'?90:16000;c.fillStyle='#e6edf0';c.fillRect(275,y-16,590,19);if(r.value!=null){c.fillStyle=r.name==='United States'?'#a95143':'#5f96a7';c.fillRect(275,y-16,590*r.value/max,19)}c.fillStyle='#17384b';c.textAlign='right';c.fillText(val(r),1030,y);c.textAlign='left'}});
 c.fillStyle='#526977';c.font='13px sans-serif';c.fillText('Source: '+sourceURL,40,H-38);c.fillText('Country reporting years vary; OECD average includes all member countries.',40,H-17);
 cv.toBlob(b=>{if(b){download(b,'aip-'+metric+'.png');feedback.textContent='Chart saved as PNG.'}else feedback.textContent='Could not save chart.'},'image/png');
};
}

document.addEventListener('DOMContentLoaded',()=>{
 const m=document.querySelector('.metric-menu'); if(!m)return;
 const query=window.matchMedia('(max-width:800px)');
 function resize(e){m.open=!e.matches}
 resize(query);query.addEventListener?.('change',resize);
});

(() => {
  const stage=document.getElementById('stage'), toc=document.getElementById('toc');
  let index=0;
  const count=SLIDES.length;
  const pad=n=>String(n).padStart(2,'0');
  const renderSlide=(s,i)=>`<section class="slide ${s.type==='hero'?'hero':''}" aria-label="第${i+1}页 ${s.title}"><div class="eyebrow">ZHONGHE RESEARCH <span>/</span> ${pad(i+1)} · ${s.section}</div>${s.type==='hero'?'':`<h2>${s.title}</h2>${s.sub?`<p class="subtitle">${s.sub}</p>`:''}`}<div class="body">${s.body}</div><div class="slidefoot"><span>${s.foot||''}</span><span>${pad(i+1)} / ${pad(count)}</span></div></section>`;
  function fit(){if(innerWidth<=760)return;const box=document.getElementById('viewport');stage.style.transform=`scale(${Math.min((box.clientWidth-32)/1440,(box.clientHeight-32)/810)})`;}
  function show(n,update=true){index=Math.max(0,Math.min(count-1,n));stage.innerHTML=renderSlide(SLIDES[index],index);document.getElementById('counter').textContent=`${pad(index+1)} / ${pad(count)}`;document.getElementById('chapter').textContent=`${pad(index+1)}　${SLIDES[index].section}`;document.getElementById('progress').style.width=`${(index+1)/count*100}%`;document.getElementById('prev').disabled=index===0;document.getElementById('next').disabled=index===count-1;document.getElementById('viewport').scrollTop=0;document.title=`${SLIDES[index].title} · 中合村`;if(update)history.replaceState(null,'',`#${index+1}`);document.querySelectorAll('#tocList button').forEach((b,i)=>b.classList.toggle('selected',i===index));fit();}
  document.getElementById('tocList').innerHTML=SLIDES.map((s,i)=>`<button data-page="${i}"><span>${pad(i+1)}</span>${s.title}</button>`).join('');
  document.getElementById('tocList').addEventListener('click',e=>{const b=e.target.closest('button');if(b){show(Number(b.dataset.page));toc.close();}});
  document.getElementById('prev').onclick=()=>show(index-1);document.getElementById('next').onclick=()=>show(index+1);
  document.getElementById('tocBtn').onclick=()=>toc.showModal();document.getElementById('closeToc').onclick=()=>toc.close();toc.addEventListener('click',e=>{if(e.target===toc){const r=toc.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)toc.close();}});
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.getElementById('fullBtn').textContent='请按 F11 全屏';}}
  document.getElementById('fullBtn').onclick=fullscreen;
  document.addEventListener('fullscreenchange',()=>document.getElementById('fullBtn').textContent=document.fullscreenElement?'退出全屏 ↙':'全屏 ↗');
  document.addEventListener('keydown',e=>{if(toc.open||e.ctrlKey||e.metaKey||e.altKey)return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(index+1);}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(index-1);}if(e.key==='Home'){e.preventDefault();show(0);}if(e.key==='End'){e.preventDefault();show(count-1);}if(e.key.toLowerCase()==='f')fullscreen();});
  window.addEventListener('resize',fit);window.addEventListener('hashchange',()=>show((parseInt(location.hash.slice(1))||1)-1,false));
  window.addEventListener('beforeprint',()=>{stage.innerHTML=SLIDES.map(renderSlide).join('');});window.addEventListener('afterprint',()=>show(index,false));
  show((parseInt(location.hash.slice(1))||1)-1,false);
})();

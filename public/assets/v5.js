(function(){
var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var CL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',CR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
/* ---------- burger menu ---------- */
var hdr=document.querySelector('.hdr');
if(hdr && !hdr.querySelector('.burger')){var b=document.createElement('button');b.className='burger';b.type='button';b.setAttribute('aria-label','Open menu');b.setAttribute('aria-expanded','false');
b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
var acts = hdr.querySelector('.acts');
if(acts) acts.appendChild(b);
b.addEventListener('click',function(){var o=hdr.classList.toggle('open');b.setAttribute('aria-expanded',o);b.innerHTML=o?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';document.body.style.overflow=o?'hidden':''});
hdr.querySelectorAll('.dd .ddb').forEach(function(x){x.addEventListener('click',function(){if(window.innerWidth<=1180){x.parentNode.classList.toggle('open')}})});
hdr.querySelectorAll('.mainnav a').forEach(function(a){a.addEventListener('click',function(){if(hdr.classList.contains('open')){hdr.classList.remove('open');document.body.style.overflow='';b.setAttribute('aria-expanded','false')}})});
window.addEventListener('resize',function(){if(window.innerWidth>1180&&hdr.classList.contains('open')){hdr.classList.remove('open');document.body.style.overflow=''}});}
/* ---------- sub-nav arrows ---------- */
var sn=document.querySelector('.subnav');
if(sn && !sn.querySelector('.sn-wrap')){var inn=sn.querySelector('.sn-in');var w=document.createElement('div');w.className='sn-wrap';inn.parentNode.insertBefore(w,inn);w.appendChild(inn);
var l=document.createElement('button'),r=document.createElement('button');l.className='sn-btn l';r.className='sn-btn r';l.type=r.type='button';l.setAttribute('aria-label','Scroll sections left');r.setAttribute('aria-label','Scroll sections right');l.innerHTML=CL;r.innerHTML=CR;w.appendChild(l);w.appendChild(r);
function chk(){var o=inn.scrollWidth>inn.clientWidth+4;sn.classList.toggle('ovf',o);sn.classList.toggle('at-start',inn.scrollLeft<4);sn.classList.toggle('at-end',inn.scrollLeft+inn.clientWidth>=inn.scrollWidth-4)}
l.addEventListener('click',function(){inn.scrollBy({left:-inn.clientWidth*.7,behavior:'smooth'})});r.addEventListener('click',function(){inn.scrollBy({left:inn.clientWidth*.7,behavior:'smooth'})});
inn.addEventListener('scroll',chk,{passive:true});window.addEventListener('resize',chk);chk();setTimeout(chk,400);}
/* ---------- lightbox ---------- */
if(!document.querySelector('.lbx')) {
var lb=document.createElement('div');lb.className='lbx';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Screenshot');
lb.innerHTML='<button class="x" type="button" aria-label="Close">&times;</button><figure><img alt=""><figcaption></figcaption></figure>';document.body.appendChild(lb);
var li=lb.querySelector('img'),lc=lb.querySelector('figcaption'),lastF=null;
function openLb(src,cap){li.src=src;li.alt=cap;lc.textContent=cap+' - fictional sample data';lastF=document.activeElement;lb.classList.add('open');document.body.style.overflow='hidden';lb.querySelector('.x').focus()}
function closeLb(){lb.classList.remove('open');document.body.style.overflow='';if(lastF)lastF.focus()}
document.addEventListener('click',function(e){var a=e.target.closest('a.shot,.shot-cap a');if(!a)return;e.preventDefault();var img=a.classList.contains('shot')?a.querySelector('img'):null;var alt=img?img.alt:(a.closest('div').parentNode.querySelector('a.shot img')||{alt:'OvoTech screen'}).alt;openLb(a.getAttribute('href'),alt)});
lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('x'))closeLb()}); lb.addEventListener('keydown',function(e){if(e.key==='Tab'){e.preventDefault();lb.querySelector('.x').focus()}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))closeLb()});
}
/* ---------- autoplay for tabbed / stepped sections ---------- */
function auto(o){var host=document.querySelector(o.host);if(!host||RM)return;var ms=o.ms,paused=false,hold=0,visible=false,t=null,prog=false;
if(!document.querySelector('style#auto-css')){var st=document.createElement('style');st.id='auto-css';st.textContent='@keyframes draw{to{stroke-dashoffset:0}} .ap-btn{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#56606E;background:none;border:none;padding:8px 0;margin-top:16px;cursor:pointer} .ap-btn:hover{color:#081B3C} .ap-btn svg{width:16px;height:16px;fill:currentColor} .ap-circ{transform:rotate(-90deg);stroke-dasharray:100;stroke-dashoffset:100} .running .ap-circ{animation:draw linear forwards}';document.head.appendChild(st)}
var ctrl=document.createElement('button');ctrl.className='ap-btn';ctrl.type='button';ctrl.setAttribute('aria-label','Pause animation');
var pIcon='<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',plIcon='<svg viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"/></svg>';
function uCtrl(){ctrl.innerHTML=(paused?plIcon:pIcon)+'<span>'+(paused?'Play':'Pause')+'</span>';ctrl.setAttribute('aria-label',paused?'Play animation':'Pause animation')}
var wrap=document.createElement('div');wrap.appendChild(ctrl);host.parentNode.insertBefore(wrap,host.nextSibling);
var isO=false;
function run(){if(t)clearTimeout(t);if(paused||!visible)return;if(!isO){var b=host.querySelectorAll(o.btns);var cur=-1;b.forEach(function(x,i){if(x.getAttribute('aria-pressed')==='true'||x.classList.contains('on'))cur=i});var nxt=(cur+1)%b.length;var ev=new MouseEvent('click',{bubbles:true});b[nxt].dispatchEvent(ev)}
isO=false;t=setTimeout(run,ms)}
function obs(e){visible=e[0].isIntersecting;if(visible){run()}else{clearTimeout(t)}}
var ob=new IntersectionObserver(obs,{threshold:0.5});ob.observe(host);
ctrl.addEventListener('click',function(){paused=!paused;uCtrl();if(!paused)run();else clearTimeout(t)});
uCtrl();
var to=null;
host.addEventListener('click',function(e){if(e.isTrusted){isO=true;if(to)clearTimeout(to);if(!paused){clearTimeout(t);to=setTimeout(function(){isO=false;run()},ms*2)}}});}
if(document.querySelector('.wtr'))auto({host:'.wtr',btns:'.tbtn',ms:5000});
if(document.querySelector('.roles'))auto({host:'.roles',btns:'.tbtn',ms:6000});
if(document.querySelector('#stepList'))auto({host:'#stepList',btns:'button',ms:6000});
})();


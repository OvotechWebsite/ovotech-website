(function(){
var nav=document.querySelector('.subnav');if(!nav || nav.dataset.v3)return;nav.dataset.v3 = '1';
var links=[].slice.call(nav.querySelectorAll('a'));var map={};links.forEach(function(a){var t=document.getElementById(a.getAttribute('href').slice(1));if(t)map[t.id]=a});
function upd(){var y=window.scrollY+170,cur=null;Object.keys(map).forEach(function(id){var el=document.getElementById(id);if(el && el.getBoundingClientRect().top+window.scrollY<=y)cur=id});links.forEach(function(a){a.classList.remove('on')});if(cur){map[cur].classList.add('on');var a=map[cur],box=nav.querySelector('.sn-in');if(box) { var l=a.offsetLeft-box.clientWidth/2+a.clientWidth/2;box.scrollTo({left:l,behavior:'smooth'}) }}}
window.addEventListener('scroll',upd,{passive:true});upd();})();

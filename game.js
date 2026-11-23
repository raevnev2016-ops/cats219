(()=>{'use strict';
const $=id=>document.getElementById(id);const app=$('app');const screens=['home','rules','playing','moment','end'];
const links={history:'https://historyandcats.com/polugod?utm_source=game&utm_medium=bf&utm_term=iik',social:'https://socialandcats.com/polugod?utm_medium=bf&utm_source=game&utm_term=oik'};
const ctx=$('canvas').getContext('2d');const W=390,H=490;
let subject='history',stage='home',score=0,tries=3,caught=0,round=0,clawX=195,clawY=98,dir=1,phase='aim',held=null,landed=null,prizes=[],last=0,frame=0,particles=[];
const catalog=[{type:'coin',label:'%',points:100,color:'#ffd26f'},{type:'combo',label:'COMBO',points:150,color:'#b69af4'},{type:'book',label:'ЕГЭ',points:80,color:'#8bd5df'},{type:'heart',label:'♥',points:120,color:'#ff9dbe'},{type:'mystery',label:'?',points:0,color:'#b8d9a8'}];
function show(id){screens.forEach(s=>$(s).classList.toggle('hide',s!==id));stage=id;}
function setSubject(s){subject=s;app.classList.toggle('social',s==='social');document.querySelectorAll('[data-subject]').forEach(b=>b.classList.toggle('active',b.dataset.subject===s));$('guideCat').src=`assets/${s==='history'?'kosha':'kvaks'}.webp`;}
document.querySelectorAll('[data-subject]').forEach(el=>el.addEventListener('click',()=>setSubject(el.dataset.subject)));
$('startBtn').addEventListener('click',()=>show('rules'));$('backBtn').addEventListener('click',()=>show('home'));
$('playBtn').addEventListener('click',start);$('grabBtn').addEventListener('click',grab);$('canvas').addEventListener('pointerdown',e=>{e.preventDefault();grab();});
$('continueBtn').addEventListener('click',()=>{if(tries<=0)end();else beginRound();});$('retryBtn').addEventListener('click',start);$('switchBtn').addEventListener('click',()=>show('home'));$('quitBtn').addEventListener('click',start);
function updateHUD(){$('triesDisplay').textContent=('♥ '.repeat(tries)+ '♡ '.repeat(3-tries)).trim();$('scoreDisplay').textContent=String(score).padStart(3,'0');}
function makePrizes(){let pool=[catalog[0],catalog[1],catalog[2],catalog[3],catalog[4]];for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}prizes=pool.map((p,i)=>({...p,x:62+i*66+(Math.random()*7-3.5),y:378+Math.sin(i*2)*5,alive:true,spin:Math.random()*7}));}
function start(){score=0;tries=3;caught=0;round=0;updateHUD();makePrizes();beginRound();}
function beginRound(){if(tries===0){end();return;}clawX=195;clawY=95;dir=1;phase='aim';held=null;landed=null;particles=[];$('grabBtn').disabled=false;$('hintLabel').textContent='Выбери момент для захвата';$('talkCat').src=`assets/${subject==='history'?'kosha':'kvaks'}.webp`;$('talkText').textContent=round===0?'Три попытки. Не промахнись!':round===1?'Ладно, теперь точно попадёшь?':'Последняя попытка. Соберись!';show('playing');}
function grab(){if(stage!=='playing'||phase!=='aim')return;phase='down';$('grabBtn').disabled=true;$('hintLabel').textContent='Клешня опускается…';}
function outcome(){tries--;round++;if(landed){caught++;let delta=landed.type==='mystery'?[0,50,160][Math.floor(Math.random()*3)]:landed.points;score+=delta;let title=landed.type==='mystery'?(delta?'СЮРПРИЗ!':'КОРОБКА-ПУСТЫШКА!'):landed.type==='combo'?'КОМБО-УЛОВ!':'ЕСТЬ ДОБЫЧА!';$('momentTitle').textContent=title;$('momentPrize').textContent=delta?'+'+delta:'0 очков';$('momentDesc').textContent=landed.type==='combo'?'Combo в игре пойман! А в реальной акции тоже есть выгода за несколько предметов.':landed.type==='mystery'&&delta===0?'Сюрприз оказался пустым. Да, бывает и так 😼':'Кошачья хватка работает! Попробуешь повторить?';$('momentCat').src=`assets/${subject==='history'?'kvaks':'kosha'}.webp`;}else{$('momentTitle').textContent='ЛАПКИ МИМО!';$('momentPrize').textContent='+0';$('momentDesc').textContent='Клешня прошла мимо коробок. Ещё попробуем?';$('momentCat').src=`assets/${subject==='history'?'kosha-boss':'kvaks-coffee'}.webp`;}updateHUD();$('momentCount').textContent=`${round} / 3`;$('leftCount').textContent=tries?`Осталось попыток: ${tries}`:'Все попытки использованы';$('continueBtn').innerHTML=tries?'ЕЩЁ ЗАХВАТ <span>➜</span>':'УЗНАТЬ РЕЗУЛЬТАТ <span>➜</span>';show('moment');}
function end(){show('end');let win=score>=250;$('endTitle').textContent=win?'КОТОЛЕГЕНДА!':score>=120?'ПОЧТИ ПОЙМАЛ!':'АВТОМАТ ПОБЕДИЛ 😼';$('endDesc').textContent=win?'У тебя реально золотые лапки!':score>=120?'Не хватило до 250 — можно отыграться.':'Квакс требует реванша. Дадим ему шанс?';$('endScore').textContent=score;$('endPrizes').textContent=`${caught} / 3`;$('endCat').src=`assets/${subject==='history'?'kvaks':'kosha'}.webp`;$('courseLink').href=links[subject];$('courseLink').innerHTML=subject==='history'?'КУРС ПО ИСТОРИИ <span>↗</span>':'КУРС ПО ОБЩЕСТВУ <span>↗</span>';}
function resize(){const rect=$('canvas').getBoundingClientRect();if(rect.width<1)return;const dpr=Math.min(2,devicePixelRatio||1);$('canvas').width=Math.round(rect.width*dpr);$('canvas').height=Math.round(rect.height*dpr);ctx.setTransform($('canvas').width/W,0,0,$('canvas').height/H,0,0);}
function rounded(x,y,w,h,r,fill,stroke,lw=1){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}}
function text(t,x,y,sz,color='#fff',weight=900){ctx.font=`${weight} ${sz}px Arial,sans-serif`;ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,x,y);}
function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
function render(){let bg=subject==='history'?'#f2e2fd':'#d5effd';ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
// cabinet back wall and animated signage
rounded(16,14,358,432,23,subject==='history'?'#a791d9':'#84b6de','#fff',5);rounded(29,27,332,398,17,subject==='history'?'#e6ddf9':'#d6f0ff','#fff',4);
for(let i=0;i<8;i++){const x=45+i*43;text('✦',x,47+(i%2)*11,13,i%2?'#f5aa50':'#b898d7');}
rounded(56,52,278,40,12,'#302456');text('BLACK FRIDAY',195,73,21,'#ffffff');
rounded(42,102,305,252,12,subject==='history'?'#d8caec':'#c1e5f6','#fff',4);
ctx.save();ctx.globalAlpha=.23;for(let k=0;k<12;k++){ctx.fillStyle=k%2?'#fff':'#9f90cf';ctx.fillRect(52+(k%5)*61,120+Math.floor(k/5)*72,34,37);}ctx.restore();
// rails and upper motor
rounded(41,116,309,15,7,'#6a568b');rounded(clawX-23,110,46,21,7,'#45335f','#fff',2);ctx.strokeStyle='#51446d';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(clawX,130);ctx.lineTo(clawX,clawY);ctx.stroke();
// prize bed
rounded(32,350,326,73,12,'#9d7bc2','#fff',3);for(let i=0;i<14;i++){ellipse(46+i*23,410-(i%2)*5,14,7,i%2?'#b99cdc':'#d9bbee');}
prizes.forEach((p,i)=>{if(!p.alive) return;drawPrize(p.x,p.y,p,frame*.012+p.spin);});
// hanging prize
if(held){drawPrize(clawX,clawY+38,held,frame*.01);}
// claw claws
ctx.strokeStyle='#38304f';ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(clawX,clawY-3);ctx.lineTo(clawX-18,clawY+16);ctx.lineTo(clawX-14,clawY+27);ctx.moveTo(clawX,clawY-3);ctx.lineTo(clawX+18,clawY+16);ctx.lineTo(clawX+14,clawY+27);ctx.stroke();ellipse(clawX,clawY,10,10,'#ffc96f');
// lower counter / controls on cabinet
rounded(24,434,342,43,12,'#44315c');rounded(39,443,100,22,7,'#f7c975');text('3 ХВАТА',89,454,11,'#44315c');text('✦  СТАДИКЭТС  ✦',252,456,12,'#ffffff');
for(let p of particles){ctx.globalAlpha=Math.max(0,p.life);text('✦',p.x,p.y,12,p.col);ctx.globalAlpha=1;}
}
function drawPrize(x,y,p,t){let bob=Math.sin(t)*2;ctx.save();ctx.translate(x,y+bob);ctx.rotate(Math.sin(t*.5)*.055);ellipse(0,20,27,8,'#5a4c8355');rounded(-23,-20,46,41,9,p.color,'#ffffff',3);ctx.strokeStyle='#ffffffa0';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-21,-2);ctx.lineTo(21,-2);ctx.moveTo(0,-19);ctx.lineTo(0,19);ctx.stroke();rounded(-23,-26,46,12,5,p.color,'#ffffff',2);text(p.label,0,4,p.label.length>2?10:19,p.type==='combo'?'#372c62':'#3a2a5a');ctx.restore();}
function step(dt){if(stage!=='playing')return;frame++;if(phase==='aim'){clawX+=dir*dt*145; if(clawX>326){clawX=326;dir=-1;} if(clawX<64){clawX=64;dir=1;}}else if(phase==='down'){clawY+=dt*350;if(clawY>=330){clawY=330;phase='up';let nearby=prizes.filter(p=>p.alive&&Math.abs(p.x-clawX)<24).sort((a,b)=>Math.abs(a.x-clawX)-Math.abs(b.x-clawX));held=nearby[0]||null;landed=held;if(held){held.alive=false;for(let i=0;i<14;i++){particles.push({x:clawX+(Math.random()-.5)*80,y:340+(Math.random()-.5)*35,life:1,col:i%2?'#ffdd73':'#bc8ef2'});}}}}else if(phase==='up'){clawY-=dt*360;for(let p of particles){p.y-=dt*48;p.life-=dt*.65;}if(clawY<=95){clawY=95;phase='return';setTimeout(()=>{if(stage==='playing'&&phase==='return')outcome();},350);}}}
function loop(ts){let dt=Math.min(.05,(ts-last)/1000||0);last=ts;if(stage==='playing'){resize();step(dt);render();}requestAnimationFrame(loop);}requestAnimationFrame(loop);setSubject('history');show('home');
})();

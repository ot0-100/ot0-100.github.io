const K='lifetracker.v2',WD=['понедельник','вторник','среда','четверг','пятница','суббота','воскресенье'];
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const pd=s=>new Date(s+'T00:00'),addD=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);
const TD=pd(iso(new Date())),D=iso(TD),START=pd('2026-10-01'),END=pd('2027-06-01'),GOAL=pd('2027-06-20');
let S={l2:null,done:{},apps:{},notes:{},co:[],debts:[],extra:0,method:'av',assets:[],led:[],hired:false,usdRate:83.5588,moneyCurrency:'RUB'};
const DEF=JSON.parse(JSON.stringify(S));
try{Object.assign(S,JSON.parse(localStorage.getItem(K)||'{}'))}catch(e){}
S.usdRate=Number(S.usdRate)>0?Number(S.usdRate):83.5588;
S.moneyCurrency=S.moneyCurrency==='USD'?'USD':'RUB';
const save=()=>{S.ts=Date.now();try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}if(AU)qp()};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fm=n=>Math.round(n).toLocaleString('ru-RU')+' ₽';
const fdol=n=>'$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const mf=n=>S.moneyCurrency==='USD'?fdol(Number(n)/S.usdRate):fm(n);
const balance=()=>S.led.reduce((a,x)=>a+(x.t==='Доход'?1:-1)*Number(x.a||0),0);
const curBtn=()=>`<div class="currency"><button class="${S.moneyCurrency==='RUB'?'on':''}" data-a=currency data-k=RUB>₽</button><button class="${S.moneyCurrency==='USD'?'on':''}" data-a=currency data-k=USD>$</button></div>`;
const rateText=()=>`1 $ = ${S.usdRate.toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:4})} ₽`;
const v=id=>document.getElementById(id).value;
const days=(a,b)=>Math.round((a-b)/864e5),idx=d=>Math.max(0,days(d,START));
const fd=(s,o)=>pd(s).toLocaleDateString('ru-RU',o||{day:'numeric',month:'long'});
let col={},ti=0,tab=(location.hash||'#h').slice(1),cm=new Date(TD.getFullYear(),TD.getMonth(),1),sel=D,dd=D;
const TABS={h:'Сегодня',k:'План',s:'Учёба',w:'Работа',m:'Деньги',f:'Спорт',d:'Дневник'};
const AN={s:'Учёба',w:'Работа',m:'Финансы',f:'Физподготовка'};

// ---------- годовой план ----------
const LOG=['Понятия: объём и содержание, определение, деление','Суждения и их виды','Умозаключения: непосредственные и силлогизм','Индукция, аналогия, методы исследования причин','Доказательство, ошибки в рассуждении, итоговое повторение'];
const HR=[{logic:3},{logic:.5,math:1.5,rus:1,inf:1,dev:1.5}];
const NM={logic:'Логика (Челпанов)',math:'Математика',rus:'Русский язык',inf:'Информатика',dev:'DevOps'};
const RUS=['Орфография: корни и приставки','Пунктуация: запятые в простых и сложных предложениях','Сочинение: структура и аргументы','Нормы: ударения, лексика, грамматика'];
const INF=['Системы счисления и кодирование','Логика и таблицы истинности','Алгоритмы и основы Python','Графы, перебор и таблицы'];
const DEV=['Linux: файлы, права, процессы','Bash-скрипты','Git и GitHub','Сети: IP, DNS, HTTP','Docker','CI/CD (GitHub Actions)','Ansible и Terraform (обзор)','Мониторинг и логи'];
const PLAT=['hh.ru','Хабр Карьера','SuperJob и Авито Работа','Telegram-каналы с вакансиями','сайты компаний напрямую'];
const BLK=['Адаптация: техника, привычка, лёгкий объём','Объём: +1 подход к упражнениям','Сила: опускайся медленно (3 секунды), полный контроль','Форма к экзаменам: объём держим, больше восстановления'];
const WU='Суставная разминка 3 мин';
const PL=[
['Ноги и спина',[WU,['Скакалка',5,1,' мин',0],['Приседания',4,15,'',1],['Приседания с гирей',3,10,'',1]],[['Тяга гантели в наклоне',3,10,' на руку',1],['Планка',3,40,' с',5],'Растяжка 5 мин']],
['Жим и плечи',[WU,['Скакалка',4,2,' мин',0],['Отжимания',4,8,'',1],['Жим гантели стоя',3,10,'',1]],[['Обратные отжимания от стула',3,10,'',1],['Подъём ног лёжа',3,12,'',1],'Растяжка груди и плеч 5 мин']],
['Кардио и кор',[WU,['Скакалка',6,1,' мин',0],['Выпады',3,10,' на ногу',1]],['Мобилити или йога 15 мин',['Боковая планка',3,30,' с',5]]],
['Ноги',[WU,['Приседания с гирей',4,12,'',1],['Выпады с гантелью',3,10,' на ногу',1],['Скакалка',3,1,' мин',0]],[['Приседания',3,15,'',1],['Подъёмы на носки',3,20,'',2],'Растяжка ног 5 мин']],
['Верх и тяга',[WU,['Отжимания узким хватом',3,8,'',1],['Тяга гири в наклоне',3,10,' на руку',1],['Скакалка',3,1,' мин',0]],[['Жим гантелей лёжа на полу',3,10,'',1],['Сгибания на бицепс',3,12,'',1],['Скручивания',3,15,'',1]]],
['Круг и прогулка',[WU,'Круг, 4 раунда: приседания с гирей 10, отжимания 8, выпады 10, скакалка 30 с'],['Прогулка 30–40 мин или мобилити']],
['Восстановление',['Мобилити 10 мин','Лёгкая прогулка 20 мин'],['Растяжка всего тела 10 мин','Дыхание и расслабление 5 мин']]];
const fw=d=>Math.floor(idx(d)/7);
const ex=(a,w)=>{if(typeof a=='string')return a;const c=w%4,dl=c==3,l=Math.min(3,Math.floor(w/8)),s=Math.max(2,a[1]+(l?1:0)-(dl?1:0));return`${a[0]} ${s}×${a[2]+(dl?0:(c+Math.min(3,Math.floor(w/4)))*a[4])}${a[3]}`};
const fdet=(d,k)=>{const w=fw(d),l=Math.min(3,Math.floor(w/8));return PL[(d.getDay()+6)%7][k].map(a=>ex(a,w)).join(' • ')+(w%4==3?'. Неделя разгрузки: на подход меньше':'')+(l==2?'. Темп вниз 3 с':'')};

// ---------- фазы учёбы ----------
const planned=()=>addD(START,35),P2e=()=>S.l2?pd(S.l2):planned();
const ph=d=>S.l2?(d>=pd(S.l2)?1:0):(planned()>TD&&d>=planned()?1:0);
const grade=d=>{const t=Math.max(6,Math.floor(days(END,P2e())/7)),w=Math.max(0,Math.floor(days(d,P2e())/7));return 6+Math.min(5,Math.floor(w/(t/6)))};
function tasks(d){
 if(d<START||d>END)return[];
 const wd=(d.getDay()+6)%7,p=ph(d),T=[];
 if(wd==6)T.push({id:'s-rev',a:'s',x:'Повторение недели',d:p?'Перечитать конспекты, разобрать ошибки недели':'Повторить пройденное по Челпанову, ответить на вопросы в конце глав',h:1});
 else if(!p)T.push({id:'s-logic',a:'s',x:'Челпанов: «Учебник логики»',d:LOG[Math.min(4,fw(d))]+'. Читать, конспект, свои примеры, задачи',h:3});
 else{const w=Math.max(0,Math.floor(days(d,P2e())/7)),fin=days(END,d)<21,X='Пробный вариант экзамена и разбор ошибок',
  t={logic:'Повторение: 10–15 задач на умозаключения и определения',math:fin?X:'Учебник '+grade(d)+' класса: параграф и задачи',rus:fin?X:RUS[w%4],inf:fin?X:INF[w%4],dev:DEV[w%8]};
  for(const k in HR[1])T.push({id:'s-'+k,a:'s',x:NM[k],d:t[k],h:HR[1][k]})}
 if(!S.hired){
  if(wd<5)T.push({id:'w-ap',a:'w',x:'5 откликов: '+PLAT[wd],d:'Подстроить резюме под вакансию чат-поддержки',h:1},{id:'w-in',a:'w',x:'Проверить ответы и сообщения рекрутёров',h:.25},{id:'w-pr',a:'w',x:'Подготовка к собеседованию',d:'Типовые вопросы саппорта, ситуации с клиентами',h:.5});
  else T.push(wd==5?{id:'w-cv',a:'w',x:'Обновить резюме и сопроводительное письмо',h:.5}:{id:'w-sum',a:'w',x:'Итоги недели по откликам и компаниям',d:'Внести ответы в таблицу компаний',h:.25})}
 T.push({id:'m-led',a:'m',x:'Внести доходы и расходы за день',h:.1},
  {id:'f-am',a:'f',x:'Утро: '+PL[wd][0],d:fdet(d,1),h:.4},{id:'f-pm',a:'f',x:'Вечер, тихо: без скакалки',d:fdet(d,2),h:.4});
 return T}
const doneOn=(s,t)=>!!(S.done[s]&&S.done[s][t.id]),isDone=t=>doneOn(D,t);
const chk=(t,s=D,ro)=>{const o=doneOn(s,t);return`<label class="r c${o?' on':''}"><input type=checkbox data-c=tgl data-k="${t.id}" data-d="${s}" ${o?'checked':''} ${ro?'disabled':''}><span><b>${t.x}</b>${t.d?'<small>'+t.d+'</small>':''}</span><em>${t.h} ч</em></label>`};
const areaTasks=a=>tasks(TD).filter(t=>t.a==a);
const grp=(T,s,ro)=>`<div class="g">${T.map(t=>chk(t,s,ro)).join('')}</div>`;

// ---------- расчёт долгов ----------
function sim(){
 const d=S.debts.map(x=>({n:x.n,b:+x.b,r:+x.r/1200,p:+x.p,m:null})).filter(x=>x.b>0);if(!d.length)return null;
 const budget=d.reduce((a,x)=>a+x.p,0)+ +S.extra;let m=0,int=0;
 while(d.some(x=>x.b>.005)&&m<600){m++;
  d.forEach(x=>{if(x.b>0){const i=x.b*x.r;x.b+=i;int+=i}});let pool=budget;
  d.forEach(x=>{if(x.b>0){const p=Math.min(x.p,x.b,pool);x.b-=p;pool-=p}});
  d.filter(x=>x.b>.005).sort(S.method=='av'?(a,b)=>b.r-a.r:(a,b)=>a.b-b.b).forEach(x=>{const p=Math.min(x.b,pool);x.b-=p;pool-=p});
  d.forEach(x=>{if(x.b<=.005&&x.m==null)x.m=m})}
 return{m,int,d,budget,ok:!d.some(x=>x.b>.005)}}
const mdate=n=>{const t=new Date(TD);t.setMonth(t.getMonth()+n);return t.toLocaleDateString('ru-RU',{month:'long',year:'numeric'})};

// ---------- экраны ----------
function home0(){
 const T=tasks(TD),c=T.filter(isDone).length,nx=T.find(t=>!isDone(t)),wd=(TD.getDay()+6)%7,hr=new Date().getHours(),p=ph(TD);
 const gr=hr<5?'Доброй ночи':hr<12?'Доброе утро':hr<18?'Добрый день':'Добрый вечер',sh=areaTasks('s').reduce((a,t)=>a+t.h,0),ap=S.apps[D]||0,sm=sim(),dn=days(GOAL,TD),bal=balance();
 const L=[`Сегодня ${WD[wd]}, день ${idx(TD)+1} плана.`,p?'Идёт основной этап: все предметы параллельно.':`Этап 1: Челпанов. Тема недели: ${LOG[Math.min(4,fw(TD))].toLowerCase()}. Остальные предметы откроются после него.`,
  `Учёба сегодня: ${sh} ч. ${S.hired?'Работа найдена.':wd<5?'Откликов отправлено: '+ap+' из 5.':'Работа: разбор недели и резюме.'}`];
 if(sm)L.push(sm.ok?`Долги закроются через ${sm.m} мес. (${mdate(sm.m)}).`:'Платежей по долгам не хватает даже на проценты.');
 if(hr>=18&&!S.led.some(x=>x.d==D))L.push('Доходы и расходы за сегодня ещё не внесены.');
 if(!T.length)L.length=1,L.push('План на эту дату не составлен.');
 return`<div class="hd"><img src="${document.querySelector('link[rel=icon]').href}" width="46" height="46" alt=""><h1>${gr}</h1></div>
 <div class="g p"><div class="row"><div><div class="mut">Баланс</div><div class="big">${mf(bal)}</div><div class="mut">Доходы − расходы</div></div>${curBtn()}</div><p class="mut" style="margin-top:10px">${rateText()} · изменить курс можно в разделе «Деньги».</p></div>
 <div class="g p">${L.map(x=>'<p>'+x+'</p>').join('')}${nx?`<p style="margin-top:10px"><b>Следующий шаг:</b> ${nx.x}</p>`:''}<div class="bar${c==T.length&&T.length?' full':''}"><i data-w="${T.length?100*c/T.length:0}"></i></div><p class="mut">Выполнено ${c} из ${T.length}</p></div>
 <div class="g p row"><div><div class="big" data-n="${Math.max(0,dn)}">${Math.max(0,dn)}</div><div class="mut">дней до начала приёма (${fd('2027-06-20')})</div></div><div class="mut">Цель: поступление в НИУ ВШЭ Пермь на базе СПО. План идёт до 1 июня 2027.</div></div>
 ${['s','w','m','f'].map(a=>{const t=areaTasks(a);return t.length?`<div class="gh fh${col[a]?' shut':''}" data-a=col data-k=${a}>${AN[a]}<span>${t.filter(isDone).length}/${t.length}</span><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></div><div class="fold${col[a]?' shut':''}"><div>${grp(t)}</div></div>`:''}).join('')}`}


function study(){
 const p=ph(TD),i=idx(TD),tot=Object.keys(S.done).reduce((a,k)=>a+tasks(pd(k)).filter(t=>t.a=='s'&&S.done[k][t.id]).reduce((x,t)=>x+t.h,0),0);
 let h=`<h1>Учёба</h1><div class="g p"><div class="big" data-n="${tot.toFixed(1)}" data-dc="1" data-s=" ч">${tot.toFixed(1)} ч</div><div class="mut">учебных часов отмечено</div></div><div class="gh">Сегодня</div>${grp(areaTasks('s'))||''}`;
 if(!p){
  const wk=LOG.map((x,k)=>`<div class="r"><span><b>Неделя ${k+1}</b> · ${fd(iso(addD(START,k*7)))} — ${fd(iso(addD(START,k*7+6)))}<small>${x}</small></span></div>`).join('');
  const can=i>=28;
  h+=`<div class="gh">Этап 1: Челпанов, 3 ч в день (примерно 5 недель)</div><div class="g">${wk}</div>
  <div class="gh">Закрыто до окончания Челпанова</div><div class="g">${['math','rus','inf','dev'].map(k=>`<div class="r"><span>${NM[k]}<small>Откроется на этапе 2</small></span><em>закрыто</em></div>`).join('')}</div>
  <div class="g p"><button class="b" data-a=fin ${can?'':'disabled'}>Я закончил Челпанова</button><p class="mut">${can?'Нажми, когда прошёл книгу и решил задачи. Остальные предметы откроются со следующего дня.':'Кнопка станет доступна с '+fd(iso(addD(START,28)))+': за меньший срок книгу не пройти вдумчиво.'}</p></div>`}
 else{
  const w=Math.max(0,Math.floor(days(TD,P2e())/7)),r=k=>`<tr><td>${NM[k]}</td><td>${HR[1][k]} ч</td></tr>`;
  h+=`<div class="gh">Этап 2 с ${fd(iso(P2e()))}</div><div class="g wrap"><table><tr><th>Предмет</th><th>В день (Пн–Сб)</th></tr>${Object.keys(HR[1]).map(r).join('')}<tr><th>Итого</th><th>${Object.values(HR[1]).reduce((a,b)=>a+b)} ч</th></tr></table></div>
  <div class="gh">Тема этой недели</div><div class="g"><div class="r"><span>Математика<small>${grade(TD)} класс, программа 6–11 классов равномерно до июня</small></span></div><div class="r"><span>Русский<small>${RUS[w%4]}</small></span></div><div class="r"><span>Информатика<small>${INF[w%4]}</small></span></div><div class="r"><span>DevOps<small>${DEV[w%8]}</small></span></div></div>
  <p class="mut" style="margin:0 16px">Воскресенье: 1 ч повторения. Последние 3 недели до 1 июня: пробные варианты экзаменов.</p>`}
 return h}

function cal(){
 const y=cm.getFullYear(),m=cm.getMonth(),f=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();
 let c=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<div class="wd">${x}</div>`).join('')+'<i></i>'.repeat(f);
 for(let k=1;k<=n;k++){const d=new Date(y,m,k),s=iso(d),T=tasks(d),h=T.reduce((a,t)=>a+t.h,0);
  c+=`<button class="cd${s==sel?' sel':''}${s==D?' td':''}" data-a=sel data-k=${s}><b>${k}</b><small>${T.length?+h.toFixed(1)+' ч':''}</small>${T.length&&T.every(t=>doneOn(s,t))?'<u></u>':''}</button>`}
 const sd=pd(sel),T=tasks(sd),ro=sd>TD;
 return`<h1>План</h1><div class="g"><div class="row p" style="padding-bottom:0"><button class="ic" data-a=cmo data-n=-1 aria-label="Предыдущий месяц"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><b style="text-align:center;text-transform:capitalize">${cm.toLocaleDateString('ru-RU',{month:'long',year:'numeric'})}</b><button class="ic" data-a=cmo data-n=1 aria-label="Следующий месяц"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button></div><div class="cal">${c}</div></div>
 <div class="gh">${sd.toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})}${T.length?', '+ +T.reduce((a,t)=>a+t.h,0).toFixed(1)+' ч':''}</div>${T.length?grp(T,sel,ro):'<div class="g p mut">На эту дату плана нет: он идёт с 1 октября 2026 по 1 июня 2027.</div>'}
 <p class="mut" style="margin:0 16px">Этап 1 (Челпанов) сдвигается вместе с тобой: пока книга не закончена, будущие дни показывают проекцию.</p>`}

const ST=['Отклик','Созвон с HR','Первый собес','Собес с руководителем','Оффер','Отказ'];
function work(){
 const wk=[0,1,2,3,4,5,6].reduce((a,k)=>a+(S.apps[iso(addD(TD,-k))]||0),0);
 const cards=S.co.map((c,i)=>`<div class="g p"><div class="row"><h3 style="flex:1 1 100px;margin:0">${esc(c.n)}</h3><select data-c=stage data-i=${i} style="flex:0 1 210px">${ST.map(s=>`<option ${s==c.s?'selected':''}>${s}</option>`).join('')}</select><button class=x data-a=delco data-i=${i}>✕</button></div>
 <p class="mut">${c.d?fd(c.d,{day:'numeric',month:'long',year:'numeric'}):''}</p>${c.sal?`<p><b>Зарплата:</b> ${esc(c.sal)}</p>`:''}${c.bon?`<p><b>Бонусы и условия:</b> ${esc(c.bon)}</p>`:''}${c.con?`<p><b>Минусы:</b> ${esc(c.con)}</p>`:''}${c.cm?`<p>${esc(c.cm)}</p>`:''}</div>`).join('');
 return`<h1>Работа</h1><div class="g p"><h3>Цель: удалённая работа в чат-поддержке</h3><div class="row"><span class="n">Откликов сегодня: <b>${S.apps[D]||0}</b></span><button class="ic" data-a=ap data-n=-1 aria-label="Минус один"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button><button class="ic" data-a=ap data-n=1 aria-label="Плюс один"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button><span class="mut">за 7 дней: ${wk}</span></div>
 <label class="row" style="margin-top:10px"><input type=checkbox data-c=hired ${S.hired?'checked':''} class="n"><span>Работа найдена (убрать задачи поиска)</span></label></div>
 <div class="gh">Сегодня</div>${areaTasks('w').length?grp(areaTasks('w')):'<div class="g p mut">Поиск завершён.</div>'}
 <div class="gh">Компании: ${ST.map(s=>s+' '+S.co.filter(c=>c.s==s).length).join(' · ')}</div>
 <div class="g p"><div class="row"><input id=cn placeholder="Компания"><select id=cs>${ST.map(s=>`<option>${s}</option>`).join('')}</select><input id=cd type=date value="${D}"></div>
 <div class="row" style="margin-top:8px"><input id=csal placeholder="Зарплата"><input id=cbon placeholder="Бонусы и условия"><input id=ccon placeholder="Минусы"></div>
 <div class="row" style="margin-top:8px"><input id=ccm placeholder="Комментарий"><button class="b" data-a=addco>Добавить</button></div></div>${cards}`}

function money(){
 const sm=sim(),cap=S.assets.reduce((a,x)=>a+ +x.a,0),inc=S.assets.reduce((a,x)=>a+x.a*x.y/1200,0),bal=balance();
 const dr=S.debts.map((x,i)=>`<tr><td>${esc(x.n)}</td><td><input type=number data-c=debt data-i=${i} value="${x.b}" style="width:110px"></td><td>${x.r}%</td><td>${mf(x.p)}</td><td>${sm&&sm.d.find(q=>q.n==x.n&&q.m)?sm.d.find(q=>q.n==x.n).m+' мес.':''}</td><td><button class=x data-a=deldebt data-i=${i}>✕</button></td></tr>`).join('');
 const mo={};S.led.forEach(x=>{const k=x.d.slice(0,7);mo[k]=mo[k]||{i:0,e:0};mo[k][x.t=='Доход'?'i':'e']+=+x.a});
 const mr=Object.keys(mo).sort().reverse().map(k=>{const r=mo[k],p=r.i-r.e;return`<tr><td>${k}</td><td>${mf(r.i)}</td><td>${mf(r.e)}</td><td class="${p>=0?'pos':'neg'}"><b>${p>=0?'+':''}${mf(p)}</b></td></tr>`}).join('');
 const lr=S.led.map((x,i)=>({...x,i})).sort((a,b)=>b.d.localeCompare(a.d)).slice(0,15).map(x=>`<tr><td>${x.d}</td><td>${x.t}</td><td>${esc(x.c)}</td><td class="${x.t=='Доход'?'pos':'neg'}">${mf(x.a)}</td><td><button class=x data-a=delled data-i=${x.i}>✕</button></td></tr>`).join('');
 const ar=S.assets.map((x,i)=>`<tr><td>${esc(x.n)}</td><td>${x.k}</td><td>${mf(x.a)}</td><td>${x.y}%</td><td>${mf(x.a*x.y/1200)}</td><td><button class=x data-a=delasset data-i=${x.i}>✕</button></td></tr>`).join('');
 return`<h1>Деньги</h1>
 <div class="g p"><div class="row"><div><div class="mut">Баланс</div><div class="big">${mf(bal)}</div><div class="mut">Доходы − расходы · ${mf(bal)} / ${S.moneyCurrency==='RUB'?fdol(bal/S.usdRate):fm(bal)}</div></div>${curBtn()}</div><div class="row" style="margin-top:12px"><label style="max-width:260px">Курс USD, ₽<input type=number min=0.01 step=.0001 data-c=usdRate value="${S.usdRate}"></label><span class="mut">Текущий курс в трекере: ${rateText()}. Все суммы и операции хранятся в рублях, переключатель меняет только отображение.</span></div></div>
 <div class="gh">Долги</div><div class="g p"><div class="row"><input id=dn placeholder="Название долга"><input id=db type=number placeholder="Остаток, ₽"><input id=dr type=number step=.1 placeholder="Ставка, % годовых"><input id=dp type=number placeholder="Платёж в мес., ₽"><button class="b" data-a=adddebt>Добавить</button></div></div>
 ${S.debts.length?`<div class="g wrap"><table><tr><th>Долг</th><th>Остаток, ₽</th><th>Ставка</th><th>Платёж</th><th>Закрыт через</th><th></th></tr>${dr}</table></div>
 <div class="g p"><div class="row"><label>Доп. платёж в месяц, ₽<input type=number data-c=extra value="${S.extra}"></label><label>Порядок погашения<select data-c=method><option value="av" ${S.method=='av'?'selected':''}>Сначала высокая ставка</option><option value="sn" ${S.method=='sn'?'selected':''}>Сначала малый остаток</option></select></label></div>
 ${sm.ok?`<p style="margin-top:10px"><b>Свобода от долгов через ${sm.m} мес. (${mdate(sm.m)}).</b> Переплата по процентам: ${mf(sm.int)}. Платим в месяц: ${mf(sm.budget)}.</p>`:'<p class="neg" style="margin-top:10px"><b>При таких платежах долг не гасится.</b> Увеличь платёж или доп. сумму.</p>'}</div>`:'<div class="g p mut">Добавь долги, и калькулятор покажет срок и переплату.</div>'}
 <div class="gh">Вклады, акции и другие активы</div><div class="g p"><div class="row"><input id=an placeholder="Название"><select id=ak><option>Вклад</option><option>Акции</option><option>Облигации</option><option>Другое</option></select><input id=aa type=number placeholder="Сумма, ₽"><input id=ay type=number step=.1 placeholder="Доходность, % годовых"><button class="b" data-a=addasset>Добавить</button></div></div>
 ${S.assets.length?`<div class="g wrap"><table><tr><th>Актив</th><th>Тип</th><th>Сумма</th><th>Доходность</th><th>Доход в мес.</th><th></th></tr>${ar}<tr><th>Итого</th><th></th><th>${mf(cap)}</th><th></th><th>${mf(inc)}</th><th></th></tr></table></div>`:''}
 <div class="gh">Доходы и расходы по месяцам</div><div class="g p"><div class="row"><input id=ld type=date value="${D}"><select id=lt><option>Расход</option><option>Доход</option></select><input id=lc placeholder="Категория"><input id=la type=number placeholder="Сумма, ₽"><button class="b" data-a=addled>Добавить</button></div></div>
 ${mr?`<div class="g wrap"><table><tr><th>Месяц</th><th>Доходы</th><th>Расходы</th><th>Итог</th></tr>${mr}</table></div><div class="gh">Последние операции</div><div class="g wrap"><table>${lr}</table></div>`:'<div class="g p mut">Операций пока нет. Добавь первую операцию выше — баланс появится автоматически.</div>'}`}


function fit(){
 const mon=addD(TD,-((TD.getDay()+6)%7)),w=fw(TD),bl=Math.min(3,Math.floor(w/8));
 const rows=PL.map((p,i)=>{const d=addD(mon,i);return`<tr class="${i==(TD.getDay()+6)%7?'td':''}"><td><b>${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][i]}</b></td><td><b>${p[0]}</b><br>${fdet(d,1)}</td><td>${fdet(d,2)}</td></tr>`}).join('');
 return`<h1>Физподготовка</h1><div class="g p"><p>Инвентарь: скакалка, гиря 16 кг, гантеля до 16 кг и свой вес. Утро до 25 минут, вечер до 20 минут и без прыжков. Неделя ${w+1} из 35.</p><p class="mut">Текущий блок: ${BLK[bl]}</p></div>
 <div class="gh">Сегодня</div>${grp(areaTasks('f'))||'<div class="g p mut">Вне плана.</div>'}
 <div class="gh">Годовой план: 1 октября 2026 — 1 июня 2027</div><div class="g">${BLK.map((b,k)=>`<div class="r"><span><b>${fd(iso(addD(START,k*56)))} — ${fd(iso(k==3?END:addD(START,k*56+55)))}</b><small>${b}</small></span></div>`).join('')}</div>
 <p class="mut" style="margin:0 16px">Внутри блока повторения растут каждую неделю, каждая 4-я неделя разгрузочная. Все дни в разделе «План».</p>
 <div class="gh">Эта неделя</div><div class="g wrap"><table><tr><th></th><th>Утро</th><th>Вечер</th></tr>${rows}</table></div>
 <div class="gh">Правила</div><div class="g p"><ul style="margin:0;padding-left:18px"><li>Останавливайся за 1–2 повторения до отказа, отдых между подходами 60–90 с.</li><li>Сон 7–8 часов, вода и белок в каждом приёме пищи.</li><li>При боли в суставах замени день на мобилити и обратись к врачу.</li></ul></div>`}

function diary(){
 const ks=Object.keys(S.notes).filter(k=>S.notes[k]&&S.notes[k].trim()&&k!=dd).sort().reverse();
 return`<h1>Дневник</h1><div class="g p"><input type=date data-c=ddate value="${dd}"><textarea data-c=note placeholder="Что было за день: что сделал, что получилось, что не успел, что перенести">${esc(S.notes[dd])}</textarea><p class="mut">Запись сохраняется автоматически.</p></div>
 ${ks.length?'<div class="gh">Прошлые записи</div>'+ks.map(k=>`<button class="g p ent" data-a=edit data-k=${k}><b>${fd(k,{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</b><p>${esc(S.notes[k].slice(0,140))}</p></button>`).join(''):''}`}

// ---------- рендер и события ----------
const V={h:home,k:cal,s:study,w:work,m:money,f:fit,d:diary};
const IC={h:'<path d="M3 11l9-8 9 8M5 9.5V20h14V9.5"/>',k:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',s:'<path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2zM12 6v14"/>',w:'<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18"/>',m:'<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.6-.8-1.6-1.2-2.6-1.2-1.6 0-2.6.8-2.6 1.9s1 1.6 2.7 1.9 2.7.8 2.7 2-1.1 1.9-2.7 1.9c-1.1 0-2.1-.5-2.7-1.3M12 6.5v1.8M12 15.8v1.7"/>',f:'<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',d:'<path d="M5 4h11a2 2 0 012 2v14H7a2 2 0 01-2-2zM9 8h6M9 12h6"/>'};
const navEl=document.getElementById('nav');
navEl.innerHTML='<i class="ind"></i>'+Object.keys(TABS).map(k=>`<button data-a=tab data-k=${k}><svg viewBox="0 0 24 24">${IC[k]}</svg>${TABS[k]}</button>`).join('');
const ind=()=>{const b=navEl.querySelector('button.on'),i=navEl.querySelector('.ind');if(b){i.style.width=b.offsetWidth+'px';i.style.transform='translateX('+b.offsetLeft+'px)'}};
let pw=0;
function cnt(el,anim){const n=+el.dataset.n,dc=+el.dataset.dc||0,u=el.dataset.s||'',set=x=>el.textContent=x.toFixed(dc)+u;if(!anim||matchMedia('(prefers-reduced-motion:reduce)').matches){set(n);return}const t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/900);set(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)}
function render(anim){
 const app=document.getElementById('app');
 document.body.dataset.t=tab;const o=Object.keys(TABS),ni=o.indexOf(tab);if(anim)app.style.setProperty('--dx',Math.sign(ni-ti)*26+'px');ti=ni;navEl.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.k==tab));ind();
 app.classList.remove('in');app.innerHTML=(V[tab]||home)();
 [...app.children].forEach((el,i)=>el.style.setProperty('--i',Math.min(i,9)));
 app.querySelectorAll('.bar i').forEach(el=>{const w=+el.dataset.w;el.style.width=(anim?0:pw)+'%';void el.offsetWidth;el.style.width=w+'%';pw=w});
 app.querySelectorAll('[data-n]').forEach(el=>cnt(el,anim));
 if(anim){void app.offsetWidth;app.classList.add('in')}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,i=+b.dataset.i;
 if(a=='login'||a=='signup'){auth(a);return}
 if(a=='syncnow'){pull();return}
 if(a=='logout'){if(confirm('Выйти? Данные останутся в облаке, а на этом устройстве будут удалены.')){AU=null;localStorage.removeItem('lt.auth');localStorage.removeItem(K);S=JSON.parse(JSON.stringify(DEF));sync.st='out';loginUI();render()}return}
 if(a=='col'){col[b.dataset.k]=!col[b.dataset.k];b.classList.toggle('shut');b.nextElementSibling.classList.toggle('shut');return}
 if(a=='tab'){tab=b.dataset.k;location.hash=tab;scrollTo(0,0)}
 else if(a=='currency'){S.moneyCurrency=b.dataset.k=='USD'?'USD':'RUB';save()}
 else if(a=='sel')sel=b.dataset.k;
 else if(a=='cmo')cm=new Date(cm.getFullYear(),cm.getMonth()+ +b.dataset.n,1);
 else if(a=='edit'){dd=b.dataset.k;scrollTo(0,0)}
 else if(a=='fin'){S.l2=iso(addD(TD,1))}
 else if(a=='ap')S.apps[D]=Math.max(0,(S.apps[D]||0)+ +b.dataset.n);
 else if(a=='addco'){if(!v('cn').trim())return;S.co.unshift({n:v('cn'),s:v('cs'),d:v('cd'),sal:v('csal'),bon:v('cbon'),con:v('ccon'),cm:v('ccm')})}
 else if(a=='delco')S.co.splice(i,1);
 else if(a=='adddebt'){if(!v('dn').trim()||!(+v('db')>0))return;S.debts.push({n:v('dn'),b:+v('db'),r:+v('dr')||0,p:+v('dp')||0})}
 else if(a=='deldebt')S.debts.splice(i,1);
 else if(a=='addasset'){if(!v('an').trim()||!(+v('aa')>0))return;S.assets.push({n:v('an'),k:v('ak'),a:+v('aa'),y:+v('ay')||0})}
 else if(a=='delasset')S.assets.splice(i,1);
 else if(a=='addled'){if(!(+v('la')>0)||!v('ld'))return;S.led.push({d:v('ld'),t:v('lt'),c:v('lc')||'Без категории',a:+v('la')})}
 else if(a=='delled')S.led.splice(i,1);
 save();render(a=='tab')});
document.addEventListener('change',e=>{const t=e.target,c=t.dataset.c;if(!c||c=='note')return;
 if(c=='tgl'){const s=t.dataset.d;S.done[s]=S.done[s]||{};S.done[s][t.dataset.k]=t.checked}
 else if(c=='stage')S.co[+t.dataset.i].s=t.value;
 else if(c=='debt')S.debts[+t.dataset.i].b=+t.value||0;
 else if(c=='extra')S.extra=+t.value||0;
 else if(c=='usdRate')S.usdRate=Math.max(.01,+t.value||83.5588);
 else if(c=='method')S.method=t.value;
 else if(c=='hired')S.hired=t.checked;
 else if(c=='ddate'&&t.value)dd=t.value;
 save();if(c=='tgl'){const l=t.closest('label');if(l){l.classList.toggle('on',t.checked);if(t.checked){l.classList.remove('pulse');void l.offsetWidth;l.classList.add('pulse')}}setTimeout(render,320)}else render()});
document.addEventListener('input',e=>{if(e.target.dataset.c=='note'){S.notes[dd]=e.target.value;save()}});
// ---------- Supabase ----------
const CFG=window.SB||{},ON=!!(CFG.url&&CFG.key);let AU=null,pt;try{AU=JSON.parse(localStorage.getItem('lt.auth'))}catch(e){}
let sync={st:ON?(AU?'ok':'out'):'off',t:0,msg:''};
const ru=m=>/invalid login/i.test(m)?'Неверная почта или пароль':/already|registered/i.test(m)?'Такой аккаунт уже есть, нажми «Войти»':/signups? (not allowed|disabled)/i.test(m)?'Регистрация отключена':/password/i.test(m)?'Пароль слишком короткий':m;
async function gt(p,b){const r=await fetch(CFG.url+'/auth/v1/'+p,{method:'POST',headers:{apikey:CFG.key,'Content-Type':'application/json'},body:JSON.stringify(b)}),j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(ru(j.error_description||j.msg||j.message||'Ошибка входа'));return j}
function setAu(j){const u=j.user||j;AU={at:j.access_token,rt:j.refresh_token,exp:Date.now()+(j.expires_in||3600)*1000,email:u.email||(AU&&AU.email),uid:u.id||(AU&&AU.uid)};localStorage.setItem('lt.auth',JSON.stringify(AU))}
async function tok(){if(Date.now()>AU.exp-60000){try{setAu(await gt('token?grant_type=refresh_token',{refresh_token:AU.rt}))}catch(e){throw new Error('auth')}}return AU.at}
async function rest(p,o={}){const r=await fetch(CFG.url+'/rest/v1/'+p,{...o,headers:{apikey:CFG.key,Authorization:'Bearer '+await tok(),'Content-Type':'application/json',...(o.headers||{})}});if(r.status==401)throw new Error('auth');if(!r.ok)throw new Error('Ошибка '+r.status);return r.status==204?null:r.json()}
const push=()=>rest('tracker?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:AU.uid,data:S,updated_at:new Date().toISOString()})});
const sttxt=()=>sync.st=='busy'?'Сохраняю…':sync.st=='err'?'Нет связи: '+sync.msg:'Синхронизировано'+(sync.t?' в '+new Date(sync.t).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}):'');
const stat=()=>{const el=document.getElementById('sst');if(el)el.textContent=sttxt()};
const fail=e=>{if(e.message=='auth'){AU=null;localStorage.removeItem('lt.auth');loginUI()}else{sync.st='err';sync.msg=e.message}stat()};
function qp(){clearTimeout(pt);sync.st='busy';stat();pt=setTimeout(async()=>{try{await push();sync.st='ok';sync.t=Date.now();stat()}catch(e){fail(e)}},1200)}
async function pull(){if(!AU)return;sync.st='busy';stat();try{const r=await rest('tracker?select=data'),d=r[0]&&r[0].data;
 if(d&&(d.ts||0)>(S.ts||0)){S=Object.assign(JSON.parse(JSON.stringify(DEF)),d);try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}render()}
 else if(!d||(S.ts||0)>(d.ts||0))await push();
 sync.st='ok';sync.t=Date.now();stat()}catch(e){fail(e)}}
function loginUI(){let el=document.getElementById('lg');if(!el){el=document.createElement('div');el.id='lg';el.className='lg';document.body.appendChild(el)}
 el.innerHTML=`<div><img src="${document.querySelector('link[rel=icon]').href}" width="72" height="72" alt="" style="border-radius:16px"><h1 style="margin:16px 0 4px">Личный рост</h1><p class="mut" style="margin-bottom:18px">Войди, чтобы данные синхронизировались между телефоном и компьютером.</p><div class="g p"><input id=le type=email autocomplete=username placeholder="Почта"><input id=lp type=password autocomplete=current-password placeholder="Пароль, от 6 символов" style="margin-top:8px"></div><p class="neg" id=lerr></p><div class="row"><button class="b" data-a=login>Войти</button><button class="b2" data-a=signup>Создать аккаунт</button></div></div>`}
async function auth(a){const e=v('le').trim(),p=v('lp'),er=document.getElementById('lerr');er.textContent='';if(!e||p.length<6){er.textContent='Введи почту и пароль от 6 символов';return}
 try{const j=await gt(a=='signup'?'signup':'token?grant_type=password',{email:e,password:p});
  if(!j.access_token){er.textContent='Аккаунт создан. Подтверди почту по письму и затем войди.';return}
  setAu(j);document.getElementById('lg').remove();await pull()}catch(x){er.textContent=x.message}}
function acct(){return ON&&AU?`<div class="gh">Синхронизация</div><div class="g p"><p id="sst">${sttxt()}</p><p class="mut">${esc(AU.email)}</p><div class="row" style="margin-top:8px"><button class="b2" data-a=syncnow>Обновить</button><button class="b2" data-a=logout>Выйти</button></div></div>`:''}
function home(){return home0()+acct()}
document.addEventListener('keydown',e=>{if(e.key=='Enter'&&e.target.id=='lp')auth('login')});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&AU)pull()});

render(true);requestAnimationFrame(()=>navEl.classList.add('rdy'));addEventListener('resize',ind);
if(ON){if(AU)pull();else loginUI()}

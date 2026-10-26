import {SUPABASE_URL as SUPA_URL,SUPABASE_ANON_KEY as KEY} from './config.js';
const root=document.querySelector('#app'), nav=document.querySelector('#nav'), badge=document.querySelector('#status');
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const id=()=>crypto.randomUUID();
const s={user:null,tab:'today',workouts:[],plans:[],body:[],current:null,editing:false,busy:false};
const exerciseGroups={
  "胸部": [
    "槓鈴平板臥推",
    "槓鈴上斜臥推",
    "槓鈴下斜臥推",
    "啞鈴平板臥推",
    "啞鈴上斜臥推",
    "啞鈴下斜臥推",
    "啞鈴飛鳥",
    "上斜啞鈴飛鳥",
    "滑輪夾胸",
    "高位滑輪夾胸",
    "低位滑輪夾胸",
    "胸推機",
    "上斜胸推機",
    "蝴蝶機夾胸",
    "史密斯機臥推",
    "伏地挺身",
    "雙槓撐體",
    "單邊胸推機",
    "臥推",
    "啞鈴臥推",
    "上斜啞鈴臥推"
  ],
  "背部": [
    "傳統硬舉",
    "相撲硬舉",
    "羅馬尼亞硬舉",
    "引體向上",
    "反手引體向上",
    "輔助引體向上",
    "滑輪下拉",
    "寬握滑輪下拉",
    "窄握滑輪下拉",
    "反手滑輪下拉",
    "單臂滑輪下拉",
    "坐姿划船",
    "窄握坐姿划船",
    "寬握坐姿划船",
    "槓鈴划船",
    "反手槓鈴划船",
    "T槓划船",
    "胸靠式划船",
    "單臂啞鈴划船",
    "啞鈴划船",
    "機械式划船",
    "高位划船機",
    "直臂下拉",
    "滑輪上拉",
    "啞鈴上拉",
    "背伸展",
    "硬舉"
  ],
  "肩部": [
    "槓鈴肩推",
    "啞鈴肩推",
    "坐姿啞鈴肩推",
    "史密斯機肩推",
    "機械式肩推",
    "阿諾肩推",
    "啞鈴側平舉",
    "滑輪側平舉",
    "單臂滑輪側平舉",
    "機械式側平舉",
    "啞鈴前平舉",
    "槓鈴前平舉",
    "啞鈴反向飛鳥",
    "反向蝴蝶機",
    "滑輪反向飛鳥",
    "面拉",
    "啞鈴聳肩",
    "槓鈴聳肩",
    "直立划船"
  ],
  "腿部": [
    "槓鈴深蹲",
    "高槓深蹲",
    "低槓深蹲",
    "前蹲舉",
    "高腳杯深蹲",
    "史密斯機深蹲",
    "哈克深蹲",
    "保加利亞分腿蹲",
    "啞鈴弓箭步",
    "槓鈴弓箭步",
    "行走弓箭步",
    "腿推舉",
    "單腿腿推舉",
    "腿屈伸",
    "單腿腿屈伸",
    "坐姿腿後勾",
    "俯臥腿後勾",
    "站姿腿後勾",
    "羅馬尼亞硬舉",
    "直腿硬舉",
    "臀推",
    "槓鈴臀推",
    "臀橋",
    "滑輪後踢腿",
    "髖外展機",
    "髖內收機",
    "站姿提踵",
    "坐姿提踵",
    "登階",
    "六角槓硬舉",
    "深蹲",
    "腿後勾"
  ],
  "二頭肌": [
    "啞鈴二頭彎舉",
    "交替啞鈴彎舉",
    "槌式彎舉",
    "斜板啞鈴彎舉",
    "集中彎舉",
    "槓鈴二頭彎舉",
    "EZ槓彎舉",
    "牧師椅彎舉",
    "滑輪二頭彎舉",
    "繩索槌式彎舉",
    "反手彎舉",
    "機械式二頭彎舉"
  ],
  "三頭肌": [
    "三頭肌下壓",
    "繩索三頭肌下壓",
    "直槓三頭肌下壓",
    "反手三頭肌下壓",
    "滑輪過頭三頭伸展",
    "啞鈴過頭三頭伸展",
    "法式推舉",
    "仰臥三頭伸展",
    "窄握臥推",
    "雙槓撐體",
    "機械式三頭伸展",
    "啞鈴後踢"
  ],
  "前臂": [
    "槓鈴腕彎舉",
    "反向腕彎舉",
    "農夫走路",
    "握力器訓練",
    "腕滾輪"
  ],
  "核心": [
    "捲腹",
    "滑輪捲腹",
    "反向捲腹",
    "仰臥起坐",
    "懸垂舉腿",
    "懸垂抬膝",
    "羅馬椅抬腿",
    "平板支撐",
    "側平板支撐",
    "死蟲式",
    "鳥狗式",
    "俄羅斯轉體",
    "腹輪",
    "Pallof Press",
    "登山者式",
    "負重捲腹"
  ],
  "有氧": [
    "跑步機跑步",
    "戶外跑步",
    "快走",
    "跑步機斜坡快走",
    "飛輪",
    "室內腳踏車",
    "戶外自行車",
    "橢圓機",
    "滑步機",
    "划船機",
    "階梯機",
    "跳繩",
    "游泳",
    "登山健行",
    "HIIT",
    "衝刺間歇"
  ]
};
const groupOf=name=>Object.keys(exerciseGroups).find(g=>exerciseGroups[g].includes(name))||'自訂';
const timer={seconds:90,end:0,handle:null};
function remaining(){return timer.end?Math.max(0,Math.ceil((timer.end-Date.now())/1000)):0}
function updateTimer(){const display=document.querySelector('#timer-count');if(display)display.textContent=timer.end?remaining()+' 秒':'未啟動';if(timer.end&&remaining()===0){timer.end=0;clearInterval(timer.handle);timer.handle=null;if(navigator.vibrate)navigator.vibrate([150,100,150]);}}
function startRest(){clearInterval(timer.handle);timer.end=Date.now()+timer.seconds*1000;updateTimer();timer.handle=setInterval(updateTimer,300)}
function stopRest(){clearInterval(timer.handle);timer.handle=null;timer.end=0;updateTimer()}
function optionList(group,search){return (exerciseGroups[group]||Object.values(exerciseGroups).flat()).filter(n=>n.toLocaleLowerCase().includes(search.toLocaleLowerCase())).map(n=>'<option value="'+esc(n)+'">'+esc(n)+'</option>').join('')}


// V1.5 本機暫存僅供同一裝置恢復，正式紀錄仍以 Supabase 為準。
const draftKey=()=>s.user?'fitness-draft-v1:'+s.user.id:null;
function saveDraft(){const k=draftKey();if(!k||!s.current)return;try{localStorage.setItem(k,JSON.stringify({current:s.current,editing:s.editing,savedAt:Date.now()}))}catch(e){console.warn('本機暫存失敗',e)}}
function clearDraft(){const k=draftKey();if(k)try{localStorage.removeItem(k)}catch(e){}}
function restoreDraft(){if(!s.user||s.current)return;try{const raw=localStorage.getItem(draftKey());if(!raw)return;const d=JSON.parse(raw);if(!d.current||!Array.isArray(d.current.entries))return;
// 若雲端已存在相同版本的紀錄，避免把舊草稿誤當成尚未儲存。
if(d.editing){const cloud=s.workouts.find(w=>w.id===d.current.id);if(!cloud){clearDraft();return}}
if(confirm('找到尚未儲存的訓練，要恢復嗎？')){s.current=d.current;s.editing=!!d.editing;s.tab='today'}else clearDraft()
}catch(e){console.warn('恢復暫存失敗',e)}}

const configOK=!SUPA_URL.includes('YOUR_PROJECT')&&!KEY.includes('YOUR_');
let db=null;
function notify(message){alert(message)}
function prev(name){for(const w of s.workouts){if(w.id===s.current?.id)continue;const x=w.entries.find(e=>e.name===name);if(x)return x}return null}
function volume(w){return (w.entries||[]).flatMap(e=>e.sets).reduce((a,x)=>a+(x.done?Number(x.weight||0)*Number(x.reps||0):0),0)}
async function refresh(){const uid=s.user.id;const pairs=await Promise.all(['workouts','plans','body_metrics'].map(t=>db.from(t).select('*').eq('user_id',uid)));for(const x of pairs)if(x.error)throw x.error;s.workouts=pairs[0].data.sort((a,b)=>b.performed_on.localeCompare(a.performed_on));s.plans=pairs[1].data;s.body=pairs[2].data.sort((a,b)=>b.measured_on.localeCompare(a.measured_on))}
async function write(table,row){const r=await db.from(table).upsert({...row,user_id:s.user.id},{onConflict:'id'});if(r.error)throw r.error;await refresh();render()}
async function del(table,key){if(!confirm('確定刪除這筆紀錄？'))return;const r=await db.from(table).delete().eq('id',key).eq('user_id',s.user.id);if(r.error)throw r.error;await refresh();render()}
function newWorkout(p){s.current={id:id(),performed_on:today(),title:p?.name||'今日訓練',notes:'',entries:(p?.exercises||[]).map(e=>({id:id(),name:e.name||e,sets:(prev(e.name||e)?.sets||[{weight:'',reps:'',rpe:'',done:false}]).map(q=>({...q,done:false}))}))};s.editing=false;s.tab='today';saveDraft();render()}
function field(name,value,type='text',attrs=''){return '<label>'+name+'</label><input type="'+type+'" '+attrs+' value="'+esc(value??'')+'">'}
function todayPage(){
const w=s.current;
if(!w)return '<section class="onepage"><h2>今天練什麼？</h2><button class="primary-full" data-act="new">＋ 開始自由訓練</button>'+(s.plans.length?'<h3>常用課表</h3>'+s.plans.map(p=>'<button class="plan-pick" data-act="start" data-id="'+p.id+'">'+esc(p.name)+' · '+p.exercises.length+' 動作</button>').join(''):'')+'</section>';
const completed=w.entries.reduce((n,e)=>n+e.sets.filter(q=>q.done).length,0);
const total=w.entries.reduce((n,e)=>n+e.sets.length,0);
return '<div class="onepage"><div class="row"><h2>今天的訓練</h2><span class="pill">'+completed+'/'+total+' 組</span></div>'+
'<div class="quick-head"><span>'+esc(w.performed_on)+'</span><span id="timer-count">'+(timer.end?remaining()+' 秒':'休息計時未啟動')+'</span></div>'+
w.entries.map((e,i)=>'<section class="exercise-card"><div class="row"><h3>'+esc(e.name)+'</h3><button class="alt tiny" data-act="remove-ex" data-i="'+i+'">移除</button></div>'+
(prev(e.name)?'<div class="muted">上次 '+esc(prev(e.name).sets.map(x=>x.weight+' kg × '+x.reps).join(' / '))+'</div>':'')+
'<div class="set-head"><span>組</span><span>重量 kg</span><span>次數</span><span>完成</span></div>'+
e.sets.map((q,j)=>'<div class="quick-set '+(q.done?'set-done':'')+'"><b>'+(j+1)+'</b><input type="number" inputmode="decimal" min="0" step="0.5" aria-label="重量" data-i="'+i+'" data-j="'+j+'" data-field="weight" value="'+esc(q.weight)+'"><input type="number" inputmode="numeric" min="0" step="1" aria-label="次數" data-i="'+i+'" data-j="'+j+'" data-field="reps" value="'+esc(q.reps)+'"><button data-act="toggle-set" data-i="'+i+'" data-j="'+j+'" aria-pressed="'+q.done+'" class="'+(q.done?'complete':'alt')+'">'+(q.done?'✓':'○')+'</button></div>').join('')+
'<button class="add-row" data-act="addset" data-i="'+i+'">＋ 下一組</button></section>').join('')+
'<section class="exercise-card"><h3>＋ 加入動作</h3><div class="row"><input id="custom" list="exercise-options" placeholder="搜尋動作名稱" autocomplete="off"><button data-act="add-ex">加入</button></div><datalist id="exercise-options">'+[...new Set(Object.values(exerciseGroups).flat())].map(x=>'<option value="'+esc(x)+'"></option>').join('')+'</datalist></section>'+
'<div class="finish-panel"><button class="primary-full" data-act="save-workout">✓ 結束並儲存</button><details><summary>更多選項</summary>'+field('日期',w.performed_on,'date','id="date"')+field('訓練名稱',w.title,'text','id="title"')+'<label>備註</label><textarea id="notes">'+esc(w.notes)+'</textarea><div class="actions"><button class="alt" data-act="stop-rest">停止計時</button><button class="alt" data-act="cancel">取消訓練</button></div></details></div></div>';
}
function plansPage(){return '<h2>我的課表</h2><section>'+field('課表名稱','','text','id="pname" placeholder="例如：Push Day"')+'<label>動作，每行一個</label><textarea id="pex" rows="5" placeholder="啞鈴臥推&#10;啞鈴肩推&#10;三頭肌下壓"></textarea><p><button data-act="save-plan">新增課表</button></p></section>'+s.plans.map(p=>'<section><h3>'+esc(p.name)+'</h3><p class="muted">'+esc(p.exercises.map(e=>e.name||e).join(' · '))+'</p><div class="actions"><button data-act="start" data-id="'+p.id+'">開始訓練</button><button class="danger" data-act="del-plan" data-id="'+p.id+'">刪除</button></div></section>').join('')}
function historyPage(){return '<h2>歷史紀錄</h2>'+(s.workouts.length?'':'<section>尚無訓練紀錄</section>')+s.workouts.map(w=>'<section><div class="row"><div><b>'+esc(w.title)+'</b><p class="muted">'+w.performed_on+' · '+w.entries.length+' 個動作 · '+volume(w).toLocaleString()+' kg</p></div><button class="alt" data-act="toggle" data-id="'+w.id+'">明細</button></div><div id="d-'+w.id+'" class="hidden">'+w.entries.map(e=>'<div class="line"><b>'+esc(e.name)+'</b><p class="muted">'+e.sets.map(x=>esc(x.weight)+' kg × '+esc(x.reps)+(x.done?' ✓':'')).join(' / ')+'</p></div>').join('')+'<p class="muted">'+esc(w.notes)+'</p><div class="actions"><button data-act="edit" data-id="'+w.id+'">編輯</button><button class="danger" data-act="del-workout" data-id="'+w.id+'">刪除</button></div></div></section>').join('')}
function plot(vals,labels){if(!vals.length)return '<p class="muted">尚無資料</p>';const a=vals.slice(-12), names=labels.slice(-12), max=Math.max(...a,1);return '<svg viewBox="0 0 340 175"><line x1="15" y1="145" x2="330" y2="145" stroke="#70818e"/>'+a.map((v,i)=>{const x=20+i*302/Math.max(1,a.length-1),y=142-v/max*115;return (i?'<line x1="'+(20+(i-1)*302/Math.max(1,a.length-1))+'" y1="'+(142-a[i-1]/max*115)+'" x2="'+x+'" y2="'+y+'" stroke="#b8ef79" stroke-width="2"/>':'')+'<circle cx="'+x+'" cy="'+y+'" r="4" fill="#b8ef79"/><text x="'+x+'" y="163" text-anchor="middle" font-size="9" fill="#b8c4ce">'+esc(names[i]?.slice(5))+'</text>'}).join('')+'</svg>'}
function statsPage(){const ws=[...s.workouts].reverse(), n=[...new Set(s.workouts.flatMap(w=>w.entries.map(e=>e.name)))];return '<h2>統計</h2><div class="grid"><div class="metric"><b>'+ws.length+'</b><small>累計訓練次數</small></div><div class="metric"><b>'+Math.round(ws.reduce((a,w)=>a+volume(w),0)).toLocaleString()+'</b><small>累計訓練量 kg</small></div></div><section><h3>單次訓練量</h3>'+plot(ws.map(volume),ws.map(w=>w.performed_on))+'</section><section><h3>各動作最佳重量</h3>'+n.map(name=>'<div class="line row"><span>'+esc(name)+'</span><b>'+Math.max(0,...s.workouts.flatMap(w=>w.entries.filter(e=>e.name===name).flatMap(e=>e.sets.filter(q=>q.done).map(q=>Number(q.weight)||0))))+' kg</b></div>').join('')+'</section>'}
function bodyPage(){const sorted=[...s.body].reverse().filter(x=>x.weight_kg!=null);return '<h2>身體數據</h2><section>'+field('測量日期',today(),'date','id="bdate"')+'<div class="grid"><div>'+field('體重 kg','','number','id="bw" step="0.1" min="0"')+'</div><div>'+field('體脂 %','','number','id="bf" step="0.1" min="0" max="100"')+'</div></div>'+field('腰圍 cm','','number','id="bc" step="0.1" min="0"')+'<label>備註</label><textarea id="bn"></textarea><p><button data-act="save-body">儲存數據</button></p></section><section><h3>體重趨勢</h3>'+plot(sorted.map(x=>Number(x.weight_kg)),sorted.map(x=>x.measured_on))+'</section>'+s.body.map(b=>'<section class="row"><div><b>'+esc(b.measured_on)+'</b><p class="muted">'+esc(b.weight_kg??'–')+' kg · 體脂 '+esc(b.body_fat_pct??'–')+'% · 腰圍 '+esc(b.waist_cm??'–')+' cm</p><p class="muted">'+esc(b.notes)+'</p></div><button class="danger" data-act="del-body" data-id="'+b.id+'">刪除</button></section>').join('')}
function settingsPage(){return '<h2>設定與備份</h2><section>登入帳號：'+esc(s.user.email)+'<p><button class="alt" data-act="logout">登出</button></p></section><section><h3>JSON 備份</h3><p class="muted">可匯出課表、訓練與身體數據；本版尚不提供 JSON 匯入。</p><button data-act="backup">下載備份</button></section>'}
function render(){if(s.current)saveDraft();badge.textContent=!configOK?'尚未設定 Supabase':s.user?'雲端帳號已登入':'尚未登入';nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.tab===s.tab));if(!configOK){root.innerHTML='<section><h2>網站已部署，等待雲端設定</h2><p class="notice">請在 Supabase 建立專案，執行 schema.sql，再將 Project URL 與 publishable key 填入 GitHub 的 config.js。絕對不可使用 secret key。</p><p class="muted">雲端連線設定完成後即可登入與使用。</p></section>';return}if(!s.user){root.innerHTML='<section><h2>登入 / 註冊</h2>'+field('Email','','email','id="email" autocomplete="email"')+field('密碼','','password','id="pass" autocomplete="current-password"')+'<div class="actions"><button data-act="login">登入</button><button class="alt" data-act="signup">註冊</button></div><p class="muted">註冊後可能需要先驗證電子郵件。</p></section>';return}root.innerHTML=({today:todayPage,plans:plansPage,history:historyPage,stats:statsPage,body:bodyPage,settings:settingsPage}[s.tab])()}
nav.addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(!b)return;if(s.current&&s.tab==='today'&&b.dataset.tab!=='today'){}s.tab=b.dataset.tab;render()});
root.addEventListener('input',e=>{const x=e.target;if(x.id==='exercise-search'){const pick=document.querySelector('#pick');if(pick)pick.innerHTML=optionList(document.querySelector('#muscle-group').value,x.value);return}if(s.current){if(x.dataset.field){const q=s.current.entries[+x.dataset.i].sets[+x.dataset.j];q[x.dataset.field]=x.type==='checkbox'?x.checked:x.value}else if(x.id==='date')s.current.performed_on=x.value;else if(x.id==='title')s.current.title=x.value;else if(x.id==='notes')s.current.notes=x.value;saveDraft()}});
root.addEventListener('change',e=>{const x=e.target;if(x.id==='rest-seconds')timer.seconds=Number(x.value);if(x.id==='muscle-group'){const pick=document.querySelector('#pick'),search=document.querySelector('#exercise-search');if(search)search.value='';if(pick)pick.innerHTML=optionList(x.value,'')} if(s.current&&x.dataset.field==='done')s.current.entries[+x.dataset.i].sets[+x.dataset.j].done=x.checked});
root.addEventListener('click',async e=>{const b=e.target.closest('button[data-act]');if(!b||s.busy)return;const a=b.dataset.act,key=b.dataset.id;try{if(a==='login'||a==='signup'){const email=document.querySelector('#email').value.trim(),password=document.querySelector('#pass').value;if(!email||password.length<6)throw Error('請輸入 Email 與至少 6 字元密碼');s.busy=true;const r=a==='login'?await db.auth.signInWithPassword({email,password}):await db.auth.signUp({email,password});if(r.error)throw r.error;notify(a==='signup'?'註冊完成，請檢查驗證信':'登入成功')}
else if(a==='new')newWorkout();else if(a==='start'){if(s.current&&!confirm('目前有未儲存的訓練，確定捨棄？'))return;clearDraft();newWorkout(s.plans.find(p=>p.id===key))}
else if(a==='add-ex'){const name=document.querySelector('#custom').value.trim();if(!name)throw Error('請輸入動作名稱');if(s.current.entries.some(e=>e.name===name))throw Error('動作已存在');const old=prev(name);s.current.entries.push({id:id(),name,sets:old?old.sets.map(q=>({...q,done:false})):[{weight:'',reps:'',rpe:'',done:false}]});render()}
else if(a==='remove-ex'){s.current.entries.splice(+b.dataset.i,1);render()}
else if(a==='toggle-set'){const q=s.current.entries[+b.dataset.i].sets[+b.dataset.j];q.done=!q.done;if(q.done&&!s.editing)startRest();render()}
else if(a==='start-rest'){startRest();render()}
else if(a==='stop-rest'){stopRest();render()}
else if(a==='mark-all'){for(const e of s.current.entries)for(const q of e.sets)q.done=true;render()}
else if(a==='addset'){const arr=s.current.entries[+b.dataset.i].sets;arr.push({...arr[arr.length-1],done:false});render()}
else if(a==='delset'){const arr=s.current.entries[+b.dataset.i].sets;if(arr.length>1)arr.pop();render()}
else if(a==='cancel'){if(confirm('取消尚未儲存的訓練？')){s.current=null;clearDraft();stopRest();render()}}
else if(a==='save-workout'){if(!s.current.title.trim()||!s.current.entries.length)throw Error('請輸入名稱並新增至少一個動作');const all=s.current.entries.flatMap(e=>e.sets);if(all.some(q=>q.done&&(!Number.isFinite(Number(q.weight))||Number(q.weight)<0||!Number.isInteger(Number(q.reps))||Number(q.reps)<=0)))throw Error('已完成的組數必須有有效重量與正整數次數');if(all.every(q=>!q.done)&&!confirm('目前沒有任何組數標記為完成，這次訓練量將顯示 0。仍要儲存嗎？'))return;s.busy=true;await write('workouts',s.current);s.current=null;s.editing=false;clearDraft();stopRest();render();notify('訓練已同步')}
else if(a==='save-plan'){const name=document.querySelector('#pname').value.trim(),exercises=[...new Set(document.querySelector('#pex').value.split('\n').map(x=>x.trim()).filter(Boolean))].map(name=>({name}));if(!name||!exercises.length)throw Error('請輸入課表名稱與動作');s.busy=true;await write('plans',{id:id(),name,exercises});notify('課表已同步')}
else if(a==='del-plan')await del('plans',key);else if(a==='toggle')document.getElementById('d-'+key).classList.toggle('hidden');
else if(a==='edit'){if(s.current&&!confirm('確定捨棄目前未儲存的訓練？'))return;clearDraft();s.current=structuredClone(s.workouts.find(w=>w.id===key));s.editing=true;s.tab='today';saveDraft();render()}
else if(a==='del-workout')await del('workouts',key);
else if(a==='save-body'){const n=x=>{const v=document.querySelector(x).value;return v===''?null:Number(v)};const row={id:id(),measured_on:document.querySelector('#bdate').value,weight_kg:n('#bw'),body_fat_pct:n('#bf'),waist_cm:n('#bc'),notes:document.querySelector('#bn').value};if([row.weight_kg,row.body_fat_pct,row.waist_cm].every(x=>x===null))throw Error('至少輸入一項數據');if([row.weight_kg,row.waist_cm].some(x=>x!==null&&(x<0||x>500))||(row.body_fat_pct!==null&&(row.body_fat_pct<0||row.body_fat_pct>100)))throw Error('數值超出合理範圍');s.busy=true;await write('body_metrics',row);notify('身體數據已同步')}
else if(a==='del-body')await del('body_metrics',key);
else if(a==='logout'){if(s.current&&!confirm('目前訓練尚未儲存，確定登出？'))return;clearDraft();const r=await db.auth.signOut();if(r.error)throw r.error}
else if(a==='backup'){const blob=new Blob([JSON.stringify({exported_at:new Date().toISOString(),workouts:s.workouts,plans:s.plans,body_metrics:s.body},null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='fitness-backup-'+today()+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000)}}catch(err){notify('操作失敗：'+err.message)}finally{s.busy=false}});
render();
if(configOK){try{const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.57.0');db=createClient(SUPA_URL,KEY);db.auth.onAuthStateChange((_,session)=>{const prevId=s.user?.id;s.user=session?.user||null;if(!s.user){s.workouts=[];s.plans=[];s.body=[];s.current=null;render()}else if(prevId!==s.user.id){setTimeout(async()=>{try{await refresh();restoreDraft();render()}catch(err){notify('資料讀取失敗：'+err.message)}},0)}});const {data,error}=await db.auth.getSession();if(error)throw error;s.user=data.session?.user||null;if(s.user){await refresh();restoreDraft()}render()}catch(err){root.innerHTML='<section><h2>初始化失敗</h2><p class="notice">'+esc(err.message)+'</p></section>'}}

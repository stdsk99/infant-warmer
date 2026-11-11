/* ===== โมดูล 3: การใช้งานสำหรับช่าง (เครื่องอุ่นทารก) =====
   แท็บ: บทเรียน · ฝึกตั้งค่า · ตรวจก่อนใช้งาน · มุมช่าง
   คะแนน clin:sim = ฝึกตั้งเครื่อง (5 ใบสั่ง × 2 = 10) + มุมช่าง (8 โจทย์ × 2 = 16) รวม 26 คะแนน
   ระบบส่งคะแนนครั้งเดียวเมื่อทำครบทั้งสองส่วน (เก็บผลส่วนที่ทำแล้วไว้ในเครื่องระหว่างรอ) */
(function(){
  const D=window.TECHUSE, root=document.getElementById("tech");
  if(!D||!root) return;
  const esc = s => String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const r1=x=>Math.round(x*10)/10, f1=x=>x.toFixed(1);
  const range=(a,b,s)=>{const o=[];for(let x=a;x<=b+1e-9;x+=s)o.push(r1(x));return o;};
  const TABS=[["learn","บทเรียน"],["set","ฝึกตั้งเครื่อง"],["check","ตรวจก่อนใช้งาน"],["tech","มุมช่าง"]];
  const MOD="3-การใช้งานสำหรับช่าง";
  let tab="learn", lesson=D.lessons[0].id;

  /* ---------- คะแนนรวม 2 ส่วน ---------- */
  const K_P="iwt-clin-part";
  const sid=()=>{ const p=window.Score&&Score.profile(); return p?p.sid:""; };
  function parts(){ try{ const o=JSON.parse(localStorage.getItem(K_P)); return o&&o.sid===sid()?o:{sid:sid()}; }catch(e){ return {sid:sid()}; } }
  function savePart(name, score, max){
    const o=parts(); o[name]={score, max, t:Date.now()};
    if(o.set && o.tech){
      const sc=o.set.score+o.tech.score, mx=o.set.max+o.tech.max;
      window.Score&&Score.record({key:"clin:sim", mod:MOD, item:"ฝึกตั้งเครื่องและมุมช่าง", score:sc, max:mx,
        detail:`ฝึกตั้งเครื่อง ${o.set.score}/${o.set.max} · มุมช่าง ${o.tech.score}/${o.tech.max}`});
      try{ localStorage.removeItem(K_P); }catch(e){}
      return {done:true, score:sc, max:mx};
    }
    try{ localStorage.setItem(K_P, JSON.stringify(o)); }catch(e){}
    return {done:false};
  }
  function statusBar(){
    const o=parts(), b=window.Score&&Score.bestOf("clin:sim");
    const one=(k,n)=>o[k]?`<span class="tp ok">✓ ${n} ${o[k].score}/${o[k].max}</span>`:`<span class="tp">○ ${n}</span>`;
    return `<div class="tstat"><b>คะแนนโมดูลนี้</b>${one("set","ฝึกตั้งเครื่อง")}${one("tech","มุมช่าง")}
      <span class="muted small">${b?`ดีที่สุด ${Math.round(b.v*100)}% (${b.score}/${b.max})`:"ทำครบทั้งสองส่วนแล้วระบบจึงส่งคะแนน"} · เกณฑ์ผ่าน ≥ 80%</span></div>`;
  }

  function frame(body){
    root.innerHTML=`<h1>โมดูล 3 · การใช้งานสำหรับช่าง</h1>
      <p class="muted">เข้าใจว่าผู้ใช้ประกอบและตั้งเครื่องอย่างไร ฝึกตั้งเครื่องบนเครื่องจำลอง ฝึกตรวจเครื่องก่อนใช้งาน และฝึกแยกให้ออกว่าปัญหาที่ได้รับแจ้งเกิดจากการใช้งานหรือเครื่องเสีย</p>
      <div class="note small" style="margin:0 0 10px">⚠️ ${esc(D.disclaimer)}</div>
      ${statusBar()}
      <div class="chips pmtabs">${TABS.map(([id,n])=>`<button data-t="${id}" class="${tab===id?"on":""}">${n}</button>`).join("")}</div>
      <div id="tu-body">${body}</div>`;
    root.querySelectorAll(".pmtabs [data-t]").forEach(b=>b.onclick=()=>{tab=b.dataset.t;render();window.scrollTo(0,0);});
  }

  /* ---------- บทเรียน ---------- */
  function block([t,c]){
    if(t==="p") return `<p>${c}</p>`;
    if(t==="ul") return `<ul>${c.map(x=>`<li>${x}</li>`).join("")}</ul>`;
    if(t==="ol") return `<ol>${c.map(x=>`<li>${x}</li>`).join("")}</ol>`;
    if(t==="ex") return `<div class="exbox"><b>ตัวอย่าง</b><br>${esc(c).replace(/\n/g,"<br>")}</div>`;
    if(t==="tip") return `<div class="hint">💡 ${c}</div>`;
    if(t==="warn") return `<div class="msg bad">⚠️ ${c}</div>`;
    return "";
  }
  function viewLearn(){
    const L=D.lessons.find(x=>x.id===lesson), i=D.lessons.indexOf(L);
    frame(`<div class="clgrid">
      <nav class="clnav">${D.lessons.map(x=>`<button data-l="${x.id}" data-seen="tech|${x.id}" class="${x.id===lesson?"on":""}">${esc(x.n)}</button>`).join("")}</nav>
      <article class="lesson"><h2>${esc(L.n)}</h2>${L.b.map(block).join("")}
        ${L.drill?`<div id="cfg-drill"></div>`:""}
        <div class="tools">${i>0?`<button data-go="${D.lessons[i-1].id}">◀ ${esc(D.lessons[i-1].n)}</button>`:""}
        ${i<D.lessons.length-1?`<button class="primary" data-go="${D.lessons[i+1].id}">${esc(D.lessons[i+1].n)} ▶</button>`:`<button class="primary" data-tab="set">ไปฝึกตั้งเครื่อง ▶</button>`}</div>
      </article></div>`);
    if(window.Seen) Seen.mark("tech", lesson, root);
    root.querySelectorAll("[data-l],[data-go]").forEach(b=>b.onclick=()=>{lesson=b.dataset.l||b.dataset.go;render();if(window.innerWidth<900)root.querySelector(".lesson").scrollIntoView({behavior:"smooth"});});
    const t=root.querySelector("[data-tab]"); if(t) t.onclick=()=>{tab="set";render();window.scrollTo(0,0);};
  }

  /* ---------- ฝึกตั้งค่า (แผงเครื่องอุ่นทารกจำลอง) ---------- */
  const P=D.panel;
  const MN={pre:"Prewarm", man:"Manual", baby:"Baby"};
  function genOrder(kind){
    const tgt=pick([36.0,36.3,36.5,36.8,37.0]), pw=pick([20,30,40,50]);
    const O={
      baby:()=>({kind, mode:"baby", target:tgt, who:pick(["หอผู้ป่วยทารกแรกเกิด","ห้องคลอด","หอผู้ป่วยทารกวิกฤต"]), text:`เครื่องกลับจากซ่อม ส่งคืนพร้อมใช้กับทารก: ตั้งโหมด Baby อุณหภูมิผิว ${tgt.toFixed(1)} °C (ค่าตัวอย่าง) ตรวจว่าหัววัดเสียบและติดผิวถูกวิธี`}),
      pre:()=>({kind, mode:"pre", who:"ห้องคลอด", text:"เตรียมเตียงรับทารกที่กำลังจะคลอด: อุ่นเตียงเปล่าด้วยโหมด Prewarm ต้องไม่มีทารกบนเตียงระหว่างนี้"}),
      man:()=>({kind, mode:"man", target:pw, who:"งานทดสอบหลังซ่อม", text:`เตรียมทดสอบความร้อนบนเตียงเปล่า (โมดูล 8): ตั้งโหมด Manual ${pw}% บนเตียงที่ไม่มีทารก`})
    };
    return O[kind]();
  }
  let setRound=null;
  function newSetRound(){ setRound={orders:shuffle(D.setKinds).slice(0,5).map(genOrder), i:0, res:[]}; }

  function viewSet(){
    if(!setRound) newSetRound();
    const R=setRound;
    if(R.i>=R.orders.length) return setSummary();
    const O=R.orders[R.i];
    const st={mode:pick(["pre","man","baby"]), t:r1(pick([35.5,36.0,36.5,37.0])), pw:pick([0,30,60,100]),
      bad:O.kind==="baby"?(Math.random()<.5?pick(["off","nc","nocover"]):""):(O.kind!=="baby"&&Math.random()<.35?"baby":""), seen:false, msg:""};
    frame(`<div class="simtop"><span class="kicker">ใบสั่งที่ ${R.i+1} / ${R.orders.length} · ${esc(O.who)}</span>
        <div class="simdots">${R.orders.map((x,k)=>`<i class="${R.res[k]===true?"ok":R.res[k]===false?"bad":k===R.i?"on":""}"></i>`).join("")}</div></div>
      <div class="order"><div class="tk-h"><span>📋 ใบสั่งงาน</span></div><p>${esc(O.text)}</p></div>
      <div class="sxset">
        <div class="lpbox" id="set-dev"></div>
        <div>
          <h3>โหมด</h3>
          <div class="ctrl" id="set-mode">${["pre","man","baby"].map(m=>`<button data-m="${m}">${MN[m]}</button>`).join("")}</div>
          <h3>ปรับค่า (SET ในโหมด Baby · PWR ในโหมด Manual)</h3>
          <div class="ctrl"><button data-k="-5" aria-label="ลดมาก">▼▼</button><button data-k="-1" aria-label="ลด">▼</button><button data-k="1" aria-label="เพิ่ม">▲</button><button data-k="5" aria-label="เพิ่มมาก">▲▲</button></div>
          <h3>หัววัดและเตียง</h3>
          <div class="ctrl"><button id="set-look">🔍 ตรวจหัววัดและเตียง</button><button id="set-fix" hidden></button></div>
          <p class="read" id="set-read"></p>
          <div class="imsg small" id="set-msg" role="status"></div>
          <p class="muted small">ในโหมด Baby ปุ่ม ▲▼ ปรับทีละ 0.1 °C (▲▲ ทีละ 0.5) ในโหมด Manual ปรับทีละ 5% (▲▲ ทีละ 25%)</p>
          <div class="tools"><button class="primary" id="set-go">ส่งงาน</button></div>
          <div id="set-side"></div>
        </div>
      </div>`);
    const dev=root.querySelector("#set-dev"); dev.innerHTML=WMDIA.svg({cls:"lp", labels:false});
    const svg=dev.querySelector("svg");
    const FIX={off:"ติดหัววัดให้แนบผิว", nc:"เสียบหัววัดเข้าเครื่อง", nocover:"ปิดหัววัดด้วยแผ่นสะท้อนความร้อน", baby:"แจ้งพยาบาลย้ายทารกออกก่อน"};
    function heatNow(){ if(st.mode==="pre") return 100; if(st.mode==="man") return st.pw;
      if(st.bad==="nc") return 0; const skin=st.bad==="off"?34.9:36.4; return Math.max(0,Math.min(100, Math.round(35+(st.t-skin)*80))); }
    function paint(){
      const baby=O.kind==="baby"||st.bad==="baby";
      WMDIA.state(svg,{mode:st.mode, heat:heatNow(), set:st.t, skin:!baby||st.bad==="nc"?null:st.bad==="off"?34.9:st.bad==="nocover"?37.2:36.4,
        probe:!baby||st.bad==="nc"?"nc":st.bad==="off"?"off":"ok", baby, alarm:st.mode==="baby"&&st.bad==="nc"?"PROBE FAIL":"", hi:st.seen&&st.bad?(st.bad==="baby"?"bed":"probe"):[]});
      root.querySelectorAll("#set-mode [data-m]").forEach(b=>b.classList.toggle("on",b.dataset.m===st.mode));
      root.querySelector("#set-read").textContent=st.mode==="baby"?`โหมด Baby · SET ${st.t.toFixed(1)} °C`:st.mode==="man"?`โหมด Manual · PWR ${st.pw}%`:"โหมด Prewarm";
      root.querySelector("#set-msg").textContent=st.msg;
      const fx=root.querySelector("#set-fix"); fx.hidden=!(st.seen&&st.bad); if(st.bad) fx.textContent=FIX[st.bad];
    }
    root.querySelectorAll("#set-mode [data-m]").forEach(b=>b.onclick=()=>{ st.mode=b.dataset.m; st.msg=""; paint(); });
    root.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{ const d=+b.dataset.k;
      if(st.mode==="baby"){ const nt=r1(Math.max(P.tMin,Math.min(P.tMax, st.t+d*P.tStep))); st.msg=nt===st.t?"ถึงขอบเขตที่ตั้งได้แล้ว":""; st.t=nt; }
      else if(st.mode==="man"){ const np=Math.max(0,Math.min(100, st.pw+d*P.pStep)); st.msg=np===st.pw?"ถึงขอบเขตแล้ว":""; st.pw=np; }
      else st.msg="โหมด Prewarm ไม่มีค่าให้ปรับ";
      paint(); });
    root.querySelector("#set-look").onclick=()=>{ st.seen=true;
      const M={off:"หัววัดหลุดออกจากผิว วางอยู่ข้างตัวทารก", nc:"สายหัววัดไม่ได้เสียบเข้าเครื่อง", nocover:"หัววัดติดผิวด้วยเทปใส ไม่มีแผ่นสะท้อนความร้อน หัวโดนรังสีโดยตรง", baby:"มีทารกนอนอยู่บนเตียง ทั้งที่งานนี้ต้องใช้เตียงเปล่า"};
      st.msg=st.bad?M[st.bad]:(O.kind==="baby"?"หัววัดเสียบแน่น ติดผิวบริเวณท้องด้วยแผ่นสะท้อนความร้อน ถูกต้อง":"เตียงว่าง ไม่มีทารก พร้อมสำหรับงานนี้"); paint(); };
    root.querySelector("#set-fix").onclick=()=>{ st.msg=FIX[st.bad]+" เรียบร้อย"; st.bad=""; paint(); };
    root.querySelector("#set-go").onclick=()=>{
      const okM=st.mode===O.mode, okV=O.mode==="baby"?Math.abs(st.t-O.target)<0.05:O.mode==="man"?st.pw===O.target:true, okP=!st.bad, all=okM&&okV&&okP;
      R.res[R.i]=all;
      const side=root.querySelector("#set-side"), last=R.i===R.orders.length-1;
      root.querySelectorAll(".sxset button").forEach(b=>b.disabled=true);
      const vtxt=O.mode==="baby"?`SET ${st.t.toFixed(1)} °C ${okV?"✓":"✗ ควรเป็น "+O.target.toFixed(1)}`:O.mode==="man"?`PWR ${st.pw}% ${okV?"✓":"✗ ควรเป็น "+O.target+"%"}`:"ไม่มีค่าที่ต้องตั้ง ✓";
      side.innerHTML=`<h2>${all?"✓ ตั้งถูกต้อง +2":"✗ ยังไม่ถูก +0"}</h2>
        <ul class="gl"><li class="${okM?"ok":"bad"}">โหมด ${MN[st.mode]} ${okM?"✓":"✗ ควรเป็น "+MN[O.mode]}</li>
        <li class="${okV?"ok":"bad"}">${vtxt}</li>
        <li class="${okP?"ok":"bad"}">หัววัดและเตียง ${okP?"✓ พร้อม":"✗ ยังมีปัญหาที่ไม่ได้แก้ (กด “ตรวจหัววัดและเตียง” ทุกครั้ง)"}</li></ul>
        ${!okP?`<div class="msg bad">ค่าที่ตั้งถูกแต่หัววัดหรือเตียงไม่พร้อม เครื่องจะควบคุมผิด หรือทารกอยู่ในโหมดที่ไม่มีสัญญาณเตือน</div>`:""}
        <div class="tools"><button class="primary" id="set-nx">${last?"ดูผลรวม":"ใบสั่งถัดไป →"}</button></div>`;
      side.querySelector("#set-nx").onclick=()=>{R.i++;viewSet();window.scrollTo(0,0);};
      if(window.innerWidth<900) side.scrollIntoView({behavior:"smooth"});
    };
    paint();
  }
  function setSummary(){
    const R=setRound, ok=R.res.filter(Boolean).length, sc=ok*2, mx=R.orders.length*2;
    const s=R.saved||(R.saved=savePart("set", sc, mx));   // บันทึกครั้งเดียวต่อรอบ
    frame(`<h2>ผลฝึกตั้งเครื่อง</h2><div class="score ${sc>=8?"ok":sc>=6?"mid":"bad"}"><div class="big">${sc}/${mx}</div><div>ตั้งถูก ${ok} จาก ${R.orders.length} ใบสั่ง</div></div>
      ${s.done?`<div class="msg ok">ทำครบทั้งสองส่วนแล้ว ส่งคะแนนโมดูลนี้ ${s.score}/${s.max} (${Math.round(s.score/s.max*100)}%)</div>`:`<p class="muted">ทำมุมช่างต่อให้ครบ ระบบจึงจะรวมคะแนนและส่ง</p>`}
      <ol class="recap">${R.orders.map((o,k)=>`<li><b>${R.res[k]?"✓":"✗"} ${esc(o.who)}</b><span>${esc(o.text)}</span></li>`).join("")}</ol>
      <div class="tools"><button id="set-again">ฝึกอีกชุด</button>${s.done?"":`<button class="primary" id="go-tech">ไปมุมช่าง ▶</button>`}</div>`);
    root.querySelector("#set-again").onclick=()=>{ newSetRound(); viewSet(); };
    const g=root.querySelector("#go-tech"); if(g) g.onclick=()=>{ tab="tech"; techRound=null; render(); };
    window.scrollTo(0,0);
  }

  /* ---------- ตรวจก่อนใช้งาน (ไม่เก็บคะแนน) ---------- */
  function viewCheck(){
    const items=D.checklist, bad=new Set(shuffle(items.map((x,k)=>k)).slice(0,D.checkBad)), ans={}; let checked=false;
    function draw(){
      const done=Object.keys(ans).length===items.length;
      frame(`<h2>ตรวจเครื่องก่อนใช้งาน</h2>
        <p class="muted">รายการที่ผู้ใช้ตรวจก่อนใช้กับผู้ป่วย ช่างใช้รายการเดียวกันนี้ตรวจตอนรับแจ้งซ่อมและก่อนส่งคืน อ่านผลที่พบแล้วตัดสินว่าผ่านหรือไม่ผ่าน (ไม่เก็บคะแนน)</p>
        <div class="chk">${items.map((x,k)=>{ const isBad=bad.has(k), a=ans[k];
          const res=checked?((a==="bad")===isBad?"good":"bad"):"";
          return `<div class="chkrow ${res}"><div><b>${k+1}. ${esc(x.n)}</b><p>${esc(isBad?x.bad:x.ok)}</p>
            ${checked&&isBad?`<p class="act">→ ${esc(x.act)}</p>`:""}${checked&&res==="bad"&&!isBad?`<p class="act">รายการนี้ปกติ ใช้งานได้</p>`:""}</div>
            <div class="seg"><button data-k="${k}" data-a="ok" class="${a==="ok"?"on":""}" ${checked?"disabled":""}>ผ่าน</button><button data-k="${k}" data-a="bad" class="${a==="bad"?"on":""}" ${checked?"disabled":""}>ไม่ผ่าน</button></div></div>`; }).join("")}</div>
        ${checked?(()=>{ const right=items.filter((x,k)=>(ans[k]==="bad")===bad.has(k)).length;
            return `<div class="score ${right===items.length?"ok":right>=8?"mid":"bad"}"><div class="big">${right}/${items.length}</div><div>ตัดสินถูก · เครื่องนี้${bad.size?"ยังไม่พร้อมใช้":"พร้อมใช้"}</div></div>`; })():""}
        <div class="tools">${checked?`<button class="primary" id="ck-new">สุ่มเครื่องใหม่</button>`:`<button class="primary" id="ck-go" ${done?"":"disabled"}>ตรวจคำตอบ</button><span class="muted small">ตัดสินแล้ว ${Object.keys(ans).length}/${items.length}</span>`}</div>`);
      root.querySelectorAll(".chk [data-k]").forEach(b=>b.onclick=()=>{ ans[b.dataset.k]=b.dataset.a; const y=window.scrollY; draw(); window.scrollTo(0,y); });
      const g=root.querySelector("#ck-go"); if(g) g.onclick=()=>{ checked=true; draw(); };
      const n=root.querySelector("#ck-new"); if(n) n.onclick=()=>{ viewCheck(); window.scrollTo(0,0); };
    }
    draw();
  }

  /* ---------- มุมช่าง ---------- */
  let techRound=null;
  function viewTech(){
    if(!techRound) techRound={qs:shuffle(D.cases).slice(0,D.techPerRound).map(c=>({...c, ord:shuffle(c.act.map((t,k)=>k))})), i:0, step:1, sc:0, pts:[]};
    const T=techRound;
    if(T.i>=T.qs.length) return techSummary();
    const q=T.qs[T.i];
    frame(`<h2>มุมช่าง: ใช้งานผิดหรือเครื่องเสีย</h2><p class="muted">อ่านใบแจ้งซ่อม ตัดสินสาเหตุ (1 คะแนน) แล้วเลือกสิ่งที่ควรทำต่อ (1 คะแนน)</p>
      <div class="simtop"><span class="kicker">โจทย์ ${T.i+1} / ${T.qs.length}</span><div class="simdots">${T.qs.map((x,k)=>`<i class="${k<T.i?(T.pts[k]===2?"ok":"bad"):k===T.i?"on":""}"></i>`).join("")}</div></div>
      <div class="ticket"><div class="tk-h"><span>ใบแจ้งซ่อม</span></div><p>${esc(q.q)}</p></div>
      <h3>1) สาเหตุน่าจะเป็นแบบไหน</h3>
      <div class="lopts" id="tc-a">${Object.entries(D.causes).map(([k,n])=>`<button class="lopt" data-c="${k}">${esc(n)}</button>`).join("")}</div>
      <div id="tc-2"></div>`);
    let p=0;
    root.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{
      const good=b.dataset.c===q.a; if(good) p++;
      root.querySelectorAll("[data-c]").forEach(x=>{ x.disabled=true; if(x.dataset.c===q.a) x.classList.add("good"); else if(x===b) x.classList.add("bad"); });
      const box=root.querySelector("#tc-2");
      box.innerHTML=`<p class="small ${good?"":"bad-t"}">${good?"✓ ถูกต้อง":"✗ คำตอบคือ: "+esc(D.causes[q.a])}</p>
        <h3>2) ควรทำอะไรต่อ</h3><div class="lopts">${q.ord.map(k=>`<button class="lopt" data-x="${k}">${esc(q.act[k])}</button>`).join("")}</div><div id="tc-f"></div>`;
      box.querySelectorAll("[data-x]").forEach(y=>y.onclick=()=>{
        const g2=y.dataset.x==="0"; if(g2) p++;
        box.querySelectorAll("[data-x]").forEach(z=>{ z.disabled=true; if(z.dataset.x==="0") z.classList.add("good"); else if(z===y) z.classList.add("bad"); });
        T.sc+=p; T.pts[T.i]=p;
        box.querySelector("#tc-f").innerHTML=`<div class="fb ${p===2?"good":"bad"}"><b>ได้ ${p}/2 คะแนน</b><p>${esc(q.e)}</p><button class="primary" id="tc-n">${T.i+1<T.qs.length?"โจทย์ถัดไป →":"ดูผล"}</button></div>`;
        box.querySelector("#tc-n").onclick=()=>{ T.i++; viewTech(); window.scrollTo(0,0); };
      });
      if(window.innerWidth<900) box.scrollIntoView({behavior:"smooth",block:"start"});
    });
  }
  function techSummary(){
    const T=techRound, mx=T.qs.length*2, s=T.saved||(T.saved=savePart("tech", T.sc, mx));   // บันทึกครั้งเดียวต่อรอบ
    frame(`<h2>ผลมุมช่าง</h2><div class="score ${T.sc>=13?"ok":T.sc>=10?"mid":"bad"}"><div class="big">${T.sc}/${mx}</div><div>คะแนน</div></div>
      ${s.done?`<div class="msg ok">ทำครบทั้งสองส่วนแล้ว ส่งคะแนนโมดูลนี้ ${s.score}/${s.max} (${Math.round(s.score/s.max*100)}%)</div>`:`<p class="muted">ทำฝึกตั้งเครื่องต่อให้ครบ ระบบจึงจะรวมคะแนนและส่ง</p>`}
      <ol class="recap">${T.qs.map((q,k)=>`<li><b>${T.pts[k]}/2 · ${esc(D.causes[q.a].split(" (")[0])}</b><span>${esc(q.q)}</span></li>`).join("")}</ol>
      <div class="tools"><button id="tc-again">ทำอีกชุด</button>${s.done?"":`<button class="primary" id="go-set">ไปฝึกตั้งเครื่อง ▶</button>`}</div>`);
    root.querySelector("#tc-again").onclick=()=>{ techRound=null; viewTech(); };
    const g=root.querySelector("#go-set"); if(g) g.onclick=()=>{ tab="set"; setRound=null; render(); };
    window.scrollTo(0,0);
  }

  function render(){ ({learn:viewLearn, set:viewSet, check:viewCheck, tech:viewTech})[tab](); }
  window.Views=window.Views||{}; window.Views.tech={show:()=>{ if(!root.innerHTML) render(); }};
})();

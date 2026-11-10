/* ===== โหมดเรียนรู้: ฉากแอนิเมชันทีละขั้น ===== */
(function(){
  const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const STAGES = ["อาการ","ตรวจ","วินิจฉัย","ซ่อม","ทดสอบ","สรุป"];
  let muted = false;
  try{ muted = localStorage.getItem("iwt-mute")==="1"; }catch(e){}

  /* ---------- ภาพเครื่องอุ่นทารก (ใช้ร่วมกับโหมดสอบ) ---------- */
  function pumpSVG(){ return WMDIA.svg({cls:"lp"}) + `<div class="sx-cap" aria-live="polite"></div>`; }

  /* ภาพขยายชิ้นส่วน: ชื่อ "ชนิด_สถานะ" เติม " fixed" เพื่อแสดงสภาพหลังแก้ */
  const ZT = {heater:"ภาพขยายไส้ฮีตเตอร์ในหลอดควอตซ์", quartz:"ภาพขยายปลายหลอดควอตซ์ด้านขั้ว", probe:"ภาพขยายหัววัดอุณหภูมิผิว", jack:"ภาพขยายขั้วต่อหัววัดบนเครื่อง",
    cord:"ภาพขยายปลั๊กและสายไฟ", batt:"ภาพขยายแบตสำรองของสัญญาณเตือน", reflector:"ภาพขยายแผ่นสะท้อน", triac:"ภาพขยายวงจรขับฮีตเตอร์บนบอร์ด", fuse:"ภาพขยายฟิวส์ F1", speaker:"ภาพขยายลำโพงเสียงเตือน"};
  function zoomSVG(kind){
    const k=kind.split(/[_ ]/)[0]; let b="";
    if(k==="heater") b=`<rect x="14" y="36" width="152" height="28" rx="14" class="zm-f"/><path class="zm-ok zm-new" d="M24 50 q4 -6 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0"/>
      <path class="zm-o zm-old" d="M24 50 q4 -6 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 M126 50 q4 -6 8 0 t8 0 t8 0 t8 0"/><circle class="zm-dirt zm-old" cx="119" cy="50" r="5"/>
      <text x="90" y="92" text-anchor="middle" class="zm-t zm-old zm-bad">ขดลวดขาดช่วงปลาย วัดได้วงจรเปิด</text><text x="90" y="92" text-anchor="middle" class="zm-t zm-new">ไส้ใหม่ 104 Ω</text>`;
    if(k==="quartz") b=`<rect x="40" y="36" width="130" height="28" rx="14" class="zm-f"/><rect x="10" y="40" width="34" height="20" rx="3" class="zm-f"/><path class="zm-cr zm-old" d="M50 38 l6 8 l-4 6 l7 9"/><path class="zm-wet zm-old" d="M14 60 q10 8 26 2 v6 h-26z"/>
      <text x="90" y="92" text-anchor="middle" class="zm-t zm-old zm-bad">หลอดร้าว คราบน้ำยาซึมถึงขั้ว</text><text x="90" y="92" text-anchor="middle" class="zm-t zm-new">ไส้ใหม่ ฉนวน &gt; 200 MΩ</text>`;
    if(k==="probe") b=`<circle cx="50" cy="50" r="18" class="zm-f"/><circle cx="50" cy="50" r="6" class="zm-o"/><path class="zm-o" d="M68 50 H170"/>
      <text x="110" y="40" text-anchor="middle" class="zm-t zm-old zm-bad">อ่านต่ำกว่าจริง 1.0 °C</text><text x="110" y="40" text-anchor="middle" class="zm-t zm-new">หัววัดใหม่ ±0.1 °C</text><text x="50" y="92" text-anchor="middle" class="zm-t">เทอร์มิสเตอร์</text>`;
    if(k==="jack") b=`<rect x="40" y="24" width="100" height="56" rx="8" class="zm-f"/><circle cx="72" cy="52" r="6" class="zm-o"/><circle cx="108" cy="52" r="6" class="zm-o"/><circle cx="108" cy="52" r="4" class="zm-dirt zm-old"/><path class="zm-cr zm-old" d="M66 44 l12 14"/>
      <text x="90" y="98" text-anchor="middle" class="zm-t zm-old zm-bad">สปริงจับคลาย ขามีคราบ</text><text x="90" y="98" text-anchor="middle" class="zm-t zm-new">ขั้วต่อใหม่ จับแน่น</text>`;
    if(k==="cord") b=`<rect x="20" y="30" width="54" height="44" rx="8" class="zm-f"/><path class="zm-o" d="M74 52 H172"/><path class="zm-cr zm-old" d="M30 34 l8 14 l-6 10 l8 12"/><path class="zm-cr zm-old" d="M120 46 v12 M128 46 v12"/>
      <text x="96" y="96" text-anchor="middle" class="zm-t zm-old zm-bad">ปลั๊กร้าว สายแบนจากล้อทับ</text><text x="96" y="96" text-anchor="middle" class="zm-t zm-new">สายไฟและปลั๊กใหม่</text>`;
    if(k==="batt") b=`<rect x="44" y="26" width="92" height="50" rx="6" class="zm-f"/><rect x="136" y="44" width="8" height="14"/>
      <text x="90" y="50" text-anchor="middle" class="zm-t">แบตสำรอง</text><text x="90" y="66" text-anchor="middle" class="zm-t zm-old zm-bad">5.1 V · ติดตั้ง 4 ปีก่อน</text><text x="90" y="66" text-anchor="middle" class="zm-t zm-new">แบตใหม่ 9.4 V</text>`;
    if(k==="reflector") b=`<path class="zm-ok zm-new" d="M20 70 Q90 10 160 70"/><path class="zm-o zm-old" d="M20 70 Q60 22 92 30 Q104 44 118 38 Q140 40 160 70"/><g class="zm-dirt zm-old"><circle cx="70" cy="34" r="3"/><circle cx="130" cy="44" r="3"/></g>
      <text x="90" y="96" text-anchor="middle" class="zm-t zm-old zm-bad">บุบเป็นแอ่งด้านหนึ่ง ผิวหมอง</text><text x="90" y="96" text-anchor="middle" class="zm-t zm-new">แผ่นสะท้อนใหม่ โค้งสม่ำเสมอ</text>`;
    if(k==="triac") b=`<rect x="10" y="20" width="160" height="64" rx="6" fill="#1f6f52" opacity=".85"/><rect x="72" y="34" width="30" height="24" rx="2" fill="#1d2430"/><path d="M78 58 v12 M87 58 v12 M96 58 v12" stroke="#cfd6dc" stroke-width="2"/>
      <circle cx="87" cy="64" r="12" class="zm-dirt zm-old"/><text x="90" y="100" text-anchor="middle" class="zm-t zm-old zm-bad">อุปกรณ์สวิตช์ไหม้ ช็อตค้าง</text><text x="90" y="100" text-anchor="middle" class="zm-t zm-new">เปลี่ยนแล้ว สั่ง 0% ไม่มีไฟที่ไส้</text>`;
    if(k==="fuse") b=`<rect x="30" y="36" width="120" height="32" rx="14" class="zm-f"/><rect x="18" y="34" width="22" height="36" rx="3" class="zm-f"/><rect x="140" y="34" width="22" height="36" rx="3" class="zm-f"/>
      <path class="zm-ok zm-new" d="M40 52 H140"/><path class="zm-o zm-old" d="M40 52 H84 M98 52 H140"/><circle class="zm-dirt zm-old" cx="91" cy="52" r="10"/>
      <text x="90" y="92" text-anchor="middle" class="zm-t zm-old zm-bad">F1 ขาด (ต้องหาสาเหตุก่อนเปลี่ยน)</text><text x="90" y="92" text-anchor="middle" class="zm-t zm-new">ฟิวส์ใหม่ขนาดเดิม</text>`;
    if(k==="speaker") b=`<circle cx="90" cy="50" r="32" class="zm-f"/><circle cx="90" cy="50" r="14" class="zm-o"/><g class="zm-dirt zm-old" style="fill:#e8e4dc"><circle cx="70" cy="34" r="6"/><circle cx="112" cy="62" r="7"/><circle cx="104" cy="30" r="4"/></g>
      <text x="90" y="100" text-anchor="middle" class="zm-t zm-old zm-bad">คราบเกลือ ลำโพงวงจรเปิด</text><text x="90" y="100" text-anchor="middle" class="zm-t zm-new">ลำโพงใหม่ เสียงเตือนดัง</text>`;
    return `<svg class="zm zm-${k} ${kind}" viewBox="0 0 180 110" role="img" aria-label="${ZT[k]||""}">${b}</svg>`;
  }

  /* ---------- ใช้สถานะกับภาพ ---------- */
  function applyVis(box, v){
    v = v||{};
    const svg = box.querySelector("svg.sx"); if(!svg) return;
    clearTimeout(box._t1); clearTimeout(box._t2);
    WMDIA.state(svg, v);
    const cap=box.querySelector(".sx-cap"); if(cap) cap.innerHTML=v.cap?`<span>${esc(v.cap)}</span>`:"";
    box.classList.remove("working");
    if(v.later){ box._t2=setTimeout(()=>{ WMDIA.state(svg, Object.assign({}, v, v.later, {later:null})); if(cap&&v.later.cap) cap.innerHTML=`<span>${esc(v.later.cap)}</span>`; if(v.later.beep) beep(); }, v.delay||2400); }
    const ins = box.querySelector(".ins"); if(!ins) return;
    let h="";
    if(v.gauge){ const g=v.gauge, mx=g.max||100, mn=g.min||0;
      h+=`<div class="inst"><div class="inst-n">${esc(g.n)}</div>
      <div class="gauge"><div class="g-fill"></div>${g.th!==undefined?`<div class="g-th" style="left:${Math.min(100,(g.th-mn)/(mx-mn)*100)}%"><span>${esc(g.thl||"เกณฑ์ "+g.th+(g.unit||""))}</span></div>`:""}</div>
      <div class="g-v">0${esc(g.unit||"")}</div></div>`; }
    if(v.meter) h+=`<div class="inst"><div class="inst-n">${esc(v.meter.n)}</div><div class="meter big">${esc(v.meter.v)}</div></div>`;
    if(v.zoom) h+=`<div class="inst"><div class="inst-n">${ZT[v.zoom.split(/[_ ]/)[0]]||""}</div>${zoomSVG(v.zoom)}</div>`;
    ins.innerHTML=h;
    if(v.gauge) animGauge(ins, v.gauge);
  }
  function animGauge(ins,g){
    const f=ins.querySelector(".g-fill"), t=ins.querySelector(".g-v"), mx=g.max||100, mn=g.min||0, u=g.unit||"", dp=g.dp||0;
    const bad = g.bad==="below" ? (x=>x<g.th) : g.bad==="above" ? (x=>x>g.th) : (()=>false);
    const pct = x=>Math.min(100,Math.max(0,(x-mn)/(mx-mn)*100))+"%";
    const fmt = x=>(+x).toFixed(dp);
    const from = g.still ? g.v : (g.from!==undefined?g.from:mn);
    f.style.transition="none"; f.style.width=pct(from);
    f.classList.toggle("bad",bad(from)); t.textContent=fmt(from)+u;
    if(g.still){ f.classList.toggle("bad",bad(g.v)); return; }
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      f.style.transition="width 1.6s cubic-bezier(.3,.7,.3,1), background .3s"; f.style.width=pct(g.v);
      const t0=performance.now();
      (function tick(now){ const k=Math.min(1,(now-t0)/1600), e=1-Math.pow(1-k,3), x=from+(g.v-from)*e;
        t.textContent=fmt(x)+u; f.classList.toggle("bad",bad(x)); if(k<1) requestAnimationFrame(tick); })(t0);
    }));
  }

  /* แอนิเมชันพิเศษ แล้วเรียก done เมื่อจบ */
  function runAnim(box, name, done){
    if(name==="work"){
      box.classList.add("working");
      box._t1=setTimeout(()=>{ box.classList.remove("working"); done(); }, 1800);
    }else if(name==="rerun"){
      box._t1=setTimeout(done, 2400);
    }else if(name==="fix"){
      const zm=box.querySelector(".zm"); box.classList.add("working");
      box._t1=setTimeout(()=>{ box.classList.remove("working"); if(zm) zm.classList.add("fixed"); setTimeout(done,500); }, 1600);
    }else done();
  }

  let actx=null;
  function beep(){
    if(muted) return;
    try{
      actx = actx || new (window.AudioContext||window.webkitAudioContext)();
      [0,0.28,0.56].forEach(d=>{
        const o=actx.createOscillator(), g=actx.createGain();
        o.type="square"; o.frequency.value=880; g.gain.value=0.04;
        o.connect(g); g.connect(actx.destination);
        o.start(actx.currentTime+d); o.stop(actx.currentTime+d+0.16);
      });
    }catch(e){}
  }

  /* ---------- ภาพอาการสำหรับโหมดสอบ (ไม่เน้นชิ้นส่วน เพื่อไม่บอกใบ้) ---------- */
  const MINI = {
    "HEATER FAIL":{mode:"pre", heat:100, dead:true, baby:false, probe:"nc", alarm:"HEATER FAIL", cap:"สั่ง Prewarm แถบกำลังเต็ม แต่เตียงไม่อุ่น"},
    "CHECK BABY ดังบ่อย":{mode:"baby", heat:100, skin:35.1, set:36.5, alarm:"CHECK BABY", cap:"แถบกำลังเต็มนาน แล้วเตือน CHECK BABY"},
    "เครื่องไม่ติด":{off:true, cap:"เสียบไฟ เปิดสวิตช์ จอดับ ไม่มีไฟใดติด"},
    "ค่าผิวต่ำกว่าจริง":{mode:"baby", heat:55, skin:36.5, set:36.5, cap:"จอ 36.5 °C แต่วัดทารกได้ราว 37.5 °C"},
    "ไฟดับไม่เตือน":{off:true, cap:"ถอดปลั๊กขณะทำงาน เครื่องดับเงียบ"},
    "PROBE FAIL เป็นช่วงๆ":{mode:"baby", heat:0, skin:null, probe:"nc", set:36.5, alarm:"PROBE FAIL", cap:"เตือนไม่กี่วินาทีแล้วหายเอง"},
    "มุมเตียงไม่อุ่น":{mode:"baby", heat:70, skin:36.3, set:36.5, cap:"ทารกที่เลื่อนไปปลายเท้าตัวเย็นกว่าปกติ"},
    "ร้อนเกิน กำลังไม่ลด":{mode:"baby", heat:100, skin:37.8, set:35.5, alarm:"SKIN HIGH", cap:"ลดค่าที่ตั้งแล้ว ไส้ยังแดงจัด"},
    "ฟิวส์ขาดซ้ำ":{mode:"pre", heat:100, baby:false, probe:"nc", cap:"เปิดได้ไม่ถึงนาที แล้วดับ", later:{off:true, cap:"ฟิวส์ขาดอีก เครื่องดับ"}, delay:2600},
    "ไม่มีเสียงเตือน":{mode:"baby", heat:0, skin:null, probe:"nc", set:36.5, alarm:"PROBE FAIL", cap:"ไฟเตือนติด แต่ไม่มีเสียง"}
  };
  function mini(el, c){
    el.innerHTML = `<div class="lpbox mini">${pumpSVG()}</div>`;
    applyVis(el.querySelector(".lpbox"), MINI[c.alarm]||{mode:"baby", heat:40});
  }

  /* ---------- ตัวเล่นฉาก ---------- */
  function start(id, root, hooks){
    const L = window.LEARN.find(x=>x.id===id); if(!L) return;
    const st = {k:0, tries:0, firstOk:0, picked:null, answered:false, log:[]};
    const qs = L.scenes.filter(s=>s.opts).length;

    function stageBar(stage){
      const si=STAGES.indexOf(stage);
      return `<ol class="stepper">${STAGES.map((s,i)=>`<li class="${i<si?"ok":i===si?"on":""}"><span>${i+1}</span>${s}</li>`).join("")}</ol>`;
    }

    function render(){
      const sc = L.scenes[st.k];
      if(!sc){ return summary(); }
      root.innerHTML = `
        <div class="simhead"><button class="ghost" id="ln-back">← รายการเคส</button>
          <div class="meta"><button class="ghost" id="ln-mute" aria-label="เปิด/ปิดเสียง">${muted?"🔇 ปิดเสียง":"🔊 เปิดเสียง"}</button></div></div>
        <h1>${esc(L.n)} <span class="tag">โหมดเรียนรู้</span></h1>
        ${stageBar(sc.stage)}
        <div class="lgrid">
          <div class="lpbox" id="lpbox">${pumpSVG()}<div class="wrk">🔧 กำลังดำเนินการ…</div><div class="ins"></div></div>
          <div class="lstory">
            <div class="kicker">ขั้นที่ ${st.k+1} / ${L.scenes.length} · ${esc(sc.stage)}</div>
            <h2>${esc(sc.title)}</h2>
            <p>${esc(sc.text)}</p>
            ${sc.opts?`<div class="lopts">${sc.opts.map((o,i)=>`<button class="lopt" data-i="${i}">${esc(o.t)}</button>`).join("")}</div>
              <div id="fb"></div>`
            :`<div class="tools"><button class="primary" id="ln-next">${esc(sc.next||"ต่อไป")} →</button></div>`}
          </div>
        </div>`;
      const box=root.querySelector("#lpbox");
      applyVis(box, sc.vis);
      if(sc.vis && sc.vis.beep) beep();
      root.querySelector("#ln-back").onclick=()=>{clearTimeout(box._t1);hooks.onBack();};
      root.querySelector("#ln-mute").onclick=e=>{muted=!muted;try{localStorage.setItem("iwt-mute",muted?"1":"0")}catch(_){}
        e.currentTarget.textContent=muted?"🔇 ปิดเสียง":"🔊 เปิดเสียง";};
      const nx=root.querySelector("#ln-next"); if(nx) nx.onclick=()=>{st.k++;st.answered=false;st.tries=0;render();window.scrollTo(0,0);};
      root.querySelectorAll(".lopt").forEach(b=>b.onclick=()=>pick(+b.dataset.i));
    }

    function pick(i){
      const sc=L.scenes[st.k], o=sc.opts[i], box=root.querySelector("#lpbox");
      if(st.answered) return;
      const btns=[...root.querySelectorAll(".lopt")];
      btns.forEach(b=>b.disabled=true);
      btns[i].classList.add("picked");
      const fb=root.querySelector("#fb");
      fb.innerHTML=`<div class="fb wait">กำลังดำเนินการ… ดูภาพเครื่อง</div>`;
      const mob = window.innerWidth<900;
      if(mob) box.scrollIntoView({behavior:"smooth",block:"start"});
      if(o.vis) applyVis(box, o.vis); else applyVis(box, sc.vis);
      if(o.vis && o.vis.beep) beep();
      runAnim(box, o.anim, ()=>{
        if(o.after){ applyVis(box, o.after); if(o.after.beep) beep(); }
        const good = o.ok===true, mid=o.ok==="costly";
        if(good||mid){ st.answered=true; if(st.tries===0&&good) st.firstOk++; st.log.push({t:sc.title, a:(sc.opts.find(x=>x.ok===true)||o).t}); }
        else st.tries++;
        btns[i].classList.add(good?"good":mid?"mid":"bad");
        const last = st.k===L.scenes.length-1;
        fb.innerHTML=`<div class="fb ${good?"good":mid?"mid":"bad"}">
          <b>${good?"✓ ถูกต้อง":mid?"△ ได้ผล แต่ยังไม่ใช่วิธีที่ดีที่สุด":"✗ ยังไม่ใช่"}</b><p>${esc(o.fb)}</p>
          ${good||mid?`<button class="primary" id="ln-go">${last?"ดูสรุป":"ขั้นต่อไป"} →</button>`:`<button id="ln-retry">ลองตัวเลือกอื่น</button>`}</div>`;
        const go=root.querySelector("#ln-go"); if(go) go.onclick=()=>{st.k++;st.answered=false;st.tries=0;render();window.scrollTo(0,0);};
        const rt=root.querySelector("#ln-retry"); if(rt) rt.onclick=()=>{
          applyVis(box, sc.vis); fb.innerHTML="";
          btns.forEach((b,j)=>{ if(!b.classList.contains("bad")) b.disabled=false; b.classList.remove("picked"); });
        };
        if(mob) setTimeout(()=>fb.scrollIntoView({behavior:"smooth",block:"center"}), o.anim||o.vis?900:0);
      });
    }

    function summary(){
      const C = window.SIM.CASES.find(c=>c.id===id);
      window.Score&&Score.record({key:"learn:"+id, mod:(window.APP_CONFIG||{}).simMod?(window.APP_CONFIG.simMod+" (เรียนรู้)"):"3-จำลองซ่อม (เรียนรู้)", item:L.n, score:st.firstOk, max:qs, detail:"ตอบถูกในครั้งแรก"});
      root.innerHTML = `
        <div class="simhead"><button class="ghost" id="ln-back">← รายการเคส</button></div>
        <h1>${esc(L.n)} <span class="tag">โหมดเรียนรู้</span></h1>
        ${stageBar("สรุป")}
        <div class="score ${st.firstOk===qs?"ok":st.firstOk>=qs-2?"mid":"bad"}"><div class="big">${st.firstOk}/${qs}</div><div>ข้อที่ตอบถูกในครั้งแรก</div></div>
        <h2>ลำดับการทำงานที่ถูกต้อง</h2>
        <ol class="recap">${st.log.map(l=>`<li><b>${esc(l.t)}</b><span>${esc(l.a)}</span></li>`).join("")}</ol>
        ${C?`<h2>ข้อคิด</h2><div class="learn"><p>${esc(C.learn)}</p></div>`:""}
        <div class="tools"><button id="ln-again">เรียนเคสนี้ใหม่</button>${C?`<button class="primary" id="ln-exam">ลองทำเคสนี้ในโหมดสอบ →</button>`:""}<button class="ghost" id="ln-list">รายการเคส</button></div>`;
      root.querySelector("#ln-back").onclick=hooks.onBack;
      root.querySelector("#ln-list").onclick=hooks.onBack;
      root.querySelector("#ln-again").onclick=()=>start(id,root,hooks);
      const ex=root.querySelector("#ln-exam"); if(ex) ex.onclick=()=>hooks.onExam(id);
      window.scrollTo(0,0);
    }
    render(); window.scrollTo(0,0);
  }

  window.Learn = {start, mini, has:id=>window.LEARN.some(x=>x.id===id)};
})();

/* ===== โมดูล 8: การทดสอบหลังซ่อม (เครื่องอุ่นทารก) ===== */
(function(){
  const D = window.PM;
  const root = document.getElementById("pm");
  const esc = s => String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const rnd = (a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
  const r1 = x=>Math.round(x*10)/10, r2=x=>Math.round(x*100)/100;
  let cur = "probe";

  /* ---------- โจทย์ฝึก: สร้างแบบสุ่ม (เกณฑ์ตัวอย่างของเครื่องจำลอง) ---------- */
  const ri=(a,b)=>Math.round(rnd(a,b));
  const GEN = {
    probe(){
      const t=pick(["bath","sim"]);
      if(t==="bath"){ const ref=pick([33.0,35.0,37.0]), e=Math.random()<.55?r1(rnd(-0.3,0.3)):(Math.random()<.5?-1:1)*r1(rnd(0.4,1.2)), disp=r1(ref+e), d=r1(disp-ref), pass=Math.abs(d)<=0.3;
        return {q:`ตรวจเทียบในอ่างน้ำ: เทอร์โมมิเตอร์อ้างอิง ${ref.toFixed(1)} °C เครื่องอ่าน ${disp.toFixed(1)} °C ค่าต่างเท่าไร และผ่านหรือไม่`,
          num:{label:"ค่าต่าง = ค่าบนจอ − อ้างอิง (°C)", ans:d, tol:0.05}, pass,
          ex:`${disp.toFixed(1)} − ${ref.toFixed(1)} = ${d>0?"+":""}${d.toFixed(1)} °C เกณฑ์ ±0.3 °C → ${pass?"ผ่าน":"ไม่ผ่าน "+(d<0?"อ่านต่ำกว่าจริง เครื่องจะให้ความร้อนเกิน ทารกร้อนเกิน":"อ่านสูงกว่าจริง เครื่องจะลดความร้อน ทารกเย็น")}`}; }
      const c=pick([
        {b:"ผิด −0.9", s:"ถูก", p:false, e:"ไม่ผ่าน อ่างน้ำผิดแต่ตัวจำลองถูก → เปลี่ยนหัววัด"},
        {b:"ผิด −0.9", s:"ผิด −0.9", p:false, e:"ไม่ผ่าน ทั้งสองผิดเท่ากัน → วงจรอ่านในเครื่อง ตรวจบอร์ด"},
        {b:"ถูก (+0.1)", s:"ถูก (0.0)", p:true, e:"ผ่าน ทั้งหัววัดและวงจรอยู่ในเกณฑ์"}]);
      return {q:`ผลตรวจ: อ่างน้ำ ${c.b} °C · ตัวจำลองหัววัด ${c.s} ผ่านหรือไม่`, pass:c.p, ex:c.e};
    },
    bed(){
      const t=pick(["mid","even"]);
      if(t==="mid"){ const v=r1(Math.random()<.55?rnd(34.2,38.8):pick([rnd(30,33.8),rnd(39.3,41)])), p=v>=34&&v<=39;
        return {q:`Manual 100% บนเตียงเปล่า 10 นาที กลางเตียงวัดได้ ${v.toFixed(1)} °C ผ่านเกณฑ์เครื่องจำลองหรือไม่`, pass:p,
          ex:`เกณฑ์ 34–39 °C → ${p?"ผ่าน":v<34?"ไม่ผ่าน ความร้อนต่ำ ตรวจไส้ แผ่นสะท้อน และลมในห้อง":"ไม่ผ่าน ร้อนเกิน ตรวจวงจรขับและความสูงหัวฮีตเตอร์"}`}; }
      const mid=r1(rnd(36.5,37.5)), cs=[0,0,0,0].map(()=>r1(mid-rnd(0.4,1.5))); if(Math.random()<.45){ cs[2]=r1(mid-rnd(2.6,3.6)); }
      const all=[mid,...cs], d=r1(Math.max(...all)-Math.min(...all)), p=d<=2;
      return {q:`กลางเตียง ${mid.toFixed(1)} · มุม ${cs.map(x=>x.toFixed(1)).join(" / ")} °C ค่าสูงสุดต่างจากต่ำสุดเท่าไร และผ่านหรือไม่`,
        num:{label:"สูงสุด − ต่ำสุด (°C)", ans:d, tol:0.05}, pass:p,
        ex:`${Math.max(...all).toFixed(1)} − ${Math.min(...all).toFixed(1)} = ${d.toFixed(1)} °C เกณฑ์ ≤ 2 °C → ${p?"ผ่าน":"ไม่ผ่าน มุมหนึ่งเย็น ตรวจแผ่นสะท้อนและตำแหน่งหัวฮีตเตอร์"}`};
    },
    alarm(){
      const c=pick([
        {s:"ถอดหัววัดในโหมด Baby ไฟเตือนติด จอขึ้น PROBE FAIL มีเสียงเตือน",p:true,e:"ผ่าน"},
        {s:"ถอดหัววัดในโหมด Baby ไฟเตือนติด จอขึ้น PROBE FAIL แต่ไม่มีเสียง",p:false,e:"ไม่ผ่าน ต้องมีทั้งเสียงและไฟ ตรวจลำโพงและวงจรเสียง งดใช้"},
        {s:"ใช้ตัวจำลองค่าต่ำค้างไว้ CHECK BABY เตือนที่นาทีที่ 15 (คู่มือกำหนด 15 นาที)",p:true,e:"ผ่าน ตรงเวลาที่กำหนด"},
        {s:"ใช้ตัวจำลองค่าต่ำค้างไว้ 40 นาที CHECK BABY ไม่เตือนเลย",p:false,e:"ไม่ผ่าน ระบบป้องกันร้อนเกินไม่ทำงาน งดใช้ ตรวจค่าตั้งและบอร์ด"},
        {s:"ตัวจำลองให้ค่าผิวสูงกว่าค่าที่ตั้ง 1.5 °C เครื่องเตือน SKIN HIGH และลดกำลังเหลือ 0%",p:true,e:"ผ่าน"}]);
      return {q:c.s+" ผ่านหรือไม่", pass:c.p, ex:c.e};
    },
    cut(){
      const c=pick([
        {s:"Manual สั่ง 0% วัดไฟที่ขั้วไส้ได้ 0 V ไส้ไม่แดง",p:true,e:"ผ่าน"},
        {s:"Manual สั่ง 0% แถบกำลังว่าง แต่วัดไฟที่ขั้วไส้ได้ 228 V",p:false,e:"ไม่ผ่าน วงจรขับค้างจ่าย งดใช้ทันที เปลี่ยนอุปกรณ์สวิตช์"},
        {s:"โหมด Baby ตั้งต่ำกว่าค่าจากตัวจำลอง แถบกำลังลดเหลือ 0% ภายใน 5 วินาที ไส้หยุดแดง",p:true,e:"ผ่าน"},
        {s:"ทดสอบวงจรตัดความร้อนแยกอิสระตามคู่มือบริการ ฮีตเตอร์ไม่ถูกตัด",p:false,e:"ไม่ผ่าน ระบบป้องกันชั้นที่สองไม่ทำงาน งดใช้"}]);
      return {q:c.s+" ผ่านหรือไม่", pass:c.p, ex:c.e};
    },
    pf(){
      const t=pick(["alarm","batt"]);
      if(t==="alarm"){ const c=pick([{s:"ถอดปลั๊กขณะทำงาน มีเสียงและไฟเตือนไฟดับทันที",p:true,e:"ผ่าน"},{s:"ถอดปลั๊กขณะทำงาน เครื่องดับเงียบ",p:false,e:"ไม่ผ่าน ตรวจแบตสำรอง"},{s:"ถอดปลั๊ก มีไฟเตือนแต่ไม่มีเสียง",p:false,e:"ไม่ผ่าน ต้องมีทั้งเสียงและไฟ"}]);
        return {q:c.s+" ผ่านหรือไม่", pass:c.p, ex:c.e}; }
      const v=r1(Math.random()<.55?rnd(8.5,9.6):rnd(4.5,8.2)), y=pick([1,1,3]), p=v>=8.4&&y<=2;
      return {q:`แบตสำรองวัดได้ ${v.toFixed(1)} V ติดตั้งมาแล้ว ${y} ปี (คู่มือกำหนดเปลี่ยนทุก 2 ปี) ผ่านหรือไม่`, pass:p,
        ex:`เกณฑ์ ≥ 8.4 V และไม่เกินรอบ 2 ปี → ${p?"ผ่าน":"ไม่ผ่าน เปลี่ยนแบตสำรองแล้วทดสอบเตือนไฟดับซ้ำ"}`};
    },
    mech(){
      const c=pick([
        {s:"ยกแผงกั้นทุกด้านแล้วดัน ไม่มีด้านใดพับลง",p:true,e:"ผ่าน"},
        {s:"แผงกั้นด้านหนึ่งพับลงเมื่อดันเบาๆ",p:false,e:"ไม่ผ่าน งดใช้ทันที เปลี่ยนสลัก"},
        {s:"เอียงเตียง 10° วางน้ำหนักทดสอบ เตียงค่อยๆ เลื่อนกลับแนวราบ",p:false,e:"ไม่ผ่าน กลไกล็อกสึก ซ่อมก่อนใช้"},
        {s:"ล็อกล้อเบรกทั้งหมดแล้วดันเครื่อง เครื่องไม่เคลื่อน",p:true,e:"ผ่าน"}]);
      return {q:c.s+" ผ่านหรือไม่", pass:c.p, ex:c.e};
    },
    esa(){
      const t=pick(["pe","eq","ap"]);
      if(t==="pe"){ const v=r2(pick([rnd(0.05,0.28),rnd(0.32,0.9)])), p=v<=0.3;
        return {q:`เครื่องอุ่นทารก Class I ความต้านทานสายดินป้องกันวัดได้ ${v} Ω ผ่านหรือไม่`, pass:p, ex:`เกณฑ์ ≤ 0.3 Ω → ${p?"ผ่าน":"ไม่ผ่าน ตรวจสายไฟ ปลั๊ก และจุดต่อสายดินในเครื่อง"}`}; }
      if(t==="eq"){ const v=Math.round(pick([rnd(40,480),rnd(520,900)])), p=v<=500;
        return {q:`Equipment leakage ของเครื่อง Class I วัดได้ ${v} µA ผ่านหรือไม่`, pass:p, ex:`เกณฑ์ ≤ 500 µA → ${p?"ผ่าน":"ไม่ผ่าน ตรวจฉนวนไส้ฮีตเตอร์และสายภายใน"}`}; }
      const v=Math.round(pick([rnd(5,4000),rnd(5200,8000)])), p=v<=5000;
      return {q:`หัววัด (ส่วนสัมผัสผู้ป่วยชนิด BF) วัด applied part leakage ได้ ${v} µA ผ่านหรือไม่`, pass:p, ex:`เกณฑ์ BF ≤ 5,000 µA → ${p?"ผ่าน":"ไม่ผ่าน ตรวจหัววัดและขั้วต่อ"}`};
    }
  };

  function practice(id){
    const box=root.querySelector("#pm-pr"), N=5; let i=0, ok=0, q=null, step=0;
    function next(){
      if(i>=N){ box.innerHTML=`<div class="score ${ok>=4?"ok":ok>=3?"mid":"bad"}"><div class="big">${ok}/${N}</div><div>ตอบถูก</div></div><div class="tools"><button class="primary" id="pr-again">ฝึกอีกชุด</button></div>`;
        window.Score&&Score.record({key:"pm:"+id, mod:"8-ทดสอบหลังซ่อม", item:"ฝึกตัดสินผล: "+D.find(x=>x.id===id).n, score:ok, max:N});
        box.querySelector("#pr-again").onclick=()=>practice(id); return; }
      q=GEN[id](); step=q.num?0:1; draw();
    }
    function draw(fb){
      box.innerHTML=`<div class="kicker">ข้อ ${i+1} / ${N}</div><p class="pq">${esc(q.q)}</p>
        ${q.num?`<label class="nlab">${esc(q.num.label)}<input id="pr-n" type="number" step="0.01" inputmode="decimal" ${step>0?"disabled":""}></label>`:""}
        ${step===0?`<div class="tools"><button class="primary" id="pr-c">ตรวจตัวเลข</button></div>`:
          `<div class="tools"><button class="pf" data-v="1">✓ ผ่าน</button><button class="pf" data-v="0">✗ ไม่ผ่าน</button></div>`}
        <div id="pr-fb">${fb||""}</div>`;
      const c=box.querySelector("#pr-c");
      if(c) c.onclick=()=>{ const v=parseFloat(box.querySelector("#pr-n").value);
        if(isNaN(v)){ box.querySelector("#pr-fb").innerHTML=`<div class="msg bad">กรอกตัวเลขก่อน</div>`; return; }
        q.numOk=Math.abs(v-q.num.ans)<=q.num.tol; step=1;
        draw(`<div class="msg ${q.numOk?"ok":"bad"}">${q.numOk?"ตัวเลขถูกต้อง":"ยังไม่ถูก คำตอบคือ "+q.num.ans} · ต่อไปตัดสินว่าผ่านหรือไม่</div>`);
        box.querySelector("#pr-n").value=v; };
      box.querySelectorAll(".pf").forEach(b=>b.onclick=()=>{
        const good=(b.dataset.v==="1")===q.pass && (q.num?q.numOk:true);
        if(good) ok++;
        box.querySelectorAll(".pf").forEach(x=>x.disabled=true);
        box.querySelector("#pr-fb").innerHTML=`<div class="fb ${good?"good":"bad"}"><b>${good?"✓ ถูกต้อง":"✗ ยังไม่ถูก"}</b><p>${esc(q.ex)}</p><button class="primary" id="pr-nx">${i+1<N?"ข้อต่อไป →":"ดูผล"}</button></div>`;
        box.querySelector("#pr-nx").onclick=()=>{i++;next();};
      });
    }
    next();
  }

  /* ---------- เครื่องคำนวณ ---------- */
  function calc(id){
    if(id==="probe") return `<div class="calc"><h3>ตัวช่วยแยกหัววัดกับวงจร</h3>
      <div class="cgrid"><label>อ้างอิงในอ่างน้ำ (°C)<input id="c-r" type="number" value="37.0" step="0.1" inputmode="decimal"></label>
      <label>เครื่องอ่าน (อ่างน้ำ)<input id="c-v" type="number" value="36.1" step="0.1" inputmode="decimal"></label>
      <label>ตัวจำลอง (°C)<input id="c-s" type="number" value="37.0" step="0.1" inputmode="decimal"></label>
      <label>เครื่องอ่าน (ตัวจำลอง)<input id="c-sv" type="number" value="37.0" step="0.1" inputmode="decimal"></label></div><div id="c-o" class="cout"></div></div>`;
    if(id==="bed") return `<div class="calc"><h3>เครื่องตัดสินผลอุณหภูมิบนเตียง</h3>
      <div class="cgrid">${["กลาง","มุม 1","มุม 2","มุม 3","มุม 4"].map((n,i)=>`<label>${n}<input class="c-b" type="number" value="${[37.2,36.1,35.8,36.0,36.3][i]}" step="0.1" inputmode="decimal"></label>`).join("")}</div><div id="c-o" class="cout"></div></div>`;
    return "";
  }
  function bindCalc(id){
    const $=s=>root.querySelector(s), o=$("#c-o"); if(!o) return;
    const run=()=>{
      if(id==="probe"){ const db=r1(+$("#c-v").value - +$("#c-r").value), ds=r1(+$("#c-sv").value - +$("#c-s").value), pb=Math.abs(db)<=0.3, ps=Math.abs(ds)<=0.2;
        const w=pb&&ps?"ผ่านทั้งหัววัดและวงจร":!ps?"วงจรอ่านในเครื่องเพี้ยน (ตัวจำลองก็ผิด)":"หัววัดเพี้ยน (ตัวจำลองถูก)";
        o.innerHTML=`อ่างน้ำ <b>${db>0?"+":""}${db.toFixed(1)} °C</b> · ตัวจำลอง <b>${ds>0?"+":""}${ds.toFixed(1)} °C</b> <span class="pfb ${pb&&ps?"ok":"bad"}">${pb&&ps?"ผ่าน":"ไม่ผ่าน"}</span> ${w}`; }
      if(id==="bed"){ const v=[...root.querySelectorAll(".c-b")].map(x=>+x.value), mid=v[0], d=r1(Math.max(...v)-Math.min(...v)), okm=mid>=34&&mid<=39, okd=d<=2;
        o.innerHTML=`กลาง ${mid.toFixed(1)} °C ${okm?"✓":"✗"} · ต่างกัน <b>${d.toFixed(1)} °C</b> ${okd?"✓":"✗"} <span class="pfb ${okm&&okd?"ok":"bad"}">${okm&&okd?"ผ่าน":"ไม่ผ่าน"}</span>`; }
    };
    root.querySelectorAll(".calc input").forEach(i=>i.addEventListener("input",run)); run();
  }

  /* ---------- แบบบันทึกผล PM ---------- */
  function form(){
    return `<details class="grp"><summary>แบบบันทึกผลการทดสอบ (คัดลอกไปใช้ได้)</summary><div class="acts" style="display:block">
      <div class="cgrid"><label>เลขครุภัณฑ์<input id="f-id"></label><label>ยี่ห้อ/รุ่น<input id="f-md"></label><label>หน่วยงาน<input id="f-w"></label><label>ผู้ทดสอบ<input id="f-by"></label></div>
      ${D.map(t=>`<label class="fchk"><span>${esc(t.n)}</span><select data-t="${t.id}"><option value="">ไม่ได้ทำ</option><option>ผ่าน</option><option>ไม่ผ่าน</option></select><input data-v="${t.id}" placeholder="ค่าที่วัดได้"></label>`).join("")}
      <div class="tools"><button class="primary" id="f-cp">สร้างข้อความบันทึก</button></div><div id="f-o"></div></div></details>`;
  }
  function bindForm(){
    const b=root.querySelector("#f-cp"); if(!b) return;
    b.onclick=async()=>{
      const v=s=>root.querySelector(s).value.trim();
      const rows=D.map(t=>{const r=root.querySelector(`[data-t="${t.id}"]`).value, m=root.querySelector(`[data-v="${t.id}"]`).value.trim(); return r?`- ${t.n}: ${r}${m?" ("+m+")":""}`:null;}).filter(Boolean);
      const all=rows.length&&rows.every(r=>r.includes(": ผ่าน"));
      const txt=`บันทึกการทดสอบเครื่องอุ่นทารกแบบแผ่รังสี (Infant radiant warmer)\nวันที่: ${new Date().toLocaleDateString("th-TH")}\nเลขครุภัณฑ์: ${v("#f-id")||"-"} · รุ่น: ${v("#f-md")||"-"} · หน่วยงาน: ${v("#f-w")||"-"}\n${rows.join("\n")||"- ยังไม่ได้เลือกผล"}\nสรุป: ${all?"ผ่าน พร้อมใช้งาน":"ไม่ผ่าน/ไม่ครบ ห้ามใช้งาน"}\nผู้ทดสอบ: ${v("#f-by")||"-"}`;
      const ta=document.createElement("textarea"); ta.className="copybox"; ta.value=txt; root.querySelector("#f-o").replaceChildren(ta);
      try{ await navigator.clipboard.writeText(txt); b.textContent="คัดลอกแล้ว ✓"; }catch(e){ ta.select(); }
    };
  }

  function render(){
    const t=D.find(x=>x.id===cur);
    root.innerHTML=`<h1>โมดูล 8 · การทดสอบหลังซ่อม</h1>
      <p class="muted">ทุกงานซ่อมต้องจบด้วยการทดสอบที่ตรงกับสิ่งที่ซ่อม ก่อนส่งเครื่องกลับไปใช้กับผู้ป่วย เลือกหัวข้อการทดสอบ อ่านวิธีและเกณฑ์ แล้วฝึกตัดสินผลทางขวา (ฝึกได้ไม่จำกัด ไม่นับคะแนนผ่าน) จากนั้นไปแท็บ “ลำดับขั้นตอนงาน”</p>
      <div class="chips pmtabs">${D.map(x=>`<button data-id="${x.id}" class="${x.id===cur?"on":""}">${esc(x.n)}</button>`).join("")}</div>
      <div class="pmgrid">
        <div>
          <h2>${esc(t.th)}</h2><p>${esc(t.why)}</p>
          <h3>อุปกรณ์</h3><ul>${t.tools.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
          <h3>ขั้นตอน</h3><ol>${t.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>
          ${t.limits?`<h3>${esc(t.limTitle||"เกณฑ์")}</h3><table class="lim">${t.limits.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</table>`:""}
          <div class="formula">${esc(t.formula).replace(/\n/g,"<br>")}</div>
          <h3>ข้อควรระวัง</h3><ul>${t.tips.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
          ${calc(cur)}
        </div>
        <aside class="logbox"><h2>ฝึกตัดสินผล</h2><div id="pm-pr"></div></aside>
      </div>
      ${form()}`;
    root.querySelectorAll(".pmtabs button").forEach(b=>b.onclick=()=>{cur=b.dataset.id;render();});
    bindCalc(cur); bindForm(); practice(cur);
  }

  window.Views=window.Views||{}; window.Views.pm={show:()=>{ if(!root.innerHTML) render(); }};
})();

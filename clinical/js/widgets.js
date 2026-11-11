/* ===== วิดเจ็ตในบทเรียนวิชาคลินิกเครื่องอุ่นทารกและเครื่องส่องไฟ =====
   ใช้ <div data-w="ชื่อ"></div> ในเนื้อหาบท  clin.js จะเรียก Widgets[ชื่อ](el) เมื่อเปิดบท
   wflow : ภาพเครื่องอุ่นทารก กดดูการทำงานทีละสถานะ (บทที่ 1)
   pflow : ภาพเครื่องส่องไฟ กดดูการทำงานทีละสถานะ (บทที่ 1)
   heat  : ทารกเสียความร้อน 4 ทาง และผลของเครื่องอุ่น (บทที่ 2)
   modes : เปรียบเทียบโหมด Servo กับ Manual และเมื่อหัววัดหลุด (บทที่ 4)
   probe : เลือกตำแหน่งติดหัววัดผิว แล้วดูว่าเครื่องอ่านค่าอย่างไร (บทที่ 5)
   photo : จัดทารกใต้เครื่องส่องไฟ ระยะ ผิวที่เปิด และการปิดตา (บทที่ 7)
   ตัวเลขในวิดเจ็ตเป็นตัวอย่างเพื่อการเรียนรู้ ไม่ใช่ค่าจากผู้ป่วยจริง */
(function(){
  const W={};
  const esc = s => String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  let n=0;

  /* ---------- 0) ภาพรวมการทำงาน: กดดูทีละสถานะ ---------- */
  function flow(el, DIA, ST, first){
    const id="cw"+(++n);
    el.innerHTML=`<div class="wbox"><div class="chips">${ST.map((s,i)=>`<button data-i="${i}">${esc(s[0])}</button>`).join("")}</div>
      <figure class="wfig wflow">${DIA?DIA.svg({id}):""}</figure><p class="wtxt" data-t></p></div>`;
    const svg=el.querySelector("svg"), t=el.querySelector("[data-t]");
    const go=i=>{ el.querySelectorAll("[data-i]").forEach(b=>b.classList.toggle("primary",+b.dataset.i===i)); if(svg) DIA.state(svg, ST[i][1]); t.textContent=ST[i][2]; };
    el.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>go(+b.dataset.i)); go(first||0);
  }
  W.wflow = el=>flow(el, window.WMDIA, [
    ["ปิดเครื่อง", {off:true, baby:false}, "เครื่องดับ ฮีตเตอร์ไม่ทำงาน ที่นอนเย็น ยังไม่พร้อมรับทารก"],
    ["Prewarm รอรับทารก", {mode:"pre", heat:25, skin:null, probe:"nc", baby:false, hi:"heater"}, "ฮีตเตอร์จ่ายความร้อนระดับต่ำคงที่ อุ่นที่นอนและผ้าล่วงหน้า ใช้กับเตียงว่างเท่านั้น"],
    ["วางทารก ติดหัววัด", {mode:"baby", heat:100, skin:35.8, set:36.5, probe:"ok", hi:"probe"}, "ติดหัววัดที่ผิวและปิดแผ่นสะท้อน เปลี่ยนเป็นโหมด Servo ตั้ง 36.5 °C ผิวยังต่ำกว่าค่าที่ตั้ง เครื่องจึงจ่ายความร้อนเต็มที่"],
    ["ถึงค่าที่ตั้ง", {mode:"baby", heat:22, skin:36.5, set:36.5, probe:"ok", hi:"panel"}, "ผิวถึงค่าที่ตั้ง แผงควบคุมลดกำลังฮีตเตอร์เหลือพอรักษาระดับ และปรับขึ้นลงเองตลอดเวลา"],
    ["หัววัดหลุด", {mode:"baby", heat:100, skin:34.0, set:36.5, probe:"off", alarm:"PROBE", hi:"probe"}, "หัววัดหลุดจากผิว อ่านอุณหภูมิอากาศซึ่งต่ำกว่า เครื่องเข้าใจว่าทารกเย็นและเร่งความร้อน พร้อมเสียงเตือน ทารกจริงเสี่ยงร้อนเกิน"],
    ["Manual", {mode:"man", heat:60, skin:36.9, probe:"ok", alarm:"CHECK BABY", hi:"panel"}, "ฮีตเตอร์จ่ายกำลังคงที่ตามที่ตั้ง ไม่สนใจอุณหภูมิผิว เครื่องเตือนให้ตรวจทารกเป็นระยะ ใช้ระยะสั้นและต้องมีคนเฝ้า"]
  ], 2);
  W.pflow = el=>flow(el, window.PHDIA, [
    ["ปิดเครื่อง", {off:true}, "เครื่องดับ ไม่มีแสง พัดลมหยุด"],
    ["เปิด HIGH ระยะตามคู่มือ", {lvl:"hi", dist:30, rad:36.0, hi:"led"}, "แผง LED ปล่อยแสงฟ้า-เขียว ผ่านฝาครอบลงผิวทารก พัดลมหมุนระบายความร้อน เครื่องวัดแสงของช่างอ่านได้ราว 36 µW/cm²/nm (ค่าตัวอย่าง)"],
    ["เลือก LOW", {lvl:"lo", dist:30, rad:18.0, hi:"panel"}, "ความเข้มแสงลดลงราวครึ่งหนึ่ง ใช้ตามคำสั่งการรักษา"],
    ["ยกโคมสูง", {lvl:"hi", dist:55, rad:15.2, hi:"arm"}, "แสงกระจายกว้างขึ้นแต่ความเข้มที่ถึงผิวลดลงมาก ทั้งที่ตาเห็นว่ายังสว่าง"],
    ["ผ้าพาดบนโคม", {lvl:"hi", dist:30, cloth:true, rad:5.4, hot:true, hi:"fan"}, "ผ้าบังแสงและปิดช่องระบายความร้อน แสงที่ถึงผิวลดลง และเครื่องอาจร้อนจนดับเอง"],
    ["LED ดับหนึ่งแถว", {lvl:"hi", dist:30, dark:true, alarm:"LED FAULT", rad:15.8, hi:"led"}, "เกิดแถบมืดบนตัวทารก ต้องย้ายไปเครื่องสำรองและแจ้งช่าง"]
  ], 1);

  /* ---------- 1) เสียความร้อน 4 ทาง ---------- */
  W.heat = el=>{
    const T=[
      ["การแผ่รังสี (radiation)","ความร้อนแผ่จากผิวทารกไปยังวัตถุที่เย็นกว่าที่อยู่ห่างออกไป เช่น ผนัง หน้าต่าง โดยไม่ต้องสัมผัส","เครื่องอุ่นทารกแก้ทางนี้โดยตรง: แผ่รังสีความร้อนกลับลงมาที่ผิว ต้องไม่มีอะไรบังระหว่างฮีตเตอร์กับทารก"],
      ["การพาความร้อน (convection)","อากาศเย็นหรือลมพัดผ่านผิวพาความร้อนออกไป เช่น ลมแอร์ พัดลม ประตูเปิด","เตียงเปิดด้านบน ลมในห้องยังพาความร้อนออกได้ ปิดประตู หน้าต่าง และไม่ตั้งเตียงใต้ช่องแอร์"],
      ["การระเหย (evaporation)","น้ำบนผิวระเหยพาความร้อนไป มากที่สุดตอนแรกคลอดตัวเปียก หลังอาบน้ำ หรือผ้าอ้อมเปียก","ใต้เครื่องอุ่น การเสียน้ำทางผิวหนังเพิ่มขึ้น เช็ดตัวให้แห้งทันที และเฝ้าระวังน้ำในทารกที่อยู่นาน"],
      ["การนำความร้อน (conduction)","ผิวสัมผัสพื้นผิวที่เย็นกว่า เช่น ที่นอนเย็น ตาชั่ง ผ้าเย็น มือเย็น","อุ่นที่นอนล่วงหน้า (Prewarm) อุ่นผ้า และอุ่นสิ่งที่จะสัมผัสทารก"]];
    el.innerHTML=`<div class="wbox"><div class="chips">${T.map((x,i)=>`<button data-i="${i}">${esc(x[0])}</button>`).join("")}</div><div data-t></div></div>`;
    const t=el.querySelector("[data-t]");
    const go=i=>{ el.querySelectorAll("[data-i]").forEach(b=>b.classList.toggle("primary",+b.dataset.i===i));
      t.innerHTML=`<p class="wtxt"><b>${esc(T[i][0])}</b> ${esc(T[i][1])}</p><div class="tip">${esc(T[i][2])}</div>`; };
    el.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>go(+b.dataset.i)); go(0);
  };

  /* ---------- 2) Servo กับ Manual ---------- */
  W.modes = el=>{
    const id="cw"+(++n);
    let mode="baby", probe="ok", skin=35.6, ax=36.0, t=0, timer=null; const SET=36.5;
    el.innerHTML=`<div class="wbox"><div class="tools"><span class="seg" data-m><button data-v="baby">Servo (Baby)</button><button data-v="man">Manual 60%</button></span>
      <button data-p>หัววัดหลุดจากผิว</button><button data-r>เริ่มใหม่</button></div>
      <div class="wgrid"><figure class="wfig">${window.WMDIA?WMDIA.svg({id, labels:false}):""}</figure><div><div class="vitals"><span>เวลา <span class="spo2" data-tm>0</span> นาที</span><span>รักแร้ <span class="spo2" data-ax></span> °C</span></div><div data-msg></div></div></div></div>`;
    const svg=el.querySelector("svg"), $=s=>el.querySelector(s);
    function tick(){
      t+=5;
      const read = probe==="ok" ? skin : 33.0;            // หัวหลุด: อ่านอุณหภูมิอากาศ (ต่ำกว่าผิว)
      let heat = mode==="man" ? 60 : Math.max(0, Math.min(100, (SET-read)*120+18));
      skin += (heat-22)*0.004; skin=Math.max(34.5, Math.min(39.5, skin)); ax = skin+0.3;
      draw(heat, read);
      if(t>=120) stop();
    }
    function draw(heat, read){
      if(svg) WMDIA.state(svg,{mode, heat:Math.round(heat), skin:+read.toFixed(1), set:mode==="baby"?SET:undefined, probe, alarm:ax>=37.6?"HIGH TEMP":(mode==="man"&&t>=15?"CHECK BABY":"")});
      $("[data-tm]").textContent=t; $("[data-ax]").textContent=ax.toFixed(1);
      $("[data-m]").querySelectorAll("button").forEach(b=>b.classList.toggle("primary",b.dataset.v===mode));
      $("[data-p]").classList.toggle("primary",probe==="off");
      const m=$("[data-msg]");
      m.innerHTML= probe==="off" ? `<div class="msg bad">หัววัดหลุด เครื่องอ่านอุณหภูมิอากาศซึ่งต่ำกว่าผิว จึงเข้าใจว่าทารกเย็นและเร่งความร้อน ทารกจริงร้อนขึ้นเรื่อยๆ ต้องติดหัววัดกลับและวัดอุณหภูมิรักแร้</div>`
        : mode==="man" ? `<div class="msg bad">โหมด Manual จ่ายความร้อนคงที่ ไม่สนใจอุณหภูมิผิว ถ้าไม่มีคนเฝ้าและวัดอุณหภูมิ ทารกร้อนเกินได้ เครื่องหลายรุ่นเตือนให้ตรวจทารกทุก 15 นาที</div>`
        : `<div class="msg ok">โหมด Servo ปรับความร้อนเองตามอุณหภูมิผิวที่หัววัดอ่านได้ เมื่อผิวถึง ${SET} °C ความร้อนลดลงเหลือพอรักษาระดับ</div>`;
    }
    function stop(){ clearInterval(timer); timer=null; }
    function reset(){ stop(); skin=35.6; ax=36.0; t=0; draw(mode==="man"?60:100, probe==="ok"?skin:33); timer=setInterval(tick, 400); }
    $("[data-m]").querySelectorAll("button").forEach(b=>b.onclick=()=>{ mode=b.dataset.v; reset(); });
    $("[data-p]").onclick=()=>{ probe=probe==="ok"?"off":"ok"; if(!timer) reset(); else draw(mode==="man"?60:50, probe==="ok"?skin:33); };
    $("[data-r]").onclick=()=>{ probe="ok"; reset(); };
    reset();
  };

  /* ---------- 3) ตำแหน่งหัววัดผิว ---------- */
  W.probe = el=>{
    const id="cw"+(++n);
    const P=[
      ["ท้องด้านขวาบน (เหนือตับ) ปิดแผ่นสะท้อน", 36.5, true, "ตำแหน่งที่แนวทางหลายแห่งแนะนำเมื่อทารกนอนหงาย ผิวเรียบ ไม่ใช่กระดูก หันหาฮีตเตอร์ แผ่นสะท้อนกันไม่ให้รังสีจากฮีตเตอร์ทำให้หัววัดร้อนเอง"],
      ["ทารกนอนทับหัววัด", 37.4, false, "ผิวที่ถูกกดและไม่โดนรังสีอ่านได้สูงกว่าผิวส่วนอื่น เครื่องลดความร้อน ทารกส่วนที่เหลือเย็นลง"],
      ["อยู่ใต้ผ้าอ้อมหรือผ้าห่ม", 37.3, false, "ผ้าเก็บความร้อนที่หัววัด อ่านได้สูงเกินจริง เครื่องลดความร้อน ทารกเย็นลง"],
      ["ไม่มีแผ่นสะท้อนปิด", 37.6, false, "รังสีจากฮีตเตอร์ส่องหัววัดตรง หัววัดร้อนกว่าผิว เครื่องลดความร้อน ทารกอาจเย็นลง"],
      ["ติดหลวม ปลายหัววัดยกจากผิว", 34.2, false, "หัววัดอ่านอุณหภูมิอากาศซึ่งต่ำกว่าผิว เครื่องเร่งความร้อนเต็มที่ ทารกเสี่ยงร้อนเกิน"]];
    el.innerHTML=`<div class="wbox"><div class="lopts">${P.map((p,i)=>`<button class="lopt" data-i="${i}">${esc(p[0])}</button>`).join("")}</div>
      <div class="wgrid"><figure class="wfig">${window.WMDIA?WMDIA.svg({id, labels:false}):""}</figure><div data-m></div></div></div>`;
    const svg=el.querySelector("svg"), m=el.querySelector("[data-m]");
    const go=i=>{ const p=P[i], heat=Math.max(0,Math.min(100,(36.5-p[1])*120+18));
      el.querySelectorAll("[data-i]").forEach(b=>b.classList.toggle("picked",+b.dataset.i===i));
      if(svg) WMDIA.state(svg,{mode:"baby", set:36.5, skin:p[1], heat:Math.round(heat), probe:i===4?"off":"ok", hi:"probe"});
      m.innerHTML=`<div class="msg ${p[2]?"ok":"bad"}">จออ่านได้ ${p[1].toFixed(1)} °C · กำลังฮีตเตอร์ ${Math.round(heat)}%<br>${esc(p[3])}</div>`; };
    el.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>go(+b.dataset.i)); go(0);
  };

  /* ---------- 4) จัดทารกใต้เครื่องส่องไฟ ---------- */
  W.photo = el=>{
    const id="cw"+(++n);
    const st={d:30, cloth:false, blanket:true, mask:false, nappy:"big"};
    el.innerHTML=`<div class="wbox"><div class="wgrid"><figure class="wfig">${window.PHDIA?PHDIA.svg({id, labels:false}):""}</figure>
      <div><label class="small">ระยะโคมถึงผิวทารก: <b data-dv></b><input type="range" min="20" max="60" step="5" data-d style="width:100%"></label>
      <div class="chips"><button data-k="blanket">ผ้าห่มคลุมตัว</button><button data-k="nappy">ผ้าอ้อมใหญ่</button><button data-k="mask">ปิดตา</button><button data-k="cloth">ผ้าพาดบนโคม</button></div>
      <div data-m></div></div></div></div>`;
    const svg=el.querySelector("svg"), $=s=>el.querySelector(s);
    $("[data-d]").value=st.d;
    /* ผ้าห่มและผ้าอ้อมบนภาพ (เพิ่มเฉพาะในวิดเจ็ตนี้) */
    if(svg){ const NS="http://www.w3.org/2000/svg", g=svg.querySelector(".ph-baby");
      const bl=document.createElementNS(NS,"path"); bl.setAttribute("d","M150 175 q30 -6 52 2 l2 16 q-28 6 -54 0z"); bl.setAttribute("class","w-blanket"); bl.setAttribute("style","fill:#c9b8e8;stroke:currentColor;stroke-width:1;opacity:.95");
      g.appendChild(bl); }
    const draw=()=>{
      const e=PHDIA.irr({lvl:"hi", dist:st.d, cloth:st.cloth}), exp=Math.round(100-(st.blanket?45:0)-(st.nappy==="big"?18:7));
      if(svg){ PHDIA.state(svg,{lvl:"hi", dist:st.d, cloth:st.cloth, rad:e});
        svg.querySelector(".ph-mask").style.display=st.mask?"":"none";
        svg.querySelector(".w-blanket").style.display=st.blanket?"":"none";
        const np=svg.querySelector(".ph-nap"); np.setAttribute("width", st.nappy==="big"?28:18); np.setAttribute("x", st.nappy==="big"?158:164); }
      $("[data-dv]").textContent=st.d+" cm";
      el.querySelectorAll("[data-k]").forEach(b=>{ const k=b.dataset.k; b.classList.toggle("primary", k==="nappy"?st.nappy==="big":st[k]); });
      const bad=[]; if(!st.mask) bad.push("ยังไม่ได้ปิดตาทารก ต้องปิดตาทุกครั้งที่ส่องไฟ");
      if(st.blanket) bad.push("ผ้าห่มบังผิว แสงไม่ถึงผิวส่วนนั้น");
      if(st.nappy==="big") bad.push("ผ้าอ้อมใหญ่เกิน ใช้เท่าที่จำเป็นเพื่อเปิดผิวให้มากที่สุด");
      if(st.cloth) bad.push("ผ้าบนโคมบังแสงและปิดช่องระบายความร้อน เอาออกทันที");
      if(st.d!==30) bad.push(`โคมไม่อยู่ที่ระยะตามคู่มือ (เครื่องตัวอย่าง 30 cm)`);
      $("[data-m]").innerHTML=`<table class="ltbl"><tr><td>ความเข้มแสงกลางเตียง (ค่าตัวอย่าง)</td><td><b>${e.toFixed(1)}</b> µW/cm²/nm</td></tr><tr><td>ผิวที่เปิดรับแสงโดยประมาณ</td><td><b>${exp}%</b></td></tr></table>
        ${bad.length?`<div class="msg bad">${bad.map(esc).join("<br>")}</div>`:`<div class="msg ok">พร้อมแล้ว: ระยะตามคู่มือ เปิดผิวให้มากที่สุด ปิดตา ไม่มีอะไรบังแสง</div>`}`;
    };
    $("[data-d]").oninput=e=>{ st.d=+e.target.value; draw(); };
    el.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{ const k=b.dataset.k; if(k==="nappy") st.nappy=st.nappy==="big"?"small":"big"; else st[k]=!st[k]; draw(); });
    draw();
  };

  window.Widgets = W;
})();

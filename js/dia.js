/* ===== ภาพเครื่องอุ่นทารกแบบแผ่รังสีจำลอง (ใช้ร่วมกันทุกโมดูล) =====
   WMDIA.svg({id, cls, labels})  คืน SVG ชิ้นส่วนอยู่ใน <g class="part" data-id="…">
   WMDIA.state(svg, v)            ตั้งสถานะภาพ
     off:true        เครื่องดับทั้งหมด
     mode:"pre"|"man"|"baby"   โหมด Prewarm / Manual / Baby (servo)
     heat:0–100      กำลังฮีตเตอร์ (%)  แสดงที่แถบบนจอ ความสว่างฮีตเตอร์ และรังสีความร้อน
     dead:true       ฮีตเตอร์ขาด: จอสั่งจ่ายกำลังแต่ไส้ไม่แดงและไม่มีรังสี
     skin:ตัวเลข|null  อุณหภูมิผิวที่จอแสดง (null = "--.-")   set:ตัวเลข  อุณหภูมิที่ตั้ง (โหมด Baby)
     alarm:"ข้อความ"  สัญญาณเตือนบนจอ (ไฟแดงกะพริบ)   silence:true  กดเงียบเสียงแล้ว (ไฟเหลือง)
     probe:"ok"|"off"|"nc"  หัววัดติดผิวทารก / หลุดจากผิว / ไม่ได้เสียบสาย   baby:false ไม่มีทารกบนเตียง
     lamp:true       ไฟส่องตรวจเปิด    tilt:องศา  เตียงเอียง (−12 ถึง 12)   batt:0–100 แบตเตอรี่สำรองของสัญญาณเตือน
     hot:true        แผ่นสะท้อนหรือตัวเครื่องร้อนผิดปกติ  hi:"id" หรือ ["id",…]  เน้นชิ้นส่วน
   ชิ้นส่วน: heater reflector lamp panel probe bed tilt board power battery */
(function(){
  const MODE = {pre:"PREWARM", man:"MANUAL", baby:"BABY"};
  function svg(o){
    o=o||{};
    const L=o.labels!==false, id=o.id?` id="${o.id}"`:"";
    const t=(x,y,s,a)=>L?`<text class="lbl s" x="${x}" y="${y}"${a?` text-anchor="${a}"`:""}>${s}</text>`:"";
    let rays="";
    for(let i=0;i<7;i++){ const x1=86+i*24, x2=74+i*28; rays+=`<line x1="${x1}" y1="56" x2="${x2}" y2="166"/>`; }
    return `<svg${id} class="dia sx wm ${o.cls||""}" viewBox="0 0 360 300" role="img" aria-label="ภาพเครื่องอุ่นทารกแบบแผ่รังสีจำลอง: หัวฮีตเตอร์ด้านบนมีไส้ฮีตเตอร์ แผ่นสะท้อน และไฟส่องตรวจ แผ่รังสีความร้อนลงเตียงทารก เสาด้านขวามีแผงควบคุมและจอ หัววัดอุณหภูมิผิวติดที่ท้องทารกต่อสายเข้าแผง ใต้เตียงมีกลไกปรับเอียง ในฐานมีแผงวงจร ชุดจ่ายไฟ ฟิวส์ และแบตเตอรี่สำรองของสัญญาณเตือน">
  <!-- เสาและแขน -->
  <rect class="wm-col" x="262" y="22" width="16" height="250" rx="4"/>
  <rect class="wm-col" x="238" y="22" width="40" height="12" rx="4"/>
  <!-- หัวฮีตเตอร์ -->
  <rect class="wm-head" x="56" y="14" width="190" height="42" rx="12"/>
  <g class="part" data-id="reflector">
    <rect class="hit" x="70" y="16" width="160" height="30" rx="6"/>
    <path class="wm-refl" d="M78 44 Q150 10 222 44"/>
    ${t(150,12,"แผ่นสะท้อน","middle")}
  </g>
  <g class="part" data-id="heater">
    <rect class="hit" x="84" y="36" width="134" height="18" rx="6"/>
    <rect class="wm-elem" x="92" y="41" width="118" height="7" rx="3.5"/>
    <rect class="wm-glow" x="92" y="41" width="118" height="7" rx="3.5"/>
    ${t(150,68,"ไส้ฮีตเตอร์ (ควอตซ์)","middle")}
  </g>
  <g class="part" data-id="lamp">
    <rect class="hit" x="58" y="18" width="26" height="34" rx="6"/>
    <circle class="wm-lamp" cx="70" cy="40" r="7"/>
    ${t(46,40,"ไฟส่อง","end")}
  </g>
  <g class="wm-rays">${rays}</g>
  <!-- เตียงและทารก -->
  <g class="wm-tiltg">
  <g class="part" data-id="bed">
    <rect class="hit" x="42" y="150" width="214" height="78" rx="8"/>
    <rect class="wm-side" x="48" y="160" width="200" height="40" rx="4"/>
    <rect class="wm-tray" x="48" y="196" width="200" height="16" rx="5"/>
    <rect class="wm-matt" x="54" y="188" width="188" height="10" rx="5"/>
    <g class="wm-baby"><ellipse cx="114" cy="178" rx="13" ry="11"/><ellipse cx="160" cy="180" rx="32" ry="12"/><path d="M190 176 q14 -2 22 4 M190 186 q14 2 22 -2"/></g>
    ${t(52,156,"เตียงและแผงกั้นข้าง")}
  </g>
  <g class="part" data-id="probe">
    <rect class="hit" x="146" y="160" width="28" height="22" rx="5"/>
    <path class="wm-pcab" d="M160 172 C 176 150, 230 150, 262 188"/>
    <circle class="wm-pdisc" cx="160" cy="172" r="4.5"/>
    ${t(196,150,"หัววัดอุณหภูมิผิว","middle")}
  </g>
  </g>
  <circle class="wm-jack" cx="262" cy="188" r="4"/>
  <g class="part" data-id="tilt">
    <rect class="hit" x="126" y="212" width="48" height="26" rx="5"/>
    <circle class="wm-pivot" cx="150" cy="218" r="5"/>
    <rect class="wm-tiltbar" x="132" y="222" width="36" height="9" rx="3"/>
  </g>
  <!-- แผงควบคุมและจอ -->
  <g class="part" data-id="panel">
    <rect class="hit" x="282" y="56" width="76" height="112" rx="8"/>
    <rect class="wm-pbox" x="286" y="60" width="68" height="104" rx="7"/>
    <rect class="wm-scr" x="291" y="66" width="58" height="62" rx="4"/>
    <text class="wm-mode" x="320" y="76" text-anchor="middle">BABY</text>
    <text class="wm-k" x="295" y="89">SKIN</text><text class="wm-skin" x="346" y="91" text-anchor="end">36.5</text>
    <text class="wm-k" x="295" y="104">SET</text><text class="wm-set" x="346" y="104" text-anchor="end">36.5</text>
    <rect class="wm-barb" x="295" y="110" width="50" height="6" rx="2"/><rect class="wm-bar" x="295" y="110" width="0" height="6" rx="2"/>
    <text class="wm-alm" x="320" y="124" text-anchor="middle"></text>
    <circle class="wm-led r" cx="296" cy="138" r="4"/><circle class="wm-led y" cx="308" cy="138" r="4"/><circle class="wm-led g" cx="320" cy="138" r="4"/>
    <rect class="wm-key" x="330" y="133" width="18" height="10" rx="3"/>
    ${t(320,178,"แผงควบคุม","middle")}
  </g>
  <!-- ฐานเครื่อง -->
  <rect class="wm-cab" x="56" y="238" width="236" height="36" rx="8"/>
  <g class="part" data-id="board">
    <rect class="hit" x="60" y="240" width="70" height="32" rx="5"/>
    <rect class="wm-brd" x="64" y="244" width="62" height="24" rx="4"/>
    <rect class="wm-chip" x="80" y="250" width="22" height="11" rx="2"/>
    ${t(95,288,"แผงวงจรควบคุม","middle")}
  </g>
  <g class="part" data-id="power">
    <rect class="hit" x="134" y="240" width="80" height="32" rx="5"/>
    <rect class="wm-psu" x="138" y="244" width="46" height="24" rx="4"/>
    <rect class="wm-fuse" x="190" y="246" width="18" height="8" rx="3"/><rect class="wm-fuse" x="190" y="258" width="18" height="8" rx="3"/>
    <path class="wm-cord" d="M292 262 H318 q10 0 10 10 v14"/>
    ${t(174,288,"ชุดจ่ายไฟ ฟิวส์","middle")}
  </g>
  <g class="part" data-id="battery">
    <rect class="hit" x="218" y="240" width="70" height="32" rx="5"/>
    <rect class="wm-bat" x="224" y="246" width="44" height="20" rx="3"/><rect class="wm-bl" x="227" y="249" width="38" height="14" rx="2"/>
    <rect class="wm-bt" x="268" y="252" width="4" height="8"/>
    ${t(250,288,"แบตสำรอง","middle")}
  </g>
  <rect class="wm-base" x="40" y="274" width="268" height="6" rx="3"/>
  <circle class="wm-wheel" cx="56" cy="288" r="6"/><circle class="wm-wheel" cx="292" cy="288" r="6"/>
</svg>`;
  }

  const fmt = v => v===null||v===undefined||isNaN(v) ? "--.-" : (+v).toFixed(1);
  /* ตัวเลขอุณหภูมิผิวค่อยๆ เปลี่ยน */
  function skinTo(svg, to, ms){
    const t=svg.querySelector(".wm-skin"); if(!t) return;
    cancelAnimationFrame(svg._raf);
    if(to===null||to===undefined){ t.textContent="--.-"; return; }
    const from=parseFloat(t.textContent); ms=ms||1400;
    if(isNaN(from)||Math.abs(from-to)>8){ t.textContent=fmt(to); return; }
    const t0=performance.now();
    (function tick(now){ const k=Math.min(1,(now-t0)/ms), e=1-Math.pow(1-k,3); t.textContent=fmt(from+(to-from)*e); if(k<1) svg._raf=requestAnimationFrame(tick); })(t0);
  }
  function state(svg, v){
    v=v||{};
    const on=(c,b)=>svg.classList.toggle(c,!!b), off=!!v.off;
    const mode=v.mode||"baby", heat=off?0:Math.max(0,Math.min(100, v.heat===undefined?(mode==="pre"?100:40):v.heat));
    on("off", off); on("dead", v.dead); on("lampon", v.lamp && !off); on("hot", v.hot);
    on("alarm", v.alarm && !off); on("sil", v.silence && v.alarm && !off);
    on("nobaby", v.baby===false); on("pr-off", v.probe==="off"); on("pr-nc", v.probe==="nc");
    svg.style.setProperty("--heat", (v.dead?0:heat/100).toFixed(2));
    const q=s=>svg.querySelector(s);
    const bar=q(".wm-bar"); if(bar) bar.setAttribute("width",(50*heat/100).toFixed(1));
    const md=q(".wm-mode"); if(md) md.textContent=off?"":(MODE[mode]||"");
    const st=q(".wm-set"), k2=svg.querySelectorAll(".wm-k")[1];
    if(st){ if(off) st.textContent=""; else if(mode==="baby"){ st.textContent=fmt(v.set===undefined?36.5:v.set); if(k2) k2.textContent="SET"; }
      else { st.textContent=Math.round(heat)+"%"; if(k2) k2.textContent="PWR"; } }
    const al=q(".wm-alm"); if(al) al.textContent=off?"":(v.alarm||"");
    if(off) skinTo(svg, null); else skinTo(svg, v.probe==="nc"?null:(v.skin===undefined?36.5:v.skin), v.sweep===false?1:undefined);
    const g=svg.querySelector(".wm-tiltg"); if(g) g.setAttribute("transform", `rotate(${(+v.tilt||0).toFixed(1)} 150 196)`);
    const bl=q(".wm-bl"); if(bl){ const lv=v.batt===undefined?100:v.batt; bl.setAttribute("width",(38*lv/100).toFixed(1)); bl.classList.toggle("lowb", lv<25); }
    const hi=[].concat(v.hi||[]);
    svg.querySelectorAll(".part").forEach(p=>p.classList.toggle("hl", hi.includes(p.dataset.id)));
  }
  window.WMDIA = {svg, state, skinTo};
})();

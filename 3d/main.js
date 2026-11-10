/* ===== เครื่องอุ่นทารกแบบแผ่รังสี 3 มิติ =====
   หน่วย = เซนติเมตร (ประมาณ) แกน Y ขึ้น ด้านหน้าเครื่องหันไป +Z
   ทุกชิ้นสร้างจากรูปทรงพื้นฐาน เป็นเครื่องจำลองทั่วไป ไม่ได้ใช้โมเดลของผู้ผลิต
   โครงหน้า (กล้อง ป้ายชื่อ แผงด้านขวา โหมดฝึก) ดัดแปลงจากหน้า 3D ของวิชาตู้อบ */
import * as THREE from "three";
import { OrbitControls } from "./lib/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "./lib/CSS2DRenderer.js";

const MODE = "tech";
const PARTS = Object.assign({}, window.PARTS || {}, window.EXTRA3D || {});
const GROUPS = window.GROUPS3D || [];
const NARROW = matchMedia("(max-width:900px), (orientation:portrait) and (max-width:1200px)");
const MOBILE = NARROW.matches;
const R = 76;   // รัศมีโดยประมาณของฉาก ใช้จัดกล้องให้พอดีจอ

/* ---------- renderer / scene ---------- */
const stage = document.getElementById("stage");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, MOBILE ? 1.5 : 2));
stage.prepend(renderer.domElement);
const labelR = new CSS2DRenderer();
labelR.domElement.className = "labels";
stage.appendChild(labelR.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 1000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.minDistance = 40; controls.maxDistance = 500;

scene.add(new THREE.HemisphereLight(0xffffff, 0x8a96a8, 1.5));
const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(60, 120, 90); scene.add(sun);
const fillL = new THREE.DirectionalLight(0xdfe8ff, 0.6); fillL.position.set(-80, 50, -60); scene.add(fillL);
{
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const g = c.getContext("2d"), gr = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  gr.addColorStop(0, "rgba(30,40,55,.32)"); gr.addColorStop(1, "rgba(30,40,55,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(150, 110), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.set(4, 0.05, 0); scene.add(m);
}

/* ---------- วัสดุ ---------- */
const mat = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, metalness: 0.05 }, o));
const M = {
  shell: mat(0xeef0f4), panel: mat(0xdfe7e6), dark: mat(0x3a4250), black: mat(0x1f242b), rubber: mat(0x2b3138, { roughness: 0.9 }),
  steel: mat(0xb8c0c9, { metalness: 0.7, roughness: 0.3 }), pcb: mat(0x1f7a46, { roughness: 0.6 }), chip: mat(0x22262c),
  refl: mat(0xdfe5ea, { metalness: 0.9, roughness: 0.15, side: THREE.DoubleSide }), quartz: new THREE.MeshStandardMaterial({ color: 0xf4eee6, transparent: true, opacity: 0.35, roughness: 0.1, depthWrite: false }),
  glow: new THREE.MeshStandardMaterial({ color: 0x8a5a44, emissive: 0xff5a1f, emissiveIntensity: 0, roughness: 0.4 }),
  guard: new THREE.MeshStandardMaterial({ color: 0x9aa4b0, wireframe: true }), lamp: mat(0xfff6c8, { emissive: 0x000000 }),
  matt: mat(0xcfe6ef, { roughness: 0.7 }), tray: mat(0xe6ebee),
  side: new THREE.MeshStandardMaterial({ color: 0xd6eeff, transparent: true, opacity: 0.25, roughness: 0.1, depthWrite: false, side: THREE.DoubleSide }),
  skin: mat(0xf3cfb3, { roughness: 0.8 }), probe: mat(0xe9e3d7), cable: mat(0x1f242b, { roughness: 0.7 }),
  screen: mat(0x14303a, { emissive: 0x0a2a30 }), led: mat(0x2fbf71, { emissive: 0x0a3a1e }), ledR: mat(0x7a3a3a),
  psu: mat(0x2b3138), fuse: mat(0xe9eef3, { metalness: 0.3 }), batt: mat(0x2b3a55), term: mat(0xc0392b), cover: mat(0xeef0f4), knob: mat(0x2b3138)
};

/* ---------- ตัวช่วยสร้างรูปทรง ---------- */
function box(w, h, d, m, x = 0, y = 0, z = 0, parent) { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); if (parent) parent.add(o); return o; }
function cyl(rt, rb, h, m, x = 0, y = 0, z = 0, parent, seg = 28) { const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); o.position.set(x, y, z); if (parent) parent.add(o); return o; }
function grp(parent, x = 0, y = 0, z = 0) { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; }
function tag(obj, id) { obj.traverse(o => { if (o.isMesh) o.userData.part = id; }); }
function tube(points, r, m, parent) {
  const c = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const o = new THREE.Mesh(new THREE.TubeGeometry(c, 40, r, 10, false), m); if (parent) parent.add(o); return o;
}
const nodes = [];
function reg(node, explode = [0, 0, 0]) {
  node.userData.base = { p: node.position.clone(), r: node.rotation.clone() };
  node.userData.ex = new THREE.Vector3(...explode); node.userData.fx = [];
  nodes.push(node); return node;
}
const partRoot = {}, labelAt = {};

/* ========== ฐานเครื่อง (x −30..30, y 4..22, z −22..22) ========== */
const dev = grp(scene);
const baseG = grp(dev); partRoot.cabinet = baseG;
box(64, 2, 50, M.dark, 0, 4, 0, baseG);                                     // โครงล่าง
[[-28, 21], [28, 21], [-28, -21], [28, -21]].forEach(([x, z]) => { cyl(3, 3, 2.6, M.rubber, x, 1.6, z, baseG).rotation.x = Math.PI / 2; });
box(58, 16, 1.2, M.shell, 0, 13, -21.4, baseG); box(1.2, 16, 44, M.shell, -28.4, 13, 0, baseG); box(1.2, 16, 44, M.shell, 28.4, 13, 0, baseG);
box(58, 1.2, 44, M.shell, 0, 21.4, 0, baseG);
tag(baseG, "cabinet");
/* ฝาฐานด้านหน้า (ถอดได้) */
const cabCoverG = reg(grp(dev), [0, 0, 14]);
const coverParts = [box(58, 16, 1.2, M.cover, 0, 13, 21.6, cabCoverG)];
[-20, -10, 0, 10, 20].forEach(x => box(5, 1, 0.4, M.dark, x, 9, 22.3, cabCoverG));
tag(cabCoverG, "cabinet"); labelAt.cabinet = [cabCoverG, [-20, 8, 23]];
const coverG = cabCoverG;
/* แผงวงจร ชุดจ่ายไฟ+ฟิวส์ แบตสำรอง ในฐาน */
const boardG = reg(grp(dev, -14, 12, 10), [-10, 0, 22]); partRoot.board = boardG;
box(20, 12, 1, M.pcb, 0, 0, 0, boardG); box(6, 4, 1.4, M.chip, -3, 1, 0.8, boardG); box(3, 3, 1.6, M.black, 5, -3, 0.8, boardG);
tag(boardG, "board"); labelAt.board = [boardG, [0, 9, 1]];
const pwrG = reg(grp(dev, 8, 11, 2), [0, 0, 26]); partRoot.power = pwrG;
box(14, 8, 12, M.psu, 0, 0, 0, pwrG);
[cyl(0.7, 0.7, 3.4, M.fuse, -3, 5, 6.4, pwrG), cyl(0.7, 0.7, 3.4, M.fuse, 3, 5, 6.4, pwrG)].forEach(f => f.rotation.z = Math.PI / 2);
tube([[0, -2, -6], [0, -2, -22], [6, -6, -30], [14, -10, -38]], 0.6, M.cable, pwrG);   // สายไฟออกด้านหลัง
tag(pwrG, "power"); labelAt.power = [pwrG, [0, 7, 4]];
const battG = reg(grp(dev, 21, 9, 8), [14, 0, 20]); partRoot.battery = battG;
box(8, 5, 5, M.batt, 0, 0, 0, battG); box(1.2, 0.8, 1.2, M.term, -2, 2.9, 0, battG);
tag(battG, "battery"); labelAt.battery = [battG, [0, 5, 2]];

/* ========== เตียง (หมุนรอบจุดหมุนใต้เตียง) ========== */
const tiltG = grp(dev, 0, 30, 0);
const pivotG = grp(dev, 0, 25, 0); partRoot.tilt = pivotG;
cyl(2.2, 2.2, 40, M.steel, 0, 0, 0, pivotG).rotation.x = Math.PI / 2;
box(10, 6, 6, M.dark, 0, -1, 0, pivotG); box(4, 2, 6, M.knob, 0, -2, 22, pivotG);
tag(pivotG, "tilt"); labelAt.tilt = [pivotG, [12, -2, 22]];
const bedG = grp(tiltG); partRoot.bed = bedG;
box(72, 4, 52, M.tray, 0, 0, 0, bedG);
box(66, 5, 46, M.matt, 0, 4.5, 0, bedG);
const sideF = reg(grp(bedG, 0, 2, 26), [0, 0, 10]); box(72, 13, 0.6, M.side, 0, 7, 0, sideF);
box(72, 13, 0.6, M.side, 0, 9, -26, bedG); box(0.6, 13, 52, M.side, -36, 9, 0, bedG); box(0.6, 13, 52, M.side, 36, 9, 0, bedG);
tag(bedG, "bed"); tag(sideF, "bed"); labelAt.bed = [bedG, [-30, 18, 20]];
/* ทารกจำลอง */
const babyG = grp(bedG, 0, 9, 0);
const bh = new THREE.Mesh(new THREE.SphereGeometry(5, 20, 14), M.skin); bh.position.set(-16, 1, 0); babyG.add(bh);
const bb = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), M.skin); bb.scale.set(11, 4, 7); bb.position.set(-1, 0, 0); babyG.add(bb);
[[12, 0.5, 3], [12, 0.5, -3]].forEach(p => { const l = cyl(1.4, 1.2, 9, M.skin, ...p, babyG); l.rotation.z = Math.PI / 2; });
/* หัววัดบนท้องทารก + สายไปแผงควบคุม */
const probeG = reg(grp(bedG, 0, 13.2, 1), [0, 10, 0]); partRoot.probe = probeG;
cyl(1.4, 1.4, 0.6, M.probe, 0, 0, 0, probeG);
tube([[0, 0.3, 0], [8, 2, 6], [20, 6, 12], [32, 14, 6], [37, 23, -10]], 0.3, M.cable, probeG);
tag(probeG, "probe"); labelAt.probe = [probeG, [2, 4, 0]];
tiltG.add(bedG);

/* ========== เสา แขน และแผงควบคุม ========== */
const colG = grp(dev); partRoot.column = colG;
box(7, 92, 7, M.shell, 46, 66, -16, colG);
tube([[46, 112, -16], [46, 120, -12], [38, 122, -4], [30, 118, 0]], 2.2, M.shell, colG);
box(8, 8, 8, M.dark, 46, 20, -16, colG);
tag(colG, "column"); labelAt.column = [colG, [46, 40, -12]];
const panelG = reg(grp(dev, 46, 76, -11), [16, 0, 10]); partRoot.panel = panelG;
box(22, 26, 4, M.shell, 0, 0, 0, panelG);
box(17, 11, 0.4, M.screen, 0, 4, 2.1, panelG);
const LED = [cyl(0.8, 0.8, 0.6, M.ledR, -6, -5, 2.2, panelG), cyl(0.8, 0.8, 0.6, M.led, -2, -5, 2.2, panelG)]; LED.forEach(l => l.rotation.x = Math.PI / 2);
[2, 5, 8].forEach(x => box(2.2, 1.6, 0.6, M.knob, x, -5, 2.2, panelG));
box(1.6, 1.6, 1.4, M.black, -9, -10, 2.2, panelG);   // ขั้วต่อหัววัด
tag(panelG, "panel"); labelAt.panel = [panelG, [0, 16, 2]];

/* ========== หัวฮีตเตอร์ ========== */
const headG = grp(dev, 0, 108, 0);
box(64, 14, 28, M.shell, 0, 7, 0, headG); tag(headG, "reflector");
const reflG = reg(grp(headG, 0, 0, 0), [0, 14, 0]); partRoot.reflector = reflG;
const rf = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 56, 32, 1, true, Math.PI / 2, Math.PI), M.refl);
rf.rotation.z = Math.PI / 2; rf.position.set(0, 4, 0); reflG.add(rf);
tag(reflG, "reflector"); labelAt.reflector = [reflG, [-22, 12, 0]];
const heatG = reg(grp(headG, 0, -2, 0), [0, -8, 18]); partRoot.heater = heatG;
const quartz = cyl(1.6, 1.6, 50, M.quartz, 0, 0, 0, heatG); quartz.rotation.z = Math.PI / 2;
const elem = cyl(0.8, 0.8, 48, M.glow, 0, 0, 0, heatG); elem.rotation.z = Math.PI / 2;
[-26, 26].forEach(x => box(3, 4, 4, M.dark, x, 0, 0, heatG));
tag(heatG, "heater"); labelAt.heater = [heatG, [12, -5, 8]];
const lampG = reg(grp(headG, -29, -1, 9), [-10, -8, 10]); partRoot.lamp = lampG;
cyl(2.4, 2.8, 3, M.lamp, 0, 0, 0, lampG);
tag(lampG, "lamp"); labelAt.lamp = [lampG, [-6, 2, 2]];
/* ตะแกรงกันของตก (ถอดได้) */
const guardG = reg(grp(headG, 0, -5, 0), [0, -10, 0]);
box(58, 0.6, 26, M.guard, 0, 0, 0, guardG); tag(guardG, "heater");
const glowLight = new THREE.PointLight(0xff7a3a, 0, 120, 1.6); glowLight.position.set(0, 100, 0); scene.add(glowLight);

/* ---------- การกระทำ (ขยับชิ้นส่วน) ----------
   fx: [โหนด, ระยะเลื่อน [x,y,z], มุมหมุน]  ·  req: ต้องทำการกระทำเหล่านี้ก่อน */
const A = {
  guard:     { on: "ถอดตะแกรงใต้หัวฮีตเตอร์", off: "ใส่ตะแกรงกลับ", fx: [[guardG, [0, -14, 22]]] },
  heater:    { on: "ถอดไส้ฮีตเตอร์", off: "ใส่ไส้ฮีตเตอร์กลับ", req: ["guard"], fx: [[heatG, [0, -10, 30]]] },
  reflector: { on: "ถอดแผ่นสะท้อน", off: "ใส่แผ่นสะท้อนกลับ", req: ["heater"], fx: [[reflG, [0, -16, 44]]] },
  lamp:      { on: "ถอดหลอดไฟส่อง", off: "ใส่หลอดไฟส่องกลับ", req: ["guard"], fx: [[lampG, [-12, -10, 14]]] },
  probe:     { on: "ถอดหัววัดออก", off: "เสียบหัววัดกลับ", fx: [[probeG, [0, 14, 0]]] },
  side:      { on: "พับแผงกั้นด้านหน้าลง", off: "ยกแผงกั้นขึ้นและล็อก", fx: [[sideF, [0, -6, 4], [Math.PI / 2, 0, 0]]] },
  panel:     { on: "ดึงแผงควบคุมออกจากเสา", off: "ใส่แผงควบคุมกลับ", fx: [[panelG, [14, 0, 14]]] },
  cabcover:  { on: "ถอดฝาฐาน", off: "ปิดฝาฐาน", fx: [[cabCoverG, [0, 0, 22]]] },
  batt:      { on: "ยกแบตสำรองออก", off: "ใส่แบตสำรองกลับ", req: ["cabcover"], fx: [[battG, [12, 0, 24]]] },
  board:     { on: "ยกแผงวงจรออก", off: "ใส่แผงวงจรกลับ", req: ["cabcover"], fx: [[boardG, [-8, 0, 26]]] }
};
const PART_ACTIONS = { heater: ["guard", "heater"], reflector: ["reflector"], lamp: ["lamp"], probe: ["probe"], bed: ["side"], tilt: [], panel: ["panel"],
  cabinet: ["cabcover"], board: ["board"], power: ["cabcover"], battery: ["batt"], column: [] };
for (const k in A) { const a = A[k]; a.t = 0; a.v = 0; (a.fx || []).forEach(([n, dp, dr]) => n.userData.fx.push([a, dp, dr])); }
function isOn(k) { return !!A[k].t; }
function toggle(k) {
  const a = A[k], turnOn = !a.t;
  if (turnOn) { const miss = (a.req || []).filter(r => !A[r].t); if (miss.length) { toast("ต้อง" + A[miss[0]].on + "ก่อน"); return; } }
  else { const dep = Object.keys(A).find(o => A[o].t && (A[o].req || []).includes(k)); if (dep) { toast("ต้อง" + A[dep].off + "ก่อน"); return; } }
  if (turnOn && running) stopRun("ปิดฮีตเตอร์และรอให้เย็นก่อนถอดชิ้นส่วน");
  a.t = turnOn ? 1 : 0; refresh();
  if (window.Task3D) Task3D.onToggle(k, turnOn);
}

/* ---------- เปิดฮีตเตอร์: รังสีความร้อน (ส้ม) จากไส้ลงเตียง ---------- */
const NA = MOBILE ? 70 : 140;
const fGeo = new THREE.BufferGeometry();
fGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(NA * 3), 3));
const flowPts = new THREE.Points(fGeo, new THREE.PointsMaterial({ size: 1.3, color: 0xff7a2a, transparent: true, opacity: 0.85, depthWrite: false }));
flowPts.visible = false; flowPts.renderOrder = 3; scene.add(flowPts);
const fu = Array.from({ length: NA }, () => Math.random()), fx0 = Array.from({ length: NA }, () => [(Math.random() - 0.5) * 46, (Math.random() - 0.5) * 18]),
  fx1 = fx0.map(([x, z]) => [x * 1.35, z * 1.9]);
let running = false, heatV = 0;
function stepFlow(dt) {
  const pos = fGeo.attributes.position.array;
  for (let i = 0; i < NA; i++) {
    fu[i] = (fu[i] + dt * 0.55) % 1; const u = fu[i];
    pos[i * 3] = fx0[i][0] + (fx1[i][0] - fx0[i][0]) * u; pos[i * 3 + 1] = 104 - u * 62; pos[i * 3 + 2] = fx0[i][1] + (fx1[i][1] - fx0[i][1]) * u;
  }
  fGeo.attributes.position.needsUpdate = true;
}

/* ---------- ป้ายชื่อ ---------- */
const SHORT = { heater: "ไส้ฮีตเตอร์", reflector: "แผ่นสะท้อน", lamp: "ไฟส่องตรวจ", column: "เสาและแขน", bed: "เตียงและแผงกั้น", tilt: "กลไกเอียง",
  probe: "หัววัดผิว", panel: "แผงควบคุม", cabinet: "ฝาฐาน", board: "แผงวงจร", power: "ชุดจ่ายไฟ + ฟิวส์", battery: "แบตสำรอง" };
const labels = {}, labelObj = {};
for (const id in labelAt) {
  const [node, p] = labelAt[id];
  const el = document.createElement("div"); el.className = "lbl"; el.textContent = SHORT[id] || id;
  el.addEventListener("pointerdown", e => e.stopPropagation());
  el.addEventListener("click", e => { e.stopPropagation(); select(id); });
  const o = new CSS2DObject(el); o.position.set(...p); node.add(o); labels[id] = el; labelObj[id] = o;
}
const INSIDE = { board: "cabcover", battery: "cabcover", power: "cabcover" };
let coverMode = 0;
function labelVis() { for (const id in INSIDE) labelObj[id].visible = selected === id || exV > 0.25 || A[INSIDE[id]].v > 0.5 || coverMode > 0; }

/* ---------- เลือกชิ้นส่วน ---------- */
const selBox = new THREE.BoxHelper(undefined, 0xe8590c); selBox.visible = false; selBox.material.depthTest = false; selBox.renderOrder = 5; scene.add(selBox);
let selected = null;
function select(id) {
  selected = id;
  for (const k in labels) labels[k].classList.toggle("sel", k === id);
  if (id && partRoot[id]) { selBox.setFromObject(partRoot[id]); selBox.visible = true; } else selBox.visible = false;
  renderSide();
}
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
let down = null;
renderer.domElement.addEventListener("pointerdown", e => { down = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener("pointerup", e => {
  if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) { down = null; return; }
  down = null; const hit = pick(e); select(hit ? hit.object.userData.part : null);
});
renderer.domElement.addEventListener("pointermove", e => { if (e.buttons) return; renderer.domElement.style.cursor = pick(e) ? "pointer" : "grab"; });
function pick(e) {
  const r = renderer.domElement.getBoundingClientRect();
  ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(scene.children, true).filter(h => h.object.isMesh && h.object.visible && h.object.userData.part);
  const solid = hits.find(h => h.object.material !== M.side && h.object.material !== M.guard && !(coverMode === 1 && coverParts.includes(h.object)));
  return solid || hits[0] || null;
}

/* ---------- แผงด้านขวา ---------- */
const side = document.getElementById("side");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function groupOf(id) { const g = GROUPS.find(g => g.ids.includes(id)); return g ? g.t : ""; }
function renderSide() {
  side.parentElement.scrollTop = 0;
  if (!selected) {
    side.innerHTML = `<h2>ชิ้นส่วนทั้งหมด</h2><p class="en">หน้าที่ หลักการ อาการเสีย และวิธีตรวจ</p>
      ${GROUPS.map(g => `<div class="grp">${esc(g.t)}</div><div class="plist">${g.ids.map(id => `<button data-id="${id}">${esc(SHORT[id] || id)}</button>`).join("")}</div>`).join("")}
      <p class="note">กด “เปิดฮีตเตอร์” เพื่อดูไส้แดงและรังสีความร้อน (ส้ม) ตกลงบนเตียง กด “เอียงเตียง” เพื่อดูกลไกเอียง ลองถอดตามลำดับจริง: ตะแกรง → ไส้ฮีตเตอร์ → แผ่นสะท้อน ถ้าข้ามขั้น ระบบจะบอกว่าต้องทำอะไรก่อน</p>`;
    side.querySelectorAll("[data-id]").forEach(b => b.onclick = () => select(b.dataset.id));
    return;
  }
  const Pt = PARTS[selected] || {};
  const acts = (PART_ACTIONS[selected] || []).map(k => {
    const on = isOn(k), a = A[k], lock = !on && (a.req || []).some(r => !A[r].t);
    const need = lock ? `<small>ต้อง${esc(A[(a.req || []).find(r => !A[r].t)].on)}ก่อน</small>` : "";
    return `<button data-a="${k}" class="${on ? "on" : ""}${lock ? " lock" : ""}">${esc(on ? a.off : a.on)}${need}</button>`;
  }).join("");
  side.innerHTML = `<button class="link" id="all">← รายการทั้งหมด</button><br>
    <span class="chip">${esc(groupOf(selected))}</span>
    <h2>${esc(Pt.th || SHORT[selected])}</h2><div class="en">${esc(Pt.n || "")}</div>
    <p>${esc(Pt.f || "")}</p>
    ${acts ? `<h3>สั่งให้ขยับ</h3><div class="acts">${acts}</div>` : ""}
    ${Pt.h ? `<h3>หลักการทำงาน</h3><p>${esc(Pt.h)}</p>` : ""}
    ${Pt.x ? `<h3>อาการเสียที่พบบ่อย</h3><ul>${Pt.x.map(s => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
    ${Pt.c ? `<h3>วิธีตรวจเบื้องต้น</h3><ol>${Pt.c.map(s => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}`;
  side.querySelector("#all").onclick = () => select(null);
  side.querySelectorAll("[data-a]").forEach(b => b.onclick = () => toggle(b.dataset.a));
}
function refresh() { if (selected) renderSide(); }

let toastT = 0;
function toast(msg, ok) {
  const t = document.getElementById("toast"); t.textContent = msg; t.className = "toast" + (ok ? " ok" : ""); t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2800);
}

/* ---------- แถบเครื่องมือ ---------- */
const VIEWS = { iso: [[80, 104, 110], [6, 64, 0]], front: [[6, 66, 160], [6, 64, 0]], side: [[160, 72, 0], [6, 64, 0]], top: [[6, 200, 20], [6, 40, 0]] };
let camAnim = null, curView = "iso", barH = 0;
function fitPos(v) {
  const [p, t] = VIEWS[v], tv = new THREE.Vector3(...t), dir = new THREE.Vector3(...p).sub(tv).normalize();
  const h = stage.clientHeight || 1, k = Math.max(0.3, (h - barH) / h);
  const vf = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * k), hf = 2 * Math.atan(Math.tan(vf / 2) * stage.clientWidth / (h * k));
  const dist = R / Math.sin(Math.min(vf, hf) / 2) * 1.04;
  return [tv.clone().addScaledVector(dir, dist), tv];
}
function view(v, instant) {
  curView = v; const [p1, t1] = fitPos(v);
  if (instant) { camAnim = null; camera.position.copy(p1); controls.target.copy(t1); }
  else camAnim = { t: 0, p0: camera.position.clone(), t0: controls.target.clone(), p1, t1 };
  document.querySelectorAll("#views button").forEach(b => b.classList.toggle("on", b.dataset.v === v));
}
document.querySelectorAll("#views button").forEach(b => b.onclick = () => view(b.dataset.v));
const bLbl = document.getElementById("b-lbl");
bLbl.onclick = () => { const on = bLbl.classList.toggle("on"); labelR.domElement.classList.toggle("off", !on); };
const COVER_MODES = ["ปกติ", "โปร่ง", "ซ่อน"];
const bCover = document.getElementById("b-cover");
const coverGlass = new THREE.MeshStandardMaterial({ color: 0xdfe7ee, transparent: true, opacity: 0.18, depthWrite: false });
bCover.onclick = () => {
  coverMode = (coverMode + 1) % 3;
  coverG.children.forEach(o => { if (!o.isMesh) return; o.visible = coverMode < 2; o.material = coverMode === 1 ? coverGlass : (coverParts.includes(o) ? M.cover : M.dark); });
  labels.cabinet.style.visibility = coverMode < 2 ? "" : "hidden";
  bCover.textContent = "ฝาฐาน: " + COVER_MODES[coverMode]; bCover.classList.toggle("on", coverMode > 0);
};
const bAir = document.getElementById("b-air"), bFill = document.getElementById("b-fill");
function stopRun(msg) { running = false; flowPts.visible = false; bAir.classList.remove("on"); bAir.textContent = "▶ เปิดฮีตเตอร์"; if (msg) toast(msg); }
bAir.onclick = () => {
  if (running) return stopRun();
  if (Object.keys(A).some(k => A[k].t)) { toast("ประกอบกลับให้ครบก่อนเปิดฮีตเตอร์"); return; }
  running = true; flowPts.visible = true; bAir.classList.add("on"); bAir.textContent = "■ ปิดฮีตเตอร์";
  toast("ไส้ฮีตเตอร์ร้อนจนแผ่รังสีอินฟราเรด แผ่นสะท้อนรวมรังสี (ส้ม) ให้ตกลงบนเตียง ผิวทารกอุ่นขึ้นโดยตรง", true);
};
let tiltT = 0, tiltV = 0;
bFill.onclick = () => {
  const on = tiltT === 0; tiltT = on ? -10 : 0; bFill.classList.toggle("on", on); bFill.textContent = on ? "ปรับเตียงราบ" : "เอียงเตียง";
  if (on) toast("เตียงเอียงหัวสูง 10° กลไกต้องล็อกให้อยู่กับที่เมื่อปล่อยมือ ระยะจากหัวฮีตเตอร์ถึงตัวทารกเปลี่ยนไปเล็กน้อย", true);
};
const exInput = document.getElementById("explode");
let exT = 0, exV = 0;
exInput.oninput = () => { if (window.Task3D && Task3D.active()) { exInput.value = 0; toast("โหมดฝึก: ปิดการแยกชิ้นส่วนอัตโนมัติ"); return; } if (running) stopRun(); exT = exInput.value / 100; };
document.getElementById("b-reset").onclick = () => {
  if (window.Task3D && Task3D.active()) { toast("โหมดฝึก: ประกอบกลับทีละชิ้นด้วยตัวเอง"); return; }
  for (const k in A) A[k].t = 0; exT = 0; exInput.value = 0; refresh();
};

/* ---------- วนเฟรม ---------- */
const tmpV = new THREE.Vector3();
function applyNodes() {
  for (const n of nodes) {
    const b = n.userData.base;
    n.position.copy(b.p).addScaledVector(n.userData.ex, exV); n.rotation.copy(b.r);
    for (const [a, dp, dr] of n.userData.fx) {
      if (!a.v) continue;
      if (dp) n.position.add(tmpV.set(dp[0], dp[1], dp[2]).multiplyScalar(a.v));
      if (dr) { n.rotation.x += dr[0] * a.v; n.rotation.y += dr[1] * a.v; n.rotation.z += dr[2] * a.v; }
    }
  }
}
const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false); labelR.setSize(w, h);
  const tb = document.querySelector(".bar");
  barH = tb && tb.parentElement === stage ? Math.min(tb.offsetHeight + 24, h * 0.4) : 0;
  camera.aspect = w / Math.max(h, 1);
  if (barH) camera.setViewOffset(w, h, 0, barH / 2, w, h); else camera.clearViewOffset();
  camera.updateProjectionMatrix();
}
let lastAspect = 0, refitT = 0;
new ResizeObserver(() => {
  resize();
  if (Math.abs(camera.aspect - lastAspect) > 0.15) { lastAspect = camera.aspect; clearTimeout(refitT); refitT = setTimeout(() => view(curView, true), 60); }
}).observe(stage);
resize(); lastAspect = camera.aspect; view("iso", true);

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  for (const k in A) { const a = A[k]; a.v += Math.sign(a.t - a.v) * Math.min(Math.abs(a.t - a.v), dt * 2.2); }
  exV += (exT - exV) * Math.min(1, dt * 6);
  applyNodes(); labelVis();
  /* ฮีตเตอร์และเตียง */
  heatV += ((running ? 1 : 0) - heatV) * Math.min(1, dt * 1.2);
  M.glow.emissiveIntensity = heatV * 2.2; glowLight.intensity = heatV * 2.5;
  if (running) stepFlow(dt);
  tiltV += (tiltT - tiltV) * Math.min(1, dt * 2); tiltG.rotation.z = THREE.MathUtils.degToRad(tiltV);
  if (camAnim) {
    camAnim.t = Math.min(1, camAnim.t + dt * 1.4); const e = ease(camAnim.t);
    camera.position.lerpVectors(camAnim.p0, camAnim.p1, e); controls.target.lerpVectors(camAnim.t0, camAnim.t1, e);
    if (camAnim.t >= 1) camAnim = null;
  }
  controls.update();
  if (selBox.visible && selected) selBox.setFromObject(partRoot[selected]);
  renderer.render(scene, camera); labelR.render(scene, camera);
});

const bar = document.querySelector(".bar");
function layout(narrow) {
  if (narrow) document.querySelector(".main").insertBefore(bar, side.parentElement); else stage.appendChild(bar);
  resize(); view(curView, true);
}
layout(MOBILE);
if (MOBILE) { bLbl.classList.remove("on"); labelR.domElement.classList.add("off"); }
NARROW.addEventListener("change", e => layout(e.matches));
document.getElementById("loading").remove();
renderSide();
if (window.Task3D) Task3D.init({ A, MODE, toast, reset: () => { exT = 0; exInput.value = 0; if (running) stopRun(); select(null); } });
window.__wm3d = { A, toggle, select, view };   // ใช้ทดสอบ

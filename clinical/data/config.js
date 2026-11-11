/* ===== ตั้งค่าแอป วิชาคลินิก: การใช้เครื่องอุ่นทารกและเครื่องส่องไฟอย่างปลอดภัยในทารกแรกเกิด =====
   ใช้ไฟล์ร่วมกับแอปซ่อมเครื่องอุ่นทารก (../css, ../js/score.js, ../js/auth.js, ../js/cert.js, ../js/dia.js)
   ภาพเครื่องส่องไฟคัดมาจาก stdsk99/phototherapy (js/phdia.js, css/ph.css)
   app   : ต้องตรงกับ APPS ใน apps-script/Code.gs และ courses.js ของเว็บหลัก
   store : คำนำหน้าคีย์ localStorage ของแอปนี้ */
window.APP_CONFIG = {
  app: "warmer-clin",
  store: "iwc",
  appName: "Neonatal Warmer & Phototherapy Clinical Use",
  portal: "/medtechcenter/",
  sheetUrl: "https://script.google.com/macros/s/AKfycbzLcs08L6W0fnHHZ5tCq8JjkXFPcux3G3_WT1t3vUC8zSo-oQKoACC3xHc67-h-yy6KTw/exec",
  token: "pump-2569",
  course: "ศูนย์การเรียนรู้เทคโนโลยีทางการแพทย์",
  emptyHint: "ยังไม่มีคะแนน เริ่มจากบทที่ 1 แล้วทำแบบทดสอบท้ายบทให้ผ่านทีละบท",
  reportEmail: "theptharo2019@gmail.com",

  cert: {
    org: ["ศูนย์การเรียนรู้เทคโนโลยีทางการแพทย์"],
    title: "การใช้เครื่องอุ่นทารกและเครื่องส่องไฟอย่างปลอดภัยในทารกแรกเกิด",
    subject: "ของศูนย์การเรียนรู้เทคโนโลยีทางการแพทย์",
    signer: "รศ.ดร.ณัฐดนัย สิงห์คลีวรรณ",
    signerPos: "ผู้จัดทำสื่อการเรียนรู้",
    ref: "IWC"
  },

  /* เกณฑ์ผ่าน (ต้องตรงกับ APPS['warmer-clin'].crit ใน Code.gs) */
  criteria: { readLessons: 10, lessonPct: 80, simPct: 80, quizPct: 80, finalN: 20 }
};

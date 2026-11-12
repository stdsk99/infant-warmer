# CLAUDE.md: วิชาเครื่องอุ่นทารกแบบแผ่รังสี (Infant Radiant Warmer)

ก่อนเริ่มงานทุกครั้ง อ่าน `STANDARDS.md` (มาตรฐานกลางของศูนย์ฯ) แล้วอ่าน `MEMORY.md` (สิ่งที่เจ้าของงานเคยสั่งแก้ในวิชานี้)
เมื่อเจ้าของงานสั่งแก้หรือตัดสินใจเรื่องใหม่ ให้จดลง `MEMORY.md` ถ้ากฎนั้นใช้กับทุกวิชา ให้เสนอย้ายเข้า `STANDARDS.md` ที่ medtechcenter
ระบบทั้งหมดดูได้ที่ `HANDOFF.md` ใน stdsk99/medtechcenter

## วิชาใน repo นี้

| ที่อยู่ | วิชา | รหัสแอป | store | เลขที่ |
|---|---|---|---|---|
| `/` | วิชาช่าง: ซ่อมเครื่องอุ่นทารก 8 โมดูล | `warmer` | `iwt` | `IWT-` |
| `/clinical/` | วิชาคลินิกรวม: เครื่องอุ่นทารก + เครื่องส่องไฟ 10 บท + เครื่องจำลอง 8 สถานการณ์ | `warmer-clin` | `iwc` | `IWC-` |
| `/3d/` | หน้า 3 มิติ ฝึกถอดเปลี่ยน 6 งาน | – | – | – |
| `/phototherapy/` | หน้าพาไปที่ stdsk99/phototherapy (วิชาช่างเครื่องส่องไฟย้ายไปแล้ว) | – | – | – |

## ⚠️ ภาพที่คัดมาจาก repo อื่น

วิชาคลินิกใช้ภาพเครื่องส่องไฟที่คัดมาจาก stdsk99/phototherapy (`clinical/js/phdia.js`, `clinical/css/ph.css`)
ถ้าแก้ภาพใน repo phototherapy ต้องคัดมาใหม่ที่นี่ด้วย

## แหล่งอ้างอิง

- วิชาช่าง: GE Panda iRes · Fisher & Paykel 900 Series · Panda/Giraffe Service Manual
- วิชาคลินิก: WHO · NICE · AAP · neoBLUE (คู่มือผู้ใช้)

## ไฟล์สำคัญ

- `data/` เนื้อหาวิชาช่าง · `js/dia.js` ภาพเครื่อง (WMDIA) · `clinical/` วิชาคลินิกรวม

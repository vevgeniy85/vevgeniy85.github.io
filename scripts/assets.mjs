import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { projects } from '../src/lib/content.js';
await mkdir('src/assets', { recursive: true });
await sharp('src/assets/workspace.png').webp({ quality: 85 }).toFile('src/assets/workspace.webp');
const text = (x,y,value,size=14,color='#a0adbf',weight=400) => `<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${value}</text>`;
const rect = (x,y,w,h,fill='#151f29',radius=8) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}"/>`;
function mockup(p, view) {
  const accent=p.color; let ui=''; const mobile=view==='mobile';
  const x=mobile?252:24, w=mobile?296:752;
  ui += rect(x,24,w,452,'#f3f5f4',10);
  ui += rect(x+1,25,w-2,450,'#101a22',9);
  ui += text(x+20,58,p.brand,mobile?13:16,'#f1f4fa',700);
  if(!mobile)ui+=text(520,58,'ABOUT     COLLECTION     CONTACT',10,'#a0adbf');
  ui+=`<path d="M${x+20} 78h${w-40}" stroke="#283643"/>`;
  if(view==='home'||mobile) {
    ui+=text(x+24,119,'DESIGNED FOR REAL LIFE',11,accent,700);
    const headline=p.headline.split(' '); const mid=Math.ceil(headline.length/2);
    ui+=text(x+24,166,headline.slice(0,mid).join(' '),mobile?24:34,'#f1f4fa',700);
    ui+=text(x+24,208,headline.slice(mid).join(' '),mobile?24:34,'#f1f4fa',700);
    ui+=rect(x+24,231,mobile?200:300,5,'#697684',2)+rect(x+24,247,mobile?172:260,5,'#465463',2);
    ui+=rect(x+24,277,130,33,accent,16)+text(x+43,299,'EXPLORE MORE',10,'#101a22',700);
    if(!mobile) {
      ui+=rect(461,104,288,211,'#1e2e39',6);
      ui+=text(481,135,'FEATURED COLLECTION',10,accent,700);
      ui+=rect(481,151,116,109,'#293d49',4)+rect(613,151,116,109,'#324851',4);
      ui+=text(493,194,'01',24,accent,700)+text(626,194,'02',24,accent,700);
      ui+=text(481,287,'Considered details. Better experiences.',11,'#d5dde4');
    }
    const cw=mobile?110:220;
    for(let i=0;i<(mobile?2:3);i++)ui+=rect(x+24+i*(cw+16),340,cw,94,'#18252f',5)+text(x+36+i*(cw+16),368,`0${i+1} / DISCOVER`,11,accent,700)+rect(x+36+i*(cw+16),388,cw-32,4,'#697684',2)+rect(x+36+i*(cw+16),402,cw-48,4,'#465463',2);
  } else if(view==='catalog') {
    ui+=text(48,128,'THE COLLECTION',30,'#f1f4fa',700)+text(48,155,'Find something that fits your next chapter.',13);
    for(let i=0;i<3;i++){
      const cx=48+i*242;ui+=rect(cx,183,218,220,'#182a36',6)+rect(cx+12,195,194,117,'#263e4a',4)+text(cx+26,237,`0${i+1}`,28,accent,700)+text(cx+14,338,`FEATURED OFFER / 0${i+1}`,12,'#f1f4fa',700)+rect(cx+14,353,154,4,'#617382',2)+rect(cx+14,367,110,4,'#465463',2)+text(cx+14,391,'VIEW DETAILS →',10,accent,700);
    }
  } else {
    ui+=text(48,118,'COLLECTION / FEATURED OFFER',11,accent,700)+rect(48,146,360,271,'#243b48',5)+text(72,199,'01 / SELECTED',20,accent,700)+text(440,174,'MADE FOR YOU',26,'#f1f4fa',700);
    for(let i=0;i<5;i++)ui+=rect(440,203+i*18,i%2?245:279,4,'#697684',2);
    ui+=rect(440,326,160,36,accent,18)+text(466,350,'MAKE AN ENQUIRY',10,'#101a22',700);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="#0e141c"/>${ui}</svg>`;
}
for(const p of projects.filter(p=>!p.real))for(const view of ['home','catalog','detail','mobile'])await writeFile(`src/assets/${p.slug}-${view}.svg`,mockup(p,view));
console.log('Created 24 demo interface previews and an optimized workspace image.');

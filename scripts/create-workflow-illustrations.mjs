import fs from 'node:fs';
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const rect=(x,y,w,h,fill='#fff')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" stroke="#E2E6EB"/>`;
const text=(x,y,s,size=20,color='#17212F',weight=400)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(s)}</text>`;
function shell(title,content){return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="Illustrative Ovotech ${title} workflow"><rect width="1600" height="900" rx="20" fill="#F8FAFC"/><g font-family="Arial,sans-serif">${rect(0,0,1600,84)}${text(30,51,'OVOTECH',25,'#315775',700)}${text(240,51,title,25)}${text(1160,50,'Illustrative · fictional data',17,'#6B7280')}${rect(20,106,176,770)}${['Overview','Review queue','Clinical review','Patient history','Reviewed items'].map((s,i)=>text(38,166+i*76,s,19,s===title?'#377DFF':'#6B7280',s===title?700:400)).join('')}${content}</g></svg>`;}
let content=rect(224,112,1348,124,'#315775')+text(256,156,'Riverside Medical Practice',19,'#fff')+text(256,202,'Clinical review summary',32,'#fff',700);
[['Documents received','214'],['Awaiting review','14'],['Patient records updated','198'],['Update exceptions','2']].forEach(([label,value],i)=>{let x=224+i*342;content+=rect(x,270,320,170)+text(x+20,309,label,19,'#6B7280')+text(x+20,382,value,46,'#315775',700);});
content+=rect(224,470,1348,350)+text(250,514,'Latest documents to review',25,'#17212F',700);
['Clinic letter · SAMPLE-042','Discharge summary · SAMPLE-108','Specialist letter · SAMPLE-215'].forEach((s,i)=>{const y=548+i*80;content+=rect(246,y,1304,62,'#F8FAFC')+text(268,y+38,s)+text(1040,y+38,'Awaiting review',19,'#315775');});
fs.writeFileSync('public/images/product/clinical-overview-illustration.svg',shell('Overview',content));
content=rect(224,112,1348,126)+text(254,160,'Review queue',32,'#17212F',700)+text(254,201,'Prioritise correspondence by urgency, confidence and age',20,'#6B7280');
[['In queue','14'],['High priority','3'],['Overdue','2']].forEach(([label,value],i)=>{const x=224+i*455;content+=rect(x,268,432,132)+text(x+22,305,label,20,'#6B7280')+text(x+22,366,value,38,'#315775',700);});
content+=rect(224,435,1348,386)+text(250,480,'Document',19,'#6B7280')+text(820,480,'Confidence',19,'#6B7280')+text(1130,480,'Status',19,'#6B7280');
['Clinic letter · SAMPLE-042','Discharge summary · SAMPLE-108','Specialist letter · SAMPLE-215'].forEach((s,i)=>{const y=510+i*88;content+=rect(244,y,1304,70,'#F8FAFC')+text(264,y+42,s)+text(820,y+42,i?'High':'Review closely',19,'#315775')+text(1130,y+42,'Pending',19,'#315775');});
fs.writeFileSync('public/images/product/review-queue-illustration.svg',shell('Review queue',content));
content=rect(224,112,1348,86)+text(250,164,'Clinical review · SAMPLE-042',28,'#17212F',700)+text(1120,164,'Review pending',20,'#B45309');
content+=rect(224,224,298,598)+text(248,267,'Patient context',23,'#17212F',700)+text(248,320,'Fictional patient',20)+text(248,365,'Prior correspondence',18,'#6B7280')+text(248,420,'Processing history',18,'#315775');
content+=rect(546,224,578,598)+text(570,267,'Document summary',23,'#17212F',700)+text(570,320,'Cardiology clinic letter',20)+text(570,370,'ECG confirmed atrial fibrillation.',20)+text(570,410,'Background of type 2 diabetes.',20)+text(570,485,'Extracted fields',23,'#17212F',700)+rect(568,513,532,102,'#F8FAFC')+text(589,547,'DOCUMENT TYPE',16,'#6B7280')+text(589,584,'Clinic letter',22)+rect(568,635,532,120,'#F8FAFC')+text(589,671,'REVIEW',16,'#6B7280')+text(589,711,'Check against the source letter',20);
content+=rect(1148,224,424,598)+text(1170,267,'SNOMED CT suggestions',23,'#17212F',700);
[['Atrial fibrillation','49436004 · 97%'],['Type 2 diabetes','44054006 · 96%']].forEach(([label,code],i)=>{const y=302+i*200;content+=rect(1170,y,380,174,'#F8FAFC')+text(1188,y+40,label,22,'#17212F',700)+text(1188,y+78,code,19,'#315775')+text(1188,y+133,'Accept    Amend    Reject',19,'#2458C7');});
fs.writeFileSync('public/images/product/clinical-review-illustration.svg',shell('Clinical review',content));
content=rect(224,112,1348,90)+text(250,169,'Patient record update',30,'#17212F',700)+text(224,250,'From reviewed suggestions to a recorded outcome',23,'#6B7280');
['Coding reviewed','Approval recorded','Ready to update','Patient record updated'].forEach((label,i)=>{let y=284+i*120;content+=rect(224,y,800,92)+text(252,y+56,String(i+1).padStart(2,'0'),24,'#377DFF',700)+text(326,y+56,label,25,'#17212F',700);});
content+=rect(1052,284,520,454)+text(1080,331,'Activity trail',27,'#17212F',700)+text(1080,391,'Each action linked to its reviewer',21)+text(1080,448,'Update status visible to the team',21)+text(1080,505,'Exceptions remain visible',21)+text(1080,562,'Controlled retry where needed',21)+text(1080,670,'Illustration only. No live connection.',18,'#6B7280');
fs.writeFileSync('public/images/product/record-readiness-illustration.svg',shell('Reviewed items',content));
for(const route of ['', 'about','demo','integrations','medical-coding','platform','resources','trust']){
 const file=`src/app/${route?route+'/':''}page.tsx`;let s=fs.readFileSync(file,'utf8');
 for(const n of ['clinical-overview','review-queue','clinical-review','record-readiness'])s=s.replaceAll(`/images/product/${n}.jpg`,`/images/product/${n}-illustration.svg`);
 s=s.replaceAll('Open full-size screenshot:', 'Open full-size illustration:').replaceAll('The OvoTech product · fictional sample data','Illustrative Ovotech workflow · fictional sample data').replaceAll('The OvoTech clinical review screen · all patient and practice details are fictional','Illustrative clinical review workflow · fictional patient and practice details');
 fs.writeFileSync(file,s);
}

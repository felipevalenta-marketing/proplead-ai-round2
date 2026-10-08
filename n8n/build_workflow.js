const fs = require('node:fs');
const path = require('node:path');

const code = value => value.trim();
const nodes = [
  {parameters:{},id:'manual-trigger',name:'Manual trigger',type:'n8n-nodes-base.manualTrigger',typeVersion:1,position:[0,300]},
  {parameters:{jsCode:code(`
return [{json:{
  lead_id:'demo-es-001',
  source_channel:'whatsapp',
  source_message_id:'wa-demo-001',
  received_at:new Date().toISOString(),
  consent_status:'synthetic_demo',
  original_text:'Hola, busco un apartamento de dos dormitorios en Palma. Mi presupuesto es de 600.000 euros.'
}}];`)},id:'sample-input',name:'Simulated channel input',type:'n8n-nodes-base.code',typeVersion:2,position:[220,300]},
  {parameters:{jsCode:code(`
const allowed=['web_form','email','whatsapp','property_portal','social','manual'];
const text=String($json.original_text||'').replace(/\\s+/g,' ').trim();
if(!text) throw new Error('A lead message is required');
return [{json:{
  lead_id:$json.lead_id||('lead-'+Date.now()),
  source_channel:allowed.includes($json.source_channel)?$json.source_channel:'manual',
  source_message_id:$json.source_message_id||null,
  received_at:$json.received_at||new Date().toISOString(),
  consent_status:$json.consent_status||'synthetic_demo',
  original_text:text
}}];`)},id:'normalise',name:'Normalise intake',type:'n8n-nodes-base.code',typeVersion:2,position:[450,300]},
  {parameters:{jsCode:code(`
const item=$json;const text=item.original_text;const lower=text.toLowerCase();
const language=/\\b(hola|busco|presupuesto|dormitorios|vivienda)\\b/i.test(text)?'es':/\\b(hallo|ich|suche|wohnung|schlafzimmer)\\b/i.test(text)?'de':'en';
function money(s){const m=s.match(/€\\s*([0-9.,]+)\\s*(m|k)?|([0-9.,]+)\\s*(m|k)?\\s*(?:euros?|euro)/i);if(!m)return null;let token=m[1]||m[3],unit=(m[2]||m[4]||'').toLowerCase();if(unit==='m')return Math.round(Number(token.replace(',','.'))*1e6);if(unit==='k')return Math.round(Number(token.replace(',','.'))*1e3);if(/^\\d{1,3}([.,]\\d{3})+$/.test(token))token=token.replace(/[.,]/g,'');return Number(token)>=100000?Number(token):null;}
const budget_eur=money(text);const names=['Palma','Sóller','Artà','Inca',"Cala d'Or",'Sant Llorenç des Cardassar'];const locations=names.filter(x=>lower.includes(x.toLowerCase()));
const property_type=/apartamento|apartment|wohnung/i.test(lower)?'apartment':/finca/i.test(lower)?'finca':/villa/i.test(lower)?'villa':/townhouse|casa de pueblo/i.test(lower)?'townhouse':null;
const words={one:1,two:2,three:3,four:4,zwei:2,drei:3,vier:4,dos:2,tres:3,cuatro:4};let min_bedrooms=null;const digit=lower.match(/(\\d+)\\s*(?:bedrooms?|dormitorios?|habitaciones?|schlafzimmer)/);if(digit)min_bedrooms=Number(digit[1]);else for(const [w,n] of Object.entries(words))if(new RegExp('\\\\b'+w+'\\\\b(?=.{0,12}(?:bedrooms?|dormitorios?|habitaciones?|schlafzimmer))','i').test(lower)){min_bedrooms=n;break;}
const missing_fields=[];if(!budget_eur)missing_fields.push('budget_eur');if(!locations.length)missing_fields.push('specific_location');if(!property_type&&!min_bedrooms)missing_fields.push('property_type_or_bedrooms');
const qualification_status=missing_fields.length?'needs_information':'matching_ready';const weights={budget_eur:20,locations:20,property_type:15,min_bedrooms:15};let score=0;for(const [k,w] of Object.entries(weights)){const v={budget_eur,locations,property_type,min_bedrooms}[k];if(Array.isArray(v)?v.length:v!==null)score+=w;}
return [{json:{...item,language,budget_eur,locations,property_type,min_bedrooms,missing_fields,qualification_status,score,priority:qualification_status==='needs_information'?'review':score>=55?'warm':'cold',confidence:'high',risk_flags:[]}}];`)},id:'extract',name:'Extract and qualify',type:'n8n-nodes-base.code',typeVersion:2,position:[690,300]},
  {parameters:{jsCode:code(`
const lead=$json;const catalogue=[
{id:'PM-101',title:'Palma Old Town Apartment',location:'Palma',type:'apartment',price_eur:575000,bedrooms:2,status:'available',last_verified_at:'2026-09-29'},
{id:'PM-103',title:'Port de Sóller Sea View Apartment',location:'Sóller',type:'apartment',price_eur:760000,bedrooms:2,status:'available',last_verified_at:'2026-09-29'},
{id:'PM-104',title:'Artà Stone Finca',location:'Artà',type:'finca',price_eur:1390000,bedrooms:4,status:'available',last_verified_at:'2026-09-29'},
{id:'PM-108',title:'Inca Renovation House',location:'Inca',type:'townhouse',price_eur:320000,bedrooms:3,status:'available',last_verified_at:'2026-09-29'}];
let matches=[];if(lead.qualification_status==='matching_ready')matches=catalogue.filter(p=>p.status==='available'&&p.price_eur<=lead.budget_eur&&lead.locations.includes(p.location)&&(!lead.property_type||p.type===lead.property_type)&&(!lead.min_bedrooms||p.bedrooms>=lead.min_bedrooms)).slice(0,3);
const risk_flags=[...lead.risk_flags];if(lead.qualification_status==='matching_ready'&&!matches.length)risk_flags.push('zero_match');
return [{json:{...lead,matches,risk_flags,must_escalate:risk_flags.length>0||lead.qualification_status==='needs_information'}}];`)},id:'match',name:'Qualification gate and matching',type:'n8n-nodes-base.code',typeVersion:2,position:[940,300]},
  {parameters:{jsCode:code(`
const lead=$json;const missing=lead.missing_fields.join(', ');let draft;
if(lead.language==='es')draft=lead.qualification_status==='needs_information'?('Gracias por su consulta. Para buscar opciones adecuadas, ¿podría confirmar: '+missing+'? Un agente revisará su respuesta.'):(lead.matches.length?('Gracias por su consulta. Hemos identificado '+lead.matches.length+' opción compatible. Un agente comprobará la disponibilidad antes de responderle.'):'Gracias por su consulta. No encontramos una coincidencia fiable. Un agente revisará su solicitud.');
else if(lead.language==='de')draft=lead.qualification_status==='needs_information'?('Vielen Dank für Ihre Anfrage. Bitte bestätigen Sie: '+missing+'. Ein Makler prüft Ihre Antwort.'):(lead.matches.length?('Vielen Dank für Ihre Anfrage. Wir haben '+lead.matches.length+' passende Option gefunden. Ein Makler prüft die Verfügbarkeit.'):'Vielen Dank für Ihre Anfrage. Es wurde keine verlässliche Übereinstimmung gefunden.');
else draft=lead.qualification_status==='needs_information'?('Thank you for your enquiry. Please confirm: '+missing+'. An agent will review your answer.'):(lead.matches.length?('Thank you for your enquiry. We found '+lead.matches.length+' compatible option. An agent will confirm availability.'):'Thank you for your enquiry. No reliable match was found. An agent will review your request.');
return [{json:{...lead,draft_reply:draft,human_review_required:true,status:lead.qualification_status==='needs_information'?'needs_information':'awaiting_agent_approval',allowed_actions:['approve','edit','reject','escalate']}}];`)},id:'draft',name:'Single-language draft',type:'n8n-nodes-base.code',typeVersion:2,position:[1190,300]},
  {parameters:{jsCode:code(`
return [{json:{lead_id:$json.lead_id,source_channel:$json.source_channel,lead_summary:{language:$json.language,budget_eur:$json.budget_eur,locations:$json.locations,property_type:$json.property_type,min_bedrooms:$json.min_bedrooms},score:$json.score,priority:$json.priority,confidence:$json.confidence,qualification_status:$json.qualification_status,missing_fields:$json.missing_fields,risk_flags:$json.risk_flags,matches:$json.matches,draft_reply:$json.draft_reply,human_review_required:true,status:$json.status,allowed_actions:$json.allowed_actions}}];`)},id:'review',name:'Agent review queue',type:'n8n-nodes-base.code',typeVersion:2,position:[1440,300]}
];

const names=nodes.map(node=>node.name);const connections={};for(let i=0;i<names.length-1;i++)connections[names[i]]={main:[[{node:names[i+1],type:'main',index:0}]]};
const workflow={name:'PropLead AI - Round 2 Controlled POC',nodes,connections,active:false,settings:{executionOrder:'v1'},versionId:'9138b531-ae43-4f1d-98a2-d97a2b361824',meta:{templateCredsSetupCompleted:true},tags:[]};
fs.writeFileSync(path.join(__dirname,'proplead_round2_workflow.json'),JSON.stringify(workflow,null,2)+'\n');
console.log(`Created workflow with ${nodes.length} nodes.`);

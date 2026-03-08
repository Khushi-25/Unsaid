import { useState, useEffect, useRef, useCallback } from "react";

const DAY = { bg:"#FAF6EF",bgSoft:"#F5EFE3",paper:"#FFFDF8",ink:"#3D3228",inkSoft:"#7A6A5A",inkMuted:"#B5A898",accent:"#E8A87C",shadow:"rgba(100,80,60,0.14)",name:"day" };
const NIGHT = { bg:"#1A1828",bgSoft:"#221F35",paper:"#252238",ink:"#E8E0F0",inkSoft:"#B0A8C8",inkMuted:"#5A5478",accent:"#9B8EC4",shadow:"rgba(0,0,0,0.35)",name:"night" };

const BTN_DAY=[{base:"#FADADD",hover:"#F5B8BE",border:"#E8A0A8",text:"#5C2D34"},{base:"#D4EAD1",hover:"#B8D9B4",border:"#8EC488",text:"#2B4D28"},{base:"#D0DCF5",hover:"#B3C6EE",border:"#8AAAE0",text:"#243566"}];
const BTN_NIGHT=[{base:"#3D2A45",hover:"#5A3E63",border:"#7A5A8C",text:"#E8D0F8"},{base:"#1E3530",hover:"#2A4D47",border:"#3D7068",text:"#A8E0D8"},{base:"#3D2228",hover:"#5A3038",border:"#8C4A52",text:"#F8C8CC"}];
const CARD_DAY=[{base:"#FADADD",hover:"#F5B8BE",border:"#E8A0A8",text:"#5C2D34"},{base:"#D4EAD1",hover:"#B8D9B4",border:"#8EC488",text:"#2B4D28"},{base:"#D0DCF5",hover:"#B3C6EE",border:"#8AAAE0",text:"#243566"},{base:"#FFF3C4",hover:"#FFE88A",border:"#F5CC50",text:"#5C4A00"},{base:"#EDE0F5",hover:"#D9C2EE",border:"#B08ACC",text:"#3A1E52"},{base:"#D4EAE8",hover:"#B4D8D4",border:"#6FB8B2",text:"#1A3E3A"}];
const CARD_NIGHT=[{base:"#3D2A45",hover:"#5A3E63",border:"#7A5A8C",text:"#E8D0F8"},{base:"#1E3530",hover:"#2A4D47",border:"#3D7068",text:"#A8E0D8"},{base:"#3D2228",hover:"#5A3038",border:"#8C4A52",text:"#F8C8CC"},{base:"#3D3A18",hover:"#5A5420",border:"#8C8430",text:"#F8F0A8"},{base:"#2A1E3D",hover:"#3E2D5A",border:"#6A508C",text:"#D8C8F8"},{base:"#1A3535",hover:"#254D4D",border:"#3D7070",text:"#A8E0E0"}];

const THREADS=[{id:"unsaid",label:"things I never said",emoji:"🌿"},{id:"spirals",label:"late night spirals",emoji:"🌀"},{id:"softthings",label:"soft things I noticed",emoji:"☁️"},{id:"halfthoughts",label:"half-finished thoughts",emoji:"✏️"},{id:"bodykeeping",label:"what my body is keeping",emoji:"🫀"},{id:"tomorrow",label:"things I'll never send",emoji:"📬"},{id:"feelings",label:"saved feelings",emoji:"🫶"}];

const MOODS=[
  {id:"happy",label:"Happy",icon:"🌤",color:{base:"#FFF3C4",hover:"#FFE88A",border:"#F5CC50",text:"#5C4A00"},quotes:["It's okay to just sit inside this feeling without needing to explain it.","Joy doesn't need to be earned. It's allowed to just be here."]},
  {id:"sad",label:"Sad",icon:"🌧",color:{base:"#D6E8F7",hover:"#B8D4EE",border:"#7AAED4",text:"#1A3A52"},quotes:["Sadness is not weakness. It's just a feeling that needed somewhere to land.","You don't have to be okay right now. You really don't."]},
  {id:"anxious",label:"Anxious",icon:"🌀",color:{base:"#EDE0F5",hover:"#D9C2EE",border:"#B08ACC",text:"#3A1E52"},quotes:["Your nervous system is trying to protect you. It's doing its best.","You don't have to solve anything right now. Just breathe."]},
  {id:"overwhelmed",label:"Overwhelmed",icon:"🌊",color:{base:"#D4EAE8",hover:"#B4D8D4",border:"#6FB8B2",text:"#1A3E3A"},quotes:["When everything feels like too much, it's okay to put it all down for a moment.","One small thing at a time is enough."]},
  {id:"numb",label:"Numb",icon:"🪨",color:{base:"#E8E4DC",hover:"#D4CEC4",border:"#A8A098",text:"#3A3530"},quotes:["Numbness is also a feeling. It's your mind taking a quiet rest.","Not feeling much right now is okay."]},
  {id:"calm_confused",label:"Calm but confused",icon:"🌫",color:{base:"#FADADD",hover:"#F5B8BE",border:"#E8A0A8",text:"#5C2D34"},quotes:["It's possible to feel peaceful and lost at the same time. Both are real.","Confusion doesn't always need to be resolved."]},
];

const DAY_R=["That took something to say. It's here now.","Whatever you're holding — you don't have to explain it further.","I hear you. That's enough.","Something in what you've shared deserves to be held gently.","You said it. That matters, even if it doesn't feel like it right now."];
const NIGHT_R=["I'm here. The quiet has a way of making things louder, and that's okay.","Whatever this is, it found its way out. That took something.","You don't have to carry all of this alone right now.","The night holds a lot. You don't have to sort through it right now.","It's late, and you're still here. That means something."];
const getResp=(n)=>new Promise(r=>setTimeout(()=>r((n?NIGHT_R:DAY_R)[Math.floor(Math.random()*(n?NIGHT_R:DAY_R).length)]),1400));

async function getAIResponse({ text, mood, isNight }) {
  const systemPrompt = `You are a gentle, emotionally attuned presence inside a journaling app called Unsaid. People come here when they have feelings they can't say out loud anywhere else.

Your only job is to make the person feel genuinely, quietly heard — like a warm hand on the shoulder.

Rules you must never break:
- Never give advice, suggestions, or solutions
- Never use clinical or therapeutic language like "validate", "process", "cope"
- Never say "I understand" or "that sounds hard" — show it instead
- Never start your response with the word "I"
- Keep your response to 2–4 sentences only
- Write in soft, poetic, human language — like a gentle friend, not a chatbot
- Do not ask questions
- Do not be cheerful or upbeat — match the tenderness of the moment
- If it is nighttime, carry a quieter, more intimate tone
- Respond only in plain text, no formatting, no bullet points`;

  const userPrompt = `Time of day: ${isNight ? "night" : "day"}
${mood ? `The user's mood: ${mood}` : ""}
The user wrote: "${text}"

Respond as a warm, quiet presence sitting with them.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
      })
    });
    const data = await res.json();
    return data?.content?.find(b => b.type === "text")?.text?.trim() || null;
  } catch { return null; }
}

async function getMoodAIResponse({ moodLabel, moodIcon, isNight }) {
  const systemPrompt = `You are a gentle, emotionally attuned presence inside a journaling app called Unsaid.

Someone has just identified how they're feeling — that alone took courage.

Your job is to offer 1–2 sentences of quiet acknowledgment. Make them feel like their feeling makes complete sense, and that they're not alone in it.

Rules:
- Never give advice or tell them what to do
- Never use clinical language
- Do not start with "I"
- Keep it to 1–2 sentences, soft and poetic
- No questions, no bullet points, plain text only`;

  const userPrompt = `The person is feeling: ${moodLabel} ${moodIcon}
Time: ${isNight ? "night" : "day"}

Respond with quiet, warm acknowledgment of this feeling.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
      })
    });
    const data = await res.json();
    return data?.content?.find(b => b.type === "text")?.text?.trim() || null;
  } catch { return null; }
}

const Wave=({color,opacity=0.3,width=140})=>(
  <svg width={width} height="28" viewBox="0 0 140 28" fill="none" style={{opacity}}>
    <path d="M2 14 Q18 4 34 14 Q50 24 66 14 Q82 4 98 14 Q114 24 130 14 Q136 10 138 14" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
  </svg>
);

function Waveform({active,color}){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",height:"64px"}}>
      {Array.from({length:28}).map((_,i)=>(
        <div key={i} style={{width:"3px",borderRadius:"2px",background:color,height:active?"100%":"4px",opacity:active?0.7:0.2,transformOrigin:"center",
          animation:active?`waveBar ${0.6+(i%5)*0.15}s ease-in-out infinite`:"none",
          animationDelay:active?`${(i*0.05)%0.6}s`:"none"}}/>
      ))}
    </div>
  );
}

function HBtn({children,onClick,c,icon,disabled}){
  const[h,sH]=useState(false);
  return(
    <button onClick={onClick} disabled={disabled} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
      style={{width:"100%",height:"58px",padding:"0 28px",fontFamily:"'Caveat',cursive",fontSize:"22px",fontWeight:600,
        letterSpacing:"0.03em",color:c.text,background:h?c.hover:c.base,border:`2.2px solid ${c.border}`,borderRadius:"12px",
        cursor:disabled?"default":"pointer",transform:h&&!disabled?"scale(1.03) translateY(-2px)":"scale(1)",
        transition:"background 0.22s ease,transform 0.22s ease,box-shadow 0.22s ease",
        boxShadow:h&&!disabled?"0 6px 20px rgba(0,0,0,0.13),inset 0 1px 0 rgba(255,255,255,0.2)":"0 2px 6px rgba(0,0,0,0.07)",
        outline:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",whiteSpace:"nowrap",opacity:disabled?0.5:1}}>
      {icon&&<span style={{fontSize:"20px",lineHeight:1}}>{icon}</span>}{children}
    </button>
  );
}

function SBtn({children,onClick,T,ci=0}){
  const[h,sH]=useState(false);
  const cc=(T.name==="day"?BTN_DAY:BTN_NIGHT)[ci%3];
  return(
    <button onClick={onClick} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
      style={{fontFamily:"'Caveat',cursive",fontSize:"17px",fontWeight:600,padding:"9px 22px",color:cc.text,
        background:h?cc.hover:cc.base,border:`2px solid ${cc.border}`,borderRadius:"10px",cursor:"pointer",
        transition:"all 0.22s ease",transform:h?"scale(1.05) translateY(-1px)":"scale(1)",
        boxShadow:h?"3px 5px 14px rgba(0,0,0,0.12)":"1px 2px 5px rgba(0,0,0,0.06)",outline:"none",letterSpacing:"0.02em"}}>
      {children}
    </button>
  );
}

function ThinkingDots({color}){
  return(
    <span style={{display:"inline-flex",gap:"5px",alignItems:"center",marginLeft:"4px"}}>
      {[0,1,2].map(i=>(
        <span key={i} style={{width:"5px",height:"5px",borderRadius:"50%",background:color,display:"inline-block",
          animation:"pulse 1.2s ease-in-out infinite",animationDelay:`${i*0.2}s`,opacity:0.7}}/>
      ))}
    </span>
  );
}

function AIResponseCard({text,mood,isNight,T}){
  const[aiResp,setAiResp]=useState("");
  const[aiLoading,setAiLoading]=useState(true);

  useEffect(()=>{
    let cancelled=false;
    setAiLoading(true);setAiResp("");
    getAIResponse({text,mood,isNight}).then(r=>{
      if(!cancelled){setAiResp(r||"");setAiLoading(false);}
    });
    return()=>{cancelled=true;};
  },[text,mood,isNight]);

  if(!aiLoading&&!aiResp) return null;
  const borderColor=isNight?"rgba(155,142,196,0.25)":"rgba(232,168,124,0.3)";
  const bgColor=isNight?"rgba(155,142,196,0.07)":"rgba(232,168,124,0.07)";

  return(
    <div style={{width:"100%",background:bgColor,borderRadius:"14px",padding:"20px 22px",border:`1px solid ${borderColor}`,animation:"floatIn 0.6s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"10px"}}>
        <span style={{fontSize:"13px"}}>✨</span>
        <span style={{fontFamily:"'Caveat',cursive",fontSize:"13px",fontWeight:600,color:T.inkMuted,letterSpacing:"0.07em",textTransform:"uppercase"}}>a quiet response</span>
      </div>
      {aiLoading
        ?<p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"16px",color:T.inkSoft,margin:0,lineHeight:1.8}}>
            sitting with you<ThinkingDots color={T.accent}/>
          </p>
        :<p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"17px",color:T.ink,lineHeight:1.85,margin:0,animation:"floatIn 0.8s ease"}}>
            {aiResp}
          </p>
      }
    </div>
  );
}

function AIMoodCard({moodLabel,moodIcon,isNight,T}){
  const[aiResp,setAiResp]=useState("");
  const[aiLoading,setAiLoading]=useState(true);

  useEffect(()=>{
    let cancelled=false;
    setAiLoading(true);setAiResp("");
    getMoodAIResponse({moodLabel,moodIcon,isNight}).then(r=>{
      if(!cancelled){setAiResp(r||"");setAiLoading(false);}
    });
    return()=>{cancelled=true;};
  },[moodLabel,moodIcon,isNight]);

  if(!aiLoading&&!aiResp) return null;
  const borderColor=isNight?"rgba(155,142,196,0.25)":"rgba(232,168,124,0.3)";
  const bgColor=isNight?"rgba(155,142,196,0.07)":"rgba(232,168,124,0.07)";

  return(
    <div style={{width:"100%",background:bgColor,borderRadius:"14px",padding:"18px 20px",border:`1px solid ${borderColor}`,animation:"floatIn 0.6s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"10px"}}>
        <span style={{fontSize:"13px"}}>🌸</span>
        <span style={{fontFamily:"'Caveat',cursive",fontSize:"13px",fontWeight:600,color:T.inkMuted,letterSpacing:"0.07em",textTransform:"uppercase"}}>with you</span>
      </div>
      {aiLoading
        ?<p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"15px",color:T.inkSoft,margin:0,lineHeight:1.8}}>
            holding this with you<ThinkingDots color={T.accent}/>
          </p>
        :<p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"16px",color:T.ink,lineHeight:1.8,margin:0,animation:"floatIn 0.8s ease"}}>
            {aiResp}
          </p>
      }
    </div>
  );
}

function TCard({entry,T,onDelete,onClick}){
  const cidx=useRef(Math.floor(Math.random()*6)).current;
  const pal=T.name==="day"?CARD_DAY:CARD_NIGHT;
  const c=pal[cidx];
  const[sx,setSx]=useState(0);
  const[sw,setSw]=useState(false);
  const[rel,setRel]=useState(false);
  const[gone,setGone]=useState(false);
  const sRef=useRef(null);
  const drag=useRef(false);
  const R=96,TH=48;
  const fmt=ts=>{if(!ts)return"";try{const d=new Date(ts);return d.toLocaleDateString("en-US",{month:"short",day:"numeric"})+" · "+d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true}).toLowerCase();}catch{return"";}};
  const os=x=>{sRef.current=x;drag.current=true;setRel(false);};
  const om=x=>{if(!drag.current)return;setSx(Math.max(-R,Math.min(0,sw?x-sRef.current-R:x-sRef.current)));};
  const oe=()=>{if(!drag.current)return;drag.current=false;setRel(true);if(sx<-TH){setSx(-R);setSw(true);}else{setSx(0);setSw(false);}};
  if(gone)return(<div style={{width:"100%",borderRadius:"12px",padding:"16px 18px",background:T.name==="day"?"#E8F4EE":"#1E3530",border:`2.2px solid ${T.name==="day"?"#A8D4B8":"#3D7068"}`,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"64px",animation:"softShow 0.3s ease"}}><p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"15px",margin:0,color:T.name==="day"?"#2B6B44":"#A8E0D8"}}>let go 💙</p></div>);
  return(
    <div style={{position:"relative",width:"100%",borderRadius:"12px",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,right:0,bottom:0,width:`${R}px`,display:"flex",alignItems:"center",justifyContent:"center",background:T.name==="day"?"#EDE0F5":"#2A1E3D",borderRadius:"12px"}}>
        <button onClick={()=>{setGone(true);setTimeout(()=>onDelete(entry.id),900);}} style={{fontFamily:"'Caveat',cursive",fontSize:"16px",fontWeight:600,color:T.name==="day"?"#6A3A8A":"#D8C8F8",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",outline:"none"}}>
          <span style={{fontSize:"20px"}}>🗑</span><span>let it go</span>
        </button>
      </div>
      <div onTouchStart={e=>os(e.touches[0].clientX)} onTouchMove={e=>om(e.touches[0].clientX)} onTouchEnd={oe}
        onMouseDown={e=>os(e.clientX)} onMouseMove={e=>drag.current&&om(e.clientX)} onMouseUp={oe}
        onMouseLeave={()=>{if(drag.current)oe();}}
        onClick={()=>{
          if(sw&&!drag.current){setSx(0);setSw(false);setRel(true);return;}
          if(!drag.current && sx===0) onClick?.();
        }}
        style={{background:c.base,border:`2.2px solid ${c.border}`,borderRadius:"12px",padding:"16px 18px 14px",width:"100%",display:"flex",flexDirection:"column",gap:"10px",transform:`translateX(${sx}px)`,transition:rel?"transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94)":"none",boxShadow:"0 2px 6px rgba(0,0,0,0.07)",cursor:sw?"pointer":"grab",userSelect:"none",position:"relative",zIndex:1}}>
        {!sw && sx===0 && (
          <div style={{position:"absolute",top:"10px",right:"14px",fontFamily:"'Caveat',cursive",fontSize:"11px",color:c.text,opacity:0.35,pointerEvents:"none"}}>← swipe</div>
        )}
        {entry.type==="feeling"&&<div style={{display:"flex",alignItems:"center",gap:"6px"}}><span style={{fontSize:"16px"}}>{entry.moodIcon}</span><span style={{fontFamily:"'Caveat',cursive",fontSize:"13px",fontWeight:600,color:c.text,letterSpacing:"0.06em",textTransform:"uppercase",opacity:0.7}}>{entry.moodLabel}</span></div>}
        <p style={{fontFamily:"'Caveat',cursive",fontSize:"18px",color:c.text,lineHeight:1.65,margin:0,whiteSpace:"pre-wrap",wordBreak:"break-word",paddingRight:"36px"}}>
          {entry.type==="feeling"?`felt ${entry.moodLabel?.toLowerCase()} today`:entry.type==="video"?"a quiet moment with myself 🎞":entry.type==="audio"?"a voice note 🎙":(entry.text?.length>180?entry.text.slice(0,180)+"…":entry.text)}
        </p>
        {entry.type==="audio" && entry.audio && (<audio controls style={{width:"100%",marginTop:"10px"}}><source src={entry.audio} type="audio/webm"/></audio>)}
        {entry.type==="video" && entry.video && (
          <video controls style={{width:"100%",marginTop:"10px",borderRadius:"8px"}}>
            <source src={entry.video} type="video/webm"/>
          </video>
        )}
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <span style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"11px",color:c.text,opacity:0.5}}>{fmt(entry.ts)}</span>
        </div>
      </div>
    </div>
  );
}

function MCard({mood,sel,onClick,T}){
  const[h,sH]=useState(false);
  const a=h||sel;
  const c=T.name==="night"?{base:mood.color.border+"22",hover:mood.color.border+"44",border:mood.color.border+"88",text:T.inkSoft}:mood.color;
  return(
    <button onClick={onClick} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
      style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",padding:"18px 12px",background:a?c.hover:c.base,border:`2.2px solid ${c.border}`,borderRadius:"12px",cursor:"pointer",minHeight:"90px",transition:"background 0.22s ease,transform 0.22s ease,box-shadow 0.22s ease",transform:a?"scale(1.04) translateY(-2px)":"scale(1)",boxShadow:a?"0 6px 20px rgba(0,0,0,0.13),inset 0 1px 0 rgba(255,255,255,0.2)":"0 2px 6px rgba(0,0,0,0.07)",outline:"none"}}>
      <span style={{fontSize:"28px",lineHeight:1}}>{mood.icon}</span>
      <span style={{fontFamily:"'Caveat',cursive",fontSize:"17px",fontWeight:600,color:T.name==="night"?T.inkSoft:mood.color.text,textAlign:"center",lineHeight:1.2}}>{mood.label}</span>
    </button>
  );
}

function ThCard({thread,c,count,onClick}){
  const[h,sH]=useState(false);
  return(
    <div onClick={onClick} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
      style={{display:"flex",alignItems:"center",gap:"12px",padding:"16px 22px",height:"58px",background:h?c.hover:c.base,border:`2.2px solid ${c.border}`,borderRadius:"12px",cursor:"pointer",transform:h?"scale(1.03) translateY(-2px)":"scale(1)",transition:"background 0.22s ease,transform 0.22s ease,box-shadow 0.22s ease",boxShadow:h?"0 6px 20px rgba(0,0,0,0.13),inset 0 1px 0 rgba(255,255,255,0.2)":"0 2px 6px rgba(0,0,0,0.07)",userSelect:"none"}}>
      <span style={{fontSize:"20px",lineHeight:1,flexShrink:0}}>{thread.emoji}</span>
      <span style={{fontFamily:"'Caveat',cursive",fontSize:"20px",fontWeight:600,color:c.text,flex:1}}>{thread.label}</span>
      <span style={{fontFamily:"'Caveat',cursive",fontSize:"14px",color:c.text,opacity:0.55,background:c.hover,border:`1.5px solid ${c.border}`,borderRadius:"20px",padding:"2px 10px"}}>{count}</span>
    </div>
  );
}

function TopBar({T,setTheme,entries,setScreen,showBack,onBack}){
  const[hb,sHb]=useState(false);
  const[ht,sHt]=useState(false);
  const kept=entries.filter(e=>e.kept).length;
  const n=T.name==="night";
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",zIndex:100,background:"transparent"}}>
      {showBack
        ?<button onClick={onBack} onMouseEnter={()=>sHb(true)} onMouseLeave={()=>sHb(false)}
            style={{fontFamily:"'Caveat',cursive",fontSize:"20px",fontWeight:700,color:hb?T.ink:T.inkSoft,background:hb?(n?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.07)"):(n?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)"),border:`1.8px solid ${n?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.15)"}`,borderRadius:"10px",padding:"7px 18px",cursor:"pointer",transition:"all 0.2s ease",outline:"none",transform:hb?"translateX(-2px)":"none"}}>← back</button>
        :<span style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"24px",fontWeight:500,color:T.ink}}>Unsaid</span>
      }
      <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
        {kept>0&&!showBack&&<button onClick={()=>setScreen("threads")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Caveat',cursive",fontSize:"16px",color:T.inkMuted}}>threads ↗</button>}
        <button onClick={()=>setTheme(n?DAY:NIGHT)} onMouseEnter={()=>sHt(true)} onMouseLeave={()=>sHt(false)}
          style={{display:"flex",alignItems:"center",gap:"8px",fontFamily:"'Caveat',cursive",fontSize:"20px",fontWeight:700,padding:"7px 18px",borderRadius:"10px",border:`1.8px solid ${n?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.15)"}`,background:ht?(n?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.07)"):(n?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)"),color:ht?T.ink:T.inkSoft,cursor:"pointer",transition:"all 0.2s ease",outline:"none"}}>
          <span style={{fontSize:"18px",lineHeight:1}}>{n?"☀️":"🌙"}</span>
          <span>{n?"day":"night"}</span>
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
export default function UnsaidApp(){
  const[theme,setTheme]=useState(DAY);
  const[screen,setScreen]=useState("home");
  const[text,setText]=useState("");
  const[resp,setResp]=useState("");
  const[loading,setLoading]=useState(false);
  const[saveChoice,setSC]=useState(null);
const[entries,setEntries]=useState(()=>{
  try{
    const saved=localStorage.getItem("unsaid_entries");
    if(!saved) return [];
    const parsed=JSON.parse(saved);
    // remove audio/video entries entirely since blob URLs don't survive refresh
    return parsed.filter(e=>e.type!=="audio" && e.type!=="video");
  }catch{return[];}
});
useEffect(()=>{
  try{
    // don't save blob URLs — they expire on refresh anyway
    const toSave=entries.map(e=>({
      ...e,
      audio: e.type==="audio" ? null : e.audio,
      video: e.type==="video" ? null : e.video,
    }));
    localStorage.setItem("unsaid_entries",JSON.stringify(toSave));
  }catch{}
},[entries]);

useEffect(()=>{
  setEntries(p=>p.filter(e=>
    e.type!=="audio" && e.type!=="video"
  ).concat(
    p.filter(e=>e.type==="audio"||e.type==="video").map(e=>({...e,audio:null,video:null}))
  ));
},[]);

  const[activeThread,setAT]=useState(null);
  const[openEntry,setOpenEntry]=useState(null);
  const[reflection,setRef]=useState(null);
  const[moodId,setMoodId]=useState(null);
  const[savedFeelings,setSF]=useState([]);
  const[feelSaved,setFS]=useState(null);
  const[talkMode,setTalk]=useState("choose");
  const[vPhase,setVP]=useState("idle");
  const[vTimer,setVT]=useState(0);
  const[fakeTx,setFTx]=useState("");
  const[vidPhase,setVidP]=useState("consent");
  const[vidSaved,setVidSaved]=useState(false);
  const[micOn,setMic]=useState(true);
  const[camOn,setCam]=useState(true);
  const[vidText,setVidText]=useState("");
  const timerRef=useRef(null);
  const textRef=useRef(null);

  // video refs
  const videoRef=useRef(null);
  const videoStreamRef=useRef(null);
  const videoRecorderRef=useRef(null);
  const videoChunksRef=useRef([]);
  const[videoURL,setVideoURL]=useState(null);

  useEffect(()=>{
    if(videoRef.current && videoStreamRef.current){
      videoRef.current.srcObject=videoStreamRef.current;
    }
  },[vidPhase]);

  // audio refs
  const mediaRecorderRef=useRef(null);
  const audioChunksRef=useRef([]);
  const[audioURL,setAudioURL]=useState(null);

  const T=theme;
  const isNight=T.name==="night";
  const B=T.name==="day"?BTN_DAY:BTN_NIGHT;
  const dot=T.name==="day"?"rgba(100,80,60,0.18)":"rgba(160,150,200,0.15)";
  const bg={minHeight:"100vh",width:"100%",backgroundColor:T.bg,backgroundImage:`radial-gradient(circle,${dot} 1.3px,transparent 1.3px)`,backgroundSize:"22px 22px",color:T.ink,position:"relative",overflow:"hidden",transition:"background-color 0.7s ease,color 0.7s ease"};

  const CSS=`
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=Caveat:wght@400;500;600;700&display=swap');
    *{box-sizing:border-box;} body{margin:0;}
    button{cursor:pointer;} button:focus,textarea:focus{outline:none;}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.2}}
    @keyframes floatIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes softShow{from{opacity:0}to{opacity:1}}
    @keyframes ripple{0%{transform:scale(1);opacity:0.6}100%{transform:scale(2.4);opacity:0}}
    @keyframes waveBar{0%,100%{transform:scaleY(0.3)}50%{transform:scaleY(1)}}
    .ta::placeholder{color:${T.inkMuted};opacity:0.65;font-style:italic;}
    ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:${T.inkMuted}40;border-radius:4px;}
  `;

  useEffect(()=>{const h=new Date().getHours();if(h>=20||h<6)setTheme(NIGHT);},[]);
  useEffect(()=>{if(screen==="typing")setTimeout(()=>textRef.current?.focus(),120);},[screen]);
  useEffect(()=>{
    if(screen!=="voice"){
      clearInterval(timerRef.current);
      setVP("idle");setVT(0);setFTx("");setTalk("choose");
      setVidP("consent");setVidSaved(false);setVideoURL(null);setVidText("");
    }
  },[screen]);

  const submit=useCallback(async(ov)=>{
    const c=ov??text; if(!c.trim())return;
    setText(c);setScreen("response");setLoading(true);setSC(null);
    const r=await getResp(T.name==="night"); setResp(r);setLoading(false);
    if(entries.length>=1){const pool=["You keep coming back. That takes something.","Not everything needs an answer. Sometimes it just needs to exist somewhere.",T.name==="day"?"Daylight doesn't always make things easier to hold.":"The dark has a way of making things heavier than they are."];setRef(pool[Math.floor(Math.random()*pool.length)]);}
  },[text,T,entries]);

  const save=(ch)=>{
    setSC(ch);
    const id=Date.now().toString();
    const tid=THREADS[Math.floor(Math.random()*THREADS.length)].id;
    if(ch==="keep")setEntries(p=>[...p,{id,text,thread:tid,kept:true,ts:Date.now()}]);
    else if(ch==="fade"){setEntries(p=>[...p,{id,text,thread:tid,kept:false,ts:Date.now()}]);setTimeout(()=>setEntries(p=>p.filter(e=>e.id!==id)),30000);}
    setTimeout(()=>{setScreen("home");setText("");setResp("");setSC(null);},1300);
  };

  const saveMood=(mood)=>{
    const ts=Date.now();
    setSF(p=>[{id:ts+"_"+mood.id,...mood},...p]);
    setEntries(p=>[{id:String(ts),type:"feeling",mood:mood.id,moodLabel:mood.label,moodIcon:mood.icon,thread:"feelings",kept:true,ts,text:""},...p]);
    setFS(mood.id);
  };

  const startV=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const recorder=new MediaRecorder(stream);
      mediaRecorderRef.current=recorder;
      audioChunksRef.current=[];
      recorder.ondataavailable=(e)=>{audioChunksRef.current.push(e.data);};
      recorder.onstop=()=>{
        const blob=new Blob(audioChunksRef.current,{type:"audio/webm"});
        setAudioURL(URL.createObjectURL(blob));
      };
      recorder.start();
      setVP("recording");
    }catch(err){alert("Microphone permission denied");}
  };

  const stopV=()=>{
    mediaRecorderRef.current?.stop();
    setVP("done");
  };

  const startVideo=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
      videoStreamRef.current=stream;
      if(videoRef.current) videoRef.current.srcObject=stream;
      videoChunksRef.current=[];
      videoRecorderRef.current=new MediaRecorder(stream);
      videoRecorderRef.current.ondataavailable=e=>{
        if(e.data.size>0) videoChunksRef.current.push(e.data);
      };
      videoRecorderRef.current.onstop=()=>{
        const blob=new Blob(videoChunksRef.current,{type:"video/webm"});
        setVideoURL(URL.createObjectURL(blob));
        setVidP("review"); // only move to review AFTER url is ready
      };
      videoRecorderRef.current.start();
      setVidP("recording");
    }catch(err){alert("Camera permission denied");}
  };

  const toggleMic = () => {
  const newVal = !micOn;
  setMic(newVal);
  if (videoStreamRef.current) {
    videoStreamRef.current.getAudioTracks().forEach(track => {
      track.enabled = newVal;
    });
  }
};

const toggleCam = () => {
  const newVal = !camOn;
  setCam(newVal);
  if (videoStreamRef.current) {
    videoStreamRef.current.getVideoTracks().forEach(track => {
      track.enabled = newVal;
    });
  }
};

  const stopVideo=()=>{
    videoRecorderRef.current?.stop();
    setVidP("processing"); // show "just a moment…" while onstop fires
  };

  const onBack=()=>{
    clearInterval(timerRef.current);
    setVP("idle");setFTx("");setTalk("choose");
    setVidP("consent");setVidSaved(false);setVideoURL(null);setVidText("");
    setScreen("home");
  };

  // ── HOME
  if(screen==="home")return(
    <div style={bg}><style>{CSS}</style>
    <TopBar T={T} setTheme={setTheme} entries={entries} setScreen={setScreen}/>
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"90px 32px 50px",margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:"52px",animation:"floatIn 0.7s ease"}}>
        <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"clamp(28px,7vw,42px)",fontWeight:400,color:T.ink,lineHeight:1.25,margin:"0 0 14px"}}>You can say it here.</p>
        <div style={{display:"flex",justifyContent:"center"}}><Wave color={T.accent} opacity={0.45} width={160}/></div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"18px",width:"100%",maxWidth:"520px",animation:"floatIn 0.85s ease"}}>
        <HBtn c={B[0]} icon="✏️" onClick={()=>setScreen("typing")}>start typing</HBtn>
        <HBtn c={B[1]} icon="🎙" onClick={()=>{setTalk("choose");setScreen("voice");}}>talk instead</HBtn>
        <HBtn c={B[2]} icon="🌫" onClick={()=>{setMoodId(null);setFS(null);setScreen("unknown");}}>I don't know what I feel</HBtn>
      </div>
      {reflection&&<div style={{marginTop:"48px",maxWidth:"100%",textAlign:"center",padding:"16px 20px",background:T.paper,borderRadius:"12px",border:`1px solid ${T.inkMuted}20`,boxShadow:`2px 3px 14px ${T.shadow}`,animation:"floatIn 0.85s ease"}}><p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"15px",color:T.inkSoft,lineHeight:1.75,margin:0}}>{reflection}</p></div>}
    </div></div>
  );

  // ── UNKNOWN
  if(screen==="unknown"){
    const moods=T.name==="night"?MOODS.map(m=>({...m,color:{base:m.color.border+"22",hover:m.color.border+"44",border:m.color.border+"88",text:T.inkSoft}})):MOODS;
    const sel=moods.find(m=>m.id===moodId);
    const orig=MOODS.find(m=>m.id===moodId);
    return(
      <div style={bg}><style>{CSS}</style>
      <TopBar T={T} setTheme={setTheme} entries={entries} setScreen={setScreen} showBack onBack={()=>{setMoodId(null);setFS(null);setScreen("home");}}/>
      <div style={{maxWidth:"420px",margin:"0 auto",padding:"80px 28px 60px",minHeight:"100vh",display:"flex",flexDirection:"column",animation:"floatIn 0.55s ease"}}>
        <div style={{textAlign:"center",marginBottom:"30px"}}>
          <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"24px",color:T.ink,margin:"0 0 10px",lineHeight:1.3}}>I don't know what I feel.</p>
          <p style={{fontFamily:"'Lora',serif",fontSize:"16px",color:T.inkSoft,lineHeight:1.75,margin:0}}>{sel?"You don't need to label anything perfectly.":"It's okay to not have the words yet."}</p>
          <div style={{display:"flex",justifyContent:"center",marginTop:"12px"}}><Wave color={T.accent} opacity={0.35} width={120}/></div>
        </div>
        {!sel&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",marginBottom:"20px"}}>
            {moods.map(m=><MCard key={m.id} mood={m} sel={moodId===m.id} onClick={()=>{setMoodId(m.id);setFS(null);}} T={T}/>)}
          </div>
          <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"15px",color:T.inkMuted,textAlign:"center",lineHeight:1.7,margin:0}}>pick the one that feels closest — even if it's not quite right.</p>
        </>}
        {sel&&orig&&<div style={{display:"flex",flexDirection:"column",gap:"20px",animation:"floatIn 0.5s ease"}}>
          <div onClick={()=>{setMoodId(null);setFS(null);}} style={{display:"inline-flex",alignItems:"center",gap:"8px",alignSelf:"center",background:sel.color.base,border:`2px solid ${sel.color.border}`,borderRadius:"10px",padding:"8px 20px",cursor:"pointer"}}>
            <span style={{fontSize:"18px"}}>{sel.icon}</span>
            <span style={{fontFamily:"'Caveat',cursive",fontSize:"19px",fontWeight:600,color:T.name==="night"?T.inkSoft:sel.color.text}}>{sel.label}</span>
            <span style={{fontFamily:"'Caveat',cursive",fontSize:"14px",color:T.inkMuted,marginLeft:"4px"}}>↩ change</span>
            <AIMoodCard moodLabel={orig.label} moodIcon={orig.icon} isNight={isNight} T={T}/>
          </div>
          {orig.quotes.map((q,i)=>(
            <div key={i} style={{background:T.paper,borderRadius:"12px",padding:"20px 22px",border:`1px solid ${T.inkMuted}18`,boxShadow:`2px 4px 16px ${T.shadow}`,animation:`floatIn ${0.5+i*0.15}s ease`}}>
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"17px",color:T.ink,lineHeight:1.85,margin:0}}>"{q}"</p>
            </div>
          ))}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",padding:"4px 0"}}>
            <button onClick={()=>!feelSaved&&saveMood(orig)} disabled={!!feelSaved}
              style={{background:"none",border:"none",cursor:feelSaved?"default":"pointer",fontFamily:"'Caveat',cursive",fontSize:"18px",fontWeight:600,color:feelSaved?T.inkMuted:T.inkSoft,padding:"4px 0",transition:"color 0.3s ease",outline:"none"}}>
              {feelSaved?"Saved 💙":"🫶 Save this feeling"}
            </button>
            {!feelSaved&&<p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"13px",color:T.inkMuted,margin:0,textAlign:"center"}}>Only if you want to. You don't have to explain it.</p>}
          </div>
          <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"14px",color:T.inkMuted,textAlign:"center",lineHeight:1.8,margin:"4px 0 0"}}>You can just sit with this feeling too —<br/>there's no pressure to write or speak.</p>
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            <HBtn c={B[0]} icon="✏️" onClick={()=>setScreen("typing")}>start writing</HBtn>
            <HBtn c={B[1]} icon="🎙" onClick={()=>{setTalk("choose");setScreen("voice");}}>talk instead</HBtn>
            <HBtn c={B[2]} icon="🏠" onClick={()=>{setMoodId(null);setFS(null);setScreen("home");}}>go home</HBtn>
          </div>
          <p style={{fontFamily:"'Caveat',cursive",fontSize:"16px",color:T.inkMuted,textAlign:"center",margin:"2px 0 0"}}>only if you feel like it ✦</p>
        </div>}
      </div></div>
    );
  }

  // ── TYPING
  if(screen==="typing")return(
    <div style={bg}><style>{CSS}</style>
    <TopBar T={T} setTheme={setTheme} entries={entries} setScreen={setScreen} showBack onBack={()=>setScreen("home")}/>
    <div style={{position:"fixed",top:"15px",left:"50%",transform:"translateX(-50%)",zIndex:200,pointerEvents:"none"}}>
      <span style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"24px",fontWeight:500,color:T.ink}}>Unsaid</span>
    </div>
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",padding:"72px 30px 110px"}}>
      <textarea ref={textRef} className="ta" value={text} onChange={e=>setText(e.target.value)}
        onKeyDown={e=>{if(e.key==="Enter"&&e.metaKey)submit();}}
        placeholder={T.name==="night"?"whatever's there…":"just let it out…"} autoFocus
        style={{flex:1,background:"transparent",border:"none",resize:"none",fontFamily:"'Caveat',cursive",fontSize:"23px",lineHeight:1.8,color:T.ink,caretColor:T.accent,minHeight:"55vh",width:"100%",letterSpacing:"0.01em"}}/>
    </div>
    {text.trim().length>0&&<div style={{position:"fixed",bottom:"32px",left:0,right:0,display:"flex",justifyContent:"center",zIndex:100,animation:"floatIn 0.4s ease"}}>
      <div style={{width:"100%",maxWidth:"310px",padding:"0 32px"}}>
        <HBtn c={B[0]} onClick={()=>submit()}>{T.name==="night"?"I'm done for now":"that's what I needed to say"}</HBtn>
      </div>
    </div>}
    </div>
  );

  // ── VOICE (contains both voice-only and video modes)
  if(screen==="voice"){

    // ── CHOOSE
    if(talkMode==="choose")return(
      <div style={bg}><style>{CSS}</style>
      <TopBar T={T} setTheme={setTheme} entries={entries} setScreen={setScreen} showBack onBack={onBack}/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"80px 32px 50px",maxWidth:"420px",margin:"0 auto",gap:"18px",animation:"floatIn 0.5s ease"}}>
        <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"24px",color:T.ink,textAlign:"center",lineHeight:1.35,margin:"0 0 10px",maxWidth:"320px"}}>how do you want to be with this?</p>
        <HBtn c={B[0]} onClick={()=>setTalk("voice")}>🎙 just my voice</HBtn>
        <HBtn c={B[1]} onClick={()=>setTalk("video")}>🎞 with video</HBtn>
      </div></div>
    );

    // ── VOICE ONLY
    if(talkMode==="voice")return(
      <div style={bg}><style>{CSS}</style>
      <TopBar T={T} setTheme={setTheme} entries={entries} setScreen={setScreen} showBack onBack={onBack}/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
        <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"22px",color:T.ink}}>
          {vPhase==="idle"&&"whenever you're ready"}
          {vPhase==="recording"&&"I'm listening"}
          {vPhase==="done"&&"take your time"}
        </p>
        <div onClick={vPhase==="idle"?startV:vPhase==="recording"?stopV:undefined}
          style={{width:"92px",height:"92px",borderRadius:"50%",background:"#FADADD",border:`3px solid ${T.accent}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"40px",cursor:"pointer",transition:"all 0.3s ease",boxShadow:vPhase==="recording"?`0 0 28px ${T.accent}66`:"none",fontSize:"36px"}}>
          🎙
        </div>
        <div style={{width:"100%",maxWidth:"320px",marginBottom:"32px",display:"flex",justifyContent:"center"}}>
          <Waveform active={vPhase==="recording"} color={T.accent}/>
        </div>
        {vPhase==="done"&&(
          <div style={{width:"320px",display:"flex",flexDirection:"column",gap:"12px"}}>
            {audioURL&&<audio controls style={{width:"100%"}}><source src={audioURL}/></audio>}
            <textarea value={fakeTx} onChange={e=>setFTx(e.target.value)} className="ta" rows={4} placeholder="add something if you want…"
              style={{width:"100%",fontFamily:"'Caveat',cursive",fontSize:"20px",background:T.paper,border:`1.5px solid ${T.inkMuted}40`,borderRadius:"12px",padding:"16px",color:T.ink,resize:"none"}}/>
            <HBtn c={B[0]} icon="💾" onClick={()=>{
              setEntries(p=>[...p,{id:Date.now().toString(),type:"audio",audio:audioURL,text:fakeTx,thread:"softthings",kept:true,ts:Date.now()}]);
              setVP("idle");setAudioURL(null);setScreen("home");
            }}>keep this</HBtn>
            <HBtn c={B[2]} icon="🌫" onClick={()=>{setVP("idle");setAudioURL(null);setScreen("home");}}>let it fade</HBtn>
            <HBtn c={B[1]} icon="🎙" onClick={()=>{setVP("idle");setAudioURL(null);}}>record again</HBtn>
            {fakeTx.trim().length > 0 && (
  <AIResponseCard text={fakeTx} mood={null} isNight={isNight} T={T}/>
)}
          </div>
        )}
      </div></div>
    );

    // ── VIDEO
    if(talkMode==="video"){

      // consent screen
      if(vidPhase==="consent")return(
        <div style={bg}><style>{CSS}</style>
        <TopBar T={T} setTheme={setTheme} entries={entries} setScreen={setScreen} showBack onBack={()=>setTalk("choose")}/>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"80px 32px 50px",gap:"22px",maxWidth:"380px",margin:"0 auto",animation:"floatIn 0.5s ease"}}>
          <div style={{width:"72px",height:"72px",borderRadius:"50%",background:T.name==="day"?"#EDE0F5":"#2A1E3D",border:`2px solid ${T.name==="day"?"#B08ACC":"#6A508C"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"32px"}}>🪞</div>
          <div style={{textAlign:"center"}}>
            <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"22px",color:T.ink,margin:"0 0 14px",lineHeight:1.35}}>You can just sit here.</p>
            <p style={{fontFamily:"'Lora',serif",fontSize:"16px",color:T.inkSoft,lineHeight:1.8,margin:"0 0 10px"}}>You don't have to talk or explain anything.</p>
            <p style={{fontFamily:"'Lora',serif",fontSize:"16px",color:T.inkSoft,lineHeight:1.8,margin:0}}>You can turn this off anytime.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"12px",width:"100%"}}>
            <HBtn c={B[0]} onClick={()=>setVidP("ready")}>turn on the camera</HBtn>
            <HBtn c={B[2]} onClick={()=>setTalk("choose")}>go back</HBtn>
          </div>
          <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"13px",color:T.inkMuted,textAlign:"center",lineHeight:1.7,margin:0}}>Camera is off until you choose to turn it on.<br/>Nothing is recorded automatically.</p>
        </div></div>
      );

      // ready / recording / processing / review
      return(
        <div style={bg}><style>{CSS}</style>
        <TopBar T={T} setTheme={setTheme} entries={entries} setScreen={setScreen} showBack onBack={()=>{setTalk("choose");setVidP("consent");setVidSaved(false);setVideoURL(null);setVidText("");}}/>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"80px 24px 50px",gap:"20px",maxWidth:"420px",margin:"0 auto",animation:"floatIn 0.4s ease"}}>

          <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"18px",color:T.ink,margin:0,textAlign:"center"}}>
            {vidPhase==="ready"&&"whenever you're ready."}
            {vidPhase==="recording"&&"I'm here with you."}
            {vidPhase==="processing"&&"just a moment…"}
            {vidPhase==="review"&&(vidSaved?"saved 💙":"take your time.")}
          </p>

          {/* camera preview box — only show when not in review */}
          {vidPhase!=="review" && vidPhase!=="processing" && (
            <div style={{width:"100%",maxWidth:"340px",aspectRatio:"4/3",borderRadius:"16px",overflow:"hidden",background:T.bgSoft,border:`2px solid ${T.inkMuted}22`,boxShadow:`0 4px 20px ${T.shadow}`,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <video ref={videoRef} autoPlay muted playsInline style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",top:0,left:0,zIndex:1}}/>
              {vidPhase==="recording"&&<div style={{position:"absolute",top:"12px",right:"12px",width:"10px",height:"10px",borderRadius:"50%",background:"#FF4444",animation:"pulse 1.8s ease-in-out infinite",boxShadow:"0 0 8px #FF444488",zIndex:2}}/>}
            </div>
          )}

          {/* saved video playback in review */}
          {vidPhase==="review" && videoURL && (
            <video controls src={videoURL} style={{width:"100%",maxWidth:"340px",borderRadius:"16px",boxShadow:`0 4px 20px ${T.shadow}`}}/>
          )}

          {(vidPhase==="ready"||vidPhase==="recording")&&(
            <div style={{display:"flex",gap:"12px",justifyContent:"center"}}>
                {[{label:micOn?"🎙 mic on":"🔇 mic off",act:toggleMic, on:micOn},{label:camOn?"📷 cam on":"📷 cam off",act:toggleCam, on:camOn}].map(({label,act,on})=>(
                <button key={label} onClick={act} style={{fontFamily:"'Caveat',cursive",fontSize:"15px",fontWeight:600,padding:"7px 16px",borderRadius:"10px",background:on?(T.name==="day"?"#D4EAD1":"#1E3530"):(T.name==="day"?"#E8E4DC":"#2A2835"),border:`1.8px solid ${on?(T.name==="day"?"#8EC488":"#3D7068"):(T.name==="day"?"#A8A098":"#4A4660")}`,color:on?(T.name==="day"?"#2B4D28":"#A8E0D8"):T.inkMuted,cursor:"pointer",outline:"none",transition:"all 0.2s ease"}}>{label}</button>
              ))}
            </div>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:"12px",width:"100%",maxWidth:"320px"}}>
            {vidPhase==="ready"&&(
              <>
                <HBtn c={B[0]} onClick={startVideo}>begin</HBtn>
                <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"13px",color:T.inkMuted,textAlign:"center",margin:0,lineHeight:1.7}}>no pressure. you can stop anytime.</p>
              </>
            )}
            {vidPhase==="recording"&&(
              <HBtn c={B[2]} onClick={stopVideo}>I'm done</HBtn>
            )}
            {vidPhase==="processing"&&(
              <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"15px",color:T.inkMuted,textAlign:"center",margin:0}}>saving your moment…</p>
            )}
            {vidPhase==="review"&&!vidSaved&&(
              <>
                <textarea
                  value={vidText}
                  onChange={e=>setVidText(e.target.value)}
                  className="ta"
                  rows={4}
                  placeholder="add something if you want…"
                  style={{width:"100%",fontFamily:"'Caveat',cursive",fontSize:"20px",background:T.paper,border:`1.5px solid ${T.inkMuted}40`,borderRadius:"12px",padding:"16px",color:T.ink,resize:"none"}}
                />
                <HBtn c={B[0]} icon="💾" onClick={()=>{
                  if(!videoURL){alert("Video is still processing, please wait a moment");return;}
                  setVidSaved(true);
                  setEntries(prev=>[...prev,{id:Date.now().toString(),type:"video",video:videoURL,text:vidText,thread:"softthings",kept:true,ts:Date.now()}]);
                }}>keep this moment</HBtn>
                 <HBtn c={B[2]} icon="🌫" onClick={()=>{setVidP("consent");setTalk("choose");setVideoURL(null);setVidText("");}}>let it fade</HBtn>
                <HBtn c={B[1]} icon="✏️" onClick={()=>setScreen("typing")}>start writing instead</HBtn>
              </>
            )}
            {vidPhase==="review"&&vidSaved&&(
              <HBtn c={B[1]} onClick={()=>setScreen("home")}>go home</HBtn>
            )}
            {vidText.trim().length > 0 && (
  <AIResponseCard text={vidText} mood={null} isNight={isNight} T={T}/>
)}
          </div>
        </div></div>
      );
    }

    return null; // fallback
  }

  // ── RESPONSE
  if(screen==="response")return(
    <div style={bg}><style>{CSS}</style>
    <TopBar T={T} setTheme={setTheme} entries={entries} setScreen={setScreen} showBack onBack={()=>setScreen("home")}/>
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",minHeight:"100vh",padding:"80px 30px 60px",maxWidth:"420px",margin:"0 auto",animation:"floatIn 0.6s ease"}}>
      <div style={{width:"100%",marginBottom:"30px",borderLeft:`2.5px solid ${T.inkMuted}44`,paddingLeft:"16px"}}>
        <p style={{fontFamily:"'Caveat',cursive",fontSize:"20px",color:T.inkSoft,lineHeight:1.7,margin:0,whiteSpace:"pre-wrap"}}>{text}</p>
      </div>
      <div style={{width:"100%",background:T.paper,borderRadius:"12px",padding:"26px 24px",boxShadow:`3px 5px 22px ${T.shadow}`,border:`1px solid ${T.inkMuted}16`,marginBottom:"36px",opacity:loading?0.5:1,transition:"opacity 0.5s ease"}}>
        <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"18px",color:T.ink,lineHeight:1.85,margin:0}}>
          {loading?(T.name==="night"?"sitting with you…":"with you for a moment…"):resp}
          {/* AI emotional response */}
{!loading && (
  <div style={{width:"100%", marginBottom:"24px"}}>
    <AIResponseCard text={text} mood={null} isNight={isNight} T={T}/>
  </div>
)}
        </p>
      </div>
      {!loading&&!saveChoice&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"14px",width:"100%",animation:"floatIn 0.5s ease"}}>
          <p style={{fontFamily:"'Caveat',cursive",fontSize:"17px",color:T.inkMuted,margin:"0 0 4px"}}>what do you want to do with this?</p>
          <div style={{display:"flex",flexDirection:"column",gap:"14px",width:"100%",maxWidth:"320px"}}>
            <HBtn c={B[0]} icon="💾" onClick={()=>save("keep")}>keep this</HBtn>
            <HBtn c={B[1]} icon="🌫" onClick={()=>save("fade")}>let it fade</HBtn>
          </div>
        </div>
      )}
      {saveChoice==="keep"&&<p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"16px",color:T.inkSoft,textAlign:"center",marginTop:"20px",animation:"softShow 0.6s ease"}}>it's there, whenever you want it.</p>}
      {saveChoice==="fade"&&<p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"16px",color:T.inkSoft,textAlign:"center",marginTop:"20px",animation:"softShow 0.6s ease"}}>it'll dissolve in a little while.</p>}
    </div></div>
  );

  // ── THREADS
  if(screen==="threads"){
    const kept=entries.filter(e=>e.kept);

    // full entry view
    if(openEntry)return(
      <div style={{...bg,overflowY:"auto"}}><style>{CSS}</style>
      <TopBar T={T} setTheme={setTheme} entries={entries} setScreen={setScreen} showBack onBack={()=>setOpenEntry(null)}/>
<div style={{
  maxWidth:"520px",
  width:"100%",
  margin:"0 auto",
  padding:"90px 28px 60px",
  animation:"floatIn 0.4s ease",
  overflowX:"hidden"
}}>
          {openEntry.type==="feeling"&&(
          <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <span style={{fontSize:"32px"}}>{openEntry.moodIcon}</span>
              <span style={{fontFamily:"'Caveat',cursive",fontSize:"26px",fontWeight:600,color:T.ink}}>{openEntry.moodLabel}</span>
            </div>
            {MOODS.find(m=>m.id===openEntry.mood)?.quotes.map((q,i)=>(
              <div key={i} style={{background:T.paper,borderRadius:"12px",padding:"20px 22px",border:`1px solid ${T.inkMuted}18`,boxShadow:`2px 4px 16px ${T.shadow}`}}>
                <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"17px",color:T.ink,lineHeight:1.85,margin:0}}>"{q}"</p>
              </div>
            ))}
          </div>
        )}
       {openEntry.text&&openEntry.type!=="feeling"&&(
  <p style={{
    fontFamily:"'Caveat',cursive",
    fontSize:"22px",
    lineHeight:1.8,
    whiteSpace:"pre-wrap",
    wordBreak:"break-word",
    overflowWrap:"break-word",
    color:T.ink,
    marginBottom:"20px",
    maxWidth:"100%"
  }}>{openEntry.text}</p>
)}
        {openEntry.type==="audio"&&openEntry.audio&&(
          <audio controls style={{width:"100%",marginTop:"10px"}}><source src={openEntry.audio}/></audio>
        )}
        {openEntry.type==="video"&&openEntry.video&&(
          <video controls preload="metadata" style={{width:"100%",marginTop:"10px",borderRadius:"12px",boxShadow:`0 4px 20px ${T.shadow}`}}>
            <source src={openEntry.video} type="video/webm"/>
          </video>
        )}
        {openEntry.text&&openEntry.type!=="feeling"&&openEntry.type!=="video"&&(
  <p style={{fontFamily:"'Caveat',cursive",fontSize:"22px",lineHeight:1.8,whiteSpace:"pre-wrap",wordBreak:"break-word",overflowWrap:"break-word",color:T.ink,marginBottom:"20px",maxWidth:"100%"}}>{openEntry.text}</p>
)}
      </div></div>
    );

    return(
      <div style={bg}><style>{CSS}</style>
      <TopBar T={T} setTheme={setTheme} entries={entries} setScreen={setScreen} showBack onBack={()=>{setScreen("home");setAT(null);}}/>
      <div style={{padding:"76px 24px 50px",maxWidth:"440px",margin:"0 auto"}}>
        <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"24px",color:T.ink,marginBottom:"28px"}}>your threads</p>
        {!activeThread?(
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            {THREADS.map((t,i)=>{
              const cnt=kept.filter(e=>e.thread===t.id).length;
              if(!cnt)return null;
              const c=B[i%B.length];
              return<ThCard key={t.id} thread={t} c={c} count={cnt} onClick={()=>setAT(t.id)}/>;
            })}
            {!kept.length&&<p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"17px",color:T.inkMuted,textAlign:"center",marginTop:"50px"}}>nothing saved yet — that's okay.</p>}
          </div>
        ):(
          <div>
            <button onClick={()=>setAT(null)} style={{background:"none",border:"none",fontFamily:"'Caveat',cursive",fontSize:"16px",color:T.inkMuted,marginBottom:"18px",padding:0,cursor:"pointer"}}>← back to threads</button>
            <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",fontSize:"19px",color:T.ink,marginBottom:"22px"}}>{THREADS.find(t=>t.id===activeThread)?.label}</p>
            <div style={{display:"flex",flexDirection:"column",gap:"12px",width:"100%"}}>
              {kept.filter(e=>e.thread===activeThread).map(entry=>(
                <TCard
                  key={entry.id}
                  entry={entry}
                  T={T}
                  onDelete={(id)=>setEntries(p=>p.filter(e=>e.id!==id))}
                  onClick={()=>setOpenEntry(entry)}
                />
              ))}
            </div>
          </div>
        )}
      </div></div>
    );
  }

  return null;
}
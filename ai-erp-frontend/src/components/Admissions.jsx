export default function Admissions() {
  const steps=[{num:'01',title:'Check Eligibility',body:'Complete +2 or equivalent with Science stream. Minimum 45% aggregate. Mathematics compulsory for CSIT/CE.'},{num:'02',title:'Submit Application',body:'Fill out the online form or collect a physical form from the college office. Attach academic transcripts and citizenship copy.'},{num:'03',title:'Entrance / Interview',body:'Appear for the college-level entrance examination. Shortlisted candidates are called for counselling.'},{num:'04',title:'Confirm Seat',body:'Pay the initial fee within 7 days of selection. Classes commence in September for regular intake.'}];
  return (
    <section id="admissions" style={{ backgroundColor:'#080f1e', padding:'100px 0', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start' }} className="eict-admg">
          <div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'2.5px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:14 }}>Admissions 2025</div>
            <h2 style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:'clamp(28px,4vw,44px)', color:'white', margin:'0 0 20px', lineHeight:1.1 }}>Apply for the<br/>upcoming intake</h2>
            <p style={{ fontSize:14.5, color:'rgba(255,255,255,0.4)', fontFamily:'system-ui,sans-serif', lineHeight:1.75, margin:'0 0 32px' }}>Applications for the 2025 academic year are now open. Limited seats available across all programs.</p>
            <div style={{ padding:'20px 24px', backgroundColor:'#0f1a2e', border:'1px solid rgba(255,255,255,0.07)', borderRadius:4, marginBottom:28 }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.28)', fontFamily:'system-ui,sans-serif', letterSpacing:'1px', textTransform:'uppercase', marginBottom:12 }}>Key Dates</div>
              {[{label:'Form available',date:'June 1, 2025'},{label:'Last submission',date:'July 31, 2025'},{label:'Entrance exam',date:'Aug 10–12, 2025'},{label:'Classes begin',date:'September 2025'}].map(item=>(
                <div key={item.label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.42)', fontFamily:'system-ui,sans-serif' }}>{item.label}</span>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.72)', fontFamily:'system-ui,sans-serif' }}>{item.date}</span>
                </div>
              ))}
            </div>
            <a href="#contact" style={{ display:'inline-block', padding:'12px 28px', backgroundColor:'#1a4fa0', color:'white', textDecoration:'none', borderRadius:4, fontSize:13.5, fontFamily:'system-ui,sans-serif', fontWeight:500 }}>Contact Admissions Office</a>
          </div>
          <div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.22)', fontFamily:'system-ui,sans-serif', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:28 }}>How to apply</div>
            {steps.map((s,i)=>(
              <div key={s.num} style={{ display:'flex', gap:20, paddingBottom:i<steps.length-1?28:0, position:'relative' }}>
                {i<steps.length-1&&<div style={{ position:'absolute', left:19, top:32, bottom:0, width:1, backgroundColor:'rgba(255,255,255,0.06)' }}/>}
                <div style={{ width:38, height:38, borderRadius:3, backgroundColor:'#0f1a2e', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:'Georgia,serif', fontSize:13, color:'rgba(255,255,255,0.38)', fontWeight:600 }}>{s.num}</div>
                <div style={{ paddingTop:8 }}>
                  <div style={{ fontSize:14.5, fontFamily:'system-ui,sans-serif', fontWeight:500, color:'white', marginBottom:6 }}>{s.title}</div>
                  <div style={{ fontSize:13, fontFamily:'system-ui,sans-serif', color:'rgba(255,255,255,0.38)', lineHeight:1.65 }}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.eict-admg{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </section>
  );
}

const programs = [
  { code:'B.Sc.', name:'Computer Science & Information Technology', short:'CSIT', duration:'4 Years', seats:72, description:'A comprehensive program covering algorithms, systems, AI, databases, and software engineering. The most sought-after computing program in Nepal.', accent:'#1a4fa0', size:'large' },
  { code:'B.E.', name:'Computer Engineering', short:'CE', duration:'4 Years', seats:48, description:'Bridges hardware and software — embedded systems, networking, VLSI, and systems design.', accent:'#0d7a6a', size:'medium' },
  { code:'BIT', name:'Bachelor of Information Technology', short:'BIT', duration:'3 Years', seats:48, description:'Practical-focused program balancing business, management, and information systems.', accent:'#5a3fa0', size:'medium' },
  { code:'BCA', name:'Bachelor of Computer Applications', short:'BCA', duration:'3 Years', seats:64, description:'Foundation computing with strong focus on programming, web technologies, and application development.', accent:'#a03f1a', size:'small' },
  { code:'M.Sc.', name:'Master of Science in CS', short:'M.Sc. CSIT', duration:'2 Years', seats:24, description:'Advanced research in machine learning, distributed systems, and advanced algorithms.', accent:'#1a4fa0', size:'small' },
];

function ProgramCard({ p }) {
  const big = p.size === 'large';
  return (
    <div style={{ backgroundColor:'#0f1a2e', border:'1px solid rgba(255,255,255,0.06)', borderRadius:4, padding: big?32:24, gridColumn: big?'span 2':'span 1', display:'flex', flexDirection: big?'row':'column', gap: big?48:16, alignItems: big?'center':'flex-start', transition:'border-color 0.2s,transform 0.2s', position:'relative', overflow:'hidden' }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=p.accent+'40';e.currentTarget.style.transform='translateY(-2px)';}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.06)';e.currentTarget.style.transform='translateY(0)';}}>
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, backgroundColor:p.accent, opacity:0.7 }} />
      <div style={{ flex: big?1:'unset' }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:10 }}>
          <span style={{ fontSize:11, color:p.accent, fontFamily:'system-ui,sans-serif', letterSpacing:'1.5px', textTransform:'uppercase', fontWeight:600 }}>{p.code}</span>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.28)', fontFamily:'system-ui,sans-serif' }}>{p.duration}</span>
        </div>
        <h3 style={{ fontFamily:'Georgia,serif', fontSize: big?26:20, fontWeight:600, color:'white', margin:'0 0 12px', lineHeight:1.2 }}>{p.name}</h3>
        <p style={{ fontSize:13.5, color:'rgba(255,255,255,0.43)', fontFamily:'system-ui,sans-serif', lineHeight:1.7, margin:0, maxWidth: big?400:'none' }}>{p.description}</p>
      </div>
      {big && (
        <div style={{ display:'flex', flexDirection:'column', gap:16, minWidth:180 }}>
          <div style={{ padding:'16px 20px', backgroundColor:'rgba(26,79,160,0.12)', borderRadius:3, border:'1px solid rgba(26,79,160,0.2)' }}>
            <div style={{ fontSize:28, fontFamily:'Georgia,serif', fontWeight:700, color:'white' }}>{p.seats}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.32)', fontFamily:'system-ui,sans-serif' }}>Seats available</div>
          </div>
          <a href="#admissions" style={{ padding:'10px 20px', backgroundColor:p.accent, color:'white', textDecoration:'none', borderRadius:3, fontSize:12.5, fontFamily:'system-ui,sans-serif', textAlign:'center' }}>Apply Now</a>
        </div>
      )}
      {!big && (
        <div style={{ marginTop:'auto', paddingTop:12, display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%' }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.22)', fontFamily:'system-ui,sans-serif' }}>{p.seats} seats</span>
          <a href="#admissions" style={{ fontSize:12, color:p.accent, textDecoration:'none', fontFamily:'system-ui,sans-serif' }}>Apply →</a>
        </div>
      )}
    </div>
  );
}

export default function Programs() {
  return (
    <section id="programs" style={{ backgroundColor:'#0c1424', padding:'100px 0', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48, flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'2.5px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:12 }}>Academic Programs</div>
            <h2 style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:'clamp(28px,4vw,42px)', color:'white', margin:0, lineHeight:1.1 }}>Programs we offer</h2>
          </div>
          <p style={{ fontSize:13.5, color:'rgba(255,255,255,0.32)', fontFamily:'system-ui,sans-serif', maxWidth:280, textAlign:'right', lineHeight:1.6, margin:0 }}>TU-affiliated programs meeting international computing education standards.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }} className="eict-pg">
          {programs.map(p => <ProgramCard key={p.short} p={p} />)}
        </div>
      </div>
      <style>{`@media(max-width:768px){.eict-pg{grid-template-columns:1fr!important}.eict-pg>div{grid-column:span 1!important;flex-direction:column!important}}`}</style>
    </section>
  );
}

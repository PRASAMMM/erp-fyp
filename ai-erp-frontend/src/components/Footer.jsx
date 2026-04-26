export default function Footer() {
  return (
    <>
      <section id="contact" style={{ backgroundColor:'#0c1424', padding:'80px 0 60px', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:40, paddingBottom:48, borderBottom:'1px solid rgba(255,255,255,0.06)' }} className="eict-cg">
            <div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:20 }}>Location</div>
              <p style={{ fontSize:13.5, color:'rgba(255,255,255,0.48)', fontFamily:'system-ui,sans-serif', lineHeight:1.8, margin:0 }}>Everest International College of Technology<br/>Gairidhara, Kathmandu<br/>Bagmati Province, Nepal</p>
            </div>
            <div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:20 }}>Contact</div>
              {[{label:'Admissions',value:'+977-1-4004567'},{label:'General',value:'+977-1-4004568'},{label:'Email',value:'info@eict.edu.np'}].map(c=>(
                <div key={c.label} style={{ marginBottom:8 }}>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.22)', fontFamily:'system-ui,sans-serif', marginRight:8 }}>{c.label}</span>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.52)', fontFamily:'system-ui,sans-serif' }}>{c.value}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:20 }}>Hours</div>
              {[{day:'Sun – Fri',time:'7:00 AM – 6:00 PM'},{day:'Saturday',time:'9:00 AM – 3:00 PM'},{day:'Holidays',time:'Closed'}].map(h=>(
                <div key={h.day} style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:6 }}>
                  <span style={{ fontSize:12.5, color:'rgba(255,255,255,0.32)', fontFamily:'system-ui,sans-serif' }}>{h.day}</span>
                  <span style={{ fontSize:12.5, color:'rgba(255,255,255,0.52)', fontFamily:'system-ui,sans-serif' }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <footer style={{ backgroundColor:'#080f1e', borderTop:'1px solid rgba(255,255,255,0.05)', padding:'28px 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, backgroundColor:'#1a4fa0', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, color:'white' }}>E</div>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.28)', fontFamily:'system-ui,sans-serif' }}>© 2025 Everest International College of Technology</span>
          </div>
          <div style={{ display:'flex', gap:24 }}>
            {['Privacy Policy','Terms of Use','Sitemap'].map(l=>(
              <a key={l} href="#" style={{ fontSize:11.5, color:'rgba(255,255,255,0.22)', textDecoration:'none', fontFamily:'system-ui,sans-serif', transition:'color 0.15s' }}
                onMouseEnter={e=>e.target.style.color='rgba(255,255,255,0.6)'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.22)'}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
      <style>{`@media(max-width:768px){.eict-cg{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}

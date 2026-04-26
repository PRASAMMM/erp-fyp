import LoginPanel from './LoginPanel';
export default function ERPLoginSection() {
  return (
    <section id="erp-login" style={{ backgroundColor:'#0c1424', padding:'100px 0', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 400px', gap:80, alignItems:'center' }} className="eict-eg">
          <div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'2.5px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:16 }}>Campus Portal</div>
            <h2 style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:'clamp(28px,4vw,44px)', color:'white', margin:'0 0 20px', lineHeight:1.1 }}>Your academic life,<br/>in one place.</h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.43)', fontFamily:'system-ui,sans-serif', lineHeight:1.75, margin:'0 0 40px', maxWidth:420 }}>The EICT Campus Portal gives students access to timetables, marks, attendance, and study materials. Faculty can manage course delivery. Admins oversee the entire institution.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {[{role:'Student',color:'#1a4fa0',features:'Marks · Attendance · Timetable · Materials · AI Chat'},{role:'Faculty',color:'#0d7a6a',features:'Grade entry · Attendance marking · Announcements'},{role:'Admin',color:'#5a3fa0',features:'Full oversight · Reports · User management'}].map(item=>(
                <div key={item.role} style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', backgroundColor:item.color, marginTop:6, flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:13, color:'rgba(255,255,255,0.68)', fontFamily:'system-ui,sans-serif', fontWeight:500, marginBottom:2 }}>{item.role} Portal</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.28)', fontFamily:'system-ui,sans-serif' }}>{item.features}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <LoginPanel/>
        </div>
      </div>
      <style>{`@media(max-width:900px){.eict-eg{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </section>
  );
}

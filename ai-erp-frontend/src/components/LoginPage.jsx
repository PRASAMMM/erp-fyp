import { Link } from 'react-router-dom';
import LoginPanel from './LoginPanel';

export default function LoginPage() {
  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#080f1e', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, position:'relative' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(26,79,160,0.10) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', top:24, left:28 }}>
        <Link to="/" style={{ color:'rgba(255,255,255,0.38)', textDecoration:'none', fontSize:13, fontFamily:'system-ui,sans-serif' }}>← EICT Homepage</Link>
      </div>
      <div style={{ marginBottom:32, textAlign:'center', position:'relative' }}>
        <div style={{ width:44, height:44, backgroundColor:'#1a4fa0', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontWeight:700, fontSize:18, color:'white', margin:'0 auto 10px' }}>E</div>
        <div style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:20, color:'white', marginBottom:2 }}>EICT</div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.28)', fontFamily:'system-ui,sans-serif', letterSpacing:'1.5px', textTransform:'uppercase' }}>Campus Portal</div>
      </div>
      <LoginPanel/>
      <p style={{ marginTop:20, fontSize:11.5, color:'rgba(255,255,255,0.18)', fontFamily:'system-ui,sans-serif', textAlign:'center', position:'relative' }}>For login issues contact it@eict.edu.np</p>
    </div>
  );
}

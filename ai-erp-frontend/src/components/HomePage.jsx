import Navbar          from './Navbar';
import Hero            from './Hero';
import About           from './About';
import Programs        from './Programs';
import WhyChooseUs     from './WhyChooseUs';
import ERPLoginSection from './ERPLoginSection';
import Admissions      from './Admissions';
import Footer          from './Footer';

export default function HomePage() {
  return (
    <div style={{ backgroundColor:'#080f1e', minHeight:'100vh' }}>
      <Navbar/>
      <Hero/>
      <About/>
      <Programs/>
      <WhyChooseUs/>
      <ERPLoginSection/>
      <Admissions/>
      <Footer/>
    </div>
  );
}

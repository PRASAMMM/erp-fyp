import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Programs from '../components/Programs';
import WhyChooseUs from '../components/WhyChooseUs';
import ERPLoginSection from '../components/ERPLoginSection';
import Admissions from '../components/Admissions';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#080f1e', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <About />
      <Programs />
      <WhyChooseUs />
      <ERPLoginSection />
      <Admissions />
      <Footer />
    </div>
  );
}

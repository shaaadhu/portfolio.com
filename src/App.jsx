import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Education from './components/Education/Education';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Experience from './components/Experience/Experience';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import './styles/global.css';

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Education />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}

export default App;
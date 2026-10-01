import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NetworkLab from './components/NetworkLab';
import Challenges from './components/Challenges';
import Learn from './components/Learn';
import MyNetworks from './components/MyNetworks';
import Progress from './components/Progress';
import Settings from './components/Settings';

// مكونات الواجهة التعريفية بدون Contact (Get in Touch)
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ChartSection from './components/ChartSection';
import Footer from './components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white relative">
      <Navbar />
      <Hero />
      <Features />
      <ChartSection />
      <Footer />
      
      {/* زر عائم للانتقال السريع إلى لوحة التحكم */}
      <Link 
        to="/" 
        className="fixed bottom-6 right-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all z-50 flex items-center gap-2"
      >
        🚀 Launch Dashboard
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/welcome" element={<LandingPage />} />
        <Route path="/lab" element={<NetworkLab />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/networks" element={<MyNetworks />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
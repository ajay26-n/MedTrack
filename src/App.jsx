import { Routes, Route, Link, useLocation } from "react-router-dom";
import AddPatient from "./pages/AddPatient";
import AddRecord from "./pages/AddRecord";
import ScanQR from "./pages/ScanQR";
import Dashboard from "./pages/Dashboard";
import ViewRecord from "./pages/ViewRecord";
import BlockchainDashboard from "./pages/BlockchainDashboard";

export default function App() {
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `block px-4 py-3 rounded-xl transition-all duration-300 font-medium tracking-wide ${
      isActive
        ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`;
  };

  return (
    <div className="min-h-screen flex font-sans">
      <div className="bg-orbs"></div>
      
      {/* Floating Sidebar */}
      <aside className="w-72 p-6 flex flex-col hidden md:flex">
        <div className="glass-panel h-full rounded-3xl flex flex-col overflow-hidden relative">
          
          <div className="p-8 border-b border-white/10 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-violet-500"></div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 tracking-tighter">
              MedChain.
            </h1>
            <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-widest">Decentralized V.1</p>
          </div>

          <nav className="flex-1 p-4 space-y-2 mt-4">
            <Link to="/" className={getLinkClass("/")}>Grid Overview</Link>
            <Link to="/patient" className={getLinkClass("/patient")}>Enroll Node (Patient)</Link>
            <Link to="/record" className={getLinkClass("/record")}>Inject Record</Link>
            <Link to="/scan" className={getLinkClass("/scan")}>Scan & Verify</Link>
            <Link to="/blockchain" className={getLinkClass("/blockchain")}>Ledger Status</Link>
          </nav>
        </div>
      </aside>

      {/* Main Glass Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden p-6 md:pr-6 md:pl-0 md:py-6">
        <div className="glass-panel w-full h-full rounded-3xl overflow-y-auto custom-scrollbar relative">
          <div className="p-8 md:p-12 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patient" element={<AddPatient />} />
              <Route path="/record" element={<AddRecord />} />
              <Route path="/scan" element={<ScanQR />} />
              <Route path="/record/:id" element={<ViewRecord />} />
              <Route path="/blockchain" element={<BlockchainDashboard />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}
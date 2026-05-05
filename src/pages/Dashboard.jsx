import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Simulated fetches for structure, replace with your actual API calls
    const fetchAll = async () => {
      try {
        const pRes = await axios.get("http://localhost:5000/patients");
        setPatients(pRes.data);
        const rRes = await axios.get("http://localhost:5000/records");
        setRecords(rRes.data);
      } catch (e) { console.error(e); }
    };
    fetchAll();
  }, []);

  return (
    <div className="space-y-10 animate-fade-in">
      <header>
        <h1 className="text-4xl font-bold text-white tracking-tight">System Overview</h1>
        <p className="text-cyan-400 mt-2 font-mono text-sm uppercase tracking-widest">Network Active • 0ms latency</p>
      </header>

      {/* Glowing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all"></div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-2">Registered Nodes</p>
          <p className="text-6xl font-black text-white">{patients.length}</p>
        </div>
        
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-all"></div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-2">Encrypted Records</p>
          <p className="text-6xl font-black text-white">{records.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transparent List */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
          <div className="px-6 py-5 border-b border-white/10 bg-black/20">
            <h2 className="text-lg font-semibold text-white">Latest Patient Entries</h2>
          </div>
          <div className="divide-y divide-white/5">
            {patients.map(p => (
              <div key={p.id} className="px-6 py-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                <div>
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-sm text-cyan-400 font-mono mt-1">{p.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transparent List */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
          <div className="px-6 py-5 border-b border-white/10 bg-black/20">
            <h2 className="text-lg font-semibold text-white">Immutable Logs</h2>
          </div>
          <div className="divide-y divide-white/5">
            {records.map(r => (
              <Link to={`/record/${r.id}`} key={r.id} className="block px-6 py-4 hover:bg-white/5 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                   <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">{r.patient_name}</p>
                   <span className="text-[10px] uppercase tracking-widest border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded-full bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Secured</span>
                </div>
                <p className="text-xs text-slate-500 font-mono truncate">Hash: {r.record_hash}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
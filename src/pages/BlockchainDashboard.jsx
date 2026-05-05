import { useEffect, useState } from "react";
import axios from "axios";

export default function BlockchainDashboard() {
  const [blocks, setBlocks] = useState([]);
  const [chainStatus, setChainStatus] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const res = await axios.get("http://localhost:5000/records/blockchain/validate");
        setChainStatus(res.data);
        const blockRes = await axios.get("http://localhost:5000/blockchain-records");
        setBlocks(blockRes.data);
    } catch(err) {
        console.error(err);
    }
  };

  return (
    <div className="max-w-5xl bg-slate-900 p-8 shadow-xl rounded-2xl border border-slate-700 text-slate-300 font-mono">
      
      <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
        <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
                Blockchain Ledger
            </h2>
            <p className="text-sm text-slate-400 mt-1">Real-time immutable record visualization</p>
        </div>
        
        {chainStatus && (
            <div className={`px-4 py-2 rounded-full text-sm font-bold border ${chainStatus.chainValid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                {chainStatus.chainValid ? "● SYSTEM SECURE" : "⚠ CHAIN CORRUPTED"}
            </div>
        )}
      </div>

      <div className="space-y-6">
        {blocks.map((block, index) => (
          <div key={block.id} className="relative pl-8 border-l-2 border-slate-700 pb-4 last:border-0 last:pb-0 group">
            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-800 border-2 border-blue-500 group-hover:scale-125 transition-transform"></div>
            
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                  <span className="text-blue-400 font-bold">Block #{block.id}</span>
                  <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">REC: {block.record_id}</span>
              </div>
              
              <div className="space-y-2 text-xs break-all">
                <div>
                    <span className="text-slate-500 block mb-0.5">PREVIOUS HASH</span>
                    <span className="text-slate-300">{block.previous_hash}</span>
                </div>
                <div>
                    <span className="text-slate-500 block mb-0.5">BLOCK HASH</span>
                    <span className="text-emerald-400 font-semibold">{block.block_hash}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {blocks.length === 0 && <p className="text-slate-500">Initializing ledger data...</p>}
      </div>
    </div>
  );
}
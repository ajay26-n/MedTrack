import { useEffect, useState } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ScanQR() {
  const [recordId, setRecordId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [data, setData] = useState(null);
  const [verification, setVerification] = useState(null);
  const [status, setStatus] = useState({ loading: false, msg: "", error: false });

  // 🔹 Send OTP
  const sendOTP = async (id) => {
    try {
      setStatus({ loading: true, msg: "Initiating secure connection...", error: false });
      await axios.post("http://localhost:5000/otp/send", { record_id: id });
      setOtpSent(true);
      setStatus({ loading: false, msg: "Authorization code sent to patient's registered email.", error: false });
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, msg: "Failed to dispatch authorization code.", error: true });
    }
  };

  // 🔹 Verify OTP + Fetch Record + Verify Blockchain
  const verifyOTP = async () => {
    try {
      setStatus({ loading: true, msg: "Verifying cryptographic signatures...", error: false });
      
      // 1. Verify OTP
      await axios.post("http://localhost:5000/otp/verify", { record_id: recordId, otp });
      
      // 2. Fetch record details (Fixed endpoint)
      const recordRes = await axios.get(`http://localhost:5000/records/${recordId}`);
      
      // 3. Fetch blockchain verification status
      const verifyRes = await axios.get(`http://localhost:5000/records/verify/${recordId}`);

      setData(recordRes.data);
      setVerification(verifyRes.data);
      setStatus({ loading: false, msg: "", error: false });
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, msg: "Authentication failed. Invalid or expired OTP.", error: true });
    }
  };

  // 🔹 QR Scanner Setup (Fixed for React Lifecycle)
  useEffect(() => {
    // If we already have an ID, don't mount the scanner
    if (recordId) return;

    // Initialize scanner
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);

    scanner.render(
      (decodedText) => {
        console.log("Scanned Data:", decodedText);
        
        // Smart Parsing: Extracts ID whether it's a URL (http://.../123) or just a raw ID (123)
        const id = decodedText.includes("/") ? decodedText.split("/").pop() : decodedText;
        
        setRecordId(id);
        sendOTP(id);
        
        // Stop scanning immediately after successful read
        scanner.clear().catch(e => console.error("Failed to clear scanner on success", e));
      },
      (error) => { 
        // We leave this empty so it doesn't spam the console every frame it doesn't see a QR code
      }
    );

    // Cleanup function when component unmounts
    return () => {
      scanner.clear().catch((error) => console.error("Failed to clear scanner on unmount", error));
    };
  }, [recordId]); // Re-run if recordId changes

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      
      <div className="glass-panel p-10 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Access Protocol</h2>
        <p className="text-slate-400 font-mono text-sm mb-8 uppercase tracking-widest">Awaiting cryptographic handshake...</p>

        {/* CSS fix for the scanner container to ensure it stays visible and centered */}
        {!recordId && (
          <div className="rounded-2xl overflow-hidden border-2 border-dashed border-cyan-500/30 bg-black/40 p-2 relative shadow-[0_0_30px_rgba(6,182,212,0.1)] flex justify-center items-center min-h-[300px]">
            <div className="absolute inset-0 bg-cyan-500/5 animate-pulse pointer-events-none"></div>
            <div id="reader" className="w-full max-w-sm [&>div]:border-none [&_video]:rounded-lg" />
          </div>
        )}

        {status.msg && (
          <div className={`mt-6 p-4 rounded-xl text-sm font-mono flex items-center gap-3 border ${status.error ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>
             {status.loading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
             {status.msg}
          </div>
        )}

        {otpSent && !data && (
          <div className="mt-8 animate-fade-in">
            <label className="block mb-3 text-xs font-mono uppercase tracking-widest text-cyan-400">Authorization Key Required</label>
            <div className="flex gap-4">
              <input 
                type="text" 
                maxLength="6"
                placeholder="000000" 
                className="flex-1 glass-input text-center text-3xl tracking-[0.7em] font-mono text-white placeholder-slate-700 h-16 uppercase"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
              />
              <button 
                onClick={verifyOTP} 
                disabled={status.loading || otp.length < 4}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                DECRYPT
              </button>
            </div>
          </div>
        )}
      </div>

      {data && verification && (
        <div className="glass-panel rounded-3xl overflow-hidden animate-fade-in border border-white/10">
           <div className={`px-8 py-5 flex items-center justify-between border-b border-white/10 ${verification.verified ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
              <span className={`font-mono uppercase tracking-widest text-sm font-bold flex items-center gap-3 ${verification.verified ? 'text-emerald-400' : 'text-red-400'}`}>
                {verification.verified ? (
                  <>✓ Ledger Verified</>
                ) : (
                  <>⚠ Data Tampering Detected</>
                )}
              </span>
              <span className="text-slate-400 text-xs font-mono px-3 py-1 bg-black/40 rounded-full border border-white/5">ID: {recordId}</span>
           </div>

           <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">Subject</p>
                  <p className="text-xl font-bold text-white">{data.patient_name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">Authorizing Node</p>
                  <p className="text-xl font-bold text-white">{data.doctor_name}</p>
                </div>
              </div>

              <div className="space-y-6 bg-black/20 p-6 rounded-2xl border border-white/5">
                <div>
                  <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest mb-2">Diagnostic Payload</p>
                  <p className="text-slate-300 leading-relaxed">{data.diagnosis}</p>
                </div>
                <div>
                  <p className="text-[10px] text-violet-400 font-mono uppercase tracking-widest mb-2">Prescription Directives</p>
                  <p className="text-slate-300 leading-relaxed">{data.prescription}</p>
                </div>
              </div>

              <div className="pt-4">
                 <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-3">Cryptographic Signature</p>
                 <div className="glass-panel p-4 rounded-xl flex items-center">
                   <code className="text-emerald-400 text-xs break-all font-mono opacity-80">{verification.blockchainHash || "0x000000000000000000"}</code>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
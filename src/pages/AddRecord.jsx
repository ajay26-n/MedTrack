import { useState, useEffect } from "react";
import axios from "axios";

export default function AddRecord() {
  const [form, setForm] = useState({ patient_id: "", doctor_id: 1, hospital_id: 1, diagnosis: "", prescription: "" });
  const [patients, setPatients] = useState([]);
  const [qr, setQr] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/patients");
        setPatients(res.data);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await axios.post("http://localhost:5000/records/add", form);
      setStatus({ type: "success", message: "Medical record securely hashed and stored." });
      setQr(res.data.qr);
      setForm({ patient_id: "", doctor_id: 1, hospital_id: 1, diagnosis: "", prescription: "" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Failed to securely store the record. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 transition-all outline-none resize-none";

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-8 py-6">
        <h2 className="text-2xl font-bold text-slate-900">Create Medical Record</h2>
        <p className="text-sm text-slate-500 mt-1">Append a new, immutable record to the patient's history.</p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">Select Patient</label>
            <select name="patient_id" value={form.patient_id} onChange={handleChange} className={inputClass} required>
              <option value="" disabled>-- Choose a registered patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">Clinical Diagnosis</label>
            <textarea name="diagnosis" rows="3" placeholder="Enter detailed diagnostic findings..." value={form.diagnosis} onChange={handleChange} className={inputClass} required />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">Medical Prescription</label>
            <textarea name="prescription" rows="3" placeholder="Medications, dosages, and instructions..." value={form.prescription} onChange={handleChange} className={inputClass} required />
          </div>

          

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 font-medium px-5 py-3 rounded-lg transition-all duration-200 ${
              isLoading ? "bg-blue-400 cursor-not-allowed text-white" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Encrypting & Saving...
              </>
            ) : "Securely Save Record"}
          </button>
        </form>

        {status.message && (
          <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
            {status.message}
          </div>
        )}

        {qr && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center animate-fade-in">
            <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Patient QR Access</h3>
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
               <img src={qr} alt="Secure QR Code" className="w-48 h-48 object-contain" />
            </div>
            <p className="text-xs text-slate-500 mt-3">Scan this code to request verified access to the record.</p>
          </div>
        )}
      </div>
    </div>
  );
}
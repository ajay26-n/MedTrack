import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/records/${id}`)
      .then(res => {
        setRecord(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 gap-3">
         <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
         <span>Retrieving secure record...</span>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900">Record Not Found</h3>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Dashboard
      </button>

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Medical Record Details</h2>
            <p className="text-sm text-slate-500 mt-1">Immutable file overview</p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Read Only
          </span>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Patient</span>
              <span className="font-semibold text-slate-900">{record.patient_name}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Attending Doctor</span>
              <span className="font-semibold text-slate-900">{record.doctor_name}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Hospital/Clinic</span>
              <span className="font-semibold text-slate-900">{record.hospital_name}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Clinical Diagnosis</h3>
              <p className="text-slate-700 leading-relaxed border-l-4 border-blue-500 pl-4 py-1">{record.diagnosis}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Prescribed Action</h3>
              <p className="text-slate-700 leading-relaxed border-l-4 border-emerald-500 pl-4 py-1">{record.prescription}</p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              Blockchain Security Hash
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 flex items-center justify-between">
              <code className="text-emerald-400 text-sm break-all font-mono">{record.record_hash}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
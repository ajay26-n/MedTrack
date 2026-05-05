import { useState } from "react";
import axios from "axios";

export default function AddPatient() {
  const [form, setForm] = useState({ name: "", age: "", phone: "", email: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/patients/add", form);
      setMsg("✅ Patient added successfully");
      setForm({ name: "", age: "", phone: "", email: "" });
      setTimeout(() => setMsg(""), 3000); // clear message after 3s
    } catch (err) {
      console.log(err);
      setMsg("❌ Failed to add patient");
    }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 transition-all outline-none";

  return (
    <div className="max-w-2xl bg-white shadow-sm border border-slate-100 rounded-2xl p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Register Patient</h2>
        <p className="text-sm text-slate-500 mt-1">Enter details to enroll a new patient into the system.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
          <label className="block mb-1.5 text-sm font-medium text-slate-700">Full Name</label>
          <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} className={inputClass} required />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">Age</label>
            <input type="number" name="age" placeholder="30" value={form.age} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700">Phone</label>
            <input type="text" name="phone" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} className={inputClass} required />
          </div>
        </div>

        

        <div>
          <label className="block mb-1.5 text-sm font-medium text-slate-700">Email Address</label>
          <input type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} className={inputClass} required />
        </div>

        <button className="w-full mt-4 bg-blue-600 text-white font-medium px-5 py-3 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          Save Patient Record
        </button>

      </form>

      {msg && (
        <div className={`mt-6 p-4 rounded-lg text-sm font-medium ${msg.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg}
        </div>
      )}
    </div>

    
  );
}
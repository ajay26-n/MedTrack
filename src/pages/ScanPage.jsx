import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ScanPage() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/records/${id}`)
      .then(res => setRecord(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!record) return <p className="p-6">Loading record...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Patient Record</h1>

      <div className="bg-white shadow p-6 rounded">
        <p><b>Patient:</b> {record.patient_name}</p>
        <p><b>Doctor:</b> {record.doctor_name}</p>
        <p><b>Hospital:</b> {record.hospital_name}</p>
        <p><b>Diagnosis:</b> {record.diagnosis}</p>
        <p><b>Prescription:</b> {record.prescription}</p>
      </div>
    </div>
  );
}
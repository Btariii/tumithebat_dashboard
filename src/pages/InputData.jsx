import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/FirebaseContext";
import { IdCard, ActivitySquare, ArrowRight } from "lucide-react";

export default function InputData() {
  const { patient, setPatient, addPatient, updatePatientRecord } = useFirebase();
  const navigate = useNavigate();

  const getSelectClassName = (value) => (value ? "" : "select-placeholder");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const hitungBraden = () => {
    return (
      Number(patient.persepsiSensori || 0) +
      Number(patient.kelembapan || 0) +
      Number(patient.aktivitas || 0) +
      Number(patient.mobilitas || 0) +
      Number(patient.nutrisi || 0) +
      Number(patient.gesekan || 0)
    );
  };

  const bradenScore = hitungBraden();

  const isFormValid = () => {
    return (
      patient.nama &&
      patient.umur &&
      patient.jenisKelamin &&
      patient.persepsiSensori &&
      patient.kelembapan &&
      patient.aktivitas &&
      patient.mobilitas &&
      patient.nutrisi &&
      patient.gesekan
    );
  };

  const handleKosongkan = () => {
    setPatient({
      nama: "",
      umur: "",
      jenisKelamin: "",
      persepsiSensori: "",
      kelembapan: "",
      aktivitas: "",
      mobilitas: "",
      nutrisi: "",
      gesekan: "",
    });
  };

  const handleLihatRisiko = () => {
    if (isFormValid()) {
      navigate("/monitoring");
    } else {
      alert("Please complete all fields before viewing risk!");
    }
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Please complete all fields before saving!");
      return;
    }
    
    const patientData = {
      nama: patient.nama,
      jenisKelamin: patient.jenisKelamin,
      umur: patient.umur,
      persepsiSensori: patient.persepsiSensori,
      kelembapan: patient.kelembapan,
      aktivitas: patient.aktivitas,
      mobilitas: patient.mobilitas,
      nutrisi: patient.nutrisi,
      gesekan: patient.gesekan,
      bradenScore: hitungBraden(),
      risk: hitungBraden() <= 14 ? "HIGH" : "LOW"
    };

    if (patient.id) {
      await updatePatientRecord(patient.id, patientData);
    } else {
      await addPatient(patientData);
    }

    setPatient({
      nama: "",
      umur: "",
      jenisKelamin: "",
      persepsiSensori: "",
      kelembapan: "",
      aktivitas: "",
      mobilitas: "",
      nutrisi: "",
      gesekan: "",
    });

    navigate("/patients");
  };

  return (
    <div>
      <div className="page-header">
        <h1>Input Patient Data</h1>
        <p>Enter patient details and conduct Braden Scale assessment.</p>
      </div>

      <form onSubmit={handleSimpan}>
        <div className="form-grid">
          <div className="card">
            <div className="card-title">
              <IdCard size={16} />
              Identity
            </div>
            
            <div className="form-group">
              <label>Patient Name</label>
              <input
                name="nama"
                placeholder="Enter full name"
                value={patient.nama}
                onChange={handleChange}
              />
            </div>

              <div className="form-group" style={{ marginTop: "16px" }}>
              <label>Age</label>
              <input
                type="number"
                name="umur"
                placeholder="Years"
                value={patient.umur}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label>Gender</label>
              <select
                name="jenisKelamin"
                className={getSelectClassName(patient.jenisKelamin)}
                value={patient.jenisKelamin}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <ActivitySquare size={16} />
              Braden Scale
            </div>
            
            <div className="form-grid" style={{ gap: "16px" }}>
              <div className="form-group">
                <label>Sensory Perception</label>
                <select name="persepsiSensori" className={getSelectClassName(patient.persepsiSensori)} value={patient.persepsiSensori} onChange={handleChange}>
                  <option value="">Select sensory perception</option>
                  <option value="1">1 - Completely Limited</option>
                  <option value="2">2 - Very Limited</option>
                  <option value="3">3 - Slightly Limited</option>
                  <option value="4">4 - No Impairment</option>
                </select>
              </div>

              <div className="form-group">
                <label>Moisture</label>
                <select name="kelembapan" className={getSelectClassName(patient.kelembapan)} value={patient.kelembapan} onChange={handleChange}>
                  <option value="">Select moisture level</option>
                  <option value="1">1 - Always Moist</option>
                  <option value="2">2 - Often Moist</option>
                  <option value="3">3 - Occasionally Moist</option>
                  <option value="4">4 - Rarely Moist</option>
                </select>
              </div>

              <div className="form-group">
                <label>Activity</label>
                <select name="aktivitas" className={getSelectClassName(patient.aktivitas)} value={patient.aktivitas} onChange={handleChange}>
                  <option value="">Select activity level</option>
                  <option value="1">1 - Bedfast / Confined to bed</option>
                  <option value="2">2 - Chairfast / Confined to chair</option>
                  <option value="3">3 - Walks occasionally</option>
                  <option value="4">4 - Walks frequently</option>
                </select>
              </div>

              <div className="form-group">
                <label>Mobility</label>
                <select name="mobilitas" className={getSelectClassName(patient.mobilitas)} value={patient.mobilitas} onChange={handleChange}>
                  <option value="">Select mobility level</option>
                  <option value="1">1 - Completely Immobile</option>
                  <option value="2">2 - Very Limited</option>
                  <option value="3">3 - Slightly Limited</option>
                  <option value="4">4 - No Limit</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nutrition</label>
                <select name="nutrisi" className={getSelectClassName(patient.nutrisi)} value={patient.nutrisi} onChange={handleChange}>
                  <option value="">Select nutrition condition</option>
                  <option value="1">1 - Very Poor</option>
                  <option value="2">2 - Poor</option>
                  <option value="3">3 - Adequate</option>
                  <option value="4">4 - Good</option>
                </select>
              </div>

              <div className="form-group">
                <label>Friction / Shear</label>
                <select name="gesekan" className={getSelectClassName(patient.gesekan)} value={patient.gesekan} onChange={handleChange}>
                  <option value="">Select friction/shear condition</option>
                  <option value="1">1 - Problem</option>
                  <option value="2">2 - Potential problem</option>
                  <option value="3">3 - No apparent problem</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="assessment-result">
          <div>
            <h3>Assessment Result</h3>
            <h2>Total Braden Score: <span>{bradenScore}</span></h2>
          </div>
          <div className="result-actions">
            <button type="button" className="btn-outline" onClick={handleKosongkan}>Reset</button>
            <button type="button" className="btn-outline" onClick={handleLihatRisiko}>Monitor Risk</button>
            <button type="submit" className="btn-primary" style={{ padding: "10px 20px" }}>
              {patient.id ? "Save Update" : "Save Record"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

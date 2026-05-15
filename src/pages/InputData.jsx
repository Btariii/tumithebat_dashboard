import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/FirebaseContext";
import { IdCard, ActivitySquare, ArrowRight } from "lucide-react";

export default function InputData() {
  const { patient, setPatient, addPatient, updatePatientRecord } = useFirebase();
  const navigate = useNavigate();

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
      alert("Isi semua data terlebih dahulu untuk melihat risiko!");
    }
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Lengkapi semua data terlebih dahulu!");
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
      risk: hitungBraden() <= 14 ? "TINGGI" : "RENDAH"
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
        <h1>Input Data Pasien</h1>
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
              <label>NAMA PASIEN</label>
              <input
                name="nama"
                placeholder="Enter full name"
                value={patient.nama}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label>UMUR</label>
              <input
                type="number"
                name="umur"
                placeholder="Years"
                value={patient.umur}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label>JENIS KELAMIN</label>
              <select
                name="jenisKelamin"
                value={patient.jenisKelamin}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Perempuan">Perempuan</option>
                <option value="Laki-laki">Laki-laki</option>
              </select>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <ActivitySquare size={16} />
              Skala Braden
            </div>
            
            <div className="form-grid" style={{ gap: "16px" }}>
              <div className="form-group">
                <label>PERSEPSI</label>
                <select name="persepsiSensori" value={patient.persepsiSensori} onChange={handleChange}>
                  <option value="">Select level</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              <div className="form-group">
                <label>KELEMBAPAN</label>
                <select name="kelembapan" value={patient.kelembapan} onChange={handleChange}>
                  <option value="">Select level</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              <div className="form-group">
                <label>AKTIVITAS</label>
                <select name="aktivitas" value={patient.aktivitas} onChange={handleChange}>
                  <option value="">Select level</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              <div className="form-group">
                <label>MOBILITAS</label>
                <select name="mobilitas" value={patient.mobilitas} onChange={handleChange}>
                  <option value="">Select level</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              <div className="form-group">
                <label>NUTRISI</label>
                <select name="nutrisi" value={patient.nutrisi} onChange={handleChange}>
                  <option value="">Select level</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              <div className="form-group">
                <label>GESEKAN</label>
                <select name="gesekan" value={patient.gesekan} onChange={handleChange}>
                  <option value="">Select level</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="assessment-result">
          <div>
            <h3>Assessment Result</h3>
            <h2>Total Skor Braden: <span>{bradenScore}</span></h2>
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

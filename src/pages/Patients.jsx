import { Search, Eye, Edit2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/FirebaseContext";

export default function Patients() {
  const { patientsList, setPatient, deletePatientRecord } = useFirebase();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [viewPatient, setViewPatient] = useState(null);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const filteredPatients = patientsList.filter(p => {
    const matchSearch = p.nama?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Semua" || p.risk === filter.toUpperCase();
    return matchSearch && matchFilter;
  });

  const handleEdit = (p) => {
    setPatient(p);
    navigate("/dashboard");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data pasien ini?")) {
      await deletePatientRecord(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Daftar Pasien</h1>
        <p>Manajemen data dan pemantauan risiko dekubitus.</p>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Cari nama pasien..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <div 
            className={`pill ${filter === "Semua" ? "active" : ""}`}
            onClick={() => setFilter("Semua")}
          >
            <div className="pill-dot all"></div> Semua
          </div>
          <div 
            className={`pill ${filter === "Tinggi" ? "active" : ""}`}
            onClick={() => setFilter("Tinggi")}
          >
            <div className="pill-dot high"></div> Risiko Tinggi
          </div>
          <div 
            className={`pill ${filter === "Rendah" ? "active" : ""}`}
            onClick={() => setFilter("Rendah")}
          >
            <div className="pill-dot low"></div> Rendah
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>NAMA PASIEN</th>
              <th>GENDER</th>
              <th>UMUR</th>
              <th>RISIKO DEKUBITUS</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="patient-name-cell">
                    <div className="initials">{getInitials(p.nama || "")}</div>
                    <span>{p.nama}</span>
                  </div>
                </td>
                <td>{p.jenisKelamin === "Laki-laki" ? "L" : "P"}</td>
                <td>{p.umur} thn</td>
                <td>
                  <div className={`risk-tag ${p.risk === "TINGGI" ? "high" : "low"}`}>
                    <div className={`pill-dot ${p.risk === "TINGGI" ? "high" : "low"}`}></div>
                    {p.risk || "RENDAH"}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => setViewPatient(p)}><Eye size={16} /></button>
                    <button className="btn-icon" onClick={() => handleEdit(p)}><Edit2 size={16} /></button>
                    <button className="btn-icon" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="pagination">
          <div>Menampilkan 1-{filteredPatients.length} dari {patientsList.length} pasien</div>
          <div className="page-controls">
            <button className="page-btn">Prev</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">Next</button>
          </div>
        </div>
      </div>

      {viewPatient && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div className="card" style={{ width: "400px", position: "relative" }}>
            <button className="btn-icon" style={{ position: "absolute", top: "16px", right: "16px", border: "none" }} onClick={() => setViewPatient(null)}>
              <X size={20} />
            </button>
            <h2 style={{ color: "#fff", marginBottom: "24px", fontSize: "20px" }}>Detail Pasien</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "#e5e7eb", fontSize: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8b949e" }}>Nama</span>
                <b>{viewPatient.nama}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8b949e" }}>Umur</span>
                <b>{viewPatient.umur} Tahun</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8b949e" }}>Jenis Kelamin</span>
                <b>{viewPatient.jenisKelamin}</b>
              </div>
              <hr style={{ borderColor: "#30363d", margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8b949e" }}>Skor Braden</span>
                <b>{viewPatient.bradenScore}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#8b949e" }}>Risiko Dekubitus</span>
                <div className={`risk-tag ${viewPatient.risk === "TINGGI" ? "high" : "low"}`}>
                  {viewPatient.risk || "RENDAH"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

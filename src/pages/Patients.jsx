import { Search, Eye, Edit2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/FirebaseContext";

export default function Patients() {
  const { patientsList, setPatient, deletePatientRecord } = useFirebase();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
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
    const matchFilter = filter === "All" || p.risk === filter.toUpperCase();
    return matchSearch && matchFilter;
  });

  const handleEdit = (p) => {
    setPatient(p);
    navigate("/dashboard");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      await deletePatientRecord(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Patient List</h1>
        <p>Patient data management and pressure injury risk monitoring.</p>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search patient name..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <div 
            className={`pill ${filter === "All" ? "active" : ""}`}
            onClick={() => setFilter("All")}
          >
            <div className="pill-dot all"></div> All
          </div>
          <div 
            className={`pill ${filter === "High" ? "active" : ""}`}
            onClick={() => setFilter("High")}
          >
            <div className="pill-dot high"></div> High
          </div>
          <div 
            className={`pill ${filter === "Low" ? "active" : ""}`}
            onClick={() => setFilter("Low")}
          >
            <div className="pill-dot low"></div> Low
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Pressure Ulcer Risk</th>
              <th>Actions</th>
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
                <td>{p.jenisKelamin === "Male" ? "M" : "F"}</td>
                <td>{p.umur} yrs</td>
                <td>
                  <div className={`risk-tag ${p.risk === "HIGH" ? "high" : "low"}`}>
                    <div className={`pill-dot ${p.risk === "HIGH" ? "high" : "low"}`}></div>
                    {p.risk || "LOW"}
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
          <div>Showing 1-{filteredPatients.length} of {patientsList.length} patients</div>
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
            <h2 style={{ color: "var(--text-bright)", marginBottom: "20px", fontSize: "20px" }}>Patient Details</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "var(--text-main)", fontSize: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Name</span>
                <b>{viewPatient.nama}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Age</span>
                <b>{viewPatient.umur} yrs</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Gender</span>
                <b>{viewPatient.jenisKelamin}</b>
              </div>
              <hr style={{ borderColor: "var(--border-color)", margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Braden Score</span>
                <b>{viewPatient.bradenScore}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)" }}>Pressure Ulcer Risk</span>
                <div className={`risk-tag ${viewPatient.risk === "HIGH" ? "high" : "low"}`}>
                  {viewPatient.risk || "LOW"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

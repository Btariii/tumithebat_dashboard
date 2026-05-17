import { useFirebase } from "../context/FirebaseContext";
import { IdCard, Gauge, Clock, BellRing, CheckCircle, AlertCircle, Info, Loader } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const {
    pressure,
    servoStatus,
    prosesReposisi,
    timerReposisi,
    tahapReposisi,
    jumlahReposisi,
    lastReposition,
    patient,
  } = useFirebase();

  const [isCalculating, setIsCalculating] = useState(true);
  const [displayPressure, setDisplayPressure] = useState(0);
  const [displayBraden, setDisplayBraden] = useState(0);

  useEffect(() => {
    // Scramble effect
    const scrambleInterval = setInterval(() => {
      setDisplayPressure(Math.random() * 80);
      setDisplayBraden(Math.floor(Math.random() * 20));
    }, 100);

    const timeout = setTimeout(() => {
      setIsCalculating(false);
      clearInterval(scrambleInterval);
    }, 1500);

    return () => {
      clearInterval(scrambleInterval);
      clearTimeout(timeout);
    };
  }, []);

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
  const finalBraden = isCalculating ? displayBraden : bradenScore;
  const finalPressure = isCalculating ? displayPressure : pressure;

  const risiko = finalBraden <= 14 ? "TINGGI" : "RENDAH";
  const tekananTinggi = finalPressure >= 35;

  const angle = Math.min(Math.max((finalPressure / 100) * 180 - 90, -90), 90);

  const waktuReposisi = lastReposition.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  function formatTimer(totalDetik) {
    const menit = Math.floor(totalDetik / 60);
    const detik = totalDetik % 60;
    return `${menit.toString().padStart(2, "0")}:${detik.toString().padStart(2, "0")}`;
  }

  return (
    <div>
      <div className="page-header animate-fade-in">
        <h1>Dashboard Monitoring Tekanan Tumit</h1>
        <p>Real-time pressure analytics and patient status overview.</p>
      </div>

      <div className="dashboard-grid">
        <div className="card animate-fade-in delay-1">
          <div className="card-title">
            <IdCard size={16} />
            IDENTITAS PASIEN
          </div>
          
          <div className="patient-info-row">
            <span>Nama</span>
            <span>:</span>
            <span>{patient.nama || "dadaw"}</span>
          </div>
          <div className="patient-info-row">
            <span>Umur</span>
            <span>:</span>
            <span>{patient.umur || "12"} Tahun</span>
          </div>
          <div className="patient-info-row">
            <span>Jenis Kelamin</span>
            <span>:</span>
            <span>{patient.jenisKelamin || "Perempuan"}</span>
          </div>
        </div>

        <div className="card risk-card animate-fade-in delay-2" style={{ border: isCalculating ? "1px solid #8b949e" : "1px solid #d9f924" }}>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#fff", lineHeight: "1.2" }}>
              RISIKO<br />DEKUBITUS
            </h2>
            <p style={{ color: "#8b949e", fontSize: "12px", letterSpacing: "2px", marginTop: "8px", textTransform: "uppercase" }}>
              {isCalculating ? "Mengkalkulasi..." : "Skor Skala Braden"}
            </p>
          </div>
          <div className="risk-score">
            <h1 style={{ color: isCalculating ? "#8b949e" : (risiko === "TINGGI" ? "#ef4444" : "#22c55e") }}>
              {finalBraden}
            </h1>
            <div className="risk-badge" style={{ 
              background: isCalculating ? "rgba(139, 148, 158, 0.2)" : (risiko === "TINGGI" ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)"),
              color: isCalculating ? "#8b949e" : (risiko === "TINGGI" ? "#ef4444" : "#22c55e") 
            }}>
              {isCalculating ? "..." : risiko}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
        <div className="card animate-fade-in delay-3">
          <div className="card-title">
            <Gauge size={16} />
            {isCalculating ? "ANALYZING SENSOR..." : "TEKANAN TUMIT"}
          </div>
          
          <div className="gauge-container">
            <div className="gauge">
              <div className="gauge-bg"></div>
              <div
                className="needle"
                style={{ transform: `rotate(${angle}deg)` }}
              ></div>
              <div className="gauge-value">
                <h3>{finalPressure.toFixed(1)}</h3>
                <p>mmHg</p>
              </div>
            </div>
            
            <div className="gauge-minmax">
              <span>0</span>
              <span>100</span>
            </div>

            <div className={`status-badge ${isCalculating ? "" : (tekananTinggi ? "danger" : "safe")}`} style={{ border: isCalculating ? "1px solid #30363d" : undefined, color: isCalculating ? "#8b949e" : undefined, background: isCalculating ? "transparent" : undefined }}>
              {isCalculating ? "Menghitung..." : (tekananTinggi ? "Tekanan Tinggi" : "Aman")}
            </div>
            <p className="limit-text">Batas Aman: &lt; 35 mmHg</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card animate-fade-in delay-4">
            <div className="card-title">
              <Clock size={16} />
              WAKTU REPOSISI TERAKHIR
            </div>
            
            <div className="timer-display">
              <h1>{waktuReposisi}</h1>
              <div className="timer-box">
                <span>Timer Reposisi</span>
                <b>{formatTimer(timerReposisi)}</b>
                <p>Tahap: {servoStatus} {tahapReposisi ? `(${tahapReposisi})` : ""}</p>
              </div>
            </div>
          </div>

          <div className="card animate-fade-in delay-5">
            <div className="card-title">
              <BellRing size={16} />
              ALARM / NOTIFIKASI
            </div>

            {isCalculating ? (
              <div className="notif-box" style={{ background: "transparent", border: "1px dashed #30363d" }}>
                <div className="icon-circle" style={{ background: "#161b22", color: "#8b949e" }}>
                  <Loader size={24} className="animate-spin" />
                </div>
                <div className="notif-content">
                  <h3>Menganalisa Status</h3>
                  <p>Mohon tunggu sebentar...</p>
                </div>
              </div>
            ) : (
              <div className={`notif-box ${tekananTinggi ? "red" : "green"}`}>
                <div className="icon-circle">
                  {tekananTinggi ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                </div>
                <div className="notif-content">
                  <h3>{tekananTinggi ? "PERINGATAN" : "AMAN"}</h3>
                  <p>
                    {tekananTinggi
                      ? `Tekanan mencapai ${finalPressure.toFixed(1)} mmHg`
                      : "Tekanan dalam batas normal"}
                  </p>
                </div>
              </div>
            )}

            <div className="notif-box" style={{ background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
              <div className="icon-circle" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
                <Info size={24} />
              </div>
              <div className="notif-content">
                <h3>Reposisi Otomatis</h3>
                <p>
                  {prosesReposisi
                    ? `Servo berada di posisi ${servoStatus}`
                    : "Menunggu tekanan tinggi"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", padding: "12px 16px", borderRadius: "8px", marginTop: "16px", fontSize: "14px", color: "#e5e7eb" }}>
              <span>Jumlah Reposisi</span>
              <b style={{ color: "#d9f924" }}>{jumlahReposisi} Kali</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

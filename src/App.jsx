import { useEffect, useRef, useState } from "react";
import "./App.css";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAcCbH6MltXtOpCNgJjQnSL2S7odl0r_LA",
  authDomain: "tumithebat.firebaseapp.com",
  databaseURL:
    "https://tumithebat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tumithebat",
  storageBucket: "tumithebat.firebasestorage.app",
  messagingSenderId: "339694970123",
  appId: "1:339694970123:web:6a780efed4b7e40dc0ae0e",
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

function App() {
  const [page, setPage] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [patient, setPatient] = useState({
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

  const [pressure, setPressure] = useState(0);
  const [servoStatus, setServoStatus] = useState("DIAM");
  const [prosesReposisi, setProsesReposisi] = useState(false);
  const [timerReposisi, setTimerReposisi] = useState(0);
  const [tahapReposisi, setTahapReposisi] = useState(0);
  const [jumlahReposisi, setJumlahReposisi] = useState(0);
  const [lastReposition, setLastReposition] = useState(new Date());

  const prevReposisi = useRef(0);

  function login(e) {
    e.preventDefault();

    if (username === "admin" && password === "12345") {
      setPage("input");
    } else {
      alert("Username atau password salah");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  }

  function hitungBraden() {
    return (
      Number(patient.persepsiSensori || 0) +
      Number(patient.kelembapan || 0) +
      Number(patient.aktivitas || 0) +
      Number(patient.mobilitas || 0) +
      Number(patient.nutrisi || 0) +
      Number(patient.gesekan || 0)
    );
  }

  function simpanPasien(e) {
    e.preventDefault();

    if (
      !patient.nama ||
      !patient.umur ||
      !patient.jenisKelamin ||
      !patient.persepsiSensori ||
      !patient.kelembapan ||
      !patient.aktivitas ||
      !patient.mobilitas ||
      !patient.nutrisi ||
      !patient.gesekan
    ) {
      alert("Lengkapi semua data dulu ya");
      return;
    }

    setPage("dashboard");
  }

  function formatTimer(totalDetik) {
    const menit = Math.floor(totalDetik / 60);
    const detik = totalDetik % 60;

    return `${menit.toString().padStart(2, "0")}:${detik
      .toString()
      .padStart(2, "0")}`;
  }

  useEffect(() => {
    if (page !== "dashboard") return;

    const sensorRef = ref(database, "sensor");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const jumlahBaru = Number(data.jumlahReposisi || 0);

      setPressure(Number(data.tekanan || 0));
      setServoStatus(data.servoStatus || "DIAM");
      setProsesReposisi(Boolean(data.prosesReposisi));
      setTimerReposisi(Number(data.timerReposisi || 0));
      setTahapReposisi(Number(data.tahapReposisi || 0));
      setJumlahReposisi(jumlahBaru);

      if (jumlahBaru > prevReposisi.current) {
        setLastReposition(new Date());
        prevReposisi.current = jumlahBaru;
      }
    });

    return () => unsubscribe();
  }, [page]);

  const bradenScore = hitungBraden();
  const risiko = bradenScore <= 14 ? "TINGGI" : "RENDAH";
  const tekananTinggi = pressure >= 35;

  const angle = Math.min(Math.max((pressure / 100) * 180 - 90, -90), 90);

  const waktuReposisi = lastReposition.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (page === "login") {
    return (
      <div className="center-page">
        <form className="login-box" onSubmit={login}>
          <h1>Login</h1>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button>Masuk</button>

          <p>Username: admin | Password: 12345</p>
        </form>
      </div>
    );
  }

  if (page === "input") {
    return (
      <div className="center-page">
        <form className="input-box" onSubmit={simpanPasien}>
          <h1>Input Data Pasien</h1>

          <input
            name="nama"
            placeholder="Nama pasien"
            value={patient.nama}
            onChange={handleChange}
          />

          <input
            type="number"
            name="umur"
            placeholder="Umur"
            value={patient.umur}
            onChange={handleChange}
          />

          <select
            name="jenisKelamin"
            value={patient.jenisKelamin}
            onChange={handleChange}
          >
            <option value="">Jenis kelamin</option>
            <option value="Perempuan">Perempuan</option>
            <option value="Laki-laki">Laki-laki</option>
          </select>

          <h2>Skala Braden</h2>

          <div className="input-grid">
            <select
              name="persepsiSensori"
              value={patient.persepsiSensori}
              onChange={handleChange}
            >
              <option value="">Persepsi</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            <select
              name="kelembapan"
              value={patient.kelembapan}
              onChange={handleChange}
            >
              <option value="">Kelembapan</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            <select
              name="aktivitas"
              value={patient.aktivitas}
              onChange={handleChange}
            >
              <option value="">Aktivitas</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            <select
              name="mobilitas"
              value={patient.mobilitas}
              onChange={handleChange}
            >
              <option value="">Mobilitas</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            <select
              name="nutrisi"
              value={patient.nutrisi}
              onChange={handleChange}
            >
              <option value="">Nutrisi</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            <select
              name="gesekan"
              value={patient.gesekan}
              onChange={handleChange}
            >
              <option value="">Gesekan</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div className="score-box">Total Skor Braden: {bradenScore}</div>

          <button>Masuk Dashboard</button>
        </form>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <h1 className="title">DASHBOARD MONITORING TEKANAN TUMIT</h1>

        <div className="layout">
          <div className="card patient-card">
            <h2>IDENTITAS PASIEN</h2>

            <div className="row">
              <span>Nama</span>
              <b>:</b>
              <p>{patient.nama}</p>
            </div>

            <div className="row">
              <span>Umur</span>
              <b>:</b>
              <p>{patient.umur} Tahun</p>
            </div>

            <div className="row">
              <span>Jenis Kelamin</span>
              <b>:</b>
              <p>{patient.jenisKelamin}</p>
            </div>
          </div>

          <div className="card risk-card">
            <div>
              <h2>RISIKO DEKUBITUS</h2>
              <p>SKOR SKALA BRADEN</p>
            </div>

            <strong>{bradenScore}</strong>

            <div className={risiko === "TINGGI" ? "badge high" : "badge low"}>
              {risiko}
            </div>
          </div>

          <div className="card pressure-card">
            <h2>TEKANAN TUMIT</h2>

            <div className="gauge">
              <div className="gauge-bg"></div>
              <div
                className="needle"
                style={{ transform: `rotate(${angle}deg)` }}
              ></div>

              <div className="value">
                <h3>{pressure.toFixed(1)}</h3>
                <p>mmHg</p>
              </div>

              <span className="min">0</span>
              <span className="max">100</span>
            </div>

            <div className={tekananTinggi ? "status danger" : "status safe"}>
              {tekananTinggi ? "Tekanan Tinggi" : "Aman"}
            </div>

            <p className="limit">Batas Aman: &lt; 35 mmHg</p>
          </div>

          <div className="right">
            <div className="card time-card">
              <h2>WAKTU REPOSISI TERAKHIR</h2>
              <h1>{waktuReposisi}</h1>

              <div className="timer">
                <span>Timer Reposisi</span>
                <b>{formatTimer(timerReposisi)}</b>
                <p>
                  Tahap: {servoStatus} {tahapReposisi ? `(${tahapReposisi})` : ""}
                </p>
              </div>
            </div>

            <div className="card notif-card">
              <h2>ALARM / NOTIFIKASI</h2>

              <div className={tekananTinggi ? "notif red" : "notif green"}>
                <div className="circle">{tekananTinggi ? "!" : "✓"}</div>
                <div>
                  <h3>{tekananTinggi ? "PERINGATAN" : "AMAN"}</h3>
                  <p>
                    {tekananTinggi
                      ? `Tekanan mencapai ${pressure.toFixed(1)} mmHg`
                      : "Tekanan dalam batas normal"}
                  </p>
                </div>
              </div>

              <div className="notif blue">
                <div className="circle">i</div>
                <div>
                  <h3>Reposisi Otomatis</h3>
                  <p>
                    {prosesReposisi
                      ? `Servo berada di posisi ${servoStatus}`
                      : "Menunggu tekanan tinggi"}
                  </p>
                </div>
              </div>

              <div className="count">
                Jumlah Reposisi <b>{jumlahReposisi} Kali</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
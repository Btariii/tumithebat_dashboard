import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { FirebaseProvider } from "./context/FirebaseContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InputData from "./pages/InputData";
import Patients from "./pages/Patients";
import "./App.css";

function App() {
  return (
    <FirebaseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<InputData />} />
            <Route path="/monitoring" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </FirebaseProvider>
  );
}

export default App;
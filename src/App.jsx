import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { FirebaseProvider } from "./context/FirebaseContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InputData from "./pages/InputData";
import Patients from "./pages/Patients";
import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");

    return () => {
      document.documentElement.setAttribute("data-theme", "light");
    };
  }, []);

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
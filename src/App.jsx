import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppProvider from "./context/AppContext.jsx";
import Home from "./pages/Home.jsx";
import Results from "./pages/Results.jsx";
import Booking from "./pages/Booking.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import Footer from "./components/Footer.jsx";
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="shell">
          <header className="topbar">
            <div className="brand">
              <span>🛫</span>
              <strong>Flight Booker</strong>
              <span className="badge-chip">v1.0</span>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/confirmation" element={<Confirmation />} />
          </Routes>
           <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
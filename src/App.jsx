import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
// import RegistrationPage from "./Pages/RegistrationPage";
import WaitingPage from "./Pages/WaitingPage";
import ErrorPage from "./Pages/ErrorPage";
import RejectPage from "./Pages/RejectPage";
import QRBadge from "./Pages/QRbadge";
// import RegistrationPageLayer from './Pages/RegistrationPageLayer'
// import EbadgePage from "./Pages/EbadgePage";
import Register from './Pages/Register';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/:companyId" element={<Register />} />
          <Route path="/waiting" element={<WaitingPage />} />
          <Route path="/ebadge" element={<QRBadge />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/reject" element={<RejectPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

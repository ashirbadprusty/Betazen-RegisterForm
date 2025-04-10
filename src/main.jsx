import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

createRoot(document.getElementById('root')).render(
<>
<LocalizationProvider dateAdapter={AdapterDayjs}>
    <App />
  </LocalizationProvider>
</>

)

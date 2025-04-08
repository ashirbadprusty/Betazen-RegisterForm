import {
  Box,
  Typography,
  Avatar,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { QRCodeCanvas } from "qrcode.react";
import { QRCodeSVG } from "qrcode.react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const EBadge = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const formId = localStorage.getItem("formId");
      if (!formId) {
        console.error("No formId found in localStorage");
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/form/getForm/${formId}`
        );
        const formData = response.data.form;

        // Ensure status is "Approved" and barcodeId & qrCode exist
        if (
          formData.status === "Approved" &&
          formData.barcodeId &&
          formData.qrCode
        ) {
          setUser(formData);
        } else {
          console.warn("Form does not meet eBadge criteria");
          navigate("/waiting");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f4f6f8",
        }}
      >
        <CircularProgress color="info" size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Badge...
        </Typography>
      </Box>
    );
  }

  return (
    <div className="wrapper">
      <style>
        {`
          .qr-container {
            background: white;
            padding: 12px;
            display: inline-block;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 230, 255, 0.5);
          }
          
          .wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #0A0F24;
          }
        `}
      </style>

      <Paper
        elevation={6}
        sx={{
          width: 350,
          backgroundColor: "#0A1A3D",
          color: "white",
          borderRadius: 2,
          p: 3,
          border: "1px solid #1E3A8A",
          textAlign: "center",
        }}
      >
        {/* Company Logo */}
        <Typography variant="h6" fontWeight="bold">
          MetroMindz Pvt. Ltd.
        </Typography>

        {/* Image Section */}
        <Box mt={2} display="flex" justifyContent="center">
          <Avatar
            // src="https://via.placeholder.com/70"
            // alt="User"
            src={user.profilePhoto}
            alt={user.name}
            sx={{ width: 74, height: 74, border: "2px solid white" }}
          />
        </Box>

        {/* Name and Contact Info */}
        <Box mt={2}>
          <Typography variant="h5" fontWeight="bold" color="#00C0FF">
           {user.name}
          </Typography>
          <Typography variant="body2">Email: {user.email}</Typography>
          <Typography variant="body2">Contact: (+91) {user.phone}</Typography>
        </Box>

        {/* QR Code */}
        <Box mt={3} display="flex" justifyContent="center">
          <div className="qr-container">
            {/* <QRCodeCanvas value="https://www.youtube.com/" size={100} /> */}
            <QRCodeSVG value={user.barcodeId} size={100} />
          </div>
        </Box>

        {/* Scan Instruction */}
        <Box mt={2}>
          <Typography variant="body2">Scan the QR Code</Typography>
          <Typography variant="body2">
            (For Secure Authentication and Verification)
          </Typography>
        </Box>

        {/* Pass ID */}
        <Box mt={2}>
          <Typography variant="body2" fontWeight="bold">
            Pass ID: {user.barcodeId}
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default EBadge;

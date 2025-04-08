import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MAX_WAIT_TIME = 5 * 60 * 1000; // 15 minutes in milliseconds
const POLL_INTERVAL = 3000; // 3 seconds

const WaitingPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    const formId = localStorage.getItem("formId");
    if (!formId) {
      console.error("No formId found in localStorage");
      navigate("/");
      return;
    }

    const startTime = Date.now();

    const fetchFormData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/form/getForm/${formId}`
        );
        const formStatus = response.data.form.status;
        setStatus(formStatus);

        if (formStatus === "Approved") {
          setTimeout(() => navigate("/ebadge"), 2000);
        } else if (formStatus === "Rejected") {
          setTimeout(() => navigate("/reject"), 2000);
        }
      } catch (error) {
        console.error("Error fetching form:", error);
      }

      // Redirect to error page if status is still "Pending" after 15 minutes
      if (Date.now() - startTime >= MAX_WAIT_TIME) {
        navigate("/error");
      }
    };

    fetchFormData();
    const interval = setInterval(fetchFormData, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        backgroundColor: "#f5f5f5",
        padding: 3,
      }}
    >
      <Paper
        elevation={6} // Adds a shadow effect
        sx={{
          padding: 4,
          maxWidth: 500,
          textAlign: "center",
          borderRadius: 3,
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          color={status === "Rejected" ? "error" : "primary"}
        >
          {status === "Approved"
            ? "Approved!"
            : status === "Rejected"
            ? "Request Rejected"
            : "Processing your request..."}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {status === "Approved"
            ? "Your request has been approved. Redirecting..."
            : status === "Rejected"
            ? "Unfortunately, your request has been rejected. Redirecting..."
            : "Your request has been submitted and is currently under review. Please wait for admin approval. You will be notified once your access is granted."}
        </Typography>
        {status === "Pending" && (
          <CircularProgress color="info" size={60} thickness={4} />
        )}
      </Paper>
    </Box>
  );
};

export default WaitingPage;

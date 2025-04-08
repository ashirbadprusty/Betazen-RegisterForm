import { Container, Typography, Box, Button } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const RejectPage = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <HighlightOffIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" color="error" sx={{ fontWeight: "bold" }}>
          Request Rejected
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
          Unfortunately, your request has been rejected. If you believe this is
          a mistake, please contact our support team.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="mailto:support@example.com"
          sx={{ mb: 2 }}
        >
          Contact Support
        </Button>
        <Button variant="outlined" color="secondary" href="/">
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default RejectPage;

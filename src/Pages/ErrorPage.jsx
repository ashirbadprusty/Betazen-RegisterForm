import { Container, Typography, Box, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ErrorPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        textAlign="center"
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 80 }} />
        <Typography variant="h4" color="error" sx={{ mt: 2 }}>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
          There seems to be an issue. Please contact our support team for
          assistance.
        </Typography>
        <Button variant="contained" color="primary" href="mailto:support@example.com">
          Contact Support
        </Button>
        <Button variant="outlined" color="secondary" href="/" style={{
          marginTop: '20px'
        }}>
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;

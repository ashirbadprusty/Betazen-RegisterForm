import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  Avatar,
  Box,
  Button,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";

import IMG from "../assets/login_image.png";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Register = () => {
  // const { cid } = useParams();
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState({});
  const adminId = companyData.adminId;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    department: "",
    personToMeet: "",
    date: "",
    timeFrom: "",
    timeTo: "",
    // gate: "",
    profilePhoto: null,
    file: null,
  });
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [departmentUsers, setDepartmentUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  // const [selectedGate, setSelectedGate] = useState("");
  const webcamRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/admin/${companyId}`);
        setCompanyData(response.data);
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    fetchCompanyDetails();
  }, [companyId]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/deptUser/?adminId=${adminId}`)
      .then(({ data }) => {
        setDepartmentUsers(data.deptUsers);
        setFilteredUsers(data.deptUsers);
      })
      .catch(console.error);
  }, [adminId]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/department/?adminId=${adminId}`)
      .then(({ data }) => {
        setDepartments(data);
      })
      .catch(console.error);
  }, [adminId]);

  const handleChange = ({ target: { name, value } }) => {
    if (name === "department") {
      const usersInDept = departmentUsers.filter((user) => user.dept === value);
      setFilteredUsers(usersInDept);
      setFormData((prev) => ({ ...prev, department: value, personToMeet: "" }));
    } else if (name === "personToMeet") {
      const selectedUser = departmentUsers.find((user) => user._id === value);
      if (selectedUser) {
        setFormData((prev) => ({
          ...prev,
          personToMeet: selectedUser._id,
          department: selectedUser.dept,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // const handleGateSelection = (gate) => {
  //   setSelectedGate(gate);
  //   setFormData((prev) => ({ ...prev, gate }));
  // };

  const handleFileChange = (e) =>
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  const openCamera = () => setOpen(true),
    closeCamera = () => setOpen(false);

  const captureProfilePhoto = () => {
    if (webcamRef.current) {
      const profilePhotoSrc = webcamRef.current.getScreenshot();
      const imageFile = new File(
        [
          new Uint8Array(
            atob(profilePhotoSrc.split(",")[1])
              .split("")
              .map((c) => c.charCodeAt(0))
          ),
        ],
        `profile-${Date.now()}.png`,
        { type: "image/png" }
      );
      setFormData((prev) => ({ ...prev, profilePhoto: imageFile }));
      closeCamera();
    }
  };
  const isValidEmail = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple clicks

    setIsSubmitting(true); // Disable button

    if (!companyId) {
      alert("Invalid or missing CID.");
      setIsSubmitting(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert("Invalid email format");
      setIsSubmitting(false); // ✅ Ensure button is re-enabled
      return;
    }

    // Validate phone number (10 digits, starts with 6-9)
    if (!/^[6-9][0-9]{9}$/.test(formData.phone)) {
      alert("Invalid phone number! It must be 10 digits and start with 6-9.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append("cid", companyId); // ✅ Include CID in the form data

      const { data } = await axios.post(
        `${BACKEND_URL}/api/form/submit`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      localStorage.setItem("formId", data.form._id);
      alert("Registration successful!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        reason: "",
        department: "",
        personToMeet: "",
        date: "",
        timeFrom: "",
        timeTo: "",
        profilePhoto: null,
        file: null,
      });

      navigate("/waiting");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Form submission failed. Please try again."
      );
    } finally {
      setIsSubmitting(false); // ✅ Always re-enable button
    }
  };
  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 50,
            left: 50,
            display: { xs: "none", sm: "none", md: "none", lg: "block" },
          }}
        >
          <img
            src={companyData.clogo}
            alt="BZ Security Logo"
            style={{
              width: "150px",
              height: "auto",
            }}
          />
        </Box>

        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={6}
          sx={{
            display: { xs: "none", sm: "none", md: "none", lg: "block" },
            alignSelf: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <img
              src={IMG}
              alt="Registration"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={10} md={8} lg={6} xl={5}>
          {/* <Card > */}
          <CardContent>
            <Grid item xs={12} sx={{ textAlign: "center", mb: 2 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                style={{
                  fontSize: "36px",
                  fontFamily: "sans-serif",
                }}
              >
                Visitor Registration
              </Typography>
              <Typography
                variant="h6"
                fontWeight="semibold"
                style={{
                  fontSize: "16px",
                }}
              >
                Fill out a form to generate a QR code for access
              </Typography>
            </Grid>
            <Grid container spacing={0}>
              {/* Profile Photo */}
              <Grid
                item
                xs={12}
                sx={{ textAlign: "center", paddingBottom: "1vh" }}
              >
                <Typography variant="h6">Upload Profile Photo</Typography>
                <IconButton onClick={openCamera}>
                  <Avatar
                    src={
                      formData.profilePhoto &&
                      URL.createObjectURL(formData.profilePhoto)
                    }
                    sx={{
                      width: 120,
                      height: 120,
                      boxShadow: 2,
                      border: "3px solid rgba(25, 210, 145, 0.8)",
                      bgcolor: "grey.300",
                    }}
                  >
                    {!formData.profilePhoto && <CameraAltIcon />}
                  </Avatar>
                </IconButton>
              </Grid>

              {/* Two Column Layout */}
              <Grid
                container
                spacing={3}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Right Section with Fields */}
                <Grid item xs={12} md={12} lg={12} xl={12}>
                  <Grid container spacing={2}>
                    {/* Section 1 */}
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        variant="outlined"
                        placeholder="Enter Your name"
                        value={formData.name}
                        onChange={(e) => {
                          const validName = e.target.value.replace(
                            /[^a-zA-Z\s]/g,
                            ""
                          ); // Allow only letters and spaces
                          handleChange({
                            target: { name: "name", value: validName },
                          }); // Update state
                        }}
                        required
                        type="text"
                        inputProps={{ pattern: "^[A-Za-z ]+$" }} // Ensure only letters and spaces
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        variant="outlined"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => {
                          const inputValue = e.target.value
                            .toLowerCase()
                            .trim(); // Convert to lowercase & trim spaces
                          handleChange({
                            target: { name: "email", value: inputValue },
                          });
                        }}
                        required
                        type="email"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        variant="outlined"
                        placeholder="1234567890"
                        value={formData.phone}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                          if (inputValue.length > 10) return; // Restrict to 10 digits
                          handleChange({
                            target: { name: "phone", value: inputValue },
                          });
                        }}
                        required
                        type="tel"
                        inputProps={{
                          pattern: "^[6-9][0-9]{9}$",
                          maxLength: 10,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        label="Purpose of Visit"
                        name="reason"
                        variant="outlined"
                        // placeholder="Visiting purpose"
                        value={formData.reason}
                        onChange={(e) => {
                          const validReason = e.target.value.replace(
                            /[^a-zA-Z\s]/g,
                            ""
                          );
                          handleChange({
                            target: { name: "reason", value: validReason },
                          });
                        }}
                        required
                        inputProps={{ pattern: "^[A-Za-z ]+$" }}
                        type="text"
                      />
                    </Grid>

                    {/* Section 2 */}
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Person to Meet</InputLabel>
                        <Select
                          name="personToMeet"
                          label="Person To Meet"
                          value={formData.personToMeet}
                          onChange={handleChange}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                overflowY: "auto",
                              },
                            },
                          }}
                        >
                          {filteredUsers.map((user) => (
                            <MenuItem key={user._id} value={user._id}>
                              {user.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Department</InputLabel>
                        <Select
                          name="department"
                          label="Department"
                          value={formData.department || ""}
                          onChange={handleChange}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                overflowY: "auto",
                              },
                            },
                          }}
                        >
                          {departments.map((dept) => (
                            <MenuItem key={dept._id} value={dept._id}>
                              {dept.name.toUpperCase()}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        label="Visiting Date"
                        name="date"
                        variant="outlined"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        onBlur={(e) => {
                          const selectedDate = e.target.value;

                          if (selectedDate) {
                            const year = parseInt(
                              selectedDate.split("-")[0],
                              10
                            );

                            if (year < 1900 || year > 2025) {
                              alert(
                                "Please enter a valid year between 1900 and 2100."
                              );
                              handleChange({
                                target: { name: "date", value: "" },
                              });
                              return;
                            }

                            if (selectedDate < today) {
                              alert("You cannot select a past date!");
                              handleChange({
                                target: { name: "date", value: "" },
                              });
                            }
                          }
                        }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: today,
                          max: "2100-12-31", // Restrict year selection up to 2100
                        }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        label="Upload Govt ID"
                        variant="outlined"
                        type="file"
                        onChange={(event) => {
                          const file = event.target.files[0];
                          if (file) {
                            const allowedTypes = [
                              "image/png",
                              "image/jpeg",
                              "image/jpg",
                            ];

                            if (!allowedTypes.includes(file.type)) {
                              alert(
                                "Invalid file type! Please upload a PNG or JPEG image."
                              );
                              event.target.value = ""; // Reset the file input
                              return;
                            }

                            handleFileChange(event); // Call your existing handler if valid
                          }
                        }}
                        accept="image/png, image/jpeg, image/jpg"
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        label="Time From"
                        name="timeFrom"
                        variant="outlined"
                        type="time"
                        value={formData.timeFrom}
                        onChange={(event) => {
                          const currentTime = moment().format("HH:mm"); // Get current time
                          const selectedTime = event.target.value;
                          if (!formData.date) {
                            alert("Please select a date first.");
                            return;
                          }

                          if (
                            formData.date === today &&
                            selectedTime < currentTime
                          ) {
                            alert("You cannot select a past time."); // Show alert message
                            return;
                          }

                          setFormData((prevData) => ({
                            ...prevData,
                            timeFrom: selectedTime,
                          }));
                        }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: moment().format("HH:mm") }} // Restrict past time selection
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        label="Time To"
                        name="timeTo"
                        variant="outlined"
                        type="time"
                        value={formData.timeTo}
                        onChange={(event) => {
                          const currentTime = moment().format("HH:mm"); // Get current time
                          const selectedTime = event.target.value;
                          if (!formData.date) {
                            alert("Please select a date first.");
                            return;
                          }
                          if (!formData.timeFrom) {
                            alert(
                              "Please select Time From before selecting Time To"
                            );
                            return;
                          }
                          if (
                            formData.timeFrom &&
                            selectedTime <= formData.timeFrom
                          ) {
                            alert("End time must be after start time.");
                            return;
                          }
                          if (
                            formData.date === today &&
                            selectedTime < currentTime
                          ) {
                            alert("You cannot select a past time."); // Show alert message
                            return;
                          }

                          setFormData((prevData) => ({
                            ...prevData,
                            timeTo: selectedTime,
                          }));
                        }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: moment().format("HH:mm") }} // Restrict past time selection
                        required
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Gate Selection */}
              {/* <Grid
                item
                xs={12}
                sx={{
                  marginTop: "2vh",
                }}
              >
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Select Gate
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    {["Gate 1", "Gate 2", "Gate 3", "Gate 4"].map((gate) => (
                      <Button
                        key={gate}
                        variant={
                          selectedGate === gate ? "contained" : "outlined"
                        }
                        color="primary"
                        onClick={() => handleGateSelection(gate)}
                      >
                        {gate}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Grid> */}

              {/* Error Message */}
              {errorMessage && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {errorMessage}
                </Typography>
              )}

              {/* Submit Button */}
              <Grid container justifyContent="center" sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    isSubmitting || !Object.values(formData).every(Boolean)
                  }
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
          {/* </Card> */}
        </Grid>

        {/* Webcam Modal */}
        <Modal open={open} onClose={closeCamera}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              height: 400,
              bgcolor: "white",
              boxShadow: 4,
              p: 2,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={{ facingMode: "user" }}
              style={{ width: "100%", height: "85%", borderRadius: "8px" }}
            />
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-around" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={captureProfilePhoto}
              >
                Capture
              </Button>
              <Button variant="outlined" color="error" onClick={closeCamera}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Grid>
    </>
  );
};

export default Register;

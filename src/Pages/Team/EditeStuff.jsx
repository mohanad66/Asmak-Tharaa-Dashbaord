import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link,
  Alert,
} from "@mui/material";
import { Home, People } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";

const EditStuff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    position: "",
    age: 0,
    salary: 0,
    salaryDeduction: 0,
    startDate: "",
  });
  
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    
    if (!id) {
      showAlert("Invalid staff ID", "error");
      return;
    }

    axios
      .get(`https://tharaa.premiumasp.net/api/Stuff/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data.data;
        // تنسيق التاريخ ليظهر في حقل input type="date"
        const formattedDate = data.startDate ? data.startDate.split('T')[0] : "";
        
        setFormData({
          fullName: data.fullName || "",
          position: data.position || "",
          age: data.age || 0,
          salary: data.salary || 0,
          salaryDeduction: data.salaryDeduction || 0,
          startDate: formattedDate,
        });
      })
      .catch((error) => {
        showAlert("Failed to load staff data", "error");
        console.error("Error fetching staff:", error);
      });
  }, [id]);

  const showAlert = (message, severity = "success") => {
    setAlert({ show: true, message, severity });
    setTimeout(
      () => setAlert({ show: false, message: "", severity: "success" }),
      5000
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // التحقق من الحقول المطلوبة
    if (!formData.fullName || !formData.position || !formData.startDate) {
      showAlert("Please fill in all required fields (Name, Position, Start Date)", "error");
      return;
    }

    const token = JSON.parse(localStorage.getItem("token"));

    axios
      .put(
        `https://tharaa.premiumasp.net/api/Stuff/${id}`,
        {
          fullName: formData.fullName,
          position: formData.position,
          age: Number(formData.age),
          salary: Number(formData.salary),
          salaryDeduction: Number(formData.salaryDeduction),
          startDate: formData.startDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        showAlert("Staff member updated successfully!", "success");
        setTimeout(() => {
          navigate("/team/stuffTeam");
        }, 1500);
      })
      .catch((error) => {
        showAlert(
          error.response?.data?.message || "Error updating staff member",
          "error"
        );
        console.error("Error:", error);
      });
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#fff", minHeight: "100vh" }}>
      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Edit Staff Member
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: "text.secondary" }}>
          <Link
            underline="hover"
            color="inherit"
            href="/dashboard"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/team/stuffTeam"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <People sx={{ mr: 0.5 }} fontSize="inherit" />
            Staff Team
          </Link>
          <Typography color="primary" sx={{ fontWeight: 600 }}>
            Edit Staff Member
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ padding: 3 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                Staff Information
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Full Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      placeholder="Input staff full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  {/* Position */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Position"
                      name="position"
                      placeholder="Input position (e.g., Manager, Waiter)"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  {/* Age */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      name="age"
                      type="number"
                      placeholder="Input age"
                      value={formData.age}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        inputProps: { 
                          min: 18,
                          max: 70 
                        }
                      }}
                    />
                  </Grid>

                  {/* Start Date */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  {/* Salary */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Salary"
                      name="salary"
                      type="number"
                      placeholder="Input salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        inputProps: { 
                          min: 0,
                          step: 0.01 
                        }
                      }}
                    />
                  </Grid>

                  {/* Salary Deduction */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Salary Deduction"
                      name="salaryDeduction"
                      type="number"
                      placeholder="Input salary deduction"
                      value={formData.salaryDeduction}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        inputProps: { 
                          min: 0,
                          step: 0.01 
                        }
                      }}
                    />
                  </Grid>

                  {/* Submit Buttons */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate("/team/stuffTeam")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          backgroundColor: "#1976d2",
                          "&:hover": {
                            backgroundColor: "#1565c0",
                          },
                        }}
                      >
                        Update Staff Member
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditStuff;
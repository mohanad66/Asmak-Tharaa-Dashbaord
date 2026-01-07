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
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EditUser = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ssn: "",
    address: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(true);
  let { id } = useParams();
  let token = JSON.parse(localStorage.token);

  useEffect(() => {
    console.log("Fetching user data for ID:", id);
    
    axios
      .get(`/api/Users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Full API Response:", res.data);
        
        // Handle different response structures
        let data = res.data.data || res.data;
        console.log("User data:", data);
        
        setFormData({
          name: data?.userName || data?.callcenterName || data?.name || "",
          email: data?.email || "",
          phone: data?.phone || data?.phoneNumber || "",
          ssn: data?.ssn || "",
          address: data?.address || "",
          password: "", // Don't populate password for security
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        console.error("Error details:", err.response?.data);
        showAlert(t('error_loading_user_data'), "error");
        setLoading(false);
      });
  }, [id]);

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showAlert = (message, severity = "success") => {
    setAlert({ show: true, message, severity });
    setTimeout(
      () => setAlert({ show: false, message: "", severity: "success" }),
      5000
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.ssn ||
      !formData.address
    ) {
      showAlert(t('please_fill_in_all_required_fields'), "error");
      return;
    }

    // Validate SSN length
    if (formData.ssn.length !== 14) {
      showAlert('SSN must be exactly 14 characters', "error");
      return;
    }

    let token = JSON.parse(localStorage.getItem("token"));

    const requestData = {
      ssn: formData.ssn,
      userName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      role: "User", // Keep existing role or make it editable
      vehicleType: 0
    };

    // Only include password if it's been changed
    if (formData.password && formData.password.trim() !== "") {
      requestData.passwordHash = formData.password;
    }

    console.log("Updating user with data:", requestData);

    axios
      .put(`/api/Users/${id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("Update success:", res.data);
        showAlert(res.data.message || t('callcenter_edited_successfully'));
        
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = "/team/CallcenterTeam";
        }, 1500);
      })
      .catch((error) => {
        console.error("Update error:", JSON.stringify(error.response?.data, null, 2));
        
        const errorMessage = error.response?.data?.errors?.Ssn?.[0] ||
                           error.response?.data?.message || 
                           error.response?.data?.title ||
                           t('error_adding_callcenter_maybe_info_was_another');
        showAlert(errorMessage, "error");
      });
  };

  if (loading) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

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
          {t('edit_user')}
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: "text.secondary" }}>
          <Link
            underline="hover"
            color="inherit"
            href="/dashboard"
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            {t('dashboard')}
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/team/CallcenterTeam"
          >
            <People sx={{ mr: 0.5 }} fontSize="inherit" />
            {t('teams')}
          </Link>
          <Typography color="primary" sx={{ fontWeight: 600 }}>
            {t('edit_user')}
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
                {t('user_information')}
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* User Name */}
                  <Grid item xs={12} width={"100%"}>
                    <TextField
                      fullWidth
                      label={t('user_name')}
                      name="name"
                      placeholder={t('input_user_name')}
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} width={"100%"}>
                    <TextField
                      fullWidth
                      label={t('email')}
                      name="email"
                      type="email"
                      placeholder={t('input_email')}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12} width={"100%"}>
                    <TextField
                      fullWidth
                      label={t('phone')}
                      name="phone"
                      placeholder={t('input_user_phone_number')}
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  {/* SSN */}
                  <Grid item xs={12} width={"100%"}>
                    <TextField
                      fullWidth
                      label={t('ssn')}
                      name="ssn"
                      placeholder={t('input_ssn')}
                      value={formData.ssn}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      inputProps={{ minLength: 14, maxLength: 14 }}
                      helperText="SSN must be exactly 14 characters"
                    />
                  </Grid>

                  {/* Address */}
                  <Grid item xs={12} width={"100%"}>
                    <TextField
                      fullWidth
                      label={t('address')}
                      name="address"
                      placeholder={t('input_address')}
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      autoComplete="off"
                    />
                  </Grid>

                  {/* Password */}
                  <Grid item xs={12} width={"100%"}>
                    <TextField
                      fullWidth
                      autoComplete="off"
                      label={t('password')}
                      name="password"
                      type="password"
                      placeholder={t('leave_blank_to_keep_current_password')}
                      value={formData.password}
                      onChange={handleInputChange}
                      variant="outlined"
                      helperText="Leave blank to keep current password"
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12} margin={"auto"}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: "#1976d2",
                        "&:hover": {
                          backgroundColor: "#1565c0",
                        },
                      }}
                    >
                      {t('save_user')}
                    </Button>
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

export default EditUser;
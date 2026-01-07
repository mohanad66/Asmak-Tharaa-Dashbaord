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
import { useTranslation } from "react-i18next";

const EditStuff = () => {
  const { t } = useTranslation();
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
      showAlert(t('invalid_staff_id'), "error");
      return;
    }

    axios
      .get(`api/Stuff/${id}`, {
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
        showAlert(t('failed_to_load_staff_data'), "error");
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
      showAlert(t('please_fill_in_all_required_fields_name_position_start_date'), "error");
      return;
    }

    const token = JSON.parse(localStorage.getItem("token"));

    axios
      .put(
        `api/Stuff/${id}`,
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
        showAlert(t('staff_member_updated_successfully'), "success");
        setTimeout(() => {
          navigate("team/stuffTeam");
        }, 1500);
      })
      .catch((error) => {
        showAlert(
          error.response?.data?.message || t('error_updating_staff_member'),
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
          {t('edit_staff_member')}
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: "text.secondary" }}>
          <Link
            underline="hover"
            color="inherit"
            href="/dashboard"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            {t('dashboard')}
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/team/stuffTeam"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <People sx={{ mr: 0.5 }} fontSize="inherit" />
            {t('staff_team')}
          </Link>
          <Typography color="primary" sx={{ fontWeight: 600 }}>
            {t('edit_staff_member')}
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
                {t('staff_information')}
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Full Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('full_name')}
                      name="fullName"
                      placeholder={t('input_staff_full_name')}
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
                      label={t('position')}
                      name="position"
                      placeholder={t('input_position_eg_manager_waiter')}
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
                      label={t('age')}
                      name="age"
                      type="number"
                      placeholder={t('input_age')}
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
                      label={t('start_date')}
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
                      label={t('salary')}
                      name="salary"
                      type="number"
                      placeholder={t('input_salary')}
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
                      label={t('salary_deduction')}
                      name="salaryDeduction"
                      type="number"
                      placeholder={t('input_salary_deduction')}
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
                        onClick={() => navigate("team/stuffTeam")}
                      >
                        {t('cancel')}
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
                        {t('update_staff_member')}
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
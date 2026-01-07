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

const EditDelivery = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    driverName: "",
    driverPhone: "",
    driverPhotoUrl: "",
    isActive: true,
    salary: 0,
    address: "",
    password: "",
    phoneNumber: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));

    if (!id) {
      showAlert(t('invalid_delivery_id'), "error");
      return;
    }

    axios
      .get(`api/Delivery/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data.data;
        console.log(data);

        setFormData({
          driverName: data.driverName || "",
          driverPhone: data.driverPhone || "",
          driverPhotoUrl: data.driverPhotoUrl || "",
          isActive: data.isActive || true,
          salary: data.salary || 0,
          address: data.driverAddress || "",
          password: "", // لا نعرض كلمة المرور الحالية
          phoneNumber: data.driverPhone || "",
        });
      })
      .catch((error) => {
        showAlert(t('failed_to_load_delivery_driver_data'), "error");
        console.error("Error fetching delivery:", error);
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.driverName ||
      !formData.driverPhone ||
      !formData.address ||
      !formData.password
    ) {
      showAlert(t('please_fill_in_all_required_fields'), "error");
      return;
    }

    const token = JSON.parse(localStorage.getItem("token"));

    axios
      .put(
        `api/Delivery/delivery-guys/${id}`,
        {
          driverName: formData.driverName,
          driverPhone: formData.driverPhone,
          driverPhotoUrl: formData.driverPhotoUrl || "string",
          isActive: formData.isActive,
          salary: Number(formData.salary),
          address: formData.address,
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        showAlert(t('delivery_driver_updated_successfully'), "success");
        // يمكنك استخدام navigate بدلاً من location.href
        setTimeout(() => {
          navigate("team/DeliveryTeam");
        }, 1500);
      })
      .catch((error) => {
        showAlert(
          error.response?.data?.message || t('error_updating_delivery_driver'),
          "error"
        );
        console.error("Error:", error);
      });
  };

  // console.log(formData);

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
          {t('edit_delivery_driver')}
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
            href="/team/DeliveryTeam"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <People sx={{ mr: 0.5 }} fontSize="inherit" />
            {t('delivery_team')}
          </Link>
          <Typography color="primary" sx={{ fontWeight: 600 }}>
            {t('edit_delivery_driver')}
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
                {t('delivery_driver_information')}
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Driver Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('driver_name')}
                      name="driverName"
                      placeholder={t('input_driver_name')}
                      value={formData.driverName}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  {/* Phone Number */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('phone_number')}
                      name="driverPhone"
                      placeholder={t('input_driver_phone_number')}
                      value={formData.driverPhone}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
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
                      required
                      variant="outlined"
                      InputProps={{
                        inputProps: {
                          min: 0,
                          step: 0.01
                        }
                      }}
                    />
                  </Grid>

                  {/* Address */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('address')}
                      name="address"
                      autoComplete="off"
                      placeholder={t('input_address')}
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  {/* Password */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      autoComplete="off"
                      label={t('new_password')}
                      name="password"
                      type="password"
                      placeholder={t('input_new_password')}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    // helperText="Leave empty to keep current password"
                    />
                  </Grid>

                  {/* Photo URL (اختياري) */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('photo_url')}
                      name="driverPhotoUrl"
                      placeholder={t('input_photo_url')}
                      value={formData.driverPhotoUrl}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>

                  {/* Active Status */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        style={{ marginRight: '8px' }}
                      />
                      <label htmlFor="isActive">
                        {t('active_driver')}
                      </label>
                    </Box>
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate("team/DeliveryTeam")}
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
                        {t('update_delivery_driver')}
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

export default EditDelivery;
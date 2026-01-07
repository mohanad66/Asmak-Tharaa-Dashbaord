import axios from "axios";
import React, { useState } from "react";
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
import { useTranslation } from "react-i18next";

const AddCallcenter = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ssn: "",
    address: "",
    password: "",
  });

  const [images, setImages] = useState([
    { id: 1, file: null, preview: null, label: t('photo_1'), width: 80 },
    { id: 2, file: null, preview: null, label: t('photo_2'), width: 170 },
  ]);

  const [teamType, setTeamType] = useState(t('team_from_restaurant'));
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

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        showAlert(t('file_size_must_be_less_than_4mb'), "error");
        return;
      }

      // التحقق من نوع الملف
      const validTypes = [
        "image/svg+xml",
        "image/png",
        "image/jpeg",
        "image/jpg",
      ];
      if (!validTypes.includes(file.type)) {
        showAlert(t('please_select_svg_png_or_jpg_files_only'), "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...images];
        newImages[index] = {
          ...newImages[index],
          file: file,
          preview: e.target.result,
        };
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages[index] = {
      ...newImages[index],
      file: null,
      preview: null,
    };
    setImages(newImages);
  };

  const handleTeamTypeChange = (type) => {
    setTeamType(type);
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
      !formData.address ||
      !formData.password
    ) {
      showAlert(t('please_fill_in_all_required_fields'), "error");
      return;
    }

    // Validate SSN: must be exactly 14 characters (CHANGED FROM 13 TO 14)
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
      passwordHash: formData.password,
      role: "User",
      vehicleType: 0
    };

    axios
      .post(`/api/Users`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("Success:", res.data);
        showAlert(res.data.message || t('callcenter_added_successfully'));

        setFormData({
          name: "",
          email: "",
          phone: "",
          ssn: "",
          address: "",
          password: "",
        });
      })
      .catch((error) => {
        console.log("ERROR:", JSON.stringify(error.response?.data, null, 2));
        
        const ssnError = error.response?.data?.errors?.Ssn?.[0];
        const errorMessage = ssnError || 
                           error.response?.data?.message || 
                           error.response?.data?.title ||
                           t('error_adding_callcenter');
        
        showAlert(errorMessage, "error");
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
          {t('add_user')}
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: "text.secondary" }}>
          <Link
            underline="hover"
            color="inherit"
            target="_blank"
            rel="noopener noreferrer"
            href="https://admin.asmaktharaa.io/team/stuffTeam"
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            {t('dashboard')}
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="https://admin.asmaktharaa.io/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <People sx={{ mr: 0.5 }} fontSize="inherit" />
            {t('teams')}
          </Link>
          <Typography color="primary" sx={{ fontWeight: 600 }}>
            {t('add_user')}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left: Staff Information */}
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
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              ></Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Callcenter Name */}
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
                      helperText={t('ssn_must_be_13_characters')}
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
                    />
                  </Grid>

                  {/* Password */}
                  <Grid item xs={12} width={"100%"}>
                    <TextField
                      fullWidth
                      label={t('password')}
                      name="password"
                      type="password"
                      placeholder={t('input_password')}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
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
                      {t('save_callcenter')}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Image Upload Section (مخفي حالياً) */}
        {/* <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 2 }}>
            <CardContent sx={{ padding: 2 }}>
              <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                {t('image_callcenter')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('note_format_photos_svg_png_jpg_max_size_4mb')}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {images.map((image, index) => (
                  <Box key={image.id} sx={{ textAlign: 'center' }}>
                    <Button
                      component="label"
                      variant="outlined"
                      sx={{
                        width: image.width,
                        height: 80,
                        border: image.preview ? '1px solid #e0e0e0' : '1px dashed #bdbdbd',
                        borderRadius: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textTransform: 'none'
                      }}
                    >
                      <input
                        type="file"
                        accept="image/svg+xml, image/png, image/jpeg, image/jpg"
                        hidden
                        onChange={(e) => handleImageUpload(index, e)}
                      />
                      {image.preview ? (
                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                          <img
                            src={image.preview}
                            alt={`Callcenter-${index}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                          />
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            sx={{
                              minWidth: 'auto',
                              width: 20,
                              height: 20,
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              fontSize: '10px',
                              padding: 0
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                          >
                            ×
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                          <Typography variant="body2" color="text.secondary">
                            {image.label}
                          </Typography>
                        </Box>
                      )}
                    </Button>
                  </Box>
                ))}
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSubmit}
              >
                {t('save_callcenter')}
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ padding: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('you_can_add_up_to_4_photos_svg_png_jpg_only')}
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default AddCallcenter;
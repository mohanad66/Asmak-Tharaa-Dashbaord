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

const AddCallcenter = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    // salary: 0,
    address: "",
    password: "",
  });

  const [images, setImages] = useState([
    { id: 1, file: null, preview: null, label: "Photo 1", width: 80 },
    { id: 2, file: null, preview: null, label: "Photo 2", width: 170 },
  ]);

  const [teamType, setTeamType] = useState("Team from resturant");
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
        showAlert("File size must be less than 4MB", "error");
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
        showAlert("Please select SVG, PNG, or JPG files only", "error");
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
      !formData.phone ||
      //   !formData.salary ||
      !formData.address ||
      !formData.password
    ) {
      showAlert("Please fill in all required fields", "error");
      return;
    }

    let token = JSON.parse(localStorage.getItem("token"));

    axios
      .post(
        `https://tharaa.premiumasp.net/api/CallCenter`,
        {
          callcenterName: formData.name,
          phoneNumber: formData.phone,
          driverPhotoUrl: "string",
          //   salary: Number(formData.salary),
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
        showAlert(res.data.message || "Callcenter added successfully!");

        setFormData({
          name: "",
          phone: "",
          //   salary: 0,
          address: "",
          password: "",
        });
      })
      .catch((error) => {
        showAlert("Error adding Callcenter", "error");
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
          Add User
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
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="https://admin.asmaktharaa.io/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <People sx={{ mr: 0.5 }} fontSize="inherit" />
            teams
          </Link>
          <Typography color="primary" sx={{ fontWeight: 600 }}>
            Add User
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
                User Information
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
                      label="User Name"
                      name="name"
                      placeholder="Input User name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12} width={"100%"}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      placeholder="Input User Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  {/* Salary */}
                  {/* <Grid item xs={12} width={'100%'}> 
                    <TextField
                      fullWidth
                      label="Salary"
                      name="salary"
                      type="number"
                      placeholder="Input Price"
                      value={formData.salary}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid> */}

                  {/* Address */}
                  <Grid item xs={12} width={"100%"}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      placeholder="Input Address"
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
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Input Password"
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
                      Save Callcenter
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
                Image Callcenter
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Note : Format photos SVG, PNG, or JPG (Max size 4mb)
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
                Save Callcenter
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ padding: 2 }}>
              <Typography variant="body2" color="text.secondary">
                You can add up to 4 photos. SVG, PNG or JPG only.
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default AddCallcenter;

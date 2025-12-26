import React, { useState } from "react";
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  Divider,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Edit,
  Person,
  Phone,
  Security,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  LocationOn,
} from "@mui/icons-material";
import axios from "axios";

const SimpleProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [userData, setUserData] = useState({
    name: localStorage?.name || "John Doe",
    role: localStorage?.role || "Administrator",
    phone: localStorage?.phoneNumber || "544636371",
    address: localStorage?.address || "Riyadh, Saudi Arabia",
    password: localStorage?.password || '', // Password will be empty initially for security
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(userData);
  // console.log(editData);
  
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const handleEdit = () => {
    // setEditData({
    //   ...userData,
    //   password: "" // Clear password when starting to edit
    // });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Basic validation
    // if (editData.password && editData.password.length < 6) {
    //   setSnackbar({
    //     open: true,
    //     message: 'Password must be at least 6 characters long',
    //     severity: 'error'
    //   });
    //   return;
    // }

    const token = JSON.parse(localStorage.token);
    const updateData = {
      callcenterName: editData.name,
      phoneNumber: editData.phone,
      address: editData.address,
      ...(editData.password && { password: editData.password }) // Only include password if changed
    };



    axios
      .put(
        `https://tharaa.premiumasp.net/api/Admin/${Number(localStorage.id)}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        
        // Update local storage with new data
        localStorage.name = editData.name;
        localStorage.phoneNumber = editData.phone;
        localStorage.address = editData.address;
        
        // Update state
        setUserData({
          ...editData,
          password: "" // Clear password after saving
        });
        
        setIsEditing(false);
        
        setSnackbar({
          open: true,
          message: 'Profile updated successfully!',
          severity: 'success'
        });
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        setSnackbar({
          open: true,
          message: 'Error updating profile. Please try again.',
          severity: 'error'
        });
      });
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
    setShowPassword(false);
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          background: '#fff',
        }}
      >
        {/* Profile Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: "auto",
              mb: 2,
              bgcolor: theme.palette.primary.main,
              fontSize: "3rem",
            }}
          >
            <Person sx={{ fontSize: 60 }} />
          </Avatar>

          {!isEditing ? (
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {userData.name}
            </Typography>
          ) : (
            <TextField
              fullWidth
              label="Full Name"
              value={editData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              sx={{ mb: 2 }}
              size={isMobile ? "small" : "medium"}
            />
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Contact Information */}
        <Grid container spacing={3} justifyContent={'space-around'}>
          {/* Phone Number */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
              <Phone sx={{ color: "primary.main" }} />
              <Typography variant="h6" color="textSecondary">
                Phone Number:
              </Typography>
            </Box>
            {!isEditing ? (
              <Typography variant="body1" sx={{ fontSize: "1.1rem", ml: 4 }}>
                {userData.phone}
              </Typography>
            ) : (
              <TextField
                fullWidth
                label="Phone Number"
                value={editData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                size={isMobile ? "small" : "medium"}
                sx={{ ml: 4 }}
              />
            )}
          </Grid>

          {/* Role */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
              <Security sx={{ color: "primary.main" }} />
              <Typography variant="h6" color="textSecondary">
                Role:
              </Typography>
            </Box>
            {!isEditing ? (
              <Typography variant="body1" sx={{ fontSize: "1.1rem", ml: 4 }}>
                {userData.role}
              </Typography>
            ) : (
              <TextField
                fullWidth
                label="Role"
                value={editData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                size={isMobile ? "small" : "medium"}
                sx={{ ml: 4 }}
                disabled // Role might not be editable
              />
            )}
          </Grid>

                {isEditing && (
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
              <LocationOn sx={{ color: "primary.main" }} />
              <Typography variant="h6" color="textSecondary">
                Address:
              </Typography>
            </Box>
            
              <TextField
                fullWidth
                label="Address"
                value={editData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                size={isMobile ? "small" : "medium"}
                sx={{ ml: 4 }}
                multiline
                rows={2}
              />
          </Grid>
            )}

          {/* Password - Only show in edit mode */}
          {isEditing && (
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
                <Security sx={{ color: "primary.main" }} />
                <Typography variant="h6" color="textSecondary">
                  New Password:
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={editData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                size={isMobile ? "small" : "medium"}
                sx={{ ml: 4 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                // helperText="Leave empty if you don't want to change password"
              />
            </Grid>
          )}
        </Grid>

        {/* Control Buttons */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {!isEditing && localStorage.role != 'CallCenter' ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
              size={isMobile ? "medium" : "large"}
              sx={{ minWidth: isMobile ? "100%" : 200 }}
            >
              Edit Profile
            </Button>
          ) :  isEditing ? (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSave}
                size={isMobile ? "medium" : "large"}
                sx={{ minWidth: isMobile ? "100%" : 150 }}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={handleCancel}
                size={isMobile ? "medium" : "large"}
                sx={{ minWidth: isMobile ? "100%" : 150 }}
              >
                Cancel
              </Button>
            </>
          ):null}
        </Box>
      </Paper>

      {/* Success/Error Message */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SimpleProfilePage;
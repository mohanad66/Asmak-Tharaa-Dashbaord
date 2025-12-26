import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Chip,
  InputAdornment,
  Button,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { Link } from "react-router-dom";
import ConfirmAlert from "./alert";
// import { toast } from "react-toastify";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  let token = JSON.parse(localStorage.token);
  let [showConfirmAlert, setshowConfirmAlert] = useState(false);

  let getData = () => {
    axios
      .get("https://tharaa.premiumasp.net/api/CallCenter", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // تحسين معالجة الـ response
        if (res.data && res.data.data) {
          setUSers(res.data.data);
          // console.log(res.data.data);
        } else {
          console.error("Invalid response format:", res);
          toast.error("Failed to load data: Invalid response format");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        toast.error("Failed to load callcenters data");
      });
  };

  useEffect(() => getData(), []);
  let [users, setUSers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const filteredUsers = users?.filter(
    (user) =>
      user?.callcenterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.id.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredUsers?.length / rowsPerPage);

  const currentUsers = filteredUsers?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  let deleteCallcenter = () => {
    axios
      .delete(`https://tharaa.premiumasp.net/api/CallCenter/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        location.reload()
        // تحسين معالجة الـ response
        if (res.data && res.data.message) {
          console.log(res.data.message);
        } else {
          console.log("Callcenter deleted successfully");
        }
        getData();
      })
      .catch((err) => {
        console.error("Delete error:", err);

        if (err.response && err.response.data) {
          console.log
          (
            err.response.data.message || "Failed to delete callcenter"
          );
        } else {
          console.log("Failed to delete callcenter");
        }
      });
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* الجزء العلوي المعدل */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid rgba(0, 0, 0, 0.2)",
          borderRadius: 2,
          padding: { xs: 2, md: 3 },
          marginBottom: 3,
          gap: 2,
          backgroundColor: "#fafafa",
        }}
      >
        {/* Total Callcenters */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: { xs: 1, md: 2 },
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              background: "rgba(211, 255, 231, 1)",
              borderRadius: "50%",
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 60,
              minHeight: 60,
            }}
          >
            <GroupIcon />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "#666", margin: 0 }}>
              Total Users
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#333",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              {users?.length || 0}
            </Typography>
          </Box>
        </Box>

        {/* الخط الفاصل */}
        <Box
          sx={{
            width: { xs: "100%", md: "1px" },
            height: { xs: "1px", md: "60px" },
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        />

        {/* Total Orders */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: { xs: 1, md: 2 },
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              background: "rgba(255, 245, 204, 1)",
              borderRadius: "50%",
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 60,
              minHeight: 60,
            }}
          >
            <DinnerDiningIcon sx={{ color: "orange", fontSize: 30 }} />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "#666", margin: 0 }}>
              Total Orders
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#333",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              {users?.reduce((sum, item) => {
                const total = Number(item?.ordersNumber) || 0;
                return sum + total;
              }, 0)}
            </Typography>
          </Box>
        </Box>

        {/* الخط الفاصل */}
        <Box
          sx={{
            width: { xs: "100%", md: "1px" },
            height: { xs: "1px", md: "60px" },
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        />

        {/* Total Revenue */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: { xs: 1, md: 2 },
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              background: "rgba(204, 229, 255, 1)",
              borderRadius: "50%",
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 60,
              minHeight: 60,
            }}
          >
            <MonetizationOnIcon sx={{ color: "blue", fontSize: 30 }} />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "#666", margin: 0 }}>
              Total Revenue
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#333",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              {users?.reduce((sum, item) => {
                const total = Number(item?.totalOrderPrice) || 0;
                return sum + total;
              }, 0)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ marginBottom: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: 1,
          }}
        >
          Users
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#666" }}>
          Dashboard ▶ Users
        </Typography>
      </Box>

      <Box
        sx={{
          marginBottom: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {/* حقل البحث */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for id, name, phone number"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e0e0e0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976d2",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976d2",
                borderWidth: 2,
              },
            },
          }}
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: "300px" },
          }}
        />

        {/* مجموعة الأزرار */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "space-between", sm: "flex-start" },
          }}
        >
          <Button
            variant="outlined"
            sx={{
              borderRadius: 2,
              padding: "8px 16px",
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
            }}
            onClick={print}
          >
            Export
          </Button>
          <Link to={"add"}>
            <Button
              color="primary"
              variant="contained"
              sx={{
                borderRadius: 2,
                padding: "8px 20px",
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Add
            </Button>
          </Link>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          borderRadius: 2,
        }}
      >
        <Table
          sx={{ minWidth: 650 }}
          aria-label="users table"
          className="table"
        >
          <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Id
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Phone Number
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Address
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Total Orders
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Total Revenue
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers?.map((user) => (
              <TableRow
                key={user?.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "#f8f9fa" },
                }}
              >
                {showConfirmAlert && (
                  <ConfirmAlert
                    open
                    onConfirm={() => deleteCallcenter()}
                    onClose={() => {
                      setshowConfirmAlert(false);
                      
                    }}
                  />
                )}
                <TableCell sx={{ fontWeight: "medium" }}>{user.id}</TableCell>
                <TableCell sx={{ fontWeight: "medium" }}>
                  {user?.callcenterName}
                </TableCell>
                <TableCell>{user?.phoneNumber}</TableCell>
                <TableCell>{user?.address}</TableCell>
                <TableCell>{user?.ordersNumber}</TableCell>
                <TableCell>{user?.totalOrderPrice}</TableCell>
                <TableCell
                  sx={{
                    display: "flex",
                    textAlign: "right",
                    justifyContent: "right",
                    gap: 2,
                  }}
                >
                  <Link
                    to={`/EditCallCenter/${user.id}`}
                    style={{ color: "#000" }}
                  >
                    <EditIcon />
                  </Link>
                  <DeleteIcon
                    onClick={() => {
                      setshowConfirmAlert(true);
                      setDeleteId(user.id);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;

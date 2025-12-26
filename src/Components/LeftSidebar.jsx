import { Radio } from "@mui/joy";
import { Box, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { FaArrowRight, FaArrowDown, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
// import { BiFoodMenu } from "react-icons/bi";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";

const LeftSidebar = () => {
  const [selectedPage, setSelectedPage] = useState(0);
  const [ShowDashbaordItems, setShowDashbaordItems] = useState(false);
  const [showOrderListItems, setShowOrderListItems] = useState(false);
  const [showWarehouseItems, setShowWarehouseItems] = useState(false);
  const [showTeamItems, setShowTeamItems] = useState(false);
  const [tapParts, setTapParts] = useState([]);
  const [activeTap, setActiveTap] = useState("dashbaord");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  let location = useLocation().pathname;

  useEffect(() => {
    const parts = location.split("/");
    setTapParts(parts);
    setActiveTap(parts[1]);
  }, [location]);

  // إغلاق السايدبار عند تغيير المسار في الموبايل
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const sidebarContent = (
    <>
      <div style={{ textAlign: "center" }}>
        <img
          src="/lightLogo.jpg"
          alt="Logo"
          style={{ height: 120, borderRadius: "50%" }}
        />
        <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
          Asmak Thraa
        </Typography>
      </div>
      <div
        style={{
          border: "1px solid rgba(0, 0, 0, 0.25)",
          borderRadius: "19px",
          padding: "20px 30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "57%",
          userSelect: "none",
        }}
        className="leftSideBar2"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
          className="leftSideBar3"
        >
          {localStorage.role === "Admin" && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: activeTap == "dashboard" ? "#000" : "#fff",
                color: activeTap == "dashboard" ? "#fff" : "#000",
                borderRadius: "15px",
                padding: "10px 10px",
                alignItems: "center",
              }}
            >
              <Link
                to={"dashboard"}
                style={{
                  textDecoration: "none",
                  color: activeTap == "dashboard" ? "#fff" : "#000",
                  display: "flex",
                  gap: 5,
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 13h4V3H3v10zM10 21h4V8h-4v13zM17 21h4V11h-4v10z"
                    stroke="#9CA3AF"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p style={{ fontSize: "16px", margin: 0 }}>Dashboard</p>
              </Link>

              {ShowDashbaordItems ? (
                <FaArrowDown
                  onClick={() => setShowDashbaordItems(!ShowDashbaordItems)}
                />
              ) : (
                <FaArrowRight
                  onClick={() => setShowDashbaordItems(!ShowDashbaordItems)}
                />
              )}
            </div>
          )}

          {ShowDashbaordItems && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: "15px",
                  padding: "0px 20px",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "16px", margin: 0 }}>Expenses</p>
                <Link to={"/dashboard/expenses"}>
                  <Radio checked={location === "/dashboard/expenses"} />
                </Link>
              </div>
            </>
          )}

          {localStorage.role === "Admin" && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: activeTap == "orderlist" ? "#000" : "#fff",
                color: activeTap == "orderlist" ? "#fff" : "#000",
                borderRadius: "15px",
                padding: "10px 10px",
                alignItems: "center",
              }}
              onClick={() => setSelectedPage(1)}
            >
              <Link
                to={"/orderlist/yearly"}
                style={{
                  textDecoration: "none",
                  color: activeTap == "orderlist" ? "#fff" : "#000",
                  display: "flex",
                  gap: 5,
                  alignItems: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 7h6M9 12h6M9 17h6"
                    stroke="#9CA3AF"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="#9CA3AF"
                    strokeWidth="1.2"
                  />
                </svg>
                <p style={{ fontSize: "16px", margin: 0 }}>orders list</p>
              </Link>
              {showOrderListItems ? (
                <FaArrowDown
                  onClick={() => setShowOrderListItems(!showOrderListItems)}
                />
              ) : (
                <FaArrowRight
                  onClick={() => setShowOrderListItems(!showOrderListItems)}
                />
              )}
            </div>
          )}

          {showOrderListItems && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: "15px",
                  padding: "0px 10px",
                  alignItems: "center",
                }}
              >
                <p
                  style={{ fontSize: "14px", margin: 0, whiteSpace: "nowrap" }}
                >
                  orders from year
                </p>
                <Link to={"/orderlist/yearly"}>
                  <Radio checked={location === "/orderlist/yearly"} />
                </Link>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: "15px",
                  padding: "0px 10px",
                  alignItems: "center",
                }}
              >
                <p
                  style={{ fontSize: "14px", margin: 0, whiteSpace: "nowrap" }}
                >
                  orders from month
                </p>
                <Link to={"/orderlist/monthly"}>
                  <Radio checked={location === "/orderlist/monthly"} />
                </Link>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: "15px",
                  padding: "0px 10px",
                  alignItems: "center",
                }}
              >
                <p
                  style={{ fontSize: "14px", margin: 0, whiteSpace: "nowrap" }}
                >
                  orders from week
                </p>
                <Link to={"/orderlist/weekly"}>
                  <Radio checked={location === "/orderlist/weekly"} />
                </Link>
              </div>
            </>
          )}
          {localStorage.role == "CallCenter" && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: activeTap == "fininshalPost" ? "#000" : "#fff",
                color: activeTap == "fininshalPost" ? "#fff" : "#000",
                borderRadius: "15px",
                padding: "10px 10px",
                alignItems: "center",
              }}
            >
              <Link
                to={"/fininshalPost"}
                style={{
                  textDecoration: "none",
                  color: activeTap == "fininshalPost" ? "#fff" : "#000",
                  display: "flex",
                  gap: 5,
                  alignItems: "center",
                }}
              >
                <ManageHistoryIcon />
                <p style={{ fontSize: "16px", margin: 0 }}>Management</p>
              </Link>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              background: activeTap == "warehouse" ? "#000" : "#fff",
              color: activeTap == "warehouse" ? "#fff" : "#000",
              borderRadius: "15px",
              padding: "10px 10px",
              alignItems: "center",
            }}
          >
            <Link
              to={"/warehouse"}
              style={{
                textDecoration: "none",
                color: activeTap == "warehouse" ? "#fff" : "#000",
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 9.5L12 4l9 5.5V20a1 1 0 0 1-1 1h-16a1 1 0 0 1-1-1V9.5z"
                  stroke="#9CA3AF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 21V11h6v10"
                  stroke="#9CA3AF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p style={{ fontSize: "16px", margin: 0 }}>warehouse</p>
            </Link>

            {showWarehouseItems ? (
              <FaArrowDown
                onClick={() => setShowWarehouseItems(!showWarehouseItems)}
              />
            ) : (
              <FaArrowRight
                onClick={() => setShowWarehouseItems(!showWarehouseItems)}
              />
            )}
          </div>

          {showWarehouseItems && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: "15px",
                  padding: "0px 20px",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "16px", margin: 0 }}>Add product</p>
                <Link to={"/warehouse/addProduct"}>
                  <Radio checked={location === "/warehouse/addProduct"} />
                </Link>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: "15px",
                  padding: "0px 20px",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "16px", margin: 0 }}>Edit product</p>
                <Radio
                  checked={tapParts[2] === "editeProduct"}
                  onClick={() => {
                    alert(
                      "Firstly Select Product Form warehouse and press edit button"
                    );
                  }}
                />
              </div>
            </>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              background: activeTap == "menumangement" ? "#000" : "#fff",
              color: activeTap == "menumangement" ? "#fff" : "#000",
              borderRadius: "15px",
              padding: "10px 10px",
              alignItems: "center",
            }}
          >
            <Link
              to={"/menumangement"}
              style={{
                textDecoration: "none",
                color: activeTap == "menumangement" ? "#fff" : "#000",
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
            >
              {/* <BiFoodMenu /> */}
              <MenuBookIcon />
              <p style={{ fontSize: "16px", margin: 0 }}>Menu</p>
            </Link>
          
              <FaArrowRight />
            
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              background: activeTap == "team" ? "#000" : "#fff",
              color: activeTap == "team" ? "#fff" : "#000",
              borderRadius: "15px",
              padding: "10px 10px",
              alignItems: "center",
            }}
          >
            <Link
              to={
                localStorage.role === "Admin"
                  ? "/team/CallcenterTeam"
                  : "/team/stuffTeam"
              }
              style={{
                textDecoration: "none",
                color: activeTap == "team" ? "#fff" : "#000",
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 11a3 3 0 1 0-6 0M6 21v-1a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1"
                  stroke="#333"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p style={{ fontSize: "16px", margin: 0 }}>Team</p>
            </Link>
            {showTeamItems ? (
              <FaArrowDown onClick={() => setShowTeamItems(!showTeamItems)} />
            ) : (
              <FaArrowRight onClick={() => setShowTeamItems(!showTeamItems)} />
            )}
          </div>

          {showTeamItems && (
            <>
              {localStorage.role === "Admin" && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderRadius: "15px",
                    padding: "0px 20px",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      margin: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Users Team
                  </p>
                  <Link to={"/team/CallcenterTeam"}>
                    <Radio checked={location === "/team/CallcenterTeam"} />
                  </Link>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: "15px",
                  padding: "0px 20px",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "16px", margin: 0 }}>Stuff Team</p>
                <Link to={"/team/stuffTeam"}>
                  <Radio checked={location === "/team/stuffTeam"} />
                </Link>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: "15px",
                  padding: "0px 20px",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "15px", margin: 0 }}>Delivery Team</p>
                <Link to={"/team/deliveryTeam"}>
                  <Radio checked={location === "/team/deliveryTeam"} />
                </Link>
              </div>
            </>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderRadius: "15px",
              padding: "10px 10px",
              alignItems: "center",
              marginTop: "auto",
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            <p style={{ fontSize: "16px", margin: 0 }}>log out</p>
            <FaArrowRight />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <IconButton
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1300,
          backgroundColor: "white",
          boxShadow: 2,
        }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </IconButton>

      {/* السايدبار للديسكتوب */}
      <Box
        sx={{
          width: 280,
          backgroundColor: "white",
          p: 3,
          borderRight: "1px solid #e0e0e0",
          maxHeight: "100vh",
          display: { xs: "none", md: "block" },
        }}
        className="leftSideBar"
      >
        {sidebarContent}
      </Box>

      {/* السايدبار للموبايل */}
      {isMobileOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "280px",
            height: "100vh",
            backgroundColor: "white",
            p: 3,
            borderRight: "1px solid #e0e0e0",
            zIndex: 1200,
            overflowY: "auto",
            display: { xs: "block", md: "none" },
          }}
          className="leftSideBar mobile"
        >
          {sidebarContent}
        </Box>
      )}

      {isMobileOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1100,
            display: { xs: "block", md: "none" },
          }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default LeftSidebar;

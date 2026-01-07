import { Radio } from "@mui/joy";
import { Box, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { FaArrowRight, FaArrowDown, FaBars, FaTimes, FaSignOutAlt, FaWarehouse, FaUsers, FaTag, FaBox } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import { useTranslation } from "react-i18next";
import TranslateIcon from "@mui/icons-material/Translate";

const LeftSidebar = () => {
  const [selectedPage, setSelectedPage] = useState(0);
  const [ShowDashbaordItems, setShowDashbaordItems] = useState(false);
  const [showOrderListItems, setShowOrderListItems] = useState(false);
  const [showWarehouseItems, setShowWarehouseItems] = useState(false);
  const [showTeamItems, setShowTeamItems] = useState(false);
  const [tapParts, setTapParts] = useState([]);
  const [activeTap, setActiveTap] = useState("dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  let location = useLocation().pathname;

  useEffect(() => {
    const parts = location.split("");
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

  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang.startsWith("ar") ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const sidebarContent = (
    <>
      <div style={{ textAlign: "center" }}>
        {/* <img
          src="/logo.jpg"
          alt="Logo"
          style={{ height: 120, borderRadius: "50%" }}
        /> */}
        {/* <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          {t('Elhoot')}
          
        </Typography> */}
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
                <DashboardIcon sx={{ color: activeTap == "dashboard" ? "#fff" : "#9CA3AF" }} />
                <p style={{ fontSize: "16px", margin: 0 }}>{t('dashboard')}</p>
              </Link>

              {ShowDashbaordItems ? (
                <FaArrowDown
                  onClick={() => setShowDashbaordItems(!ShowDashbaordItems)}
                  style={{ color: activeTap == "dashboard" ? "#fff" : "#000" }}
                />
              ) : (
                <FaArrowRight
                  onClick={() => setShowDashbaordItems(!ShowDashbaordItems)}
                  style={{ color: activeTap == "dashboard" ? "#fff" : "#000" }}
                />
              )}
            </div>
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
                <ListAltIcon sx={{ color: activeTap == "orderlist" ? "#fff" : "#9CA3AF" }} />
                <p style={{ fontSize: "16px", margin: 0 }}>{t('Orders')}</p>
              </Link>
              {showOrderListItems ? (
                <FaArrowDown
                  onClick={() => setShowOrderListItems(!showOrderListItems)}
                  style={{ color: activeTap == "orderlist" ? "#fff" : "#000" }}
                />
              ) : (
                <FaArrowRight
                  onClick={() => setShowOrderListItems(!showOrderListItems)}
                  style={{ color: activeTap == "orderlist" ? "#fff" : "#000" }}
                />
              )}
            </div>
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
                <ManageHistoryIcon sx={{ color: activeTap == "fininshalPost" ? "#fff" : "#9CA3AF" }} />
                <p style={{ fontSize: "16px", margin: 0 }}>{t('management')}</p>
              </Link>
            </div>
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
              <MenuBookIcon sx={{ color: activeTap == "menumangement" ? "#fff" : "#9CA3AF" }} />
              <p style={{ fontSize: "16px", margin: 0 }}>{t('products')}</p>
            </Link>

            <FaArrowRight style={{ color: activeTap == "menumangement" ? "#fff" : "#000" }} />
          </div>

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
              <FaWarehouse style={{ color: activeTap == "warehouse" ? "#fff" : "#9CA3AF" }} />
              <p style={{ fontSize: "16px", margin: 0 }}>{t('warehouse')}</p>
            </Link>

            {showWarehouseItems ? (
              <FaArrowDown
                onClick={() => setShowWarehouseItems(!showWarehouseItems)}
                style={{ color: activeTap == "warehouse" ? "#fff" : "#000" }}
              />
            ) : (
              <FaArrowRight
                onClick={() => setShowWarehouseItems(!showWarehouseItems)}
                style={{ color: activeTap == "warehouse" ? "#fff" : "#000" }}
              />
            )}
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
              <FaUsers style={{ color: activeTap == "team" ? "#fff" : "#9CA3AF" }} />
              <p style={{ fontSize: "16px", margin: 0 }}>{t('users')}</p>
            </Link>
            {showTeamItems ? (
              <FaArrowDown
                onClick={() => setShowTeamItems(!showTeamItems)}
                style={{ color: activeTap == "team" ? "#fff" : "#000" }}
              />
            ) : (
              <FaArrowRight
                onClick={() => setShowTeamItems(!showTeamItems)}
                style={{ color: activeTap == "team" ? "#fff" : "#000" }}
              />
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              background: activeTap == "coupons" ? "#000" : "#fff",
              color: activeTap == "coupons" ? "#fff" : "#000",
              borderRadius: "15px",
              padding: "10px 10px",
              alignItems: "center",
            }}
          >
            <Link
              to={"/coupons"}
              style={{
                textDecoration: "none",
                color: activeTap == "coupons" ? "#fff" : "#000",
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
            >
              <FaTag style={{ color: activeTap == "coupons" ? "#fff" : "#9CA3AF" }} />
              <p style={{ fontSize: "16px", margin: 0 }}>{t('coupons')}</p>
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderRadius: "15px",
              padding: "10px 10px",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => changeLanguage()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <TranslateIcon sx={{ color: "#9CA3AF" }} />
              <p style={{ fontSize: "16px", margin: 0, color: "#000" }}>
                {i18n.language === 'ar' ? 'English' : 'العربية'}
              </p>
            </div>
            <FaArrowRight style={{ color: "#000" }} />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderRadius: "15px",
              padding: "10px 10px",
              alignItems: "center",
              marginTop: "auto",
              cursor: "pointer",
              backgroundColor: "#f5f5f5",
            }}
            onClick={handleLogout}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaSignOutAlt style={{ color: "#ff4444" }} />
              <p style={{ fontSize: "16px", margin: 0, color: "#ff4444" }}>{t('log_out')}</p>
            </div>
            <FaArrowRight style={{ color: "#ff4444" }} />
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
          height: '100vh',
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
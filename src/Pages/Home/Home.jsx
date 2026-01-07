import { Box } from "@mui/material";
import LeftSidebar from "../../Components/LeftSidebar";
import MainHome from "./MainHome";
import ExpensesDashboard from "./ExpensesDashboard";
import TransactionDashboard from "./Transaction";
import RevenueDashboard from "./AllRevenure";
import { Navigate, Route, Routes } from "react-router-dom";
import FinanceLossDashboard from "./LossDashbaord";
import YearlyOrders from "../OrdersList/YearlyOrders";
import WarehouseDashboard from "../Warehouse/WareHouseMain";
import WarehouseEdite from "../Warehouse/WarehouseEdite";
import WarehouseAdd from "../Warehouse/WarehouseAdd";
import AddDelivery from "../Team/AddDelivey";
import AddStuff from "../Team/AddStuff";
import Login from "../Login/Login";
import { useEffect } from "react";
import TeamDelivery from "../Team/DeliveryTeam";
import StuffTeam from "../Team/StuffTeam";
import TopSlidePar from "../../Components/TopSlidePar";
import SimpleProfilePage from "../../Components/Profile";
import Users from "../Team/AllUsers";
import AddCallcenter from "../Team/AddUser";
import EditUser from "../Team/EditeUser";
import { Toaster } from "react-hot-toast";
import EditDelivery from "../Team/EditeDelivery";
import EditStuff from "../Team/EditeStuff";
import OrderPage from "../OrdersList/OrderPage";

import FinishalPost from "../../Components/FininshalPost";
import MenuManager from "../Menu/MenuPage";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { i18n } = useTranslation();



  return (
    <Box
      sx={{
        display: "flex",

        minHeight: '100%',
      }}
      className="mainCon"
    >
      <LeftSidebar />

      <div
        style={{
          maxHeight: "100vh",
          flex: 1,
          direction: i18n.language === "ar" ? "rtl" : "ltr",
          // maxHeight:'100%',
          overflowY: "auto",
        }}
      >
        <TopSlidePar />
        <hr style={{ margin: 10 }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          {localStorage.role === "Admin" && (
            <>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="/dashboard" element={<MainHome />} />
              <Route
                path="/dashboard/expenses"
                element={<ExpensesDashboard />}
              />
              <Route
                path="/dashboard/loss"
                element={<FinanceLossDashboard />}
              />
              <Route path="/dashboard/revenue" element={<RevenueDashboard />} />
              <Route
                path="/dashboard/transaction"
                element={<TransactionDashboard />}
              />
              <Route
                path="/orderlist/yearly"
                element={<YearlyOrders period="year" />}
              />
              <Route
                path="/orderlist/monthly"
                element={<YearlyOrders period="month" />}
              />
              <Route
                path="/orderlist/weekly"
                element={<YearlyOrders period="week" />}
              />
              <Route path="/orderlist/:id" element={<OrderPage />} />
            </>
          )}
          {localStorage.role !== "Admin" && (
            <Route index element={<Navigate to="/warehouse" />} />
          )}
          <Route path="/profile" element={<SimpleProfilePage />} />
          <Route path="/warehouse" element={<WarehouseDashboard />} />
          <Route path="/warehouse/editeProduct" element={<WarehouseEdite />} />
          <Route
            path="/warehouse/editeProduct/:id"
            element={<WarehouseEdite />}
          />
          <Route path="/warehouse/addProduct" element={<WarehouseAdd />} />
          <Route path="/team/CallcenterTeam" element={<Users />} />
          <Route path="/team/CallcenterTeam/add" element={<AddCallcenter />} />
          <Route path="/EditCallCenter/:id" element={<EditUser />} />
          <Route path="/team/deliveryTeam" element={<TeamDelivery />} />
          <Route
            path="/team/deliveryTeam/Edit/:id"
            element={<EditDelivery />}
          />
          <Route path="/team/addDelivery" element={<AddDelivery />} />
          <Route path="/team/stuffTeam" element={<StuffTeam />} />
          <Route path="/team/stuffTeam/Edit/:id" element={<EditStuff />} />
          <Route path="/team/addStuff" element={<AddStuff />} />
          <Route path="/fininshalPost" element={<FinishalPost />} />
          <Route path="/menumangement" element={<MenuManager />} />
        </Routes>
      </div>
    </Box>
  );
};

export default Home;

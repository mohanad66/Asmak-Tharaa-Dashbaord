import { FaArrowTrendUp } from "react-icons/fa6";
import WeeklyActivityChart from "./WeeklyActivityChart";
import SalesStatisticsWithChart from "./SalesStatistics";
import { useEffect, useState } from "react";
import { useDate } from "../../Contexts/DateContext";
import axios from "axios";
import TrendingOrders from "./TrendingOrders";
import { GoArrowUpRight } from "react-icons/go";
import { Link } from "react-router-dom";

function MainHome() {
  let token = JSON.parse(localStorage.token);
  const { today, lastWeek, currentMonth } = useDate();
  let [Revenue, setRevenue] = useState(0);
  let [TotalOrders, setTotalOrders] = useState(0);
  let [TotalLoss, setTotalLoss] = useState(0);
  let [TotalExpenses, setTotalExpenses] = useState(0);
  let [TotalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    axios
      .get(
        `https://tharaa.premiumasp.net/api/CallcenterOrder/GetOrderDate?from=${lastWeek}&to=${today}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setTotalOrders(
          Number(res.data?.callCenterOrderDetails?.data?.numberOfOrders) +
            Number(res.data?.mobileOrderDetails?.data?.numberOfOrders)
        );
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://tharaa.premiumasp.net/api/FinancialManagement/Profit?From=${lastWeek}&To=${today}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const data = res?.data?.data;
        
        const financialRecords = data?.financialRecords;

        const totalRevenue = financialRecords?.reduce(
          (sum, record) => sum + record?.revenue,
          0
        );

        const totalExpenses = financialRecords?.reduce(
          (sum, record) => sum + record?.expense,
          0
        );

        const actualNet = totalRevenue - totalExpenses;

        const totalProfit = actualNet > 0 ? actualNet : 0;
        const totalLoss = actualNet < 0 ? Math.abs(actualNet) : 0;

        setRevenue(totalRevenue);
        setTotalExpenses(totalExpenses);
        setTotalProfit(totalProfit);
        setTotalLoss(totalLoss);
      })
      .catch((error) => {
        console.error("Error fetching financial data:", error);
      });
  }, []);

  return (
    <div
      style={{
        flex: 1,
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        gap: 10,
        overflowX: "hidden",
      }}
    >
      {/* Statistics Cards */}
      <div
        style={{
          display: "flex",
          borderRadius: "15px",
          border: "1px solid rgba(0, 0, 0, 0.5)",
          gap: "15px",
          padding: "10px",
          color: "rgba(69, 69, 69, 1)",
          justifyContent: "center",
          width: "100%",
          flexWrap: "wrap",
          overflowX: "auto",
        }}
        className="stats-container"
      >
        {/* Total Revenue */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            border: "solid 1px #000",
            padding: "10px",
            gap: "10px",
            minWidth: "100px",
            flex: "1 1 100px",
            position: "relative",
          }}
          className="stat-card"
        >
          <Link to={"/dashboard/revenue"} style={{color:'#333'}}>
            <GoArrowUpRight
              style={{ position: "absolute", right: 10 }}
              size={"1.8rem"}
            />
          </Link>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>Total Revenue</p>
          <div style={{ display: "flex", gap: "10px", textAlign: "right" }}>
            <p style={{ fontSize: "30px", whiteSpace: "nowrap" }}>
              {Revenue?.toLocaleString()} SAR
            </p>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <p
              style={{
                color: "rgba(9, 222, 19, 1)",
                fontSize: "12px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <FaArrowTrendUp /> 0%
            </p>
            <p style={{ fontSize: "12px", color: "rgba(115, 115, 115, 1)" }}>
              From last week
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            border: "solid 1px #000",
            padding: "10px",
            gap: "10px",
            minWidth: "100px",
            flex: "1 1 100px",
            position: "relative",
          }}
          className="stat-card"
        >
          <Link to={"/orderlist/weekly"}  style={{color:'#333'}}>
            <GoArrowUpRight
              style={{ position: "absolute", right: 10 }}
              size={"1.8rem"}
            />
          </Link>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>Total orders</p>
          <div style={{ display: "flex", gap: "10px", textAlign: "right" }}>
            <p style={{ fontSize: "30px", color: "rgba(26, 113, 246, 1)" }}>
              {TotalOrders}
            </p>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <p
              style={{
                color: "rgba(9, 222, 19, 1)",
                fontSize: "12px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <FaArrowTrendUp /> 0%
            </p>
            <p style={{ fontSize: "12px", color: "rgba(115, 115, 115, 1)" }}>
              From last week
            </p>
          </div>
        </div>

        {/* Total Transaction */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            border: "solid 1px #000",
            padding: "10px",
            gap: "10px",
            minWidth: "100px",
            flex: "1 1 100px",
            position: "relative",
          }}
          className="stat-card"
        >
          <Link to={'transaction'} style={{color:'#333'}}>
            <GoArrowUpRight
              style={{ position: "absolute", right: 10 }}
              size={"1.8rem"}
            />
          </Link>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>Total Transaction</p>
          <div style={{ display: "flex", gap: "10px", textAlign: "right" }}>
            <p style={{ fontSize: "30px", color: "rgba(26, 113, 246, 1)" }}>
              {TotalProfit.toLocaleString()} SAR
            </p>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <p
              style={{
                color: "rgba(9, 222, 19, 1)",
                fontSize: "12px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <FaArrowTrendUp /> 0%
            </p>
            <p style={{ fontSize: "12px", color: "rgba(115, 115, 115, 1)" }}>
              From last week
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            border: "solid 1px #000",
            padding: "10px",
            gap: "10px",
            minWidth: "100px",
            flex: "1 1 100px",
            position: "relative",
          }}
          className="stat-card"
        >
          {/* <GoArrowUpRight
            style={{ position: "absolute", right: 10 }}
            size={"1.8rem"}
          /> */}
          <p style={{ fontSize: "16px", fontWeight: 600 }}>Total Loss</p>
          <div style={{ display: "flex", gap: "10px", textAlign: "right" }}>
            <p style={{ fontSize: "30px", color: "rgba(26, 113, 246, 1)" }}>
              {TotalLoss.toLocaleString()} SAR
            </p>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <p
              style={{
                color: "rgba(255, 0, 0, 1)",
                fontSize: "12px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <FaArrowTrendUp /> 0%
            </p>
            <p style={{ fontSize: "12px", color: "rgba(115, 115, 115, 1)" }}>
              From last week
            </p>
          </div>
        </div>

        {/* Total Expenses */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            border: "solid 1px #000",
            padding: "10px",
            gap: "10px",
            minWidth: "100px",
            flex: "1 1 100px",
            position: "relative",
          }}
          className="stat-card"
        >
          <Link to={"expenses"} style={{color:'#333'}}>
            <GoArrowUpRight
              style={{ position: "absolute", right: 10 }}
              size={"1.8rem"}
            />
          </Link>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>Total Expenses</p>
          <div style={{ display: "flex", gap: "10px", textAlign: "right" }}>
            <p style={{ fontSize: "30px", color: "rgba(26, 113, 246, 1)" }}>
              {TotalExpenses?.toLocaleString()} SAR
            </p>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <p
              style={{
                color: "rgba(255, 0, 0, 1)",
                fontSize: "12px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <FaArrowTrendUp /> 0%
            </p>
            <p style={{ fontSize: "12px", color: "rgba(115, 115, 115, 1)" }}>
              From last week
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: "flex",
          gap: 10,
          width: "100%",
          flexWrap: "wrap",
        }}
        className="charts-container"
      >
        <div style={{ flex: "1 1 250px", minWidth: "300px" }}>
          <WeeklyActivityChart />
        </div>
        <div style={{ flex: "1 1 400px", minWidth: "300px" }}>
          <SalesStatisticsWithChart />
        </div>
      </div>

      <div style={{ width: "100%" }}>
        <TrendingOrders />
      </div>
    </div>
  );
}

export default MainHome;

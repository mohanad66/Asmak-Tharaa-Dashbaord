import { FaArrowTrendUp } from "react-icons/fa6";
import WeeklyActivityChart from "./WeeklyActivityChart";
import SalesStatisticsWithChart from "./SalesStatistics";
import { useEffect, useState } from "react";
import { useDate } from "../../Contexts/DateContext";
import axios from "axios";
import TrendingOrders from "./TrendingOrders";
import { GoArrowUpRight } from "react-icons/go";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function MainHome() {
  const { t, i18n } = useTranslation();
  let token = JSON.parse(localStorage.token);
  const { today, lastWeek, currentMonth } = useDate();
  let [Revenue, setRevenue] = useState(0);
  let [TotalOrders, setTotalOrders] = useState(0)
  let [TotalSales, setTotalSales] = useState(0)
  let [ordersData, setOrdersData] = useState([]) // هذا المتغير سيمرر للابن

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("api/BaseOrders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data.data)) {
          setOrdersData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token]);

  useEffect(() => {
    axios
      .get(`api/BaseOrders/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTotalOrders(res.data.numberOfAllOrder);
        setRevenue(res.data.amountOfmonyToCompleted);
        setTotalSales(res.data.numberCompletedOfOrder)
      });
  }, [token]);

  let lang = i18n.language;

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
          <Link to={"/dashboard/revenue"} style={{ color: "#333" }}>
            <GoArrowUpRight
              style={{
                position: "absolute",
                right: lang == "en" ? 10 : "auto",
                left: lang == "ar" ? 10 : "auto",
              }}
              size={"1.8rem"}
            />
          </Link>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>
            {t("total_revenue")}
          </p>
          <div style={{ display: "flex", gap: "10px", textAlign: "right" }}>
            <p style={{ fontSize: "30px", whiteSpace: "nowrap" }}>
              {Revenue?.toLocaleString()} {t("EGP")}
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
              {t("from_last_week")}
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
          <Link to={"/orderlist/weekly"} style={{ color: "#333" }}>
            <GoArrowUpRight
              style={{
                position: "absolute",
                right: lang == "en" ? 10 : "auto",
                left: lang == "ar" ? 10 : "auto",
              }}
              size={"1.8rem"}
            />
          </Link>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>
            {t("total_orders")}
          </p>
          <div style={{ display: "flex", gap: "10px", textAlign: "right" }}>
            <p style={{ fontSize: "30px", color: "rgba(26, 113, 246, 1)" }}>
              {TotalOrders || 0} Order
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
              {t("from_last_week")}
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
          <Link to={"transaction"} style={{ color: "#333" }}>
            <GoArrowUpRight
              style={{
                position: "absolute",
                right: lang == "en" ? 10 : "auto",
                left: lang == "ar" ? 10 : "auto",
              }}
              size={"1.8rem"}
            />
          </Link>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>
            {t("Total Sales")}
          </p>
          <div style={{ display: "flex", gap: "10px", textAlign: "right" }}>
            <p style={{ fontSize: "30px", color: "rgba(26, 113, 246, 1)" }}>
              {TotalSales || 0} Order
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
              {t("from_last_week")}
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
          {/* تمرير ordersData كـ prop */}
          <WeeklyActivityChart orders={ordersData} />
        </div>
        <div style={{ flex: "1 1 400px", minWidth: "300px" }}>
          <SalesStatisticsWithChart orders={ordersData} />
        </div>
      </div>

      {/* <div style={{ width: "100%" }}>
        <TrendingOrders />
      </div> */}
    </div>
  );
}

export default MainHome;
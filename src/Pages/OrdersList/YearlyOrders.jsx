import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDate } from "../../Contexts/DateContext";
import { Link } from "react-router-dom";

const YearlyOrders = ({ period }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [ordersData, setOrdersData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { today, lastWeek, currentMonth } = useDate();
  let [Revenue, setRevenue] = useState(0);
  let [TotalOrders, setTotalOrders] = useState(0);
  let [TotalLoss, setTotalLoss] = useState(0);
  let [TotalExpenses, setTotalExpenses] = useState(0);
  let [TotalProfit, setTotalProfit] = useState(0);

  const getStartDateByPeriod = (periodType) => {
    const todayDate = new Date(today);

    switch (periodType) {
      case "week":
        return lastWeek;
      case "month":
        const firstDayOfMonth = new Date(
          todayDate.getFullYear(),
          todayDate.getMonth(),
          1
        );
        return firstDayOfMonth.toISOString().split("T")[0];
      case "year":
        const firstDayOfYear = new Date(todayDate.getFullYear(), 0, 1);
        return firstDayOfYear.toISOString().split("T")[0];
      default:
        return lastWeek;
    }
  };

  let token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const startDate = getStartDateByPeriod(period);

    axios
      .get(
        `https://tharaa.premiumasp.net/api/FinancialManagement/Profit?From=${startDate}&To=${today}`,
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
          (sum, record) => sum + record.revenue,
          0
        );

        const totalExpenses = financialRecords?.reduce(
          (sum, record) => sum + record.expense,
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
  }, [period]);

  const isDateInPeriod = (dateString, periodType) => {
    const orderDate = new Date(dateString);
    const todayDate = new Date(today);

    const normalizeDate = (date) => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };

    const normalizedOrderDate = normalizeDate(orderDate);
    const normalizedToday = normalizeDate(todayDate);

    switch (periodType) {
      case "week":
        const lastWeekDate = new Date(lastWeek);
        const normalizedLastWeek = normalizeDate(lastWeekDate);
        return (
          normalizedOrderDate >= normalizedLastWeek &&
          normalizedOrderDate <= normalizedToday
        );

      case "month":
        const firstDayOfMonth = new Date(
          todayDate.getFullYear(),
          todayDate.getMonth(),
          1
        );
        const normalizedFirstDayOfMonth = normalizeDate(firstDayOfMonth);
        return (
          normalizedOrderDate >= normalizedFirstDayOfMonth &&
          normalizedOrderDate <= normalizedToday
        );

      case "year":
        const firstDayOfYear = new Date(todayDate.getFullYear(), 0, 1);
        const normalizedFirstDayOfYear = normalizeDate(firstDayOfYear);
        return (
          normalizedOrderDate >= normalizedFirstDayOfYear &&
          normalizedOrderDate <= normalizedToday
        );

      default:
        return true;
    }
  };

  const getPaymentBadge = (ispaid) => {
    switch (ispaid) {
      case true:
        return {
          bg: "#e9fff0",
          color: "#0f7a3a",
          border: "#dff7e6",
          text: "Paid",
        };
      case false:
        return {
          bg: "#fff4e6",
          color: "#b66a00",
          border: "#fbebd8",
          text: "Unpaid",
        };
      default:
        return {
          bg: "#e9fff0",
          color: "#0f7a3a",
          border: "#dff7e6",
          text: "On Delivery",
        };
    }
  };

  const getStatusBadge = (state) => {
    switch (state) {
      case 0:
        return {
          bg: "#e6fff0",
          color: "#695abfff",
          border: "#d6f7df",
          text: "Waiting",
        };
      case 1:
        return {
          bg: "#e6fff0",
          color: "#402bffff",
          border: "#d6f7df",
          text: "Preparing",
        };
      case 2:
        return {
          bg: "#e6fff0",
          color: "#4a1515ff",
          border: "#d6f7df",
          text: "Delivering",
        };
      case 3:
        return {
          bg: "#ffecec",
          color: "green",
          border: "#f7d0d6",
          text: "Done",
        };
      case 4:
        return {
          bg: "#dfe7ff",
          color: "red",
          border: "#dfe6ff",
          text: "Cancelled",
        };
      default:
        return {
          bg: "#e6fff0",
          color: "red",
          border: "#d6f7df",
          text: "UnKnown",
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const callCenterRes = await axios.get(
        //   "https://tharaa.premiumasp.net/api/CallcenterOrder",
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );

        const ordersRes = await axios.get(
          "https://tharaa.premiumasp.net/api/Order",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // const callCenterData = Array.isArray(callCenterRes?.data?.data)
        //   ? callCenterRes.data.data
        //   : [];

        const ordersDataApi = Array.isArray(ordersRes?.data?.data)
          ? ordersRes.data.data
          : [];

        const filteredOrdersByPeriod = ordersDataApi.filter((order) =>
          isDateInPeriod(order?.createdAt, period)
        );
        console.log(ordersDataApi);
        console.log(filteredOrdersByPeriod);

        setOrdersData(filteredOrdersByPeriod);
        setFilteredOrders(filteredOrdersByPeriod);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [period]);

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      let filtered = ordersData;
      switch (activeTab) {
        case "waiting":
          filtered = ordersData.filter((order) => order.state === 0);
          break;
        case "preparing":
          filtered = ordersData.filter((order) => order.state === 1);
          break;
        case "delivering":
          filtered = ordersData.filter((order) => order.state === 2);
          break;
        case "done":
          filtered = ordersData.filter((order) => order.state === 3);
          break;
        case "cancelled":
          filtered = ordersData.filter((order) => order.state === 4);
          break;
        default:
          filtered = ordersData;
      }
      setFilteredOrders(filtered);
      return;
    }

    const searchResults = ordersData.filter(
      (order) =>
        order.orderId.toString().includes(term) ||
        (order.customerName &&
          order.customerName.toLowerCase().includes(term.toLowerCase())) ||
        (order.customerEmail &&
          order.customerEmail.toLowerCase().includes(term.toLowerCase()))
    );

    let filtered = searchResults;
    switch (activeTab) {
      case "waiting":
        filtered = searchResults.filter((order) => order.state === 0);
        break;
      case "preparing":
        filtered = searchResults.filter((order) => order.state === 1);
        break;
      case "delivering":
        filtered = searchResults.filter((order) => order.state === 2);
        break;
      case "done":
        filtered = searchResults.filter((order) => order.state === 3);
        break;
      case "cancelled":
        filtered = searchResults.filter((order) => order.state === 4);
        break;
      default:
        filtered = searchResults;
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    handleSearch(searchTerm);
  }, [activeTab, ordersData]);

  const totalOrders = ordersData.length;
  const waitingOrders = ordersData.filter((order) => order.state === 0).length;
  const preparingOrders = ordersData.filter(
    (order) => order.state === 1
  ).length;
  const deliveringOrders = ordersData.filter(
    (order) => order.state === 2
  ).length;
  const doneOrders = ordersData.filter((order) => order.state === 3).length;
  const cancelledOrders = ordersData.filter(
    (order) => order.state === 4
  ).length;

  useEffect(() => {
    axios
      .get(
        "https://tharaa.premiumasp.net/api/Menu/product/top-selling?top=10",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setTrendingItems(res.data.data);
      });
  }, []);
  const [trendingItems, setTrendingItems] = useState([]);
  console.log(ordersData);

  return (
    <div className="outer-frame d-flex justify-content-center align-items-start py-4">
      <div className="app-canvas w-100">
        <div className="d-flex">
          <main className="flex-grow-1 p-3 p-md-4">
            <div className="row g-3 stats-row mb-4">
              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="stat-card p-3"
                  style={{
                    background: "#fff",
                    border: "1px solid #e6e9ee",
                    maxWidth: "90vw",
                  }}
                >
                  <div className="small text-muted mb-2">{period} income</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="h6 mb-0" style={{ whiteSpace: "nowrap" }}>
                      {TotalProfit.toLocaleString()} SAR
                    </div>
                    <div
                      className="badge"
                      style={{
                        background: "#e9fff0",
                        color: "#0f7a3a",
                        border: "1px solid #dff7e6",
                      }}
                    >
                      +0%
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="stat-card p-3"
                  style={{
                    background: "#fff",
                    border: "1px solid #e6e9ee",
                    maxWidth: "90vw",
                  }}
                >
                  <div className="small text-muted mb-2">{period} Revenue</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="h6 mb-0" style={{ whiteSpace: "nowrap" }}>
                      {Revenue?.toLocaleString()} SAR
                    </div>
                    <div
                      className="badge"
                      style={{
                        background: "#e9fff0",
                        color: "#0f7a3a",
                        border: "1px solid #dff7e6",
                      }}
                    >
                      +0%
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="stat-card p-3"
                  style={{
                    background: "#fff",
                    border: "1px solid #e6e9ee",
                    maxWidth: "90vw",
                  }}
                >
                  <div className="small text-muted mb-2">Total Orders</div>
                  <div className="h6 mb-0">{totalOrders}</div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="stat-card p-3"
                  style={{
                    background: "#fff",
                    border: "1px solid #e6e9ee",
                    maxWidth: "90vw",
                  }}
                >
                  <div className="small text-muted mb-2">Best Selling</div>
                  <div className="h6 mb-0">{trendingItems?.length || 0}</div>
                </div>
              </div>
            </div>

            {/* Page title */}
            <div className="mb-3">
              <h4 className="mb-1">Orders</h4>
              <div className="small text-muted">
                Dashboard › Orders ›{" "}
                <span style={{ color: "#0b63c6", fontWeight: "600" }}>
                  {period === "week"
                    ? "Weekly"
                    : period === "month"
                    ? "Monthly"
                    : period === "year"
                    ? "Yearly"
                    : "All"}{" "}
                  Orders
                </span>
              </div>
            </div>

            <div
              className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3 mb-3"
              style={{ maxWidth: "90vw" }}
            >
              <div className="inner-search d-flex flex-grow-1">
                <input
                  className="form-control me-2"
                  placeholder="Search for id, name, email"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button className="btn btn-light border">
                  <i className="bi bi-search"></i>
                </button>
              </div>

              <div className="d-flex gap-2 align-items-center mt-2 mt-md-0">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    print();
                  }}
                >
                  <i className="bi bi-download"></i> Export
                </button>
              </div>
            </div>

            <div
              className="card rounded tab-card mb-3"
              style={{ maxWidth: "90vw" }}
            >
              <div className="card-body p-2">
                <div
                  className="nav nav-pills d-flex gap-2 flex-nowrap overflow-auto"
                  role="tablist"
                >
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${
                        activeTab === "all" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("all")}
                    >
                      All Orders ({totalOrders})
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${
                        activeTab === "waiting" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("waiting")}
                    >
                      Waiting ({waitingOrders})
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${
                        activeTab === "preparing" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("preparing")}
                    >
                      preparing ({preparingOrders})
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${
                        activeTab === "delivering" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("delivering")}
                    >
                      Delivering ({deliveringOrders})
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${
                        activeTab === "done" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("done")}
                    >
                      Done ({doneOrders})
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${
                        activeTab === "cancelled" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("cancelled")}
                    >
                      Cancelled ({cancelledOrders})
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ maxWidth: "90vw" }}>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <div className="print-area">
                    <table className="table mb-0 align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>id</th>
                          <th>Customer</th>
                          <th>Price</th>
                          <th>Date</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.length > 0 ? (
                          filteredOrders
                            .slice()
                            .reverse()
                            .map((order, index) => {
                              const paymentBadge = getPaymentBadge(
                                order.ispaid
                              );
                              const statusBadge = getStatusBadge(order.state);

                              return (
                                <tr key={index}>
                                  <td>{order.orderId}</td>
                                  <td>{order.customerName || "N/A"}</td>
                                  <td>{order.totalPrice || 0} SAR</td>
                                  <td>{formatDate(order.createdAt)}</td>
                                  <td>
                                    <span
                                      className="badge"
                                      style={{
                                        background: paymentBadge.bg,
                                        color: paymentBadge.color,
                                        border: `1px solid ${paymentBadge.border}`,
                                      }}
                                    >
                                      {paymentBadge.text}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className="badge"
                                      style={{
                                        background: statusBadge.bg,
                                        color: statusBadge.color,
                                        border: `1px solid ${statusBadge.border}`,
                                      }}
                                    >
                                      {statusBadge.text}
                                    </span>
                                  </td>
                                  <td className="text-end">
                                    <Link to={`/orderlist/${order.orderId}/mm`}>
                                      <button className="btn btn-sm btn-outline-primary me-1">
                                        View
                                      </button>
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              No orders found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default YearlyOrders;

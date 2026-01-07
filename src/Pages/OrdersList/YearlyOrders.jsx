import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDate } from "../../Contexts/DateContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const YearlyOrders = ({ period }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [ordersData, setOrdersData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { today, lastWeek, currentMonth } = useDate();
  let [Revenue, setRevenue] = useState(0);
  let [TotalOrders, setTotalOrders] = useState(0);
  let [TotalSales, setTotalSales] = useState(0);

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

  // جلب إحصائيات الأوردرات
  useEffect(() => {
    axios
      .get(`api/BaseOrders/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTotalOrders(res.data.numberOfAllOrder || 0);
        setRevenue(res.data.amountOfmonyToCompleted || 0);
        setTotalSales(res.data.numberCompletedOfOrder || 0);
      })
      .catch((error) => {
        console.error("Error fetching orders info:", error);
      });
  }, [token]);

  // جلب جميع الأوردرات
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("api/BaseOrders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data.data)) {
          const allOrders = response.data.data;
          setOrdersData(allOrders);

          // تصفية الأوردرات حسب الفترة
          const startDate = getStartDateByPeriod(period);
          const filteredOrdersByPeriod = allOrders.filter((order) =>
            isDateInPeriod(order?.createdAt, period, startDate)
          );

          setFilteredOrders(filteredOrdersByPeriod);
        } else {
          console.error("Invalid response format:", response.data);
          setOrdersData([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrdersData([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [period, token]);

  // دالة التحقق مما إذا كان التاريخ ضمن الفترة المحددة
  const isDateInPeriod = (dateString, periodType, startDate) => {
    if (!dateString) return false;

    const orderDate = new Date(dateString);
    const todayDate = new Date(today);
    const start = new Date(startDate);

    const normalizeDate = (date) => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };

    const normalizedOrderDate = normalizeDate(orderDate);
    const normalizedToday = normalizeDate(todayDate);
    const normalizedStart = normalizeDate(start);

    return (
      normalizedOrderDate >= normalizedStart &&
      normalizedOrderDate <= normalizedToday
    );
  };

  // دالة الحصول على حالة الدفع
  const getPaymentBadge = (paymentMethod) => {
    switch (paymentMethod?.toLowerCase()) {
      case "cash":
        return {
          bg: "#e9fff0",
          color: "#0f7a3a",
          border: "#dff7e6",
          text: t('cash'),
        };
      case "banktransfer":
      case "bank_transfer":
        return {
          bg: "#e6f3ff",
          color: "#0066cc",
          border: "#d6e7ff",
          text: t('bank_transfer'),
        };
      case "creditcard":
      case "credit_card":
        return {
          bg: "#f0e6ff",
          color: "#663399",
          border: "#e6d6ff",
          text: t('credit_card'),
        };
      default:
        return {
          bg: "#fff4e6",
          color: "#b66a00",
          border: "#fbebd8",
          text: paymentMethod || t('unknown'),
        };
    }
  };

  // دالة الحصول على حالة الطلب
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "waiting":
        return {
          bg: "#fff4e6",
          color: "#b66a00",
          border: "#fbebd8",
          text: t('waiting'),
        };
      case "accepted":
        return {
          bg: "#e6fff0",
          color: "#0f7a3a",
          border: "#d6f7df",
          text: t('accepted'),
        };
      case "rejected":
        return {
          bg: "#ffecec",
          color: "#dc3545",
          border: "#f7d0d6",
          text: t('rejected'),
        };
      case "processing":
        return {
          bg: "#e6f3ff",
          color: "#0066cc",
          border: "#d6e7ff",
          text: t('processing'),
        };
      case "completed":
        return {
          bg: "#e9fff0",
          color: "#0f7a3a",
          border: "#dff7e6",
          text: t('completed'),
        };
      case "cancelled":
        return {
          bg: "#ffecec",
          color: "#dc3545",
          border: "#f7d0d6",
          text: t('cancelled'),
        };
      default:
        return {
          bg: "#f8f9fa",
          color: "#6c757d",
          border: "#e9ecef",
          text: status || t('unknown'),
        };
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // دالة البحث
  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      // إذا كان البحث فارغاً، نعرض جميع الأوردرات حسب التبويب النشط
      filterOrdersByTab(ordersData, activeTab);
      return;
    }

    const searchResults = ordersData.filter((order) => {
      // البحث في رقم الطلب
      if (order.orderNumber && order.orderNumber.toString().toLowerCase().includes(term.toLowerCase())) {
        return true;
      }

      // البحث في اسم العميل
      if (order.customer && order.customer.name &&
        order.customer.name.toLowerCase().includes(term.toLowerCase())) {
        return true;
      }

      // البحث في بريد العميل
      if (order.customer && order.customer.email &&
        order.customer.email.toLowerCase().includes(term.toLowerCase())) {
        return true;
      }

      // البحث في رقم العميل
      if (order.customer && order.customer.id &&
        order.customer.id.toString().includes(term)) {
        return true;
      }

      // البحث في رقم الطلب (id)
      if (order.id && order.id.toString().includes(term)) {
        return true;
      }

      return false;
    });

    // تطبيق الفلتر حسب التبويب النشط على نتائج البحث
    filterOrdersByTab(searchResults, activeTab);
  };

  // دالة فلترة الأوردرات حسب التبويب
  const filterOrdersByTab = (orders, tab) => {
    let filtered = orders;

    switch (tab) {
      case "waiting":
        filtered = orders.filter((order) => order.status?.toLowerCase() === "waiting");
        break;
      case "accepted":
        filtered = orders.filter((order) => order.status?.toLowerCase() === "accepted");
        break;
      case "rejected":
        filtered = orders.filter((order) => order.status?.toLowerCase() === "rejected");
        break;
      case "processing":
        filtered = orders.filter((order) => order.status?.toLowerCase() === "processing");
        break;
      case "completed":
        filtered = orders.filter((order) => order.status?.toLowerCase() === "completed");
        break;
      case "cancelled":
        filtered = orders.filter((order) => order.status?.toLowerCase() === "cancelled");
        break;
      default:
        filtered = orders;
    }

    setFilteredOrders(filtered);
  };

  // تحديث الفلترة عند تغيير التبويب
  useEffect(() => {
    filterOrdersByTab(ordersData, activeTab);
  }, [activeTab, ordersData]);

  // حساب الإحصائيات
  const totalOrders = ordersData.length;
  const waitingOrders = ordersData.filter((order) =>
    order.status?.toLowerCase() === "waiting"
  ).length;
  const acceptedOrders = ordersData.filter((order) =>
    order.status?.toLowerCase() === "accepted"
  ).length;
  const rejectedOrders = ordersData.filter((order) =>
    order.status?.toLowerCase() === "rejected"
  ).length;
  const processingOrders = ordersData.filter((order) =>
    order.status?.toLowerCase() === "processing"
  ).length;
  const completedOrders = ordersData.filter((order) =>
    order.status?.toLowerCase() === "completed"
  ).length;
  const cancelledOrders = ordersData.filter((order) =>
    order.status?.toLowerCase() === "cancelled"
  ).length;

  // حساب المنتجات الأكثر مبيعاً
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  useEffect(() => {
    if (ordersData.length > 0) {
      const productSales = {};

      ordersData.forEach((order) => {
        if (order.orderItems && Array.isArray(order.orderItems)) {
          order.orderItems.forEach((item) => {
            if (item.product && item.productId) {
              const productId = item.productId;
              const productName = item.product.name || `Product ${productId}`;

              if (!productSales[productId]) {
                productSales[productId] = {
                  id: productId,
                  name: productName,
                  totalQuantity: 0,
                  ordersCount: 0
                };
              }

              productSales[productId].totalQuantity += (item.quantity || 0);
              productSales[productId].ordersCount += 1;
            }
          });
        }
      });

      const sortedProducts = Object.values(productSales)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5); // أفضل 5 منتجات

      setTopSellingProducts(sortedProducts);
    }
  }, [ordersData]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('loading')}</span>
        </div>
      </div>
    );
  }

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
                  <div className="small text-muted mb-2">{period} {t('revenue')}</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="h6 mb-0" style={{ whiteSpace: "nowrap" }}>
                      {Revenue?.toLocaleString()} {t('egp')}
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
                  <div className="small text-muted mb-2">{t('total_orders')}</div>
                  <div className="h6 mb-0">{TotalOrders || 0}</div>
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
                  <div className="small text-muted mb-2">{t('completed_orders')}</div>
                  <div className="h6 mb-0">{TotalSales || 0}</div>
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
                  <div className="small text-muted mb-2">{t('best_selling')}</div>
                  <div className="h6 mb-0">{topSellingProducts.length || 0}</div>
                </div>
              </div>
            </div>

            {/* Page title */}
            <div className="mb-3">
              <h4 className="mb-1">{t('orders')}</h4>
              <div className="small text-muted">
                {t('dashboard')} › {t('orders')} ›{" "}
                <span style={{ color: "#0b63c6", fontWeight: "600" }}>
                  {period === "week"
                    ? t('weekly')
                    : period === "month"
                      ? t('monthly')
                      : period === "year"
                        ? t('yearly')
                        : t('all')}{" "}
                  {t('orders')}
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
                  placeholder={t('search_placeholder')}
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
                    print()
                  }}
                >
                  <i className="bi bi-download"></i> {t('export')}
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
                      className={`nav-link ${activeTab === "all" ? "active" : ""
                        }`}
                      onClick={() => setActiveTab("all")}
                    >
                      {t('all_orders')} ({totalOrders})
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${activeTab === "waiting" ? "active" : ""
                        }`}
                      onClick={() => setActiveTab("waiting")}
                    >
                      {t('waiting')} ({waitingOrders})
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${activeTab === "accepted" ? "active" : ""
                        }`}
                      onClick={() => setActiveTab("accepted")}
                    >
                      {t('accepted')} ({acceptedOrders})
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${activeTab === "rejected" ? "active" : ""
                        }`}
                      onClick={() => setActiveTab("rejected")}
                    >
                      {t('rejected')} ({rejectedOrders})
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${activeTab === "processing" ? "active" : ""
                        }`}
                      onClick={() => setActiveTab("processing")}
                    >
                      {t('processing')} ({processingOrders})
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${activeTab === "completed" ? "active" : ""
                        }`}
                      onClick={() => setActiveTab("completed")}
                    >
                      {t('completed')} ({completedOrders})
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${activeTab === "cancelled" ? "active" : ""
                        }`}
                      onClick={() => setActiveTab("cancelled")}
                    >
                      {t('cancelled')} ({cancelledOrders})
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
                          <th>{t('order_number')}</th>
                          <th>{t('customer')}</th>
                          <th>{t('price')}</th>
                          <th>{t('date')}</th>
                          <th>{t('payment')}</th>
                          <th>{t('status')}</th>
                          <th className="text-end">{t('action')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.length > 0 ? (
                          filteredOrders
                            .slice()
                            .reverse()
                            .map((order, index) => {
                              const paymentBadge = getPaymentBadge(order.paymentMethod);
                              const statusBadge = getStatusBadge(order.status);
                              const customerName = order.customer?.name || "N/A";
                              const customerEmail = order.customer?.email || "";

                              return (
                                <tr key={order.id || index}>
                                  <td>{order.id}</td>
                                  <td>
                                    <div>{customerName}</div>
                                    {customerEmail && (
                                      <small className="text-muted">{customerEmail}</small>
                                    )}
                                  </td>
                                  <td>{order.totalPrice?.toLocaleString() || 0} {t('egp')}</td>
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
                                    <Link to={`/orderlist/${order.id}`}>
                                      <button className="btn btn-sm btn-outline-primary me-1">
                                        {t('view')}
                                      </button>
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              {t('no_orders_found')}
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
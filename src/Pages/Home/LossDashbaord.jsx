import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const FinanceLossDashboard = () => {
  const [activeTab, setActiveTab] = useState("all");

  // بيانات الجدول
  const tableData = [
    {
      id: 1,
      name: "Grilled Shimp",
      category: "orders",
      quantity: 12,
      date: "returned 12/8",
      salary: "170,750 SAR",
      status: "returned",
      image: "assets/product-1.png",
    },
    {
      id: 2,
      name: "Tilapai fish",
      category: "fish",
      quantity: 0,
      date: "harmony 15/6",
      salary: "25 SAR",
      status: "harmony",
      image: "assets/product-2.png",
    },
    {
      id: 3,
      name: "sea oysters",
      category: "Shellfish",
      quantity: 0,
      date: "Expired 15/6",
      salary: "200 SAR",
      status: "expired",
      image: "assets/product-3.png",
    },
    {
      id: 4,
      name: "Mackerla fish",
      category: "fish",
      quantity: 22,
      date: "Expired 19/8",
      salary: "250 SAR",
      status: "harmony",
      image: "assets/product-4.png",
    },
    {
      id: 5,
      name: "mussels",
      category: "fish",
      quantity: 0,
      date: "returned 15/6",
      salary: "350 SAR",
      status: "returned",
      image: "assets/product-5.png",
    },
    {
      id: 6,
      name: "Tomatoes",
      category: "vegetables",
      quantity: 23,
      date: "harmony 9/9",
      salary: "1500 SAR",
      status: "harmony",
      image: "assets/product-6.png",
    },
    {
      id: 7,
      name: "pasta",
      category: "ingredients",
      quantity: 31,
      date: "returned 7/6",
      salary: "$162,700",
      status: "returned",
      image: "assets/product-7.png",
    },
  ];

  // تصفية البيانات حسب التبويب النشط
  const filteredData =
    activeTab === "all"
      ? tableData
      : tableData.filter((item) => item.status === activeTab);

  // الحصول على عدد العناصر في كل تبويب
  const getTabCount = (status) => {
    if (status === "all") return tableData.length;
    return tableData.filter((item) => item.status === status).length;
  };

  // تنسيق الـ badge حسب الحالة
  const getStatusBadge = (status) => {
    switch (status) {
      case "expired":
        return {
          bg: "#e6eefc",
          color: "#5b6fb2",
          border: "#d0d9ff",
          text: "Expired",
        };
      case "harmony":
        return {
          bg: "#fff0f3",
          color: "#c05b6b",
          border: "#f7d6de",
          text: "harmony",
        };
      case "returned":
        return {
          bg: "#fff6e9",
          color: "#b9742f",
          border: "#f4e3c8",
          text: "returned",
        };
      default:
        return {
          bg: "#e6eefc",
          color: "#5b6fb2",
          border: "#d0d9ff",
          text: status,
        };
    }
  };

  return (
    <div className="outer-frame d-flex justify-content-center align-items-start">
      <div className="app-canvas shadow-sm w-100">
        <div className="top-dark-bar"></div>

        <div className="d-flex">
          <main className="flex-grow-1 p-4">
            {/* Header (welcome + search + actions) */}
            {/* <div className="d-flex align-items-center justify-content-between header-row mb-3">
              <div>
                <h4 className="mb-1">welcome back , Ahmed !</h4>
                <div className="text-muted small">it is the best time to manage your finances</div>
              </div>

              <div className="search-and-actions d-flex align-items-center gap-3">
                <div className="search-box d-flex align-items-center">
                  <input className="form-control search-input" placeholder="Search product" />
                  <i className="bi bi-search search-icon"></i>
                </div>

                <div className="actions d-flex align-items-center gap-2">
                  <button className="btn btn-light icon-btn position-relative">
                    <i className="bi bi-chat-left-text"></i>
                    <span className="notif-badge">2</span>
                  </button>
                  <button className="btn btn-light icon-btn position-relative">
                    <i className="bi bi-bell"></i>
                    <span className="notif-badge">1</span>
                  </button>

                  <div className="d-flex align-items-center user-sm">
                    <img src="assets/avatar.png" className="user-avatar me-2" alt="user" />
                    <div className="text-end">
                      <div className="fw-semibold">Ahemd</div>
                      <div className="small text-muted">Admin</div>
                    </div>
                  </div>
                </div>
              </div>
            </div> 

            <hr style={{borderColor:'#111', opacity:0.15, marginTop:0, marginBottom:'18px'}} />
*/}
            {/* Stat cards (loss summary cards) */}
            <div className="row g-3 stats-row mb-4">
              <div className="col-6 col-md-3">
                <div
                  className="stat-card p-3"
                  style={{ background: "#e6eefc", border: "1px solid #000", borderRadius:5 }}
                >
                  <div className="small text-muted mb-2">
                    total product Expired
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="h5 mb-0">50</div>
                    <div
                      className="badge"
                      style={{
                        background: "#e2e9ff",
                        color: "#5b6fb2",
                        border: "1px solid #d0d9ff",
                      }}
                    >
                      Expired
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div
                  className="stat-card p-3"
                  style={{ background: "#fff0f3", border: "1px solid #000", borderRadius:5 }}
                >
                  <div className="small text-muted mb-2">
                    total product harmony
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="h5 mb-0">20</div>
                    <div
                      className="badge"
                      style={{
                        background: "#fff0f3",
                        color: "#c05b6b",
                        border: "1px solid #f7d6de",
                      }}
                    >
                      harmony
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div
                  className="stat-card p-3"
                  style={{ background: "#fff7e8", border: "1px solid #000", borderRadius:5 }}
                >
                  <div className="small text-muted mb-2">
                    Total product returned
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="h5 mb-0">10</div>
                    <div
                      className="badge"
                      style={{
                        background: "#fff6e9",
                        color: "#b9742f",
                        border: "1px solid #f4e3c8",
                      }}
                    >
                      harmony
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div
                  className="stat-card p-3"
                  style={{ background: "#ffffff", border: "1px solid #000", borderRadius:5 }}
                >
                  <div className="small text-muted mb-2">total loss</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="h5 mb-0">$20.9 SAR</div>
                    <div
                      className="badge"
                      style={{
                        background: "#ffecef",
                        color: "#c03a4b",
                        border: "1px solid #f7d0d6",
                      }}
                    >
                      -2,5%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loss summary header and controls */}
            <div className="d-flex align-items-start justify-content-between mb-3">
              <div>
                <h6 className="mb-1">loss Summary</h6>
                <div className="text-muted small">
                  Overview of total orders,reurns,and return.
                </div>
              </div>

              <div className="d-flex gap-2 align-items-center">
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-funnel"></i> Filter
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-download"></i> Export
                </button>
              </div>
            </div>

            {/* Inner search */}
            <div className="mb-3">
              <div className="inner-search d-flex">
                <input
                  className="form-control me-2"
                  placeholder="Search for id, name product"
                />
                <button className="btn btn-light border">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>

            {/* Tabs (loss) */}
            <div className="card tab-card mb-4" >
              <div className="card-body p-2" >
                <ul className="nav nav-pills d-flex gap-2" role="tablist">
                  <li
                    className="nav-item"
                    role="presentation"
                    style={{ flex: "0 0 auto" }}
                  >
                    <button
                      className={`nav-link ${
                        activeTab === "all" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("all")}
                    >
                      All loss{" "}
                      <span className="badge bg-primary ms-2">
                        ({getTabCount("all")})
                      </span>
                    </button>
                  </li>
                  <li
                    className="nav-item"
                    role="presentation"
                    style={{ flex: "0 0 auto" }}
                  >
                    <button
                      className={`nav-link ${
                        activeTab === "expired" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("expired")}
                    >
                      Expired{" "}
                      <span className="text-muted ms-2">
                        ({getTabCount("expired")})
                      </span>
                    </button>
                  </li>
                  <li
                    className="nav-item"
                    role="presentation"
                    style={{ flex: "0 0 auto" }}
                  >
                    <button
                      className={`nav-link ${
                        activeTab === "harmony" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("harmony")}
                    >
                      Harmony ({getTabCount("harmony")})
                    </button>
                  </li>
                  <li
                    className="nav-item"
                    role="presentation"
                    style={{ flex: "0 0 auto" }}
                  >
                    <button
                      className={`nav-link ${
                        activeTab === "returned" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("returned")}
                    >
                      Returned ({getTabCount("returned")})
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Loss table */}
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Data of income</th>
                        <th>Salary</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item) => {
                        const badgeStyle = getStatusBadge(item.status);
                        return (
                          <tr key={item.id}>
                            <td className="d-flex align-items-center gap-3">
                              <img
                                src={item.image}
                                alt="prod"
                                className="avatar-sm rounded-circle"
                              />
                              <div>
                                <div className="fw-semibold">{item.name}</div>
                              </div>
                            </td>
                            <td>{item.category}</td>
                            <td>{item.quantity}</td>
                            <td>{item.date}</td>
                            <td>{item.salary}</td>
                            <td>
                              <span
                                className="badge"
                                style={{
                                  background: badgeStyle.bg,
                                  color: badgeStyle.color,
                                  border: `1px solid ${badgeStyle.border}`,
                                }}
                              >
                                {badgeStyle.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            {/* <div className="text-muted small mt-3">
              © 2025 Finance. كل الحقوق محفوظة.
            </div> */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default FinanceLossDashboard;

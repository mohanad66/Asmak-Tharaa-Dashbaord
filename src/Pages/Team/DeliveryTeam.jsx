import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { Link } from "react-router-dom";
import ConfirmAlert from "./alert";

const TeamDelivery = () => {
  let token = JSON.parse(localStorage.getItem("token"));
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");

  console.log(filteredStaff);
  

  useEffect(() => {
    axios
      .get("https://tharaa.premiumasp.net/api/Delivery/delivery-guys", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDeliveryStaff(res.data.data);
        setFilteredStaff(res.data.data);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterStaff(term, activeTab, stateFilter);
  };

  const handleStateFilter = (state) => {
    setStateFilter(state);
    filterStaff(searchTerm, activeTab, state);
  };

  const filterStaff = (search, tab, state) => {
    let filtered = deliveryStaff;

    if (search) {
      filtered = filtered.filter(
        (staff) =>
          staff.driverName?.toLowerCase().includes(search) ||
          staff.driverPhone?.toLowerCase().includes(search) ||
          staff.driverId?.toString().includes(search)
      );
    }

    if (tab === "inTrack") {
      filtered = filtered.filter((staff) => staff.state === "busy");
    } else if (tab === "topEvaluation") {
      filtered = filtered.filter((staff) => staff.salary > 50);
    } else if (tab === "withDiscount") {
      filtered = filtered.filter((staff) => staff.salary < 100);
    }

    if (state !== "all") {
      filtered = filtered.filter((staff) => staff.state === state);
    }

    setFilteredStaff(filtered);
  };

  const getTabStats = () => {
    const allCount = deliveryStaff?.length;
    const free = deliveryStaff?.filter(
      (staff) => staff.state === "free"
    ).length;
    const onprogress = deliveryStaff?.filter(
      (staff) => staff.state === "in_progress"
    ).length;

    return { allCount, free, onprogress };
  };

  const tabStats = getTabStats();
  let [deleteId, setDeleteId] = useState(0);

  let deleteDelivery = () => {
    console.log(deleteId);

    axios
      .delete(
        `https://tharaa.premiumasp.net/api/Delivery/delivery-guys/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res.data);
        location.reload();
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
          console.log(
            err.response.data.message || "Failed to delete callcenter"
          );
        } else {
          console.log("Failed to delete callcenter");
        }
      });
  };
  let [showConfirmAlert, setshowConfirmAlert] = useState(false);

  return (
    <div className="outer-frame d-flex justify-content-center align-items-start py-4">
      <div className="app-canvas w-100">
        <div className="top-dark-bar"></div>

        <div className="d-flex">
          <main className="flex-grow-1 p-3 p-md-4">
            {/* Stats cards - محسنة للريسبونسف */}
            <div className="row g-3 stats-row mb-4">
              <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                <div
                  className="stat-card p-3"
                  style={{ border: "1px solid #000", borderRadius: "6.82px" }}
                >
                  <div className="small text-muted mb-2">
                    number of delivery
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="h5 mb-0">{deliveryStaff?.length || 0}</div>
                    <div className="badge bg-light text-success border">
                      available
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                <div
                  className="stat-card p-3"
                  style={{ border: "1px solid #000", borderRadius: "6.82px" }}
                >
                  <div className="small text-muted mb-2">
                    total salary form delivery
                  </div>
                  <div className="h5 mb-0">
                    {deliveryStaff?.reduce(
                      (sum, record) => sum + record.salary,
                      0
                    ) || 0}{" "}
                    SAR
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                <div
                  className="stat-card p-3"
                  style={{ border: "1px solid #000", borderRadius: "6.82px" }}
                >
                  <div className="small text-muted mb-2">Active Delivery</div>
                  <div className="h5 mb-0">
                    {deliveryStaff?.filter((staff) => staff.isActive).length ||
                      0}
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                <div
                  className="stat-card p-3"
                  style={{ border: "1px solid #000", borderRadius: "6.82px" }}
                >
                  <div className="small text-muted mb-2">Busy Delivery</div>
                  <div className="h5 mb-0">
                    {deliveryStaff?.filter((staff) => staff.state === "busy")
                      .length || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Staff summary header - محسن للريسبونسف */}
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
              <div>
                <h6 className="mb-1">Delivery summery</h6>
                <div className="text-muted small">
                  Overview of Delivery Guys.
                </div>
              </div>

              <div className="d-flex gap-2 align-items-center mt-2 mt-md-0">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={print}
                >
                  <i className="bi bi-download"></i> Export
                </button>
                <Link to={"/team/addDelivery"}>
                  <button className="btn btn-primary btn-sm">
                    <span className="d-none d-md-inline">New Delivery</span>
                    <i className="bi bi-plus-lg ms-1"></i>
                  </button>
                </Link>
              </div>
            </div>

            {/* Inner search - محسن للريسبونسف */}
            <div className="mb-4">
              <div className="inner-search d-flex">
                <input
                  className="form-control me-2"
                  placeholder="Search for id, name, phone"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button className="btn btn-light border">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>

            {/* Tabs bar - محسن للريسبونسف */}
            <div className="card rounded tab-card mb-4">
              <div className="card-body p-2">
                <div
                  className="nav nav-pills d-flex gap-2 flex-nowrap overflow-auto"
                  role="tablist"
                >
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${
                        stateFilter === "all" ? "active" : ""
                      }`}
                      onClick={() => handleStateFilter("all")}
                    >
                      All Delivery{" "}
                      <span className="badge bg-primary ms-2">
                        {tabStats.allCount || 0}
                      </span>
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${
                        stateFilter === "free" ? "active" : ""
                      }`}
                      onClick={() => handleStateFilter("free")}
                    >
                      Free ({tabStats.free || 0})
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${
                        stateFilter === "in_progress" ? "active" : ""
                      }`}
                      onClick={() => handleStateFilter("in_progress")}
                    >
                      on Progress ({tabStats.onprogress || 0})
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff table - محسن للريسبونسف */}
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <div className="print-area">
                    <table className="table mb-0 align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Id</th>
                          <th>Name</th>
                          <th className="d-none d-md-table-cell">Phone</th>
                          <th className="d-none d-sm-table-cell">Position</th>
                          <th>Salary</th>
                          <th>State</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStaff?.length > 0 ? (
                          filteredStaff.map((deliveryGuy) => (
                            <tr key={deliveryGuy.driverId}>
                              {showConfirmAlert && (
                                <ConfirmAlert
                                  open
                                  onConfirm={() => deleteDelivery()}
                                  onClose={() => {
                                    setshowConfirmAlert(false);
                                  }}
                                />
                              )}
                              <td className="fw-semibold">
                                {deliveryGuy.driverId}
                              </td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  {/* {deliveryGuy.driverPhotoUrl !== "string" && (
                                  <img
                                    src={deliveryGuy.driverPhotoUrl}
                                    alt={deliveryGuy.driverName}
                                    className="avatar-sm rounded-circle"
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      objectFit: "cover",
                                    }}
                                  />
                                )} */}
                                  <div
                                    className="text-truncate"
                                    style={{ maxWidth: "120px" }}
                                  >
                                    {deliveryGuy.driverName}
                                  </div>
                                </div>
                              </td>
                              <td className="d-none d-md-table-cell">
                                {deliveryGuy.driverPhone}
                              </td>
                              <td className="d-none d-sm-table-cell">
                                Delivery
                              </td>
                              <td>{deliveryGuy.salary} SAR</td>
                              <td>
                                <span
                                  className={`badge ${
                                    deliveryGuy.state === "free"
                                      ? "bg-success"
                                      : deliveryGuy.state === "in_progress"
                                      ? "bg-warning"
                                      : "bg-secondary"
                                  }`}
                                >
                                  {deliveryGuy.state}
                                </span>
                              </td>
                              <td className="text-end">
                                <Link to={`/team/deliveryTeam/Edit/${deliveryGuy.driverId}`}>
                                  <button className="btn btn-sm btn-outline-secondary me-1">
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                </Link>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => {
                                    setshowConfirmAlert(true);
                                    setDeleteId(deliveryGuy?.driverId);
                                  }}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="7"
                              className="text-center py-4 text-muted"
                            >
                              No delivery staff found matching your criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination or results info */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted small">
                Showing {filteredStaff?.length || 0} of{" "}
                {deliveryStaff?.length || 0} delivery staff
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TeamDelivery;

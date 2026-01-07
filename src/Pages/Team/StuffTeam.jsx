import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { Link } from "react-router-dom";
import ConfirmAlert from "./alert";
import { useTranslation } from "react-i18next";

const StuffTeam = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [positions, setPositions] = useState([]);

  let [totalEmploys, setTotalEmploys] = useState(0);
  let [totalSalaryEmploys, setTotalSalaryEmploys] = useState(0);
  let [totalEmploysDiscount, setTotalEmploysDiscount] = useState(0);
  let token = JSON.parse(localStorage.getItem("token"));

  const [staffData, setStuffData] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  let [deleteId, setDeleteId] = useState(0);

  let deleteStuff = () => {
    console.log(deleteId);

    axios
      .delete(`api/Stuff/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        location.reload();
        // تحسين معالجة الـ response
        if (res.data && res.data.message) {
          console.log(res.data.message);
        } else {
          console.log(t('callcenter_deleted_successfully'));
        }
        getData();
      })
      .catch((err) => {
        console.error("Delete error:", err);

        if (err.response && err.response.data) {
          console.log(
            err.response.data.message || t('failed_to_delete_callcenter')
          );
        } else {
          console.log(t('failed_to_delete_callcenter'));
        }
      });
  };
  let [showConfirmAlert, setshowConfirmAlert] = useState(false);
  useEffect(() => {
    axios
      .get("api/Stuff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const employees = res.data.data.employees;
        setStuffData(employees);
        setFilteredStaff(employees);
        setTotalEmploys(res.data.data.totalNumbersOfEmployee);
        setTotalSalaryEmploys(res.data.data.totalSalaryOfEmployee);
        setTotalEmploysDiscount(res.data.data.totalDeductionOfEmployee);

        const uniquePositions = [
          ...new Set(employees.map((emp) => emp.position)),
        ];
        setPositions(uniquePositions);
      });
  }, []);

  // تطبيق البحث والتصفية
  useEffect(() => {
    let result = staffData;

    // تطبيق البحث
    if (searchTerm) {
      result = result.filter(
        (staff) =>
          staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.id.toString().includes(searchTerm) ||
          staff.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // تطبيق التصفية حسب المنصب
    if (selectedPosition !== "all") {
      result = result.filter((staff) => staff.position === selectedPosition);
    }

    setFilteredStaff(result);
  }, [searchTerm, selectedPosition, staffData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePositionFilter = (position) => {
    setSelectedPosition(position);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPosition("all");
  };

  return (
    <div className="outer-frame d-flex justify-content-center align-items-start py-4">
      <div className="app-canvas w-100">
        <div className="top-dark-bar"></div>

        <div className="d-flex">
          <main className="flex-grow-1 p-3 p-md-4">
            <div className="row g-3 stats-row mb-4">
              <div className="col-12 col-sm-6 col-md-4">
                <div
                  className="stat-card p-3"
                  style={{
                    border: "1px solid #000",
                    borderRadius: "6.82px",
                    maxWidth: "90vw",
                  }}
                >
                  <div className="small text-muted mb-2">{t('number_of_employs')}</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="h5 mb-0">{totalEmploys}</div>
                    <div className="badge bg-light text-success border">
                      {t('available')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4">
                <div
                  className="stat-card p-3"
                  style={{
                    border: "1px solid #000",
                    borderRadius: "6.82px",
                    maxWidth: "90vw",
                  }}
                >
                  <div className="small text-muted mb-2">
                    {t('total_salary_form_employees')}
                  </div>
                  <div className="h5 mb-0">{totalSalaryEmploys} SAR</div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4">
                <div
                  className="stat-card p-3"
                  style={{
                    border: "1px solid #000",
                    borderRadius: "6.82px",
                    maxWidth: "90vw",
                  }}
                >
                  <div className="small text-muted mb-2">
                    {t('total_employees_discount')}
                  </div>
                  <div className="h5 mb-0">{totalEmploysDiscount}</div>
                </div>
              </div>
            </div>

            {/* عنوان ملخص الموظفين وضوابط التحكم - محسن للريسبونسف */}
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
              <div>
                <h6 className="mb-1">{t('staff_summary')}</h6>
                <div className="text-muted small">{t('overview_of_stuff_team')}</div>
              </div>

              <div className="d-flex gap-2 align-items-center mt-2 mt-md-0">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={print}
                >
                  <i className="bi bi-download"></i> {t('export')}
                </button>
                <Link to={"/team/addStuff"}>
                  <button className="btn btn-primary btn-sm">
                    {t('new_staff')} <i className="bi bi-plus-lg ms-1"></i>
                  </button>
                </Link>
              </div>
            </div>

            <div className="row mb-3" style={{ maxWidth: "95vw" }}>
              <div className="col-12 col-md-8 col-lg-6">
                <div className="inner-search d-flex">
                  <input
                    className="form-control me-2"
                    placeholder={t('search_for_id_name_position')}
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button className="btn btn-light border">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </div>

            <div
              className="card rounded tab-card mb-4"
              style={{ maxWidth: "90vw" }}
            >
              <div className="card-body p-2">
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedPosition === "all"
                      ? "btn-primary"
                      : "btn-outline-primary"
                      }`}
                    onClick={() => handlePositionFilter("all")}
                  >
                    {t('all')}
                  </button>
                  {positions.map((position) => (
                    <button
                      key={position}
                      type="button"
                      className={`btn btn-sm ${selectedPosition === position
                        ? "btn-primary"
                        : "btn-outline-primary"
                        }`}
                      onClick={() => handlePositionFilter(position)}
                    >
                      {position}
                    </button>
                  ))}
                  {(searchTerm || selectedPosition !== "all") && (
                    <button
                      className="btn btn-sm btn-outline-secondary ms-auto"
                      onClick={clearFilters}
                    >
                      {t('clear_filters')}
                    </button>
                  )}
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
                          <th>{t('id')}</th>
                          <th>{t('name')}</th>
                          <th>{t('position')}</th>
                          <th>{t('age')}</th>
                          {/* <th>{t('discount')}</th> */}
                          <th>{t('salary')}</th>
                          <th>{t('start_date')}</th>
                          <th className="text-end">{t('action')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStaff.length > 0 ? (
                          filteredStaff.map((staff) => (
                            <tr key={staff.id}>
                              {showConfirmAlert && (
                                <ConfirmAlert
                                  open
                                  onConfirm={() => deleteStuff()}
                                  onClose={() => {
                                    setshowConfirmAlert(false);
                                  }}
                                />
                              )}
                              <td>{staff.id}</td>
                              <td>
                                <div className="fw-semibold">
                                  {staff.fullName}
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-light text-dark border">
                                  {staff.position}
                                </span>
                              </td>
                              <td>{staff.age}</td>
                              {/* <td
                                className={`text-${
                                  staff.salaryDeduction > 0
                                    ? "danger"
                                    : "success"
                                }`}
                              >
                                {staff.salaryDeduction > 0
                                  ? `-${staff.salaryDeduction}%`
                                  : "0%"}
                              </td> */}
                              <td>{staff.salary} SAR</td>
                              <td>
                                {new Date(staff.startDate).toLocaleDateString()}
                              </td>
                              <td className="text-end">
                                <Link to={`/team/stuffTeam/Edit/${staff.id}`}>
                                  <button className="btn btn-sm btn-outline-secondary me-1">
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                </Link>
                                <button className="btn btn-sm btn-outline-secondary">
                                  <i
                                    className="bi bi-trash"
                                    onClick={() => {
                                      setshowConfirmAlert(true);
                                      setDeleteId(staff?.id);
                                    }}
                                  ></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="8"
                              className="text-center py-4 text-muted"
                            >
                              {t('no_employees_found_matching_your_criteria')}
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

export default StuffTeam;
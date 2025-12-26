import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { useDate } from "../../Contexts/DateContext";
import { LineChart } from "@mui/x-charts/LineChart";

const ExpensesDashboard = () => {
  const [chartData, setChartData] = useState({
    days: [],
    values: [0, 0, 0, 0, 0, 0, 0],
  });

  let [TotalExpenses, setTotalExpenses] = useState(0);
  const { today, lastWeek, currentMonth } = useDate();
  let [todayFinancial, setTodayFinancial] = useState([]);
  let [todayFinancialSum, setTodayFinancialSum] = useState({
    buyProducts: 0,
    transportation: 0,
    repairs: 0,
    technology: 0,
    account: 0,
    total: 0
  });

  console.log(todayFinancial);

  let [staffData, setStuffData] = useState([]);
  let [financialRecords, setFinancialRecords] = useState([]);

  let token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    axios
      .get(`https://tharaa.premiumasp.net/api/Stuff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStuffData(res.data.data.employees);
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
        const data = res.data.data;
        const financialRecords = data.financialRecords;
        setFinancialRecords(financialRecords);
        
        // Find all records from today (not just one)
        let todayRecords = financialRecords.filter(
          (f) => f.date.split("T")[0] === today
        );
        
        // Calculate sums for today's records
        const sums = {
          buyProducts: 0,
          transportation: 0,
          repairs: 0,
          technology: 0,
          account: 0,
          total: 0
        };
        
        todayRecords.forEach(record => {
          sums.buyProducts += record.buyProducts || 0;
          sums.transportation += record.transportation || 0;
          sums.repairs += record.repairs || 0;
          sums.technology += record.technology || 0;
          sums.account += record.account || 0;
        });
        
        sums.total = sums.buyProducts + sums.transportation + sums.repairs + 
                     sums.technology + sums.account;
        
        setTodayFinancialSum(sums);
        
        // Keep the first record for backward compatibility if needed
        if (todayRecords.length > 0) {
          setTodayFinancial(todayRecords[0]);
        }

        const totalExpenses = financialRecords.reduce(
          (sum, record) => sum + record.expense,
          0
        );

        setTotalExpenses(totalExpenses);

        processChartData(financialRecords);
      })
      .catch((error) => {
        console.error("Error fetching financial data:", error);
      });
  }, []);

  const processChartData = (financialRecords) => {
    const getLastWeekDays = () => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date();
      const todayIndex = today.getDay();

      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const dayIndex = (todayIndex - 6 + i + 7) % 7;
        weekDays.push(days[dayIndex]);
      }

      return weekDays;
    };

    const weekDays = getLastWeekDays();

    const dayExpenses = {};
    weekDays.forEach((day) => {
      dayExpenses[day] = 0;
    });

    financialRecords.forEach((record) => {
      if (record.date) {
        const recordDate = new Date(record.date);
        const dayIndex = recordDate.getDay();
        const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
          dayIndex
        ];

        if (dayExpenses.hasOwnProperty(dayName) && record.expense > 0) {
          dayExpenses[dayName] += record.expense;
        }
      }
    });

    const values = weekDays.map((day) => dayExpenses[day]);

    setChartData({
      days: weekDays,
      values: values,
    });
  };

  return (
    <div className="outer-frame d-flex justify-content-center align-items-start py-4">
      <div className="app-canvas w-100">
        <div className="d-flex">
          <main className="flex-grow-1 p-3 p-md-4">
            {/* Main Content Row */}
            <div className="row g-3">
              {/* Left Column - Chart */}
              <div className="col-12 col-lg-7">
                <div
                  className="card p-3 p-md-4"
                  style={{ border: "1px solid #e6e9ee", borderRadius: "16px" }}
                >
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                    <div>
                      <h5 className="mb-1 fw-bold">Expenses</h5>
                      <p className="text-muted mb-0 small">
                        From {lastWeek} to {today}
                      </p>
                    </div>
                    <div>
                      <span className="badge bg-light text-dark border px-3 py-2">
                        Last Week
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold mb-2">Expense statistic</h6>
                    <p className="text-muted small mb-3">Last Week Expenses</p>

                    <div className="mt-3" style={{ overflowX: "auto" }}>
                      <div style={{ minWidth: "300px" }}>
                        <LineChart
                          series={[
                            {
                              data: chartData.values,
                              color: "#9f7aea",
                              label: "Expenses",
                            },
                          ]}
                          xAxis={[
                            {
                              data: chartData.days,
                              scaleType: "band",
                              label: "Days of Week",
                            },
                          ]}
                          yAxis={[
                            {
                              label: "Amount (SAR)",
                            },
                          ]}
                          height={280}
                          margin={{ left: 0, right: 30, top: 20, bottom: 40 }}
                          grid={{ horizontal: true }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Today's Expenses */}
              <div className="col-12 col-lg-5">
                <div
                  className="card p-3 p-md-4"
                  style={{ border: "1px solid #e6e9ee", borderRadius: "16px" }}
                >
                  <div className="px-2 px-md-3 pt-2 pt-md-3">
                    <h6 className="fw-bold">Today's Total Expenses</h6>
                    <p className="text-muted small mb-0">Date: {today}</p>
                  </div>

                  <div className="p-2 p-md-3 pt-0">
                    {/* Expense Items - Now using summed values */}
                    <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white me-3"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <i className="bi bi-cart"></i>
                        </div>
                        <div>
                          <span className="fw-bold">Buy products</span>
                          <br />
                          <small className="text-muted">Sum of all today's records</small>
                        </div>
                      </div>
                      <span className="badge bg-danger text-white fs-6">
                        {todayFinancialSum.buyProducts || 0}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-purple d-flex align-items-center justify-content-center text-white me-3"
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#9f7aea",
                          }}
                        >
                          <i className="bi bi-bus-front"></i>
                        </div>
                        <div>
                          <span className="fw-bold">Transportation</span>
                          <br />
                          <small className="text-muted">Sum of all today's records</small>
                        </div>
                      </div>
                      <span className="badge bg-danger text-white fs-6">
                        {todayFinancialSum.transportation || 0}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white me-3"
                          style={{ width: "40px", height: "40px", background:'rgba(255, 135, 0, 1)' }}
                        >
                          <i className="bi bi-tools"></i>
                        </div>
                        <div>
                          <span className="fw-bold">Repairs</span>
                          <br />
                          <small className="text-muted">Sum of all today's records</small>
                        </div>
                      </div>
                      <span className="badge bg-danger text-white fs-6">
                        {todayFinancialSum.repairs || 0}
                      </span>
                    </div>
                    
                    <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-danger d-flex align-items-center justify-content-center text-white me-3"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <i className="bi bi-pc-display"></i>
                        </div>
                        <div>
                          <span className="fw-bold">Technology</span>
                          <br />
                          <small className="text-muted">Sum of all today's records</small>
                        </div>
                      </div>
                      <span className="badge bg-danger text-white fs-6">
                        {todayFinancialSum.technology || 0}
                      </span>
                    </div>
                    
                    <div className="d-flex align-items-center justify-content-between py-3 ">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-success d-flex align-items-center justify-content-center text-white me-3"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <i className="bi bi-person"></i>
                        </div>
                        <div>
                          <span className="fw-bold">Account</span>
                          <br />
                          <small className="text-muted">Sum of all today's records</small>
                        </div>
                      </div>
                      <span className="badge bg-danger text-white fs-6">
                        {todayFinancialSum.account || 0}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="p-1 p-md-2 pt-0">
                    <div className="d-flex align-items-center justify-content-between py-3 border-top">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-warning d-flex align-items-center justify-content-center text-white me-3"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <i className="bi bi-cash-coin"></i>
                        </div>
                        <div>
                          <span className="fw-bold">Today's Total</span>
                          <br />
                          <small className="text-muted">Sum of all expenses today</small>
                        </div>
                      </div>
                      <span className="badge bg-dark text-white fs-5">
                        {todayFinancialSum.total || 0} SAR
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Expenses Table */}
            <div
              className="card mt-3"
              style={{ border: "1px solid #e6e9ee", borderRadius: "16px" }}
            >
              <div className="card-body">
                <h6 className="fw-bold mb-3">Staff Expenses</h6>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-semibold">Name</th>
                        <th className="fw-semibold d-none d-sm-table-cell">
                          Position
                        </th>
                        <th className="fw-semibold">Age</th>
                        <th className="fw-semibold">Salary</th>
                        <th className="fw-semibold d-none d-md-table-cell">
                          Start date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffData.map((row, i) => (
                        <tr key={i}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  fontSize: "14px",
                                }}
                              >
                                {row.fullName?.charAt(0)}
                              </div>
                              <span className="fw-medium">{row.fullName}</span>
                            </div>
                          </td>
                          <td className="d-none d-sm-table-cell">
                            {row.position}
                          </td>
                          <td>{row.age}</td>
                          <td>{row.salary}</td>
                          <td className="d-none d-md-table-cell">
                            {row.startDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .bg-purple {
          background-color: #9f7aea !important;
        }

        @media (max-width: 768px) {
          .card {
            margin-bottom: 1rem;
          }
          .badge {
            font-size: 0.8rem !important;
            padding: 0.25em 0.6em;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpensesDashboard;
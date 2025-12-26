import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LineChart, BarChart } from "@mui/x-charts";

import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import { useDate } from "../../Contexts/DateContext";
import { Link } from "react-router-dom";

const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: "#fff",
  minHeight: "100vh",
  fontFamily: "'Inter', sans-serif",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(2),
  },
}));

const Breadcrumb = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "16px",
  [theme.breakpoints.up("sm")]: {
    fontSize: "14px",
    marginBottom: "20px",
  },
}));

const TabButton = styled(Button)(({ selected, theme }) => ({
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: selected ? 600 : 500,
  backgroundColor: selected ? "#3b82f6" : "transparent",
  color: selected ? "white" : "#6b7280",
  padding: "6px 12px",
  fontSize: "12px",
  minWidth: "auto",
  [theme.breakpoints.up("sm")]: {
    padding: "8px 16px",
    fontSize: "14px",
  },
  "&:hover": {
    backgroundColor: selected ? "#3b82f6" : "#e5e7eb",
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: "300px",
  height: "120px",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
    borderRadius: "16px",
    minWidth: "auto",
    height: "auto",
  },
  position: "relative",
}));

const IconCircle = styled(Avatar)(({ bg, theme }) => ({
  background: bg,
  width: 36,
  height: 36,
  [theme.breakpoints.up("sm")]: {
    width: 48,
    height: 48,
  },
  position: "absolute",
  top: 10,
  right: 10,
}));

const ChartPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  marginTop: theme.spacing(2),
  height: "fit-content",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
    borderRadius: "16px",
    marginTop: theme.spacing(3),
  },
}));

const RevenueDashboard = () => {
  const { today, lastWeek, currentMonth } = useDate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery("(max-width:480px)");

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [chartData, setChartData] = useState({
    revenue: [],
    profit: [],
    days: [],
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  let token = JSON.parse(localStorage.token);

  useEffect(() => {
    axios
      .get("https://tharaa.premiumasp.net/api/Customer/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const customersWithProfile =
          res.data.data.customersWithProfile?.length || 0;
        const customersWithoutProfile =
          res.data.data.customersWithoutProfile?.length || 0;
        setTotalUsers(customersWithProfile + customersWithoutProfile);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });
  }, []);

  // جلب بيانات الطلبات
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
        const callCenterOrders =
          Number(res.data?.callCenterOrderDetails?.data?.numberOfOrders) || 0;
        const mobileOrders =
          Number(res.data?.mobileOrderDetails?.data?.numberOfOrders) || 0;
        setTotalOrders(callCenterOrders + mobileOrders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, [lastWeek, today]);

  // جلب البيانات المالية والرسوم البيانية
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await axios.get(
          `https://tharaa.premiumasp.net/api/FinancialManagement/Profit?From=${lastWeek}&To=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.data;
        const financialRecords = data.financialRecords || [];

        // حساب الإجماليات
        const totalRevenue = financialRecords.reduce(
          (sum, record) => sum + (record.revenue || 0),
          0
        );
        const totalExpenses = financialRecords.reduce(
          (sum, record) => sum + (record.expense || 0),
          0
        );
        const totalProfit = financialRecords.reduce(
          (sum, record) => sum + (record.profit || 0),
          0
        );

        setRevenue(totalRevenue);
        setTotalExpenses(totalExpenses);
        setTotalProfit(totalProfit);

        // معالجة البيانات للرسم البياني
        processChartData(financialRecords);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching financial data:", error);
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [lastWeek, today]);

  // جلب كل الاوردرات والطلبات الحديثة
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        // جلب بيانات الطلبات من كلا المصدرين
        const [callCenterRes, mobileRes] = await Promise.all([
          axios.get("https://tharaa.premiumasp.net/api/CallcenterOrder", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://tharaa.premiumasp.net/api/Order", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const allCallCenterOrders = callCenterRes.data.data || [];
        const allMobileOrders = mobileRes.data.data || [];

        // دمج كل الاوردرات
        const mergedAllOrders = [...allCallCenterOrders, ...allMobileOrders];
        setAllOrders(mergedAllOrders);

        console.log("All orders count:", mergedAllOrders.length);
        console.log("Call center orders:", allCallCenterOrders.length);
        console.log("Mobile orders:", allMobileOrders.length);

        // ترتيب الطلبات حسب التاريخ (الأحدث أولاً) وأخذ أول 5 طلبات للعرض الحديث
        const sortedRecentOrders = mergedAllOrders
          .filter((order) => order.createdAt)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((order) => ({
            id: order.orderId || order.id || "N/A",
            item: getOrderItem(order),
            qty: getOrderQuantity(order),
            date: new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            amount: `${order.totalPrice || order.total || 0} SAR`,
            status: getOrderStatus(order.state),
          }));

        console.log("Recent orders:", sortedRecentOrders);
        setRecentOrders(sortedRecentOrders);
      } catch (error) {
        console.error("Error fetching all orders:", error);
      }
    };

    fetchAllOrders();
  }, []);

  // دالة لاستخراج اسم المنتج من الطلب
  const getOrderItem = (order) => {
    if (order.items && order.items.length > 0) {
      const firstItem = order.items[0];
      return (
        firstItem.name ||
        firstItem.productName ||
        firstItem.itemName ||
        "See Food"
      );
    }

    if (order.itemName) {
      return order.itemName;
    }

    if (order.productName) {
      return order.productName;
    }

    return "See Food";
  };

  // دالة لاستخراج الكمية من الطلب
  const getOrderQuantity = (order) => {
    if (order.quantity) {
      return order.quantity;
    }

    if (order.items && order.items.length > 0) {
      return order.items.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );
    }

    return 1;
  };

  // دالة لتحديد حالة الطلب
  const getOrderStatus = (state) => {
    switch (state) {
      case 0:
        return "Waiting";
      case 1:
        return "Preparing";
      case 2:
        return "Delivering";
      case 3:
        return "Completed";
      case 4:
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  // معالجة بيانات الرسم البياني
  const processChartData = (financialRecords) => {
    // إنشاء مصفوفة الأيام للأسبوع الماضي
    const getLastWeekDays = () => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date();
      const result = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        result.push(days[date.getDay()]);
      }

      return result;
    };

    const weekDays = getLastWeekDays();

    // إنشاء كائنات لتخزين البيانات لكل يوم
    const revenueByDay = {};
    const profitByDay = {};

    weekDays.forEach((day) => {
      revenueByDay[day] = 0;
      profitByDay[day] = 0;
    });

    // تعبئة البيانات من السجلات المالية
    financialRecords.forEach((record) => {
      if (record.date) {
        const recordDate = new Date(record.date);
        const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
          recordDate.getDay()
        ];

        if (revenueByDay.hasOwnProperty(dayName)) {
          revenueByDay[dayName] += record.revenue || 0;
          profitByDay[dayName] += record.profit || 0;
        }
      }
    });

    // تحويل إلى مصفوفات
    const revenueData = weekDays.map((day) => revenueByDay[day]);
    const profitData = weekDays.map((day) => profitByDay[day]);

    setChartData({
      revenue: revenueData,
      profit: profitData,
      days: weekDays,
    });
  };

  if (loading) {
    return (
      <DashboardContainer>
        <Typography>Loading...</Typography>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      {/* Breadcrumb & Tabs */}
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
        gap={isMobile ? 2 : 0}
        mb={3}
      >
        <Breadcrumb>Dashboard › Total Revenue › All Revenue</Breadcrumb>
        {/* <Box
          display="flex"
          gap={1}
          flexWrap={isSmallMobile ? "wrap" : "nowrap"}
          width={isMobile ? "100%" : "auto"}
        >
          {["this year", "this month", "this Week", "today"].map((tab) => (
            <TabButton key={tab} selected={tab === "this year"}>
              {isSmallMobile ? tab.split(" ")[1] : tab}
            </TabButton>
          ))}
        </Box> */}
      </Box>

      {/* Statistics Cards */}
      <Box
        sx={{
          border: "1px solid #000",
          display: "flex",
          overflowX: "auto",
          gap: 2,
          padding: 2,
          borderRadius: 3,
          mb: 3,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        {[
          {
            title: "Total User",
            value: totalUsers.toLocaleString(),
            trend: "up",
            change: "0% Up from yesterday",
            icon: PeopleIcon,
            bg: "linear-gradient(135deg, #c4b5fd, #8b5cf6)",
          },
          {
            title: "Total Order",
            value: allOrders.length.toLocaleString(), // عرض كل الاوردرات
            trend: "up",
            change: "0% Up from past week",
            icon: ShoppingCartIcon,
            bg: "linear-gradient(135deg, #fdba74, #fb923c)",
          },
          {
            title: "Total Revenue",
            value: `${totalRevenue.toLocaleString()} SAR`,
            trend: totalRevenue > 0 ? "up" : "down",
            change: `${totalRevenue > 0 ? "0%" : "0%"} ${
              totalRevenue > 0 ? "Up" : "Down"
            } from yesterday`,
            icon: AttachMoneyIcon,
            bg: "linear-gradient(135deg, #86efac, #22c55e)",
          },
          {
            title: "Total Profit",
            value: `${totalProfit.toLocaleString()} SAR`,
            trend: totalProfit > 0 ? "up" : "down",
            change: `${totalProfit > 0 ? "0%" : "0%"} ${
              totalProfit > 0 ? "Up" : "Down"
            } from yesterday`,
            icon: CheckCircleIcon,
            bg: "linear-gradient(135deg, #93c5fd, #3b82f6)",
          },
        ].map((stat, index) => (
          <StatCard
            key={index}
            sx={{ flexShrink: 0, minWidth: isMobile ? "280px" : "300px" }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography color="#6b7280" fontSize={isMobile ? "12px" : "14px"}>
                {stat.title}
              </Typography>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight={700}
                fontSize={isSmallMobile ? "16px" : "inherit"}
              >
                {stat.value}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                {stat.trend === "up" ? (
                  <ArrowUpwardIcon sx={{ color: "#10b981", fontSize: 16 }} />
                ) : (
                  <ArrowDownwardIcon sx={{ color: "#ef4444", fontSize: 16 }} />
                )}
                <Typography
                  color={stat.trend === "up" ? "#10b981" : "#ef4444"}
                  fontSize={isMobile ? "11px" : "12px"}
                  whiteSpace="nowrap"
                >
                  {stat.change}
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconCircle bg={stat.bg}>
                <stat.icon fontSize={isMobile ? "small" : "medium"} />
              </IconCircle>
            </Box>
          </StatCard>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 3,
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: isMobile ? "100%" : "50%",
            minWidth: isMobile ? "auto" : "40%",
          }}
        >
          <ChartPaper>
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems={isMobile ? "flex-start" : "center"}
              gap={isMobile ? 2 : 0}
              mb={3}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  fontSize={isMobile ? "1rem" : "1.25rem"}
                >
                  Revenue
                </Typography>
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700}>
                    {totalRevenue.toLocaleString()} SAR
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Button
                  variant={"contained"}
                  size="small"
                  sx={{ borderRadius: 2, fontSize: "12px" }}
                >
                  Week
                </Button>
              </Box>
            </Box>

            <Box sx={{ overflowX: "auto" }}>
              <Box sx={{ minWidth: isMobile ? 400 : "auto" }}>
                <LineChart
                  series={[
                    {
                      data: chartData.revenue,
                      area: true,
                      color: "#93c5fd",
                      label: "Revenue",
                    },
                  ]}
                  xAxis={[
                    {
                      data: chartData.days,
                      scaleType: "band",
                    },
                  ]}
                  yAxis={[
                    {
                      label: "Amount (SAR)",
                    },
                  ]}
                  height={isMobile ? 250 : 320}
                  margin={{ top: 20, bottom: 50, left: 0, right: 100 }}
                  grid={{ horizontal: true }}
                  sx={{
                    width: "100%",
                  }}
                />
              </Box>
            </Box>
          </ChartPaper>
        </Box>

        <Box
          sx={{
            width: isMobile ? "100%" : "50%",
            minWidth: isMobile ? "auto" : "40%",
          }}
        >
          <ChartPaper>
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems={isMobile ? "flex-start" : "center"}
              gap={isMobile ? 2 : 0}
              mb={3}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  fontSize={isMobile ? "1rem" : "1.25rem"}
                >
                  Profit
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography
                    color="#10b981"
                    fontSize="12px"
                    whiteSpace="nowrap"
                  >
                    Total: {totalProfit.toLocaleString()} SAR
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ overflowX: "auto" }}>
              <Box sx={{ minWidth: isMobile ? 400 : "auto" }}>
                <BarChart
                  series={[
                    {
                      data: chartData.profit,
                      color: "#3b82f6",
                      label: "Profit",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: chartData.days,
                    },
                  ]}
                  yAxis={[
                    {
                      label: "Amount (SAR)",
                    },
                  ]}
                  height={isMobile ? 250 : 320}
                  margin={{ top: 20, bottom: 50, left: 0, right: 100 }}
                  sx={{
                    width: "100%",
                  }}
                />
              </Box>
            </Box>
          </ChartPaper>
        </Box>
      </Box>

      {/* Recent Orders Table */}
      <ChartPaper sx={{ mt: 3 }}>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile ? "flex-start" : "center"}
          gap={isMobile ? 2 : 0}
          mb={3}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              fontSize={isMobile ? "1rem" : "1.25rem"}
            >
              Recent Orders ({recentOrders.length})
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Orders: {allOrders.length}
            </Typography>
          </Box>
          <Link to={'/orderlist/weekly'}>
            <Button
              variant="text"
              size={isMobile ? "small" : "medium"}
              endIcon={<ArrowUpwardIcon sx={{ transform: "rotate(90deg)" }} />}
            >
              {isMobile ? "Orders" : "Go to Orders Page"}
            </Button>
          </Link>
        </Box>

        <TableContainer sx={{ maxHeight: 400, overflow: "auto" }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Qty</TableCell>
                {!isMobile && (
                  <TableCell sx={{ fontWeight: 600 }}>Order Date</TableCell>
                )}
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography
                        fontSize={isMobile ? "12px" : "14px"}
                        sx={{ fontFamily: "monospace" }}
                      >
                        {order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={isMobile ? "12px" : "14px"}>
                        {order.item}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={isMobile ? "12px" : "14px"}>
                        {order.qty}
                      </Typography>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography fontSize="14px">{order.date}</Typography>
                      </TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 600 }}>
                      <Typography fontSize={isMobile ? "12px" : "14px"}>
                        {order.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        icon={<CheckCircleIcon />}
                        size="small"
                        sx={{
                          backgroundColor:
                            order.status === "Completed"
                              ? "#d1fae5"
                              : order.status === "Delivering"
                              ? "#dbeafe"
                              : order.status === "Preparing"
                              ? "#fef3c7"
                              : order.status === "Waiting"
                              ? "#f3f4f6"
                              : "#fecaca",
                          color:
                            order.status === "Completed"
                              ? "#065f46"
                              : order.status === "Delivering"
                              ? "#1e40af"
                              : order.status === "Preparing"
                              ? "#92400e"
                              : order.status === "Waiting"
                              ? "#6b7280"
                              : "#dc2626",
                          fontSize: isMobile ? "10px" : "12px",
                          height: isMobile ? 24 : 32,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={isMobile ? 5 : 6}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography color="textSecondary">
                      No recent orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ChartPaper>
    </DashboardContainer>
  );
};

export default RevenueDashboard;

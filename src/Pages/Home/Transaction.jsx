import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import axios from "axios";
import { useDate } from "../../Contexts/DateContext";
import { useTranslation } from "react-i18next";

const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  backgroundColor: "#fff",
  minHeight: "100vh",
  fontFamily: "'Inter', sans-serif",
  overflowY: "auto",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 1.5),
  },
}));

const Breadcrumb = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#64748b",
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
    marginBottom: theme.spacing(2),
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5, 3),
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  height: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    gap: theme.spacing(1.5),
  },
}));

const IconWrapper = styled(Box)(({ bg, theme }) => ({
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  flexShrink: 0,
  [theme.breakpoints.down("sm")]: {
    width: 48,
    height: 48,
  },
}));

const ChartPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  height: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const TransactionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  height: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const TransactionItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2, 0),
  borderBottom: "1px solid #e2e8f0",
  "&:last-child": { borderBottom: "none" },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(1),
  },
}));

const ReturnChip = styled(Chip)(({ positive }) => ({
  backgroundColor: positive ? "#d1fae5" : "#fee2e2",
  color: positive ? "#065f46" : "#991b1b",
  fontWeight: 600,
}));

const TransactionDashboard = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { today, lastWeek, currentMonth } = useDate();
  let token = JSON.parse(localStorage.token);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [ordersData, setOrdersData] = useState([]);

  // تقسيم البيانات حسب الأيام
  const dailyData = useMemo(() => {
    const dailyMap = {};

    ordersData.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      if (!dailyMap[date]) {
        dailyMap[date] = {
          total: 0,
          count: 0,
          paid: 0,
          unpaid: 0,
        };
      }

      dailyMap[date].total += order.totalPrice || 0;
      dailyMap[date].count += 1;

      if (order.ispaid) {
        dailyMap[date].paid += order.totalPrice || 0;
      } else {
        dailyMap[date].unpaid += order.totalPrice || 0;
      }
    });

    return Object.entries(dailyMap)
      .map(([date, data]) => ({
        date,
        ...data,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [ordersData]);

  const weeklyData = useMemo(() => {
    const weeklyMap = {};

    ordersData.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const weekStart = new Date(orderDate);
      weekStart.setDate(orderDate.getDate() - orderDate.getDay()); // بداية الأسبوع (الأحد)

      const weekKey = `Week ${weekStart.getDate()}/${weekStart.getMonth() + 1}`;

      if (!weeklyMap[weekKey]) {
        weeklyMap[weekKey] = {
          total: 0,
          count: 0,
          paid: 0,
          unpaid: 0,
          startDate: weekStart,
        };
      }

      weeklyMap[weekKey].total += order.totalPrice || 0;
      weeklyMap[weekKey].count += 1;

      if (order.ispaid) {
        weeklyMap[weekKey].paid += order.totalPrice || 0;
      } else {
        weeklyMap[weekKey].unpaid += order.totalPrice || 0;
      }
    });

    return Object.entries(weeklyMap)
      .map(([week, data]) => ({
        week,
        ...data,
      }))
      .sort((a, b) => a.startDate - b.startDate);
  }, [ordersData]);

  // بيانات للرسوم البيانية
  const chartData = {
    daily: {
      labels: dailyData.map((item) => item.date),
      amounts: dailyData.map((item) => item.total),
      counts: dailyData.map((item) => item.count),
    },
    weekly: {
      labels: weeklyData.map((item) => item.week),
      amounts: weeklyData.map((item) => item.total),
      counts: weeklyData.map((item) => item.count),
    },
  };

  // إحصائيات إضافية
  const stats = useMemo(() => {
    const total = ordersData.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );
    const paidTotal = ordersData
      .filter((order) => order.ispaid)
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const unpaidTotal = ordersData
      .filter((order) => !order.ispaid)
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    return {
      total,
      paidTotal,
      unpaidTotal,
      paidCount: ordersData.filter((order) => order.ispaid).length,
      unpaidCount: ordersData.filter((order) => !order.ispaid).length,
    };
  }, [ordersData]);

  useEffect(() => {
    axios
      .get(
        `/api/UsersOrder/GetOrderDate?from=${lastWeek}&to=${today}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setTotalOrders(
          res.data?.callCenterOrderDetails?.data?.numberOfOrders +
          res.data?.mobileOrderDetails?.data?.numberOfOrders
        );
        const callCenterOrders =
          Number(res.data?.callCenterOrderDetails?.data?.totalPrice) || 0;
        const mobileOrders =
          Number(res.data?.mobileOrderDetails?.data?.totalPrice) || 0;
        setTotalPrice(callCenterOrders + mobileOrders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, [lastWeek, today]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const callCenterRes = await axios.get(
          "/api/UsersOrder",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const ordersRes = await axios.get(
          "api/Order",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const callCenterData = Array.isArray(callCenterRes?.data?.data)
          ? callCenterRes.data.data
          : [];

        const ordersDataApi = Array.isArray(ordersRes?.data?.data)
          ? ordersRes.data.data
          : [];

        const allOrders = [...callCenterData, ...ordersDataApi];

        setOrdersData(allOrders);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardContainer>
      <Breadcrumb>{t('dashboard')} › {t('total_revenue')} › {t('transaction')}</Breadcrumb>

      {/* Top Stats */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} md={3}>
          <StatCard>
            <IconWrapper bg="linear-gradient(135deg, #5eead4, #0d9488)">
              <AttachMoneyIcon fontSize={isMobile ? "medium" : "large"} />
            </IconWrapper>
            <Box>
              <Typography variant="body2" color="#64748b">
                {t('total_amount')}
              </Typography>
              <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700}>
                {stats.total} {t('sar')}
              </Typography>
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard>
            <IconWrapper bg="linear-gradient(135deg, #86efac, #16a34a)">
              <ShowChartIcon fontSize={isMobile ? "medium" : "large"} />
            </IconWrapper>
            <Box>
              <Typography variant="body2" color="#64748b">
                {t('paid_amount')}
              </Typography>
              <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700}>
                {stats.paidTotal} {t('sar')}
              </Typography>
              <Typography variant="caption" color="#16a34a">
                {stats.paidCount} {t('orders')}
              </Typography>
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard>
            <IconWrapper bg="linear-gradient(135deg, #fda4af, #dc2626)">
              <ShowChartIcon fontSize={isMobile ? "medium" : "large"} />
            </IconWrapper>
            <Box>
              <Typography variant="body2" color="#64748b">
                {t('unpaid_amount')}
              </Typography>
              <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700}>
                {stats.unpaidTotal} {t('sar')}
              </Typography>
              <Typography variant="caption" color="#dc2626">
                {stats.unpaidCount} {t('orders')}
              </Typography>
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard>
            <IconWrapper bg="linear-gradient(135deg, #93c5fd, #2563eb)">
              <ShowChartIcon fontSize={isMobile ? "medium" : "large"} />
            </IconWrapper>
            <Box>
              <Typography variant="body2" color="#64748b">
                {t('total_orders')}
              </Typography>
              <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700}>
                {ordersData.length}
              </Typography>
            </Box>
          </StatCard>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6} sx={{ minWidth: "45%" }}>
          <ChartPaper>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight={600}
              mb={3}
            >
              {t('daily_revenue')}
            </Typography>
            <LineChart
              series={[
                {
                  data: chartData.daily.amounts,
                  color: "#f59e0b",
                  label: `${t('revenue')} (${t('sar')})`,
                },
              ]}
              xAxis={[
                {
                  data: chartData.daily.labels,
                  scaleType: "point",
                  label: t('days'),
                },
              ]}
              height={isMobile ? 250 : 300}
              grid={{ horizontal: true }}
              margin={{ left: isMobile ? 20 : 20, right: isMobile ? 20 : 40 }}
            />
          </ChartPaper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ minWidth: "45%" }}>
          <ChartPaper>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight={600}
              mb={3}
            >
              {t('weekly_revenue')}
            </Typography>
            <LineChart
              series={[
                {
                  data: chartData.weekly.amounts,
                  color: "#06b6d4",
                  label: `${t('revenue')} (${t('sar')})`,
                },
              ]}
              xAxis={[
                {
                  data: chartData.weekly.labels,
                  scaleType: "point",
                  label: t('weeks'),
                },
              ]}
              height={isMobile ? 250 : 300}
              grid={{ horizontal: true }}
              margin={{ left: isMobile ? 20 : 20, right: isMobile ? 20 : 40 }}
            />
          </ChartPaper>
        </Grid>
      </Grid>

      {/* Daily Data Table */}
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <TransactionCard>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight={600}
              mb={3}
            >
              {t('daily_transactions')}
            </Typography>
            {dailyData.map((day, index) => (
              <Box key={index}>
                <TransactionItem>
                  <Box>
                    <Typography
                      fontWeight={600}
                      variant={isMobile ? "body2" : "body1"}
                    >
                      {day.date}
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                      {day.count} {t('orders')}
                    </Typography>
                  </Box>
                  <Box textAlign={isMobile ? "left" : "right"}>
                    <Typography
                      fontWeight={600}
                      variant={isMobile ? "body2" : "body1"}
                    >
                      {day.total} {t('sar')}
                    </Typography>
                    <Box display="flex" gap={1} mt={0.5}>
                      <Chip
                        label={`${t('paid')}: ${day.paid} ${t('sar')}`}
                        size="small"
                        sx={{ backgroundColor: "#d1fae5", color: "#065f46" }}
                      />
                      <Chip
                        label={`${t('unpaid')}: ${day.unpaid} ${t('sar')}`}
                        size="small"
                        sx={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
                      />
                    </Box>
                  </Box>
                </TransactionItem>
                {index < dailyData.length - 1 && <Divider />}
              </Box>
            ))}
          </TransactionCard>
        </Grid>

        {/* Weekly Data Table */}
        <Grid
          item
          xs={12}
          lg={6}
          sx={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <TransactionCard>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight={600}
              mb={3}
            >
              {t('weekly_summary')}
            </Typography>
            {weeklyData.map((week, index) => (
              <Box key={index}>
                <TransactionItem>
                  <Box>
                    <Typography
                      fontWeight={600}
                      variant={isMobile ? "body2" : "body1"}
                    >
                      {week.week}
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                      {week.count} {t('orders')}
                    </Typography>
                  </Box>
                  <Box textAlign={isMobile ? "left" : "right"}>
                    <Typography
                      fontWeight={600}
                      variant={isMobile ? "body2" : "body1"}
                    >
                      {week.total} {t('sar')}
                    </Typography>
                    <Box
                      display="flex"
                      gap={1}
                      mt={0.5}
                      flexDirection={isMobile ? "column" : "row"}
                    >
                      <Chip
                        label={`${t('paid')}: ${week.paid} ${t('sar')}`}
                        size="small"
                        sx={{ backgroundColor: "#d1fae5", color: "#065f46" }}
                      />
                      <Chip
                        label={`${t('unpaid')}: ${week.unpaid} ${t('sar')}`}
                        size="small"
                        sx={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
                      />
                    </Box>
                  </Box>
                </TransactionItem>
                {index < weeklyData.length - 1 && <Divider />}
              </Box>
            ))}
          </TransactionCard>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default TransactionDashboard;
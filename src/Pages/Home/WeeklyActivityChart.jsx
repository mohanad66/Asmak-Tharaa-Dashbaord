import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Paper, Typography, Box, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

const ChartContainer = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  width: "100%",
  padding: 10,
  border: "1px solid rgba(0, 0, 0, 0.5)",
  minWidth: 0, // Important for flexbox responsiveness
}));

const ChartHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
});

const ChartTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: "1.25rem",
});

const ChartPeriod = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));

const WeeklyActivityChart = () => {
  let [ordersData, setOrdersData] = useState([]);
  const [chartData, setChartData] = useState({
    days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    values: [0, 0, 0, 0, 0, 0, 0],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));

        const callCenterRes = await axios.get("https://tharaa.premiumasp.net/api/CallcenterOrder", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ordersRes = await axios.get("https://tharaa.premiumasp.net/api/Order", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const callCenterOrders = Array.isArray(callCenterRes?.data?.data)
          ? callCenterRes.data.data
          : [];

        const websiteOrders = Array.isArray(ordersRes?.data?.data)
          ? ordersRes.data.data
          : [];

        const allOrders = [...callCenterOrders, ...websiteOrders];

        setOrdersData(allOrders);

        // معالجة البيانات للرسم البياني
        processChartData(allOrders);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const processChartData = (orders) => {
    const dayCounts = {
      MON: 0,
      TUE: 0,
      WED: 0,
      THU: 0,
      FRI: 0,
      SAT: 0,
      SUN: 0,
    };

    const dayMap = {
      0: "SUN", // الأحد
      1: "MON", // الإثنين
      2: "TUE", // الثلاثاء
      3: "WED", // الأربعاء
      4: "THU", // الخميس
      5: "FRI", // الجمعة
      6: "SAT", // السبت
    };

    orders.forEach((order) => {
      if (order.createdAt) {
        const orderDate = new Date(order?.createdAt);
        const dayOfWeek = orderDate?.getDay();
        const dayName = dayMap[dayOfWeek];

        if (dayName) {
          dayCounts[dayName]++;
        }
      }
    });

    // تحويل الكائن إلى مصفوفة قيم
    const values = chartData.days.map((day) => dayCounts[day]);

    setChartData({
      days: chartData.days,
      values: values,
    });
  };

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle variant="h6">Orders Activety</ChartTitle>
        <ChartPeriod>Weekly</ChartPeriod>
      </ChartHeader>

      <BarChart
        series={[
          {
            data: chartData.values,
            label: "Orders",
            color: "rgba(240, 229, 252, 1)",
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
            scaleType: "linear",
          },
        ]}
        height={300}
        grid={{ vertical: true, horizontal: true }}
        margin={{ left: 0, right: 10, top: 20, bottom: 20 }}
        borderRadius={5}
        slotProps={{
          bar: {
            onMouseEnter: (event, data) => {
              event.currentTarget.style.fill = "rgba(150, 45, 255, 1)";
            },
            onMouseLeave: (event, data) => {
              event.currentTarget.style.fill = "rgba(240, 229, 252, 1)";
            },
          },
        }}
        sx={{
          width: "100%",
          "& .MuiChartsAxis-directionX": {
            "& .MuiChartsAxis-tickLabel": {
              fontSize: "12px",
            },
          },
          "& .MuiChartsAxis-directionY": {
            "& .MuiChartsAxis-tickLabel": {
              fontSize: "12px",
            },
          },
        }}
      />
    </ChartContainer>
  );
};

export default WeeklyActivityChart;

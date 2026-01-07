import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Paper, Typography, Box, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useTranslation } from "react-i18next";

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

// تغيير المكون ليأخذ orders كـ prop
const WeeklyActivityChart = ({ orders = [] }) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState({
    days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    values: [0, 0, 0, 0, 0, 0, 0],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orders && orders.length > 0) {
      processChartData(orders);
      setIsLoading(false);
    } else {
      // إذا لم تكن هناك orders، نعرض الرسم البياني الفارغ
      setIsLoading(false);
    }
  }, [orders]); // إضافة orders كـ dependency

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

    // خريطة الأيام من JavaScript Date.getDay() إلى أسماء الأيام
    const dayMap = {
      0: "SUN", // الأحد
      1: "MON", // الإثنين
      2: "TUE", // الثلاثاء
      3: "WED", // الأربعاء
      4: "THU", // الخميس
      5: "FRI", // الجمعة
      6: "SAT", // السبت
    };

    // حساب عدد الأوردرات لكل يوم
    orders.forEach((order) => {
      if (order.createdAt) {
        try {
          const orderDate = new Date(order.createdAt);
          const dayOfWeek = orderDate.getDay();
          const dayName = dayMap[dayOfWeek];

          if (dayName && dayCounts.hasOwnProperty(dayName)) {
            dayCounts[dayName]++;
          }
        } catch (error) {
          console.error("Error processing order date:", error, order);
        }
      }
    });

    // تحويل الكائن إلى مصفوفة قيم حسب ترتيب الأيام المحدد
    const values = chartData.days.map((day) => dayCounts[day]);

    setChartData({
      days: chartData.days,
      values: values,
    });
  };

  // حساب إجمالي عدد الأوردرات
  const totalOrders = orders.length;

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle variant="h6">{t('orders_activity')}</ChartTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ChartPeriod>{t('weekly')}</ChartPeriod>
          {!isLoading && (
            <Typography variant="body2" sx={{ 
              color: 'primary.main',
              fontWeight: 500,
              backgroundColor: 'rgba(240, 229, 252, 0.3)',
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              {totalOrders} {t('orders')}
            </Typography>
          )}
        </Box>
      </ChartHeader>

      {isLoading ? (
        <Box sx={{ 
          height: 300, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Typography color="text.secondary">
            Loading chart data...
          </Typography>
        </Box>
      ) : (
        <BarChart
          series={[
            {
              data: chartData.values,
              label: t('orders'),
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
          margin={{ left: 40, right: 10, top: 20, bottom: 20 }}
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
      )}
    </ChartContainer>
  );
};

export default WeeklyActivityChart;
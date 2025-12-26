import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { styled } from "@mui/material/styles";
import axios from "axios";

const StatsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(3),
  boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
  width: "100%",
  margin: "0 auto",
  background: "white",
  display: "flex",
  gap: theme.spacing(3),
  alignItems: "center",
  flexDirection: "row",
  border: "1px solid rgba(0, 0, 0, 0.5)",
  minWidth: 0, // Important for flexbox responsiveness
  boxSizing: 'border-box',
}));

const SalesStatisticsWithChart = () => {
  const [statsData, setStatsData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = ["#bd5ecdff", "#810f9aff", "#731dc9ff", "#1f1c71ff", "#2e8b57"];

  useEffect(() => {
    const token = JSON.parse(localStorage.token);

    axios.get("https://tharaa.premiumasp.net/api/Menu/NumOrder/by-category", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const apiData = res.data.data;
      
      // حساب المجموع الكلي للطلبات
      const totalOrders = apiData.reduce((sum, item) => sum + item.totalOrders, 0);

      // تحويل البيانات وترتيبها تنازلياً
      const formattedData = apiData
        .map((item, index) => ({
          category: item.category.replace(/_/g, " ").toLowerCase(),
          orders: `${item.totalOrders} orders`,
          totalOrders: item.totalOrders,
          percentage: Math.round((item.totalOrders / totalOrders) * 100),
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.totalOrders - a.totalOrders); // ترتيب تنازلي

      setStatsData(formattedData);
      setChartData(formattedData.map(item => ({
        value: item.totalOrders,
        label: item.category,
        color: item.color
      })));
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <StatsContainer>
        <Typography>Loading...</Typography>
      </StatsContainer>
    );
  }

  return (
    <StatsContainer sx={{
      flexDirection: { xs: 'column', md: 'row' },
      padding: { xs: 2, md: 3 },
      gap: { xs: 2, md: 3 }
    }}>
      <Card sx={{ 
        minWidth: { xs: '100%', md: 280 },
        width: { xs: '100%', md: 'auto' },
        boxShadow: 0 
      }}>
        <CardContent style={{ padding: 0 }}>
          <Typography variant="h5" gutterBottom fontWeight="700" fontSize={{ xs: '1.2rem', md: '1.5rem' }}>
            Statistics
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ marginBottom: 1 }}
            fontSize={{ xs: '0.8rem', md: '0.875rem' }}
          >
            sales details
          </Typography>

          {statsData.map((stat, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                my: 1,
                borderRadius: 2,
                bgcolor: "white",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 2,
                },
                transition: "all 0.3s ease",
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      background: stat.color,
                      borderRadius: "50%",
                      flexShrink: 0
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    textTransform="capitalize"
                    fontSize={{ xs: '0.9rem', md: '1rem' }}
                    noWrap
                  >
                    {stat.category}
                  </Typography>
                </Box>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                fontSize={{ xs: '0.8rem', md: '0.875rem' }}
                sx={{ flexShrink: 0, ml: 1 }}
              >
                {stat.orders}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      <Box 
        display="flex" 
        justifyContent="center" 
        sx={{ 
          width: { xs: '100%', md: 'auto' },
          minWidth: { xs: '100%', md: '200px' }
        }}
      >
        <PieChart
          series={[
            {
              data: chartData,
              innerRadius: 40,
              outerRadius: 80,
              cornerRadius: 8,
              paddingAngle: 4,
            },
          ]}
          width={200}
          height={200}
          hideLegend={true}
          sx={{
            '& .MuiChartsLegend-root': {
              display: 'none'
            }
          }}
        />
      </Box>
    </StatsContainer>
  );
};

export default SalesStatisticsWithChart;
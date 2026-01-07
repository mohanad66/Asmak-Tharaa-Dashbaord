import React, { useEffect, useState, useMemo } from "react";
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
import { useTranslation } from "react-i18next";

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

const SalesStatisticsWithChart = ({ orders = [] }) => {
  const { t } = useTranslation();
  const [statsData, setStatsData] = useState([]);
  console.log(statsData);
  
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = ["#bd5ecdff", "#810f9aff", "#731dc9ff", "#1f1c71ff", "#2e8b57"];

  // حساب المنتجات الأكثر مبيعاً من الـ orders
  const calculateTopSellingProducts = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const productSales = {};

    // جمع كميات كل منتج من جميع الأوردرات
    orders.forEach((order) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item) => {
          if (item.product && item.productId) {
            const productId = item.productId;
            const productName = item.product.name || `Product ${productId}`;
            const quantity = item.quantity || 0;

            if (!productSales[productId]) {
              productSales[productId] = {
                id: productId,
                name: productName,
                totalQuantity: 0,
                ordersCount: 0,
                revenue: 0
              };
            }

            productSales[productId].totalQuantity += quantity;
            productSales[productId].ordersCount += 1;
            productSales[productId].revenue += (item.totalPrice || 0);
          }
        });
      }
    });

    // تحويل الكائن إلى مصفوفة وترتيبها تنازلياً حسب الكمية
    const sortedProducts = Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5); // عرض أفضل 5 منتجات فقط

    return sortedProducts;
  }, [orders]);

  useEffect(() => {
    // استخدام البيانات المحسوبة من الـ orders
    const sortedProducts = calculateTopSellingProducts;

    if (sortedProducts.length > 0) {
      // تحويل البيانات للعرض
      const formattedData = sortedProducts.map((product, index) => ({
        id: product.id,
        name: product.name,
        orders: `${product.totalQuantity} ${t('sold')}`,
        totalQuantity: product.totalQuantity,
        ordersCount: product.ordersCount,
        revenue: product.revenue,
        percentage: Math.round((product.totalQuantity / 
          sortedProducts.reduce((sum, p) => sum + p.totalQuantity, 0)) * 100),
        color: colors[index % colors.length]
      }));

      setStatsData(formattedData);
      
      // تحضير بيانات الرسم البياني
      setChartData(formattedData.map(item => ({
        id: item.id,
        value: item.totalQuantity,
        label: item.name,
        color: item.color
      })));
    } else {
      // إذا لم توجد بيانات، نعرض رسالة
      setStatsData([{
        id: 0,
        name: t('no_data'),
        orders: `0 ${t('sold')}`,
        totalQuantity: 0,
        percentage: 0,
        color: colors[0]
      }]);
      
      setChartData([{
        id: 0,
        value: 1,
        label: t('no_data'),
        color: colors[0]
      }]);
    }

    setLoading(false);
  }, [calculateTopSellingProducts, t]);

  if (loading) {
    return (
      <StatsContainer>
        <Typography>{t('loading')}</Typography>
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
            {t('top_selling_products')}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ marginBottom: 1 }}
            fontSize={{ xs: '0.8rem', md: '0.875rem' }}
          >
            {t('based_on_total_quantity_sold')}
          </Typography>

          {statsData.map((stat, index) => (
            <Box
              key={stat.id}
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                    fontSize={{ xs: '0.9rem', md: '1rem' }}
                    sx={{ width: 24, textAlign: 'center' }}
                  >
                    {index + 1}.
                  </Typography>
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
                    fontSize={{ xs: '0.9rem', md: '1rem' }}
                    noWrap
                    sx={{ flex: 1 }}
                  >
                    {stat.name}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={{ xs: '0.75rem', md: '0.8rem' }}
                  sx={{ ml: 4 }}
                >
                  {stat.ordersCount} {t('orders')} • {stat.percentage}%
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 1 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  fontWeight="bold"
                  fontSize={{ xs: '0.9rem', md: '1rem' }}
                >
                  {stat.orders}
                </Typography>
                {stat.revenue > 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontSize={{ xs: '0.7rem', md: '0.75rem' }}
                  >
                    {stat.revenue.toLocaleString()} {t('sar')}
                  </Typography>
                )}
              </Box>
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
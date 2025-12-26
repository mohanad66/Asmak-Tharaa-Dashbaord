import axios from "axios";
import React, { useEffect, useState } from "react";

const TrendingOrders = () => {
  let token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    axios
      .get(
        "https://tharaa.premiumasp.net/api/Menu/product/top-selling?top=10",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setTrendingItems(res.data.data);
      });
  }, []);
  const [trendingItems, setTrendingItems] = useState([]);

  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: "100%",
      margin: "20px auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      border: "1px solid rgba(0, 0, 0, 0.5)",
    },
    title: {
      color: "#333",

      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "bold",
    },
    ordersList: {
      display: "flex",
      gap: "15px",
      maxWidth: "100%",
      overflowX: "auto",
      alignItems:'center'
    },
    orderItem: {
      backgroundColor: "white",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 1px 5px rgba(0, 0, 0, 0.05)",
      transition: "transform 0.2s ease",
      textAlign:'center'
    },
    orderItemHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    itemName: {
      color: "#2c3e50",
      margin: "0 0 8px 0",
      fontSize: "18px",
      fontWeight: "600",
      whiteSpace: "nowrap",
    },
    itemPrice: {
      color: "#7f8c8d",
      margin: "0",
      fontSize: "16px",
      whiteSpace: "nowrap",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Trending orders</h2>
      <div style={styles.ordersList}>
        {trendingItems.map((item) => (
          <div
            key={item.id}
            style={styles.orderItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.orderItemHover.transform;
              e.currentTarget.style.boxShadow = styles.orderItemHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = styles.orderItem.boxShadow;
            }}
          >
            <img
              src={
                item?.imageUrl?.includes("drive.google.com")
                  ? `https://lh3.googleusercontent.com/d/${
                      item.imageUrl.match(/\/d\/([^/]+)\//)?.[1]
                    }`
                  : item?.imageUrl
              }
              alt={item?.name}
              style={{ width: "120px", borderRadius:5 }}
            />
            <h3 style={styles.itemName}>{item.name}</h3>
            <p style={styles.itemPrice}>price: {item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingOrders;

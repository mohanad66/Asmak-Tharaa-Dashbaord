import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Grid } from "react-loader-spinner";
import { Button } from "@mui/joy";
import {
  Modal,
  ModalDialog,
  Typography,
  FormControl,
  FormLabel,
  Select,
  Option,
  Input,
  Box,
} from "@mui/joy";
import "./OrderPage.css";
import { toast } from "react-toastify";

// Fix Leaflet icons
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'leaflet/dist/images/marker-icon.png',
  shadowUrl: 'leaflet/dist/images/marker-shadow.png',
});

const OrderPage = () => {
  const { id, method } = useParams();
  const [order, setOrder] = useState(null);
  const [address, setAddress] = useState(null);
  const [coords, setCoords] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  console.log(deliveryInfo);
  
  const [openModal, setOpenModal] = useState(false);
  const [newState, setNewState] = useState("");
  const [deliveryId, setDeliveryId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("token"));
    if (order?.deliveryId) {
      axios
        .get(
          `https://tharaa.premiumasp.net/api/Delivery/${order?.deliveryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setDeliveryInfo(res.data.data);
        })
        .catch((err) => console.log(err));
    }
  }, [order]);
  console.log(order);
  

  // ---- get order -----
  const getOrder = () => {
    if (!id) return;
    setLoading(true);
    let token = JSON.parse(localStorage.getItem("token"));

    if (method === "mw") {
      axios
        .get(`https://tharaa.premiumasp.net/api/CallcenterOrder/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const orderData = res?.data?.data;
          setOrder(orderData);
          setAddress(orderData?.customerAddress);
          
          // Try to get coordinates from customerLat and customerLng first
          if (orderData?.customerLat && orderData?.customerLng) {
            const lat = parseFloat(orderData.customerLat);
            const lng = parseFloat(orderData.customerLng);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              setCoords({
                lat: lat,
                lng: lng,
              });
              setLoading(false);
              return;
            }
          }
          
          // Fallback: try to get coordinates from lat/lng fields
          if (orderData?.lat && orderData?.lng) {
            const lat = parseFloat(orderData.lat);
            const lng = parseFloat(orderData.lng);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              setCoords({
                lat: lat,
                lng: lng,
              });
            }
          }
          
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          toast.error("Failed to load order details");
        });
    } else {
      axios
        .get(`https://tharaa.premiumasp.net/api/Order/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const orderData = res?.data?.data;
          setOrder(orderData);
          
          // Try to get coordinates from customerLat and customerLng first
          if (orderData?.customerLat && orderData?.customerLng) {
            const lat = parseFloat(orderData.customerLat);
            const lng = parseFloat(orderData.customerLng);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              setCoords({
                lat: lat,
                lng: lng,
              });
              setLoading(false);
              return;
            }
          }
          
          // Fallback: try to get coordinates from lat/lng fields
          if (orderData?.lat && orderData?.lng) {
            const lat = parseFloat(orderData.lat);
            const lng = parseFloat(orderData.lng);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              setCoords({
                lat: lat,
                lng: lng,
              });
            }
          }
          
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          toast.error("Failed to load order details");
        });
    }
  };

  useEffect(() => {
    getOrder();
  }, [id, method]);

  // ---- convert address to lat,lng -----
  useEffect(() => {
    if (!address || coords) return;

    const fetchCoords = async () => {
      try {
        let res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            address
          )}&format=json&limit=1`
        );

        let data = await res.json();

        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          
          if (!isNaN(lat) && !isNaN(lng)) {
            setCoords({
              lat: lat,
              lng: lng,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCoords();
  }, [address, coords]);

  const handleChangeState = () => {
    setOpenModal(true);
    setNewState(order?.state?.toString());
    setDeliveryId(""); // Reset delivery ID when opening modal
  };

  const handleSubmit = () => {
    let token = JSON.parse(localStorage.getItem("token"));

    if (newState != 2 && method === "mw") {
      axios
        .put(
          `https://tharaa.premiumasp.net/api/CallcenterOrder/${id}/status`,
          newState,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setOpenModal(false);
          getOrder();
        })
        .catch((err) => {
          toast.error(
            err.response?.data?.message ||
              err.message ||
              "Failed to update status"
          );
        });
    }
    if (newState == 2 && method === "mw") {
      if (deliveryId) {
        axios
          .put(
            `https://tharaa.premiumasp.net/api/CallcenterOrder/${id}/onTheWay`,
            deliveryId,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            toast.info(res.data.message);
            setOpenModal(false);
            getOrder();
          })
          .catch((err) => {
            toast.error(
              err.response?.data?.message ||
                err.message ||
                "Failed to assign delivery"
            );
          });
      } else {
        toast.error("Please enter Delivery ID!");
      }
    }
    if (newState != 2 && method === "mm") {
      axios
        .put(
          `https://tharaa.premiumasp.net/api/Order/${id}/status`,
          { status: Number(newState) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          toast.success(res.data || "Status updated successfully");
          setOpenModal(false);
          getOrder();
        })
        .catch((err) => {
          toast.error(
            err.response?.data?.message ||
              err.message ||
              "Failed to update status"
          );
        });
    }
    if (newState == 2 && method === "mm") {
      if (deliveryId) {
        axios
          .put(
            `https://tharaa.premiumasp.net/api/Order/${id}/onTheWay`,
            deliveryId,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            toast.success(res.data.message);
            setOpenModal(false);
            getOrder();
          })
          .catch((err) => {
            toast.error(
              err.response?.data?.message ||
                err.message ||
                "Failed to assign delivery"
            );
          });
      } else {
        toast.error("Please enter Delivery ID!");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Grid
          color="#034f75"
          visible={true}
          height="80"
          width="80"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass="grid-wrapper"
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <h2>Order Not Found</h2>
        <p>The requested order could not be loaded.</p>
      </div>
    );
  }

  const getStateStyles = (state) => {
    const stateColors = {
      0: "#695abfff", // Waiting
      1: "#402bffff", // Preparing
      2: "#4a1515ff", // OnTheWay
      3: "green", // Delivered
      4: "red", // Cancelled
    };

    return {
      background: stateColors[state] || "gray",
      borderRadius: "5px",
      color: "#fff",
      padding: "6px 12px",
      margin: 0,
      fontWeight: "100",
      display: "inline-block",
    };
  };

  const getStateText = (state) => {
    const states = {
      0: "Waiting",
      1: "Preparing",
      2: "On The Way",
      3: "Delivered",
      4: "Cancelled",
    };
    return states[state] || "Unknown";
  };

  // Check if coordinates are valid
  const isValidCoords = coords && 
    !isNaN(coords.lat) && 
    !isNaN(coords.lng) && 
    coords.lat !== 0 && 
    coords.lng !== 0;

  // Use fallback coordinates if invalid
  const displayCoords = isValidCoords 
    ? coords 
    : { lat: 29.33, lng: 30.69 };

  return (
    <div className="order-page">
      <h2 className="page-title">Order Details</h2>

      <div className="order-content">
        {/* Order Header Info */}
        <div className="order-header">
          <div className="info-row">
            <h5>Order No:</h5>
            <h5 className="info-value">#{order?.orderId}</h5>
          </div>

          <div className="info-row">
            <h5>From:</h5>
            <h5 className="info-value">
              {new Date(order?.createdAt).toLocaleString()}
            </h5>
          </div>

          <div className="info-row">
            <h5>Customer No:</h5>
            <h5 className="info-value">#{order?.customerId}</h5>
          </div>

          <div className="info-row">
            <h5>Payment Method:</h5>
            <h5 className="info-value">
              {order.paymentMethod == 1 ? "Credit Card" : "On Delivery"}
            </h5>
          </div>

          <div className="info-row">
            <h5>State:</h5>
            <h5 style={getStateStyles(order?.state)}>
              {getStateText(order?.state)}
            </h5>
            {order.state !== 3 &&
            <Button size="sm" color="danger" onClick={handleChangeState}>
              Change State
            </Button>
            }
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Product Details */}
          <div className="info-section">
            <h4>Product Details</h4>
            <div
              className="items-grid"
              style={{ maxHeight: "170px", overflowY: "auto" }}
            >
              {order?.orderItems?.map((item, index) => (
                <div key={index} className="info-card">
                  <h5>Item Name: {item?.productName}</h5>
                  <h5>Quantity: {item?.quantity}</h5>
                  <h5>Price: {item?.price} SR</h5>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Information */}
          <div className="info-section">
            <h4>Billing Information</h4>
            <div className="info-card">
              <h5>{order?.customerName || "Customer"}</h5>
              <div className="detail-row">
                <span>Customer Name:</span>
                <span>{order?.customerName || "Not provided"}</span>
              </div>
              <div className="detail-row">
                <span>Customer Email:</span>
                <span>{order?.customerEmail || "Not provided"}</span>
              </div>
              <div className="detail-row">
                <span>Coordinates:</span>
                <span>
                  {order?.customerLat}, {order?.customerLng}
                </span>
              </div>
            </div>
          </div>

          {/* Commissary Information */}
          <div className="info-section">
            <h4>Driver Information</h4>
            <div className="info-card">
              <h5>Delivery Info</h5>
              {order?.deliveryId ? (
                <>
                  <div className="detail-row">
                    <span>Driver Name:</span>
                    <span>{deliveryInfo?.driverName || "Loading..."}</span>
                  </div>
                  <div className="detail-row">
                    <span>Phone Number:</span>
                    <span>{deliveryInfo?.driverPhone || "Loading..."}</span>
                  </div>
                  <div className="detail-row">
                    <span>Salary:</span>
                    <span>{deliveryInfo?.salary || 0}</span>
                  </div>
                </>
              ) : (
                <h4>Not Available Now!</h4>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="info-section">
            <h4>Order Summary</h4>
            <div className="info-card summary-card">
              <div className="detail-row">
                <span>Product Price:</span>
                <span>{order?.totalPrice} SAR</span>
              </div>
              <div className="detail-row">
                <span>Delivery:</span>
                <span>{Number(order?.totalPrice) > 300 ? "free" : deliveryInfo?.salary || 'paid'}</span>
              </div>
              <div className="detail-row total-row">
                <strong>Total:</strong>
                <strong>{order?.totalPrice && deliveryInfo?.salary ? Number(order?.totalPrice + deliveryInfo?.salary) : order.totalPrice} SAR</strong>
              </div>
            </div>
          </div>

          {/* Time and Location */}
          <div className="info-section">
            <h4>Location</h4>
            <div className="info-card">
              {/* <div className="detail-row">
                <span>Time Waiting to Order:</span>
                <span>Not Available</span>
              </div> */}
              {/* <h5 style={{ marginTop: "10px", marginBottom: "10px" }}>
                {order?.customerAddress || "Address not available"}
              </h5> */}
              {displayCoords && (
                <div className="map-wrapper">
                  <MapContainer
                    center={[displayCoords.lat, displayCoords.lng]}
                    zoom={15}
                    className="map-container"
                    style={{ height: "200px", width: "100%" }}
                    scrollWheelZoom={false}
                    dragging={true}
                    touchZoom={true}
                    doubleClickZoom={true}
                    boxZoom={true}
                    keyboard={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[displayCoords.lat, displayCoords.lng]}>
                      <Popup>
                        Order Location
                        <br />
                        Lat: {displayCoords.lat.toFixed(6)}
                        <br />
                        Lng: {displayCoords.lng.toFixed(6)}
                        <br />
                        {order?.customerAddress && `Address: ${order.customerAddress}`}
                      </Popup>
                    </Marker>
                  </MapContainer>
                  {/* Show coordinates info */}
                  <div className="detail-row" style={{ marginTop: "10px", fontSize: "0.9em", color: "#666" }}>
                    <span>GPS Coordinates:</span>
                    <span>
                      {displayCoords.lat.toFixed(6)}, {displayCoords.lng.toFixed(6)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change State Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <ModalDialog>
          <Typography level="h5" component="h2" mb={2}>
            Change Order State
          </Typography>

          <FormControl>
            <FormLabel>New State</FormLabel>
            <Select
              value={newState}
              onChange={(e, newValue) => setNewState(newValue)}
            >
              <Option value="0">Waiting</Option>
              <Option value="1">Preparing</Option>
              <Option value="2">On The Way</Option>
              <Option value="3">Delivered</Option>
              <Option value="4">Cancelled</Option>
            </Select>
          </FormControl>

          {/* Show Delivery ID input only when state is 2 (On The Way) */}
          {newState === "2" && (
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Delivery ID</FormLabel>
              <Input
                value={deliveryId}
                onChange={(e) => setDeliveryId(e.target.value)}
                placeholder="Enter delivery ID"
                type="number"
              />
            </FormControl>
          )}

          <Box
            sx={{ mt: 3, display: "flex", gap: 1, justifyContent: "flex-end" }}
          >
            <Button variant="outlined" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Update State</Button>
          </Box>
        </ModalDialog>
      </Modal>
    </div>
  );
};

// CSS styles
const styles = `
.order-page {
  background: #fff;
  flex: 1;
  color: #000;
  padding: 20px;
  min-height: 100vh;
}

.loading-container {
  background: #fff;
  flex: 1;
  padding: 20px;
  display: flex;
  justify-content: center;
  height: 70vh;
  align-items: center;
}

.error-container {
  background: #fff;
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
  text-align: center;
}

.error-container h2 {
  color: #d32f2f;
  margin-bottom: 10px;
}

.page-title {
  padding: 10px 20px;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.order-content {
  margin-left: 20px;
}

.order-header {
  margin-bottom: 30px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.info-value {
  color: gray;
  font-weight: normal;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.info-section {
  margin-bottom: 25px;
}

.info-section h4 {
  margin-bottom: 15px;
  color: #333;
}

.items-grid {
  display: grid;
  gap: 10px;
}

.info-card {
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px;
  background: #fafafa;
}

.summary-card {
  color: #666;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 4px 0;
}

.total-row {
  border-top: 1px solid #ddd;
  padding-top: 10px;
  margin-top: 10px;
  font-size: 1.1em;
}

.map-container {
  height: 200px;
  width: 100%;
  margin-top: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

/* Responsive Design */
@media (max-width: 768px) {
  .order-content {
    margin-left: 0;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .page-title {
    font-size: 1.5em;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .order-page {
    padding: 10px;
  }
  
  .info-card {
    padding: 10px;
  }
  
  .map-container {
    height: 150px;
  }
}
`;

// Add styles to document head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default OrderPage;
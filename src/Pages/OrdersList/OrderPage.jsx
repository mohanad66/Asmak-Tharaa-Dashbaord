import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
  Box,
  Alert,
} from "@mui/joy";
import "./OrderPage.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const OrderPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Order status array
  const statusOrder = [
    "waiting",
    "accepted",
    "rejected",
    "processing",
    "completed",
    "cancelled"
  ];

  // Fetch order details
  useEffect(() => {
    const getOrder = async () => {
      if (!id) return;

      setLoading(true);
      let token = JSON.parse(localStorage.getItem("token"));

      try {
        // Fetch order details
        const orderResponse = await axios.get(`api/BaseOrders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        const orderData = orderResponse?.data;
        setOrder(orderData);

        // If customerId exists, fetch customer information
        if (orderData?.customerId) {
          try {
            const customerResponse = await axios.get(`/api/Users/${orderData.customerId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              },
            });
            setCustomer(customerResponse?.data);
          } catch (customerError) {
            console.log("Error fetching customer:", customerError);
            // Ignore error if customer data fails to load
          }
        }

        setLoading(false);
      } catch (err) {
        console.log("Error fetching order:", err);
        setLoading(false);
        toast.error(t('failed_to_load_order'));
      }
    };

    getOrder();
  }, [id, t]);

  const handleChangeStatus = () => {
    setOpenModal(true);
    // Convert status name to its index
    if (order?.status) {
      const statusIndex = statusOrder.indexOf(order.status.toLowerCase());
      setNewStatus(statusIndex !== -1 ? statusIndex.toString() : "");
    }
  };

  const handleSubmit = async () => {
    if (newStatus === "") {
      toast.error(t('select_status'));
      return;
    }

    setUpdating(true);
    let token = JSON.parse(localStorage.getItem("token"));

    try {
      // Convert to integer
      const statusNumber = parseInt(newStatus);

      // Update order status using PATCH
      const response = await axios.patch(
        `api/BaseOrders/${id}/status`,
        { status: statusNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data?.message || t('status_updated'));
      setOpenModal(false);

      // Reload updated data
      const orderResponse = await axios.get(`api/BaseOrders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      setOrder(orderResponse?.data);
    } catch (err) {
      console.log("Error updating status:", err);
      toast.error(
        err.response?.data?.message ||
        err.message ||
        t('failed_to_update_status')
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Grid
          color="#3b82f6"
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
        <h2>{t('order_not_found')}</h2>
        <p>{t('order_could_not_be_loaded')}</p>
      </div>
    );
  }

  const getStatusStyles = (status) => {
    const statusColors = {
      "waiting": "#fef3c7",
      "accepted": "#d1fae5",
      "rejected": "#fee2e2",
      "processing": "#dbeafe",
      "completed": "#dcfce7",
      "cancelled": "#f3f4f6",
    };

    const textColors = {
      "waiting": "#92400e",
      "accepted": "#065f46",
      "rejected": "#991b1b",
      "processing": "#1e40af",
      "completed": "#166534",
      "cancelled": "#4b5563",
    };

    return {
      background: statusColors[status?.toLowerCase()] || "#f3f4f6",
      color: textColors[status?.toLowerCase()] || "#6b7280",
      border: `1px solid ${textColors[status?.toLowerCase()] || "#6b7280"}33`,
      borderRadius: "6px",
      padding: "6px 12px",
      margin: 0,
      fontWeight: "600",
      display: "inline-block",
      fontSize: "0.875rem",
    };
  };

  const getStatusText = (status) => {
    const statusMap = {
      "waiting": t('waiting'),
      "accepted": t('accepted'),
      "rejected": t('rejected'),
      "processing": t('processing'),
      "completed": t('completed'),
      "cancelled": t('cancelled'),
    };
    return statusMap[status?.toLowerCase()] || status || t('unknown');
  };

  const getPaymentMethodText = (paymentMethod) => {
    const paymentMethods = {
      "cash": t('cash'),
      "banktransfer": t('bank_transfer'),
      "creditcard": t('credit_card'),
      "bank_transfer": t('bank_transfer'),
      "credit_card": t('credit_card'),
    };
    return paymentMethods[paymentMethod?.toLowerCase()] || paymentMethod || t('unknown');
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatRole = (role) => {
    const roles = {
      "customer": t('customer'),
      "admin": t('admin'),
      "employee": t('employee'),
    };
    return roles[role?.toLowerCase()] || role || t('unknown');
  };

  // Calculate total
  const calculateTotal = () => {
    const orderPrice = order.totalPrice || 0;
    return orderPrice;
  };

  // Calculate items total
  const calculateItemsTotal = () => {
    if (!order.orderItems || order.orderItems.length === 0) return 0;
    return order.orderItems.reduce((total, item) => {
      return total + (item.totalPrice || 0);
    }, 0);
  };

  // Calculate items count
  const calculateItemsCount = () => {
    if (!order.orderItems || order.orderItems.length === 0) return 0;
    return order.orderItems.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0);
  };

  return (
    <div className="order-page">
      <div className="order-header-section">
        <h2 className="page-title">{t('order_details')}</h2>
        <div className="order-actions">
          <Button
            size="md"
            variant="solid"
            color="primary"
            onClick={handleChangeStatus}
            disabled={updating}
          >
            {t('change_status')}
          </Button>
        </div>
      </div>

      <div className="order-content">
        {/* Order Summary Card */}
        <div className="order-summary-card">
          <div className="order-summary-header">
            <h3>Order #{order.orderNumber || order.id}</h3>
            <div className="order-status-badge" style={getStatusStyles(order.status)}>
              {getStatusText(order.status)}
            </div>
          </div>

          <div className="order-summary-grid">
            <div className="summary-item">
              <span className="summary-label">{t('order_date')}:</span>
              <span className="summary-value">{formatDate(order.createdAt)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{t('payment_method')}:</span>
              <span className="summary-value">{getPaymentMethodText(order.paymentMethod)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{t('customer_id')}:</span>
              <span className="summary-value">#{order.customerId || "N/A"}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{t('total_price')}:</span>
              <span className="summary-value">{order.totalPrice?.toLocaleString() || 0} {t('egp')}</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Customer Information */}
          <div className="info-section customer-section">
            <h4>{t('customer_information')}</h4>
            <div className="info-card">
              {customer ? (
                <div className="customer-details">
                  <div className="customer-header">
                    <div className="customer-name">{customer.name || t('not_provided')}</div>
                    <div className="customer-role-badge">{formatRole(customer.role)}</div>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">{t('customer_id')}:</span>
                      <span className="detail-value">#{customer.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">{t('customer_email')}:</span>
                      <span className="detail-value">{customer.email || t('not_provided')}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">{t('created_at')}:</span>
                      <span className="detail-value">{formatDate(customer.createdAt)}</span>
                    </div>
                    {customer.updatedAt && customer.updatedAt !== "0001-01-01T00:00:00" && (
                      <div className="detail-item">
                        <span className="detail-label">{t('updated_at')}:</span>
                        <span className="detail-value">{formatDate(customer.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="customer-not-found">
                  <Alert color="neutral" variant="soft">
                    {t('customer_info_not_available')}
                  </Alert>
                  <div className="detail-item">
                    <span className="detail-label">{t('customer_id')}:</span>
                    <span className="detail-value">#{order.customerId || "N/A"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="info-section products-section">
            <div className="section-header">
              <h4>{t('product_details')}</h4>
              <div className="items-count">
                {calculateItemsCount()} {t('items')}
              </div>
            </div>
            <div className="products-list">
              {order?.orderItems?.map((item, index) => (
                <div key={index} className="product-card">
                  <div className="product-header">
                    <div className="product-name">{item?.product?.name || `Product ${item.productId}`}</div>
                    <div className="product-quantity">{item?.quantity || 0} ×</div>
                  </div>

                  <div className="product-details">
                    <div className="product-info">
                      {item.product?.description && (
                        <div className="product-description">
                          {item.product.description}
                        </div>
                      )}
                      <div className="product-price">
                        {item?.unitPrice?.toLocaleString() || 0} {t('egp')} each
                      </div>
                    </div>

                    <div className="product-total">
                      <div className="total-label">{t('item_total')}:</div>
                      <div className="total-value">{item?.totalPrice?.toLocaleString() || 0} {t('egp')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="items-summary">
              <div className="summary-row">
                <span>{t('items_total')}:</span>
                <strong>{calculateItemsTotal().toLocaleString()} {t('egp')}</strong>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="info-section order-summary-section">
            <h4>{t('order_summary')}</h4>
            <div className="info-card">
              <div className="summary-details">
                <div className="detail-item">
                  <span className="detail-label">{t('order_id')}:</span>
                  <span className="detail-value">#{order.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('order_number')}:</span>
                  <span className="detail-value">{order.orderNumber || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('items_total')}:</span>
                  <span className="detail-value">{calculateItemsTotal().toLocaleString()} {t('egp')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('order_total')}:</span>
                  <span className="detail-value">{order.totalPrice?.toLocaleString() || 0} {t('egp')}</span>
                </div>

                <div className="detail-item total-item">
                  <span className="detail-label">{t('final_total')}:</span>
                  <span className="detail-value total">{calculateTotal().toLocaleString()} {t('egp')}</span>
                </div>

                <div className="order-timestamps">
                  <div className="timestamp">
                    <span className="timestamp-label">{t('created_at')}:</span>
                    <span className="timestamp-value">{formatDate(order.createdAt)}</span>
                  </div>
                  {order.updatedAt && order.updatedAt !== "0001-01-01T00:00:00" && (
                    <div className="timestamp">
                      <span className="timestamp-label">{t('updated_at')}:</span>
                      <span className="timestamp-value">{formatDate(order.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Status Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <ModalDialog>
          <Typography level="h5" component="h2" mb={2}>
            {t('change_order_status')}
          </Typography>

          <FormControl>
            <FormLabel>
              {t('current_status')}:
              <span style={{ ...getStatusStyles(order.status), marginLeft: '10px' }}>
                {getStatusText(order.status)}
              </span>
            </FormLabel>
            <Select
              value={newStatus}
              onChange={(e, newValue) => setNewStatus(newValue)}
              placeholder={t('select_new_status')}
            >
              {statusOrder.map((status, index) => (
                <Option key={status} value={index.toString()}>
                  {getStatusText(status)}
                </Option>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{ mt: 3, display: "flex", gap: 1, justifyContent: "flex-end" }}
          >
            <Button variant="outlined" onClick={() => setOpenModal(false)} disabled={updating}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={updating}>
              {updating ? t('updating') : t('update_status')}
            </Button>
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
  color: #dc2626;
  margin-bottom: 10px;
}

.order-header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.page-title {
  color: #111827;
  font-size: 1.8rem;
  margin: 0;
  font-weight: 700;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.order-content {
  padding: 0;
}

.order-summary-card {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  color: white;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
}

.order-summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.order-summary-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: white;
  font-weight: 600;
}

.order-status-badge {
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 0.9rem;
  color: white !important;
  border: none !important;
}

.order-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.summary-label {
  font-size: 0.9rem;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
}

.summary-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.info-section {
  margin-bottom: 25px;
}

.info-section h4 {
  margin-bottom: 20px;
  color: #111827;
  border-bottom: 2px solid #3b82f6;
  padding-bottom: 10px;
  font-size: 1.2rem;
  font-weight: 600;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #3b82f6;
  padding-bottom: 10px;
}

.items-count {
  background: #3b82f6;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.info-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.info-card:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.customer-section .info-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.customer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.customer-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
}

.customer-role-badge {
  background: #10b981;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.detail-grid {
  display: grid;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #e5e7eb;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: #6b7280;
  font-weight: 500;
  font-size: 0.95rem;
}

.detail-value {
  color: #111827;
  font-weight: 600;
  font-size: 0.95rem;
}

.customer-not-found {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 5px;
}

.product-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 15px;
  background: #fff;
  transition: all 0.2s;
}

.product-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.product-name {
  font-weight: 600;
  color: #111827;
  font-size: 1rem;
}

.product-quantity {
  background: #3b82f6;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.85rem;
}

.product-details {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
}

.product-info {
  flex: 1;
}

.product-description {
  color: #6b7280;
  font-size: 0.85rem;
  margin-bottom: 8px;
  line-height: 1.4;
}

.product-price {
  color: #6b7280;
  font-size: 0.85rem;
}

.product-total {
  text-align: right;
  min-width: 120px;
}

.total-label {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 5px;
}

.total-value {
  font-weight: 600;
  color: #111827;
  font-size: 1rem;
}

.items-summary {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid #3b82f6;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  padding: 10px 0;
  font-weight: 600;
  color: #111827;
}

.order-summary-section .info-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.total-item {
  margin-top: 10px;
  padding-top: 15px;
  border-top: 2px solid #3b82f6;
}

.total-item .detail-label {
  font-size: 1.1rem;
  color: #111827;
}

.total-item .detail-value.total {
  font-size: 1.2rem;
  color: #3b82f6;
}

.order-timestamps {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timestamp {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp-label {
  color: #6b7280;
  font-size: 0.9rem;
}

.timestamp-value {
  color: #4b5563;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Scrollbar Styling */
.products-list::-webkit-scrollbar {
  width: 6px;
}

.products-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.products-list::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 10px;
}

.products-list::-webkit-scrollbar-thumb:hover {
  background: #2563eb;
}

/* Responsive Design */
@media (max-width: 992px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .order-summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .order-header-section {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .order-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .order-summary-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .product-details {
    flex-direction: column;
    gap: 10px;
  }
  
  .product-total {
    text-align: left;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .order-page {
    padding: 15px;
  }
  
  .order-summary-card {
    padding: 20px;
  }
  
  .info-card {
    padding: 15px;
  }
  
  .customer-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .items-count {
    align-self: flex-start;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .timestamp {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
`;

// Add styles to document head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default OrderPage;
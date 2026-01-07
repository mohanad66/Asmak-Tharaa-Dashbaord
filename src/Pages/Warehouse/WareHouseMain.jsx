import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmAlert from "../Team/alert";
import { useTranslation } from "react-i18next";

const WarehouseDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [itemsData, setItemsData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  let token = JSON.parse(localStorage.getItem("token"));

  let [totalProductsAvilable, setTotalProductsAvilable] = useState(0);
  let [totalPriceOfAvilable, setTotalPriceOfAvilable] = useState(0);
  let [todayPriceAlmostEnd, setTodayPriceAlmostEnd] = useState(0);
  let [totalProductsMostOver, setTotalProductsMostOver] = useState(0);

  let getData = () => {
    axios
      .get("api/Inventory/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data.data;
        setItemsData(data.items || []);
        setTotalPriceOfAvilable(data.totalValue || 0);
        setTotalProductsAvilable(data.totalItems || 0);

        const almostEndItems = data.items.filter((item) => item.status === 2);
        const almostEndPrice = almostEndItems.reduce(
          (sum, item) => sum + (item.totalValue || 0),
          0
        );
        setTodayPriceAlmostEnd(almostEndPrice);

        const mostOverItems = data.items.filter((item) => item.status === 2);
        setTotalProductsMostOver(mostOverItems.length);
      })
      .catch((error) => {
        console.error("Error fetching inventory data:", error);
      });
  };

  useEffect(() => getData(), []);

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      applyTabFilter(itemsData, activeTab);
      return;
    }

    const searchResults = itemsData.filter(
      (item) =>
        item.id.toString().includes(term) ||
        (item.itemName &&
          item.itemName.toLowerCase().includes(term.toLowerCase())) ||
        (item.category &&
          item.category.toLowerCase().includes(term.toLowerCase())) ||
        (item.price && item.price.toString().includes(term)) ||
        (item.totalValue && item.totalValue.toString().includes(term))
    );

    applyTabFilter(searchResults, activeTab);
  };

  const applyTabFilter = (data, tab) => {
    let filtered = data;

    switch (tab) {
      case "in-stock":
        filtered = data.filter((item) => item.status === 0);
        break;
      case "out-of-stock":
        filtered = data.filter((item) => item.status === 1);
        break;
      case "most-over":
        filtered = data.filter((item) => item.status === 2);
        break;
      default:
        filtered = data;
    }

    setFilteredItems(filtered);
  };

  useEffect(() => {
    handleSearch(searchTerm);
  }, [activeTab, itemsData]);

  const allProductsCount = itemsData.length;
  const inStockCount = itemsData.filter((item) => item.status === 0).length;
  const outOfStockCount = itemsData.filter((item) => item.status === 1).length;
  const mostOverCount = itemsData.filter((item) => item.status === 2).length;

  const getStatusBadge = (item) => {
    if (item.status === 0) {
      return {
        bg: "#e6fff0",
        color: "#0f7a3a",
        border: "#d6f7df",
        text: t('in_stock'),
      };
    } else if (item.status === 1) {
      return {
        bg: "#ffe9ee",
        color: "#c03a4b",
        border: "#f9d7dc",
        text: t('out_of_stock'),
      };
    } else if (item.status === 2) {
      return {
        bg: "#fff4e6",
        color: "#b66a00",
        border: "#fbebd8",
        text: t('most_over'),
      };
    } else {
      return {
        bg: "#fff0f3",
        color: "#e53e3e",
        border: "#fcd0d9",
        text: t('unknown'),
      };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('n_a');
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // دالة لفتح الـ alert
  const openDeleteAlert = (item) => {
    setDeleteId(item.id);
    setItemToDelete(item);
    setShowDeleteAlert(true);
  };

  // دالة تأكيد الحذف
  const confirmDelete = () => {
    if (!deleteId) return;

    axios
      .delete(
        `api/Inventory/inventory/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data.message);
        getData();
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      })
      .finally(() => {
        setShowDeleteAlert(false);
        setDeleteId(null);
        setItemToDelete(null);
      });
  };

  const closeDeleteAlert = () => {
    setShowDeleteAlert(false);
    setDeleteId(null);
    setItemToDelete(null);
  };

  return (
    <div className="outer-frame d-flex justify-content-center align-items-start py-4">
      <div className="app-canvas shadow-sm w-100">
        <div className="top-dark-bar"></div>

        <div className="d-flex">
          <main className="flex-grow-1 p-3 p-md-4">
            {/* Stats cards */}
            <div className="row g-3 stats-row mb-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <div
                  className="stat-card p-3"
                  style={{ background: "#e8f6ff", border: "1px solid #d0eafc" }}
                >
                  <div className="small text-muted mb-2">
                    {t('total_price_of_available')}
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="h5 mb-0">
                      {totalPriceOfAvilable.toLocaleString()} {t('sar')}
                    </div>
                    <div className="badge bg-light text-success border">
                      {t('available')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div
                  className="stat-card p-3"
                  style={{ background: "#fff0f3", border: "1px solid #f3d9e0" }}
                >
                  <div className="small text-muted mb-2">
                    {t('today_price_almost_end')}
                  </div>
                  <div className="h5 mb-0">
                    {todayPriceAlmostEnd.toLocaleString()} {t('sar')}
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div
                  className="stat-card p-3"
                  style={{ background: "#ecfff1", border: "1px solid #dff7e6" }}
                >
                  <div className="small text-muted mb-2">
                    {t('total_products_available')}
                  </div>
                  <div className="h5 mb-0">{totalProductsAvilable}</div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div
                  className="stat-card p-3"
                  style={{ background: "#fff7ea", border: "1px solid #f2e3c9" }}
                >
                  <div className="small text-muted mb-2">
                    {t('total_products_most_over')}
                  </div>
                  <div className="h5 mb-0">{totalProductsMostOver}</div>
                </div>
              </div>
            </div>

            {/* Warehouse summary */}
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
              <div>
                <h6 className="mb-1">{t('warehouse_summary')}</h6>
                <div className="text-muted small">
                  {t('warehouse_summary_description')}
                </div>
              </div>

              <div className="d-flex gap-2 align-items-center mt-2 mt-md-0">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    print();
                  }}
                >
                  <i className="bi bi-download"></i> {t('export')}
                </button>
                <Link to={"/warehouse/addProduct"}>
                  <button className="btn btn-primary btn-sm">
                    {t('new_product')} <i className="bi bi-plus-lg ms-1"></i>
                  </button>
                </Link>
              </div>
            </div>

            {/* Inner search */}
            <div className="mb-4">
              <div className="inner-search d-flex">
                <input
                  className="form-control me-2"
                  placeholder={t('search_placeholder_warehouse')}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button className="btn btn-light border">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="card rounded tab-card mb-4">
              <div className="card-body p-2">
                <div
                  className="nav nav-pills d-flex gap-2 flex-nowrap overflow-auto"
                  role="tablist"
                >
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${activeTab === "all" ? "active" : ""
                        }`}
                      onClick={() => setActiveTab("all")}
                    >
                      {t('all_product')}{" "}
                      <span className="badge bg-primary ms-2">
                        {allProductsCount}
                      </span>
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${activeTab === "in-stock" ? "active" : ""
                        }`}
                      onClick={() => setActiveTab("in-stock")}
                    >
                      {t('in_stock')}{" "}
                      <span className="text-muted ms-2">({inStockCount})</span>
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${activeTab === "most-over" ? "active" : ""
                        }`}
                      onClick={() => setActiveTab("most-over")}
                    >
                      {t('its_most_over')} ({mostOverCount})
                    </button>
                  </div>
                  <div className="nav-item flex-shrink-0">
                    <button
                      className={`nav-link ${activeTab === "out-of-stock" ? "active" : ""
                        }`}
                      onClick={() => setActiveTab("out-of-stock")}
                    >
                      {t('out_of_stock')} ({outOfStockCount})
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ maxWidth: "90vw" }}>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <div className="print-area">
                    <table className="table mb-0 align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>{t('product')}</th>
                          <th>{t('category')}</th>
                          <th>{t('quantity')}</th>
                          <th>{t('date_of_income')}</th>
                          <th>{t('price')}</th>
                          <th>{t('total_value')}</th>
                          <th>{t('status')}</th>
                          <th className="text-end">{t('action')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => {
                            const statusBadge = getStatusBadge(item);

                            return (
                              <tr key={item.id}>
                                <td>
                                  <div className="fw-semibold">
                                    {item.itemName || t('n_a')}
                                  </div>
                                </td>
                                <td>{item.category || t('n_a')}</td>
                                <td>{item.quantity}</td>
                                <td>{formatDate(item.data_of_income)}</td>
                                <td>
                                  {item.price ? `${item.price} ${t('sar')}` : `0 ${t('sar')}`}
                                </td>
                                <td>
                                  {item.totalValue
                                    ? `${item.totalValue} ${t('sar')}`
                                    : `0 ${t('sar')}`}
                                </td>
                                <td>
                                  <span
                                    className="badge"
                                    style={{
                                      background: statusBadge.bg,
                                      color: statusBadge.color,
                                      border: `1px solid ${statusBadge.border}`,
                                    }}
                                  >
                                    {statusBadge.text}
                                  </span>
                                </td>
                                <td className="text-end">
                                  <Link
                                    to={`/warehouse/editeProduct/${item.id}`}
                                  >
                                    <button className="btn btn-sm btn-outline-secondary me-1">
                                      <i className="bi bi-pencil"></i>
                                    </button>
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => openDeleteAlert(item)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center py-4">
                              {searchTerm
                                ? t('no_products_found')
                                : t('no_products_available')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Confirm Alert Dialog */}
      <ConfirmAlert
        open={showDeleteAlert}
        onClose={closeDeleteAlert}
        onConfirm={confirmDelete}
        title={t('delete_product')}
        message={
          itemToDelete
            ? `${t('delete_confirmation_message')} "${itemToDelete.itemName || t('this_product')
            }"?`
            : t('delete_confirmation_message_general')
        }
        confirmText={t('delete')}
        cancelText={t('cancel')}
        confirmColor="error"
        type="delete"
      />
    </div>
  );
};

export default WarehouseDashboard;
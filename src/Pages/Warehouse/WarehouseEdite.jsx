import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WarehouseEdite = () => {
  const { t } = useTranslation();
  let { id } = useParams();

  const [formData, setFormData] = useState({
    company: "",
    productName: "",
    dataIndastre: "",
    dataExpire: "",
    productCategory: "",
    salary: "",
    quantity: "",
    statusProduct: t('select_status_product'),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  let token = JSON.parse(localStorage.token);
  const handleSaveChanges = (e) => {
    e.preventDefault();
    axios
      .patch(
        `api/Inventory/inventory/${id}`,
        {
          itemName: formData.productName,
          companyName: formData.company,
          category: formData.productCategory,
          status:
            formData.statusProduct === t('in_stock')
              ? 0
              : formData.statusProduct === t('out_of_stock')
                ? 1
                : 2,
          data_of_income: formData.dataIndastre,
          quantity: Number(formData.quantity),
          price: Number(formData.salary),
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success(t('done'));
        window.location.href = "/warehouse";
      })
      .catch((err) => {
        console.log(err);
        toast.error(t('failed_to_update'));
      });
  };

  useEffect(() => {
    axios
      .get(`api/Inventory/inventory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let data = res.data.data;
        console.log(data);

        setFormData({
          company: data.companyName,
          productName: data.itemName,
          dataIndastre: data.data_of_income.split("T")[0], // Extract date part
          dataExpire: "", // This doesn't exist in API response
          productCategory: data.category,
          salary: data.price.toString(),
          quantity: data.quantity.toString(),
          statusProduct:
            data.status === 0
              ? t('in_stock')
              : data.status === 1
                ? t('out_of_stock')
                : t('most_over'),
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(t('failed_to_load'));
      });
  }, [id, token]);

  const handleDiscardChanges = () => {
    // إعادة تعيين البيانات إلى القيم الافتراضية
    setFormData({
      productName: "",
      dataIndastre: "",
      dataExpire: "",
      productCategory: "",
      salary: "",
      quantity: "",
      statusProduct: t('select_status_product'),
    });
    alert(t('changes_discarded'));
  };

  return (
    <div className="outer-frame d-flex justify-content-center align-items-start py-4">
      <div className="app-canvas w-100">
        <div className="top-dark-bar"></div>

        <div className="d-flex">
          <main className="flex-grow-1 p-4">
            <div className="mb-3">
              <h3 className="mb-1">{t('product')}</h3>
              <div className="small text-muted">
                {t('dashboard')} › {t('warehouse')} ›{" "}
                <span style={{ color: "#0b63c6", fontWeight: "600" }}>
                  {t('edit_product')}
                </span>
              </div>
            </div>

            {/* Two-column layout: form left, images/actions right */}
            <div className="row g-4">
              {/* Left: Product Information */}
              <div className="col-12 col-lg-8 w-100">
                <div className="card p-4" style={{ borderRadius: "14px" }}>
                  <h5 className="mb-3">{t('product_information')}</h5>

                  <form onSubmit={handleSaveChanges}>
                    <div className="mb-3">
                      <label className="form-label small text-muted">
                        {t('company')}
                      </label>
                      <input
                        className="form-control"
                        name="company"
                        placeholder={t('input_company')}
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-muted">
                        {t('product_name')}
                      </label>
                      <input
                        className="form-control"
                        name="productName"
                        placeholder={t('input_product_name')}
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-12">
                        <label className="form-label small text-muted">
                          {t('data_indastre')}
                        </label>
                        <input
                          className="form-control"
                          name="dataIndastre"
                          type="date"
                          placeholder="2025-01-08"
                          value={formData.dataIndastre}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label small text-muted">
                          {t('product_category')}
                        </label>
                        <input
                          className="form-control"
                          name="productCategory"
                          placeholder={t('category')}
                          value={formData.productCategory}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small text-muted">
                          {t('salary')}
                        </label>
                        <input
                          className="form-control"
                          name="salary"
                          placeholder={t('input_price')}
                          value={formData.salary}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-muted">
                        {t('quantity')}
                      </label>
                      <input
                        className="form-control"
                        name="quantity"
                        placeholder={t('input_quantity')}
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-muted">
                        {t('status_product')}
                      </label>
                      <select
                        className="form-select"
                        name="statusProduct"
                        value={formData.statusProduct}
                        onChange={handleInputChange}
                      >
                        <option value={t('select_status_product')}>
                          {t('select_status_product')}
                        </option>
                        <option value={t('in_stock')}>{t('in_stock')}</option>
                        <option value={t('out_of_stock')}>{t('out_of_stock')}</option>
                        <option value={t('most_over')}>{t('most_over')}</option>
                      </select>
                    </div>
                    <button
                      className="btn btn-primary w-100"
                      onClick={handleSaveChanges}
                    >
                      {t('save_product')}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default WarehouseEdite;
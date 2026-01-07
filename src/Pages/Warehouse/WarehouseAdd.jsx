import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const WarehouseAdd = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    company: "",
    productName: "",
    dataIndastre: "",
    dataExpire: "",
    productCategory: "",
    salary: "",
    quantity: "",
    statusProduct: t('in_stock'),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.salary || !formData.quantity) {
      alert(t('fill_required_fields'));
      return;
    }

    let token = JSON.parse(localStorage.getItem("token"));

    axios
      .post(
        `api/Inventory/inventory`,
        {
          itemName: formData.productName,
          companyName: formData.company,
          category: formData.productCategory,
          status:
            formData.statusProduct === t('in_stock')
              ? 0
              : formData.statusProduct === t('out_of_stock')
                ? 1
                : formData.statusProduct === t('most_over')
                  ? 2
                  : 4,
          data_of_income: formData.dataIndastre,
          quantity: Number(formData.quantity),
          price: Number(formData.salary),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);

        setFormData({
          company: "",
          productName: "",
          dataIndastre: "",
          dataExpire: "",
          productCategory: "",
          salary: "",
          quantity: "",
          statusProduct: t('in_stock'),
        });
      })
      .catch((err) => {
        toast.error(err.response.data.title || t('failed_to_add'))
      })

  };

  return (
    <div className="outer-frame d-flex justify-content-center align-items-start py-4">
      <div className="app-canvas w-100">
        <div className="top-dark-bar"></div>

        <div className="d-flex">
          {/* المحتوى الرئيسي بدون الشريط الجانبي */}
          <main className="flex-grow-1 p-4">
            {/* Breadcrumb + Title */}
            <div className="mb-3">
              <h3 className="mb-1">{t('product')}</h3>
              <div className="small text-muted">
                {t('dashboard')} › {t('warehouse')} ›{" "}
                <span style={{ color: "#0b63c6", fontWeight: "600" }}>
                  {t('add_product')}
                </span>
              </div>
            </div>

            {/* Two-column layout: left form, right image upload */}
            <div className="row g-4">
              {/* Left: Product Information */}
              <div className="col-12 col-lg-8 w-100">
                <div className="card p-4" style={{ borderRadius: "14px" }}>
                  <h5 className="mb-3">{t('product_information')}</h5>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label small text-muted">
                        {t('company')}
                      </label>
                      <input
                        className="form-control"
                        name="company"
                        placeholder={t('input_company_name')}
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
                          placeholder="2025-05-05"
                          value={formData.dataIndastre}
                          onChange={handleInputChange}
                          type="date"
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
                          {t('price')}
                        </label>
                        <input
                          className="form-control"
                          name="salary"
                          type="number"
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
                        type="number"
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
                        <option value={t('in_stock')}>{t('in_stock')}</option>
                        <option value={t('out_of_stock')}>{t('out_of_stock')}</option>
                        <option value={t('most_over')}>{t('most_over')}</option>
                      </select>
                    </div>
                    <button
                      className="btn btn-primary w-100"
                      onClick={handleSubmit}
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

export default WarehouseAdd;
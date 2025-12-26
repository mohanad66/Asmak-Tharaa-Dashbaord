import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const WarehouseEdite = () => {
  let { id } = useParams();

  const [formData, setFormData] = useState({
    company: "",
    productName: "",
    dataIndastre: "",
    dataExpire: "",
    productCategory: "",
    salary: "",
    quantity: "",
    statusProduct: "Select status product",
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
        `https://tharaa.premiumasp.net/api/Inventory/inventory/${id}`,
        {
          itemName: formData.productName,
          companyName: formData.company,
          category: formData.productCategory,
          status:
            formData.statusProduct === "In Stock"
              ? 0
              : formData.statusProduct === "Out of Stock"
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
        toast.success("Done");
        window.location.href = "/warehouse";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`https://tharaa.premiumasp.net/api/Inventory/inventory/${id}`, {
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
              ? "In Stock"
              : data.status === 1
              ? "Out of Stock"
              : "Returned",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load product data");
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
      statusProduct: "Select status product",
    });
    alert("Changes discarded!");
  };

  return (
    <div className="outer-frame d-flex justify-content-center align-items-start py-4">
      <div className="app-canvas w-100">
        <div className="top-dark-bar"></div>

        <div className="d-flex">
          <main className="flex-grow-1 p-4">
            <div className="mb-3">
              <h3 className="mb-1">Product</h3>
              <div className="small text-muted">
                Dashboard › Warehouse ›{" "}
                <span style={{ color: "#0b63c6", fontWeight: "600" }}>
                  Edit Product
                </span>
              </div>
            </div>

            {/* Two-column layout: form left, images/actions right */}
            <div className="row g-4">
              {/* Left: Product Information */}
              <div className="col-12 col-lg-8 w-100">
                <div className="card p-4" style={{ borderRadius: "14px" }}>
                  <h5 className="mb-3">Product Information</h5>
                  {/*
                  <p className="text-muted small">
                    Lorem ipsum dolor sit amet consectetur. Non ac nulla aliquam
                    aenean in velit mattis.
                  </p>
                    */}

                  <form onSubmit={handleSaveChanges}>
                    <div className="mb-3">
                      <label className="form-label small text-muted">
                        company
                      </label>
                      <input
                        className="form-control"
                        name="company"
                        placeholder="Input no company"
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-muted">
                        Product Name
                      </label>
                      <input
                        className="form-control"
                        name="productName"
                        placeholder="Input product name"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-12">
                        <label className="form-label small text-muted">
                          Data indastre
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
                      {/* <div className="col-6">
                        <label className="form-label small text-muted">Data Expire</label>
                        <input 
                          className="form-control" 
                          name="dataExpire"
                          placeholder="25/8/2010"
                          value={formData.dataExpire}
                          onChange={handleInputChange}
                        />
                      </div> */}
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label small text-muted">
                          Product Category
                        </label>
                        <input
                          className="form-control"
                          name="productCategory"
                          placeholder="category"
                          value={formData.productCategory}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small text-muted">
                          salary
                        </label>
                        <input
                          className="form-control"
                          name="salary"
                          placeholder="Input Price"
                          value={formData.salary}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-muted">
                        Quantity
                      </label>
                      <input
                        className="form-control"
                        name="quantity"
                        placeholder="Input Quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-muted">
                        Status Product
                      </label>
                      <select
                        className="form-select"
                        name="statusProduct"
                        value={formData.statusProduct}
                        onChange={handleInputChange}
                      >
                        <option value="Select status product">
                          Select status product
                        </option>
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Returned">Most Over</option>
                      </select>
                    </div>
                    <button
                      className="btn btn-primary w-100"
                      onClick={handleSaveChanges}
                    >
                      Save Product
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

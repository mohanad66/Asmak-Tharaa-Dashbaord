import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const WarehouseAdd = () => {
  const [formData, setFormData] = useState({
    company: "",
    productName: "",
    dataIndastre: "",
    dataExpire: "",
    productCategory: "",
    salary: "",
    quantity: "",
    statusProduct: "In Stock",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages[index] = {
      ...newImages[index],
      file: null,
      preview: null,
    };
    setImages(newImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.salary || !formData.quantity) {
      alert("Please fill in all required fields");
      return;
    }

    // التحقق من وجود صورة واحدة على الأقل
    // const hasImages = images.some(img => img.file !== null);
    // if (!hasImages) {
    //   alert('Please upload at least one product image');
    //   return;
    // }

    console.log({
      itemName: formData.productName,
      companyName: formData.company,
      category: formData.productCategory,
      status:
        formData.statusProduct === "In Stock"
          ? 0
          : formData.statusProduct === "Out of Stock"
          ? 1
          : formData.statusProduct === "Most Over"
          ? 2
          : 4,
      data_of_income: formData.dataIndastre,
      quantity: Number(formData.quantity),
      price: Number(formData.salary),
    });
    //console.log('Images:', images);
    //console.log(formData.statusProduct);
    let token = JSON.parse(localStorage.getItem("token"));

    axios
      .post(
        `https://tharaa.premiumasp.net/api/Inventory/inventory`,
        {
          itemName: formData.productName,
          companyName: formData.company,
          category: formData.productCategory,
          status:
            formData.statusProduct === "In Stock"
              ? 0
              : formData.statusProduct === "Out of Stock"
              ? 1
              : formData.statusProduct === "Most Over"
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
          statusProduct: "In Stock",
        });
      })
      .catch((err)=>{
        // console.log(err);
        toast.error(err.response.data.title)
        
      })

    // setImages([
    //   { id: 1, file: null, preview: null, label: "Photo 1" },
    //   { id: 2, file: null, preview: null, label: "Photo 2" },
    //   { id: 3, file: null, preview: null, label: "Photo 3" },
    //   { id: 4, file: null, preview: null, label: "Photo 4" }
    // ]);
  };

  return (
    <div className="outer-frame d-flex justify-content-center align-items-start py-4">
      <div className="app-canvas w-100">
        <div className="top-dark-bar"></div>

        <div className="d-flex">
          {/* المحتوى الرئيسي بدون الشريط الجانبي */}
          <main className="flex-grow-1 p-4">
            {/* Top: search & actions */}

            {/* Breadcrumb + Title */}
            <div className="mb-3">
              <h3 className="mb-1">Product</h3>
              <div className="small text-muted">
                Dashboard › Warehouse ›{" "}
                <span style={{ color: "#0b63c6", fontWeight: "600" }}>
                  Add Product
                </span>
              </div>
            </div>

            {/* Two-column layout: left form, right image upload */}
            <div className="row g-4">
              {/* Left: Product Information */}
              <div className="col-12 col-lg-8 w-100">
                <div className="card p-4" style={{ borderRadius: "14px" }}>
                  <h5 className="mb-3">Product Information</h5>
                  {/* <p className="text-muted small">
                    Lorem ipsum dolor sit amet consectetur. Non ac nulla aliquam
                    aenean in velit mattis.
                  </p> */}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label small text-muted">
                        company
                      </label>
                      <input
                        className="form-control"
                        name="company"
                        placeholder="Input company name"
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
                          placeholder="2025-05-05"
                          value={formData.dataIndastre}
                          onChange={handleInputChange}
                          type="date"
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
                          Price
                        </label>
                        <input
                          className="form-control"
                          name="salary"
                          type="number"
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
                        type="number"
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
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Most Over">Most Over</option>
                      </select>
                    </div>
                    <button
                      className="btn btn-primary w-100"
                      onClick={handleSubmit}
                    >
                      Save Product
                    </button>
                  </form>
                </div>
              </div>

              {/* Right: Image Product + Save */}
              {/* <div className="col-12 col-lg-4">
                <div className="card p-3 mb-3" style={{borderRadius: '14px'}}>
                  <h5 className="mb-2">Image Product</h5>
                  <div className="small text-muted mb-3">
                    Note : Format photos SVG, PNG, or JPG (Max size 4mb)
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    {images.map((image, index) => (
                      <div key={image.id} className="text-center">
                        <label 
                          className="upload-box d-flex flex-column align-items-center justify-content-center p-2"
                          style={{
                            width: '80px',
                            height: '80px',
                            border: image.preview ? '1px solid #e6e9ee' : '1px dashed #bcd7ff',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            overflow: 'hidden'
                          }}
                        >
                          <input 
                            type="file" 
                            accept="image/svg+xml, image/png, image/jpeg, image/jpg"
                            style={{display: 'none'}}
                            onChange={(e) => handleImageUpload(index, e)}
                          />
                          {image.preview ? (
                            <div className="position-relative">
                              <img 
                                src={image.preview} 
                                alt={`product-${index}`}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  padding: 0,
                                  fontSize: '10px'
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveImage(index);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <>
                              <i className="bi bi-image" style={{fontSize: '18px', color: '#6b7280'}}></i>
                              <div className="small text-muted mt-1">{image.label}</div>
                            </>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="d-grid mt-4">
                    
                  </div>
                </div>

                {/* helper / notes card
                <div className="card p-3" style={{borderRadius: '14px'}}>
                  <div className="small text-muted">
                    You can add up to 4 photos. SVG, PNG or JPG only.
                  </div>
                </div>
              </div>*/}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default WarehouseAdd;

import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddStuff = () => {
  const [formData, setFormData] = useState({
    staffName: "",
    startDate: "",
    position: "",
    salary: "",
    age: "",
  });

  // const [images, setImages] = useState([
  //   { id: 1, file: null, preview: null, label: "Photo 1", width: 80 },
  //   { id: 2, file: null, preview: null, label: "Photo 2", width: 170 },
  // ]);

  const [teamType, setTeamType] = useState("Team from resturant");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleImageUpload = (index, e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     // التحقق من حجم الملف (4MB كحد أقصى)
  //     if (file.size > 4 * 1024 * 1024) {
  //       alert("File size must be less than 4MB");
  //       return;
  //     }

  //     // التحقق من نوع الملف
  //     const validTypes = [
  //       "image/svg+xml",
  //       "image/png",
  //       "image/jpeg",
  //       "image/jpg",
  //     ];
  //     if (!validTypes.includes(file.type)) {
  //       alert("Please select SVG, PNG, or JPG files only");
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const newImages = [...images];
  //       newImages[index] = {
  //         ...newImages[index],
  //         file: file,
  //         preview: e.target.result,
  //       };
  //       setImages(newImages);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleRemoveImage = (index) => {
  //   const newImages = [...images];
  //   newImages[index] = {
  //     ...newImages[index],
  //     file: null,
  //     preview: null,
  //   };
  //   setImages(newImages);
  // };

  const handleTeamTypeChange = (type) => {
    setTeamType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // التحقق من الحقول المطلوبة
    if (!formData.staffName || !formData.salary || !formData.position) {
      alert("Please fill in all required fields");
      return;
    }
    let token = JSON.parse(localStorage.getItem("token"));

    axios
      .post(
        `https://tharaa.premiumasp.net/api/Stuff`,
        {
          fullName: formData.staffName,
          position: formData.position,
          age: Number(formData.age),
          salary: Number(formData.salary),
          startDate: new Date(formData.startDate).toISOString(),

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => toast.success(res.data.message))
      .catch((err) => {
        alert(err);
        return;
      });

    console.log("Form Data:", formData);

    
    setFormData({
      staffName: "",
      startDate: "",
      position: "",
      salary: "",
      age: "",
    });

    // setImages([
    //   { id: 1, file: null, preview: null, label: "Photo 1", width: 80 },
    //   { id: 2, file: null, preview: null, label: "Photo 2", width: 170 },
    // ]);
  };

  return (
    <div className="outer-frame d-flex justify-content-center align-items-start">
      <div className="app-canvas w-100">
        <div className="top-dark-bar"></div>

        <div className="d-flex">
          <main className="flex-grow-1 p-4">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between header-row mb-3">
              <div className="welcome">
                <h4 className="mb-1">staff</h4>
                <div className="text-muted small">
                  Dashboard › teams ›{" "}
                  <span style={{ color: "#0b63c6", fontWeight: "600" }}>
                    Add Staff
                  </span>
                </div>
              </div>
            </div>

            <hr
              style={{
                borderColor: "#e9e9eb",
                marginTop: 0,
                marginBottom: "18px",
              }}
            />

            <div className="row g-4">
              {/* Left: Staff Information */}
              <div className="col-12">
                <div className="card p-4" style={{ borderRadius: "14px" }}>
                  <h5 className="mb-3">Staff Information</h5>
                  {/* <p className="text-muted small">
                    Lorem ipsum dolor sit amet consectetur. Non ac nulla aliquam
                    aenean in velit mattis.
                  </p> */}

                  <form onSubmit={handleSubmit}>
                    {/* <div className="mb-3">
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
                    </div> */}

                    <div className="mb-3">
                      <label className="form-label small text-muted">
                        staff Name
                      </label>
                      <input
                        className="form-control"
                        name="staffName"
                        placeholder="Input staff name"
                        value={formData.staffName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label small text-muted">
                          Discount
                        </label>
                        <input
                          className="form-control"
                          name="discount"
                          placeholder="-2,5%"
                          value={formData.discount}
                          onChange={handleInputChange}
                        />
                      </div> 
                    </div> */}
                    <div className="col-12">
                      <label className="form-label small text-muted">
                        start data
                      </label>
                      <input
                        className="form-control"
                        name="startDate"
                        placeholder="25/08/2025"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label small text-muted">
                          posation
                        </label>
                        <input
                          className="form-control"
                          name="position"
                          placeholder="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small text-muted">
                          salare
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
                      <label className="form-label small text-muted">age</label>
                      <input
                        className="form-control"
                        name="age"
                        placeholder="Input stock"
                        value={formData.age}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* <div className="mb-3">
                      <label className="form-label small text-muted">
                        Evaluation
                      </label>
                      <select
                        className="form-select"
                        name="evaluation"
                        value={formData.evaluation}
                        onChange={handleInputChange}
                      >
                        <option value="Evaluation">Evaluation</option>
                        <option value="1.0">1.0</option>
                        <option value="2.0">2.0</option>
                        <option value="3.0">3.0</option>
                        <option value="3.5">3.5</option>
                        <option value="4.0">4.0</option>
                        <option value="4.5">4.5</option>
                        <option value="5.0">5.0</option>
                      </select>
                    </div> */}
                  </form>
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    Save Staff
                  </button>
                </div>
              </div>

              {/* Right: Image Staff + Save */}
              {/* <div className="col-12 col-lg-4">
                <div className="card p-3 mb-3" style={{ borderRadius: "14px" }}>
                  <h5 className="mb-2">Image Staff</h5>
                  <div className="small text-muted mb-3">
                    Note : Format photos SVG, PNG, or JPG (Max size 4mb)
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    {images.map((image, index) => (
                      <div key={image.id} className="text-center">
                        <label
                          className="upload-box d-flex flex-column align-items-center justify-content-center p-2"
                          style={{
                            width: `${image.width}px`,
                            height: "80px",
                            border: image.preview
                              ? "1px solid #e6e9ee"
                              : "1px dashed #bcd7ff",
                            borderRadius: "8px",
                            cursor: "pointer",
                            overflow: "hidden",
                          }}
                        >
                          <input
                            type="file"
                            accept="image/svg+xml, image/png, image/jpeg, image/jpg"
                            style={{ display: "none" }}
                            onChange={(e) => handleImageUpload(index, e)}
                          />
                          {image.preview ? (
                            <div className="position-relative w-100 h-100">
                              <img
                                src={image.preview}
                                alt={`staff-${index}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  padding: 0,
                                  fontSize: "10px",
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
                            <div className="d-flex align-items-center justify-content-center h-100">
                              <i
                                className="bi bi-image"
                                style={{ fontSize: "18px", color: "#6b7280" }}
                              ></i>
                              {image.width === 170 && (
                                <div className="small text-muted ms-2">
                                  {image.label}
                                </div>
                              )}
                              {image.width === 80 && (
                                <div className="small text-muted mt-1 position-absolute bottom-2">
                                  {image.label}
                                </div>
                              )}
                            </div>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="d-grid mt-4">
                    
                  </div>
                </div>

                <div className="card p-3" style={{ borderRadius: "14px" }}>
                  <div className="small text-muted">
                    You can add up to 4 photos. SVG, PNG or JPG only.
                  </div>
                </div>
              </div> */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AddStuff;

import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const AddDelivery = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    salary: 0,
    address: "",
    password: "",
  });

  const [images, setImages] = useState([
    { id: 1, file: null, preview: null, label: t('photo_1'), width: 80 },
    { id: 2, file: null, preview: null, label: t('photo_2'), width: 170 },
  ]);

  const [teamType, setTeamType] = useState(t('team_from_restaurant'));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // التحقق من حجم الملف (4MB كحد أقصى)
      if (file.size > 4 * 1024 * 1024) {
        alert(t('file_size_must_be_less_than_4mb'));
        return;
      }

      // التحقق من نوع الملف
      const validTypes = [
        "image/svg+xml",
        "image/png",
        "image/jpeg",
        "image/jpg",
      ];
      if (!validTypes.includes(file.type)) {
        alert(t('please_select_svg_png_or_jpg_files_only'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...images];
        newImages[index] = {
          ...newImages[index],
          file: file,
          preview: e.target.result,
        };
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
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

  const handleTeamTypeChange = (type) => {
    setTeamType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // التحقق من الحقول المطلوبة
    if (
      !formData.name ||
      !formData.phone ||
      !formData.salary ||
      !formData.address ||
      !formData.password
    ) {
      alert(t('please_fill_in_all_required_fields'));
      return;
    }
    let token = JSON.parse(localStorage.getItem("token"));

    axios
      .post(
        `api/Delivery/delivery-guys`,
        {
          driverName: formData.name,
          driverPhone: formData.phone,
          driverPhotoUrl: "string",
          salary: Number(formData.salary),
          address: formData.address,
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => toast.success(res.data.message))
      .catch((err) => console.log(err));

    //alert("Delivery staff added successfully!");

    // إعادة تعيين النموذج
    setFormData({
      name: "",
      phone: "",
      salary: 0,
      address: "",
      password: "",
    });

    // setImages([
    //   { id: 1, file: null, preview: null, label: t('photo_1'), width: 80 },
    //   { id: 2, file: null, preview: null, label: t('photo_2'), width: 170 },
    // ]);
  };

  return (
    <div className="outer-frame d-flex justify-content-center align-items-start ">
      <div className="app-canvas w-100">
        <div className="top-dark-bar"></div>

        <div className="d-flex w-100">
          <main className="flex-grow-1 p-4 w-100">
            <div className="mb-3">
              <h3 className="mb-1">{t('add_delivery')}</h3>
              <div className="small text-muted">
                {t('dashboard')} › {t('teams')} ›{" "}
                <span style={{ color: "#0b63c6", fontWeight: "600" }}>
                  {t('add_delivery')}
                </span>
              </div>
            </div>

            {/* Two-column layout: left form, right image upload */}
            <div className="row g-4 w-100">
              {/* Left: Staff/Delivery Information */}
              <div className="col-12">
                <div className="card p-4" style={{ borderRadius: "14px" }}>
                  <h5 className="mb-3">{t('staff_information')}</h5>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label small text-muted">
                        {t('delivery_name')}
                      </label>
                      <input
                        className="form-control"
                        name="name"
                        placeholder={t('input_delivery_name')}
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small text-muted">
                        {t('phone')}
                      </label>
                      <input
                        className="form-control"
                        name="phone"
                        placeholder={t('input_delivery_phone_number')}
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-12">
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
                        {t('address')}
                      </label>
                      <input
                        className="form-control"
                        name="address"
                        placeholder={t('input_address')}
                        value={formData.address}
                        onChange={handleInputChange}
                        autoComplete="off"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small text-muted">
                        {t('password')}
                      </label>
                      <input
                        className="form-control"
                        autoComplete="off"
                        name="password"
                        placeholder={t('input_password')}
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  </form>
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    {t('save_delivery')}
                  </button>
                </div>
              </div>

              {/* Right: Image Delivery + Save */}
              {/* <div className="col-12 col-lg-4">
                <div className="card p-3 mb-3" style={{borderRadius: '14px'}}>
                  <h5 className="mb-2">{t('image_delivery')}</h5>
                  <div className="small text-muted mb-3">
                    {t('note_format_photos_svg_png_jpg_max_size_4mb')}
                  </div>

                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    {images.map((image, index) => (
                      <div key={image.id} className="text-center">
                        <label 
                          className="upload-box d-flex flex-column align-items-center justify-content-center p-2"
                          style={{
                            width: `${image.width}px`,
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
                            <div className="position-relative w-100 h-100">
                              <img 
                                src={image.preview} 
                                alt={`delivery-${index}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
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
                            <div className="d-flex align-items-center justify-content-center h-100">
                              <i className="bi bi-image" style={{fontSize: '18px', color: '#6b7280'}}></i>
                              {image.width === 170 && (
                                <div className="small text-muted ms-2">{image.label}</div>
                              )}
                              {image.width === 80 && (
                                <div className="small text-muted mt-1 position-absolute bottom-2">{image.label}</div>
                              )}
                            </div>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="d-grid mt-4">
                    <button 
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      {t('save_delivery')}
                    </button>
                  </div>
                </div>

                <div className="card p-3" style={{borderRadius: '14px'}}>
                  <div className="small text-muted">
                    {t('you_can_add_up_to_4_photos_svg_png_jpg_only')}
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

export default AddDelivery;
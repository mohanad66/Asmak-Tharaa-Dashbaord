import Button from "@mui/joy/Button";
import { useState } from "react";
import axios from "axios";

function Login() {
  let [role, setRole] = useState("");

  let [phone, setPhone] = useState("");
  let [password, setPassword] = useState("");

  let [DeliveryId, setDeliveryId] = useState(0);

  const handleSubmit = async () => {
    axios
      .post("https://tharaa.premiumasp.net/api/WebAuthentication/login", {
        phoneNumber: phone,
        password: password,
      })
      .then((res) => {
        if (res.data?.statusCode === 200) {
          localStorage.token = JSON.stringify(res.data.token);
          let token = JSON.parse(localStorage.getItem("token"));

          const decodeToken = (token) => {
            const payload = token.split(".")[1];
            return JSON.parse(atob(payload));
          };

          let info = decodeToken(token);

          localStorage.role =
            info[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];
          localStorage.id =
            info[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ];
          localStorage.name =
            info["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

          localStorage.phoneNumber = phone;
          localStorage.password = password;
          window.location.href = "/";
        } else {
          console.log(res.data.message);
          alert(res.data.message);
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "space-between",
        alignItems: "center",

        gap: "20px",
      }}
      className="loginCon"
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          background: "rgb(247 247 247)",

          padding: role == "delivery" ? 20 : 100,

          paddingLeft: 0,
          paddingRight: 0,
          borderRadius: 25,
        }}
        className={role == "delivery" ? "con2-v2" : "con2"}
      >
        <img src="/lightLogo.jpg" style={{ width: 150, height: 150 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

            color: "rgba(102, 102, 102, 1)",
            gap: "20px",
            background: "rgb(247 247 247)",
          }}
        >
          <div
            style={{
              width: "120%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <label style={{ marginBottom: "5px" }}>Phone:</label>
            <input
              type="text"
              name="phone"
              required
              style={{
                border: "1px rgba(102, 102, 102, 0.35) solid",
                borderRadius: "8px",
                fontSize: "1em",
                padding: "8px",
                width: "100%",
              }}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div
            style={{
              width: "120%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <label style={{ marginBottom: "5px" }}>Password:</label>
            <input
              type="password"
              name="password"
              required
              style={{
                border: "1px rgba(102, 102, 102, 0.35) solid",
                borderRadius: "8px",
                fontSize: "1em",
                padding: "8px",
                width: "100%",
              }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {role == "delivery" && (
            <div
              style={{
                width: "120%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label style={{ marginBottom: "5px" }}>ID:</label>
              <input
                type="number"
                name="phone"
                required
                style={{
                  border: "1px rgba(102, 102, 102, 0.35) solid",
                  borderRadius: "8px",
                  fontSize: "1em",
                  padding: "8px",
                  width: "100%",
                }}
                onChange={(e) => setDeliveryId(e.target.value)}
              />
            </div>
          )}
          <Button
            variant="solid"
            size="lg"
            sx={{ borderRadius: "30px", fontSize: "1em", background: "#000" }}
            onClick={() => handleSubmit()}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;

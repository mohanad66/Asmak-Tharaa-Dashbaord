import Button from "@mui/joy/Button";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


function Login() {
  let [role, setRole] = useState("");

  let [email, setEmail] = useState("");
  let [phone, setPhone] = useState("");
  let [password, setPassword] = useState("");

  let [DeliveryId, setDeliveryId] = useState(0);

  const handleSubmit = async () => {
    axios
      .post("/api/Auth/login", {  // Added leading slash for proxy
        email: email,
        password: password,
      })
      .then((res) => {
        console.log("Login Response:", res.data);

        if (res.data?.statusCode === 200) {
          // Store token
          localStorage.setItem("token", JSON.stringify(res.data.token));
          let token = JSON.parse(localStorage.getItem("token"));

          // Decode token
          const decodeToken = (token) => {
            const payload = token.split(".")[1];
            return JSON.parse(atob(payload));
          };

          let info = decodeToken(token);
          console.log("Decoded Token Info:", info);

          // Store role
          localStorage.setItem(
            "role",
            info["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
          );

          // Optional: Store other user info if needed
          // localStorage.setItem(
          //   "id",
          //   info["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
          // );
          // localStorage.setItem(
          //   "name",
          //   info["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
          // );

          // Redirect to dashboard
          window.location.href = "/";

        } else {
          console.error("Login failed:", res.data.message);
          toast.error(res.data.message || "Login failed");
        }
      })
      .catch((err) => {
        console.error("Login Error Details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });

        const errorMessage = err.response?.data?.message ||
          err.response?.data?.title ||
          "Login failed. Please check your credentials.";
        toast.error(errorMessage);
      });
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
        {/* <img src="/lightLogo.jpg" style={{ width: 150, height: 150 }} /> */}
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
            <label style={{ marginBottom: "5px" }}>Email:</label>
            <input
              type="email"
              name="email"
              required
              style={{
                border: "1px rgba(102, 102, 102, 0.35) solid",
                borderRadius: "8px",
                fontSize: "1em",
                padding: "8px",
                width: "100%",
              }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* <div
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
          </div> */}

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

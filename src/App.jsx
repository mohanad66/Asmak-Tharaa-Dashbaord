import { useState } from "react";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import { DateProvider } from "./Contexts/DateContext";
function App() {
  return (
    <DateProvider>
      {localStorage.token ? <Home /> : <Login />}
    </DateProvider>
  );
}

export default App;

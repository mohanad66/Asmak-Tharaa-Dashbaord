import { useState } from "react";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import { DateProvider } from "./Contexts/DateContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <DateProvider>
      <Toaster />
      
      {localStorage.token ? <Home /> : <Login />}
    </DateProvider>
  );
}

export default App;

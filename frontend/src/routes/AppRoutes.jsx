import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import SignUp from "../pages/Auth/SignUp";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VerifyCode from "../pages/Auth/VerifyCode";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Routes With Layout */}
      <Route element={<MainLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword/>} />
        <Route path="/verify" element={<VerifyCode/>} />


        
        <Route path="/" element={<HomePage />} />
        {/* Add more pages here */}
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;

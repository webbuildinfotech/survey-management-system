import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import SignUp from "../pages/Auth/SignUp";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VerifyCode from "../pages/Auth/VerifyCode";
import { RoutePaths } from "./Path";
import Profile from "../pages/Profile/ProfilePage";
import SearchPage from "../pages/Search/SearchPage";
import CreatePage from "../pages/Create/CreatePage";
import AnswerPage from "../pages/Answer/AnswerPage";

const AppMainRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Routes With Layout */}
      <Route element={<MainLayout />}>
        <Route path={RoutePaths.LOGIN} element={<LoginPage />} />
        <Route path={RoutePaths.SIGNUP} element={<SignUp />} />
        <Route path={RoutePaths.FORGOT} element={<ForgotPassword />} />
        <Route path={RoutePaths.RESET} element={<ResetPassword />} />
        <Route path={RoutePaths.VERIFY} element={<VerifyCode />} />

        <Route path={RoutePaths.HOME} element={<HomePage />} />
        <Route path={RoutePaths.SEARCH} element={<SearchPage />} />
        <Route path={RoutePaths.CREATE} element={<CreatePage />} />
        <Route path={RoutePaths.ANSWER} element={<AnswerPage />} />
        <Route path={RoutePaths.PROFILE} element={<Profile />} />

        {/* Add more pages here */}
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppMainRoutes;

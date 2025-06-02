'use client';


import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import RegisterPage from "./RegisterPage";
import ResetPassword from "./ResetPassword";
import { useAuth } from "../components/AuthProvider";

;


export default function AppPage() {
  return <div>AppPage content</div>;
}
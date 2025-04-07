import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import UserLoginPage from "./pages/UserLoginPage/UserLoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import FinancialTools from "./pages/FinancialTools/FinancialTools";
import Homepage from "./pages/Homepage/Homepage";
import UserRegistrationPage from "./pages/UserRegistrationPage/UserRegistrationPage";
import LoanCalculator from "./pages/LoanCalculator/LoanCalculator";
import LifeTimeValue from "./pages/LifeTimeValue/LifetimeValue";
import PayrollCalculator from "./pages/PayrollCalculation/PayrollCalculation";
import BurnRateCalculator from "./pages/BurnRate/BurnRate";
import InvestmentGrowthCalculator from "./pages/InvestmentGrowthCalculator/InvestmentGrowthCalculator";
import MortgageCalculator from "./pages/MortgageCalculator/MortgageCalculator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AuthProvider } from "./AuthContext.jsx";
import "./App.scss";
import Runway from "./pages/Runway/Runway";
import ProtectedRoute from "./ProtectedRoute.jsx";

// Higher-Order Component for Sidebar Layout
const SidebarLayout = ({ children }) => (
  <SidebarProvider>
    <AppSidebar />
    <main className="main">
      <SidebarTrigger />
      {children}
    </main>
  </SidebarProvider>
);

function App() {
  return (
       <AuthProvider>
    <div className="app">
      <BrowserRouter>
        <Routes>
          {/* Default route redirects to /login */}
          <Route path="/" element={<Navigate to="/userlogin" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/userregistration" element={<UserRegistrationPage />} />
          <Route path="/userlogin" element={<UserLoginPage />} />

          {/* Routes with Sidebar Layout */}
          <Route path="/financialtools" element={ <ProtectedRoute><SidebarLayout><FinancialTools /></SidebarLayout>  </ProtectedRoute>} />
          <Route path="/home" element={ <ProtectedRoute><SidebarLayout><Homepage /></SidebarLayout>  </ProtectedRoute>} />
          <Route path="/apps/loan-calculator" element={ <ProtectedRoute><SidebarLayout><LoanCalculator /></SidebarLayout>  </ProtectedRoute>} />
          <Route path="/apps/ltv" element={ <ProtectedRoute><SidebarLayout><LifeTimeValue /></SidebarLayout>  </ProtectedRoute>} />
          <Route path="/apps/payroll" element={ <ProtectedRoute><SidebarLayout><PayrollCalculator /></SidebarLayout>  </ProtectedRoute>} />
          <Route path="/apps/burnrate" element={ <ProtectedRoute><SidebarLayout><BurnRateCalculator /></SidebarLayout>  </ProtectedRoute>} />
          <Route path="/apps/runway" element={ <ProtectedRoute><SidebarLayout><Runway /></SidebarLayout>  </ProtectedRoute>} />
          <Route path="/apps/mortgage-calculator" element={ <ProtectedRoute><SidebarLayout><MortgageCalculator /></SidebarLayout>  </ProtectedRoute>} />
          <Route path="/apps/investmentGrowth" element={ <ProtectedRoute><SidebarLayout><InvestmentGrowthCalculator /></SidebarLayout>  </ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
    </AuthProvider>
  );
}

export default App;

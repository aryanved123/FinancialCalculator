import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink for routing
import { FaCalculator, FaRegMoneyBillAlt, FaCog } from "react-icons/fa"; // Importing some example icons
import "./FinancialTools.scss"; // Import SCSS file

function FinancialTools() {
  return (
    <div className="financial-tools-container">
      <div className="section-content">
        {/* Finance Calculators Section */}
        <div className="first-column">
          <div className="finance-tools">
            <h2><FaCalculator /> Finance Calculators</h2>
            <ul>
              <li><NavLink to="/apps/loan-calculator">Loan Calculator</NavLink></li>
              <li><NavLink to="/apps/mortgage-calculator">Mortgage Calculator</NavLink></li>
              <li><NavLink to="/apps/investmentGrowth">Investment Growth Calculator</NavLink></li>
              <li><NavLink to="/apps/retirement-savings-calculator">Retirement Savings Calculator</NavLink></li>
              <li><NavLink to="/apps/retirement-savings">Retirement Savings</NavLink></li>
              <li><NavLink to="/apps/savings-goal">Savings Goal</NavLink></li>
              <li><NavLink to="/apps/burnrate">Burn Rate</NavLink></li>
              <li><NavLink to="/apps/runway">Runway</NavLink></li>
              <li><NavLink to="/apps/cac">Customer Acquisition Cost (CAC)</NavLink></li>
              <li><NavLink to="/apps/ltv">Lifetime Value (LTV)</NavLink></li>
              <li><NavLink to="/apps/payroll">Payroll Calculator</NavLink></li>
            </ul>
          </div>
          <div className="finance-tools-2">
            <h2><FaRegMoneyBillAlt />Tax Calculators</h2>
            <ul>
              <li><NavLink to="/apps/accounting">First</NavLink></li>
              <li><NavLink to="/apps/accounting">Second</NavLink></li>
              <li><NavLink to="/apps/accounting">Third</NavLink></li>
            </ul>
          </div>
        </div>

        <div className="second-column">
          <div className="finance-tools-3">
            <h2><FaRegMoneyBillAlt />Business Finance Calculators</h2>
            <ul>
              <li><NavLink to="/apps/accounting">First</NavLink></li>
              <li><NavLink to="/apps/accounting">Second</NavLink></li>
              <li><NavLink to="/apps/accounting">Third</NavLink></li>
            </ul>
          </div>
          <div className="finance-tools-3">
            <h2><FaRegMoneyBillAlt />Investment/Stock Calculators</h2>
            <ul>
              <li><NavLink to="/apps/accounting">First</NavLink></li>
              <li><NavLink to="/apps/accounting">Second</NavLink></li>
              <li><NavLink to="/apps/accounting">Third</NavLink></li>
            </ul>
          </div>
        </div>

        <div className="third-column">
          <div className="finance-tools-3">
            <h2><FaRegMoneyBillAlt />Currency Converters</h2>
            <ul>
              <li><NavLink to="/apps/accounting">First</NavLink></li>
              <li><NavLink to="/apps/accounting">Second</NavLink></li>
              <li><NavLink to="/apps/accounting">Third</NavLink></li>
            </ul>
          </div>
          <div className="finance-tools-3">
            <h2><FaRegMoneyBillAlt />Debt Management Calculators</h2>
            <ul>
              <li><NavLink to="/apps/accounting">First</NavLink></li>
              <li><NavLink to="/apps/accounting">Second</NavLink></li>
              <li><NavLink to="/apps/accounting">Third</NavLink></li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FinancialTools;

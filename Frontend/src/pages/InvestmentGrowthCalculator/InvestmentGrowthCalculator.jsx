import React, { useState } from "react";
import "./InvestmentGrowthCalculator.scss"; // Import SCSS file
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const InvestmentGrowthCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [years, setYears] = useState("");
  const [compoundingFrequency, setCompoundingFrequency] = useState("12"); // Default: Monthly
  const [futureValue, setFutureValue] = useState(null);
  const [error, setError] = useState("");

  // Function to calculate Future Value
  const calculateInvestmentGrowth = () => {
        event.preventDefault();  // Stop form from refreshing
    if (!initialInvestment || !annualInterestRate || !years) {
      setError("Please enter all values.");
      return;
    }

    const P = parseFloat(initialInvestment);
    const r = parseFloat(annualInterestRate) / 100;
    const t = parseFloat(years);
    const n = parseInt(compoundingFrequency);

    const FV = P * Math.pow(1 + r / n, n * t);

    setFutureValue(FV.toFixed(2));
    setError("");
  };

  // Download as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Investment Growth Calculation", 20, 20);
    doc.setFontSize(12);
    doc.text(`Initial Investment: $${initialInvestment}`, 20, 40);
    doc.text(`Annual Interest Rate: ${annualInterestRate}%`, 20, 50);
    doc.text(`Years: ${years}`, 20, 60);
    doc.text(`Compounding Frequency: ${compoundingFrequency} times/year`, 20, 70);
    doc.text(`Future Value: $${futureValue}`, 20, 90);
    doc.save("Investment_Growth_Calculation.pdf");
  };

  // Download as Excel
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Investment Growth Calculation"],
      [],
      ["Initial Investment", initialInvestment],
      ["Annual Interest Rate (%)", annualInterestRate],
      ["Years", years],
      ["Compounding Frequency", compoundingFrequency],
      ["Future Value", futureValue],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Investment Growth");
    XLSX.writeFile(wb, "Investment_Growth_Calculation.xlsx");
  };

  return (
      <div className="calculator-wrapper">
        {/* Header Section */}
        <div className="calculator-header">
          <h2>Investment Growth Calculator</h2>
        </div>

        {/* Main Container */}
        <div className="calculator-container">
          {/* Input Section (Left Side) */}
          <div className="calculation-section">
            <form>
              <div className="form-group">
                 <label>Initial Investment ($)</label>
                      <input
                        type="number"
                        value={initialInvestment}
                        onChange={(e) => setInitialInvestment(e.target.value)}
                        placeholder="Enter initial amount"
                      />
              </div>
                 <div className="form-group">
                                 <label>Annual Interest Rate (%)</label>
                                       <input
                                         type="number"
                                         value={annualInterestRate}
                                         onChange={(e) => setAnnualInterestRate(e.target.value)}
                                         placeholder="Enter interest rate"
                                       />
                      </div>
                               <div className="form-group">
                                             <label>Investment Duration (Years)</label>
                                                   <input
                                                     type="number"
                                                     value={years}
                                                     onChange={(e) => setYears(e.target.value)}
                                                     placeholder="Enter years"
                                                   />

                                          </div>

              <div className="form-group">
               <label>Compounding Frequency</label>
                     <select
                       value={compoundingFrequency}
                       onChange={(e) => setCompoundingFrequency(e.target.value)}
                     >
                       <option value="1">Annually</option>
                       <option value="4">Quarterly</option>
                       <option value="12">Monthly</option>
                       <option value="365">Daily</option>
                     </select>
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-btn"  onClick={calculateInvestmentGrowth} >
                Calculate Future Value
              </button>
            </form>
          </div>

          {/* Results Section (Right Side) */}
          <div className="results-section">
            {/* Heading changes dynamically */}
            <h3
              className="result-heading"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "black",
                marginBottom: "2rem",
              }}
            >
              {futureValue !== null
                ? "Calculated Future Value"
                : "Investment Growth Calculation Results"}
            </h3>
            {futureValue !== null ? (
              <div className="result-container">
                {" "}

                <div className="result">
                  <div className="burn-rate-display">
                    <p className="payment-amount">${futureValue}</p>

                  </div>
                </div>

                <div className="download-section">
                  <button className="download-btn" onClick={handleDownloadPDF}>
                    Download as PDF
                  </button>
                  <button className="download-btn" onClick={handleDownloadExcel}>
                    Download as Excel
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-result">
                <p>No results yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

export default InvestmentGrowthCalculator;

import React, { useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "./LifeTimeValue.scss";

const LTVCalculator = () => {
  const [revenue, setRevenue] = useState("");
  const [margin, setMargin] = useState("");
  const [lifespan, setLifespan] = useState("");
  const [result, setResult] = useState(null);

  // Handle calculation
  const handleSubmit = (e) => {
    e.preventDefault();
    const calculatedLTV = revenue * (margin / 100) * lifespan;
    const roundedLTV = parseFloat(calculatedLTV);
    // const roundedLTV = parseFloat(calculatedLTV.toFixed(2));
    setResult(roundedLTV);
  };

  // Function to Download PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Lifetime Value (LTV) Calculation", 20, 20);
    doc.setFontSize(12);
    doc.text(`Average Revenue Per Customer: $${revenue}`, 20, 40);
    doc.text(`Gross Margin: ${margin}%`, 20, 50);
    doc.text(`Average Customer Lifespan: ${lifespan} years`, 20, 60);
    doc.text(`Calculated LTV: $${result}`, 20, 80);
    doc.save("LTV_Calculation.pdf");
  };

  // Function to Download Excel
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Lifetime Value (LTV) Calculation"],
      [],
      ["Average Revenue Per Customer", revenue],
      ["Gross Margin (%)", margin],
      ["Average Customer Lifespan (Years)", lifespan],
      ["Calculated LTV", result],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "LTV Calculation");
    XLSX.writeFile(wb, "LTV_Calculation.xlsx");
  };

  return (
    <div className="calculator-wrapper">
      {/* Header Section */}
      <div className="calculator-header">
        <h2>LifeTimeValue Calculator</h2>
      </div>

      {/* Main Container */}
      <div className="calculator-container">
        {/* Input Section (Left Side) */}
        <div className="calculation-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Average Revenue Per Customer</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="Enter revenue"
              />
            </div>
            <div className="form-group">
              <label>Gross Margin (%)</label>
              <input
                type="number"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                placeholder="Enter gross margin"
              />
            </div>
            <div className="form-group">
              <label>Average Customer Lifespan (Years)</label>
              <input
                type="number"
                value={lifespan}
                onChange={(e) => setLifespan(e.target.value)}
                placeholder="Enter lifespan"
              />
            </div>
            <button type="submit" className="submit-btn">
              Calculate
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
            {result !== null
              ? "Calculated LifeTimeValue"
              : "LifeTimeValue Calculation Results"}
          </h3>
          {result !== null ? (
            <div className="result-container">
              {" "}
              {/* New container for centering */}
              <div className="result">
                {/* <h3>Calculated Lifetime Value</h3> */}
                <div className="burn-rate-display">
                  <p className="payment-amount">${result}</p>
                  {/* <p className="payment-label">Lifetime Value</p> */}
                </div>
              </div>
              {/* Download Buttons */}
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

export default LTVCalculator;

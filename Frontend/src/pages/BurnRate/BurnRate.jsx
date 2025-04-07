import React, { useState } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import "./BurnRate.scss";

function BurnRateCalculator() {
  const [startingCash, setStartingCash] = useState("");
  const [endingCash, setEndingCash] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [burnRate, setBurnRate] = useState(null);
  const [errors, setErrors] = useState({});

  const validateInput = (value, field) => {
    if (parseFloat(value) < 0) {
      setErrors(prev => ({...prev, [field]: "Negative values are not allowed"}));
      return false;
    } else {
      setErrors(prev => ({...prev, [field]: null}));
      return true;
    }
  };

  const handleStartingCashChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "startingCash")) {
      setStartingCash(value);
    }
  };

  const handleEndingCashChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "endingCash")) {
      setEndingCash(value);
    }
  };

  const handleTimePeriodChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "timePeriod")) {
      setTimePeriod(value);
    }
  };

  const calculateBurnRate = () => {
    if (startingCash && endingCash && timePeriod) {
      // Validate all inputs again before calculation
      if (
        validateInput(startingCash, "startingCash") &&
        validateInput(endingCash, "endingCash") &&
        validateInput(timePeriod, "timePeriod")
      ) {
        const calculatedBurnRate =
          (parseFloat(startingCash) - parseFloat(endingCash)) / parseFloat(timePeriod);
        setBurnRate(calculatedBurnRate);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateBurnRate();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.text("Burn Rate Calculation", 10, 10);
    doc.text(`Starting Cash: $${parseFloat(startingCash).toFixed(2)}`, 10, 20);
    doc.text(`Ending Cash: $${parseFloat(endingCash).toFixed(2)}`, 10, 30);
    doc.text(`Time Period (Months): ${parseFloat(timePeriod).toFixed(2)}`, 10, 40);
    doc.text(`Burn Rate: $${burnRate.toFixed(2)} per month`, 10, 50);

    doc.save("burn-rate-calculation.pdf");
  };

  const downloadExcel = () => {
    const data = [
      { "Parameter": "Starting Cash", "Value": `$${parseFloat(startingCash).toFixed(2)}` },
      { "Parameter": "Ending Cash", "Value": `$${parseFloat(endingCash).toFixed(2)}` },
      { "Parameter": "Time Period (Months)", "Value": parseFloat(timePeriod).toFixed(2) },
      { "Parameter": "Burn Rate", "Value": `$${burnRate.toFixed(2)} per month` },
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Burn Rate Calculation");
    XLSX.writeFile(wb, "burn-rate-calculation.xlsx");
  };

  return (
    <>
      {/* Independent header component */}
      <div className="calculator-header">
        <h2>Burn Rate Calculator</h2>
      </div>
      
      {/* Main calculator container without outer wrapper */}
      <div className="calculator-container">
        {/* Left Section - Calculation Form */}
        <div className="calculation-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="startingCash">Starting Cash</label>
              <input
                type="number"
                id="startingCash"
                value={startingCash}
                onChange={handleStartingCashChange}
                placeholder="Enter starting cash"
                min="0"
                step="0.01" // Allow 2 decimal places
                required
              />
              {errors.startingCash && <div className="error-message">{errors.startingCash}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="endingCash">Ending Cash</label>
              <input
                type="number"
                id="endingCash"
                value={endingCash}
                onChange={handleEndingCashChange}
                placeholder="Enter ending cash"
                min="0"
                step="0.01" // Allow 2 decimal places
                required
              />
              {errors.endingCash && <div className="error-message">{errors.endingCash}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="timePeriod">Time Period (Months)</label>
              <input
                type="number"
                id="timePeriod"
                value={timePeriod}
                onChange={handleTimePeriodChange}
                placeholder="Enter time period in months"
                min="0.01"
                step="0.01" // Allow 2 decimal places
                required
              />
              {errors.timePeriod && <div className="error-message">{errors.timePeriod}</div>}
            </div>

            <button type="submit" className="submit-btn">Calculate Burn Rate</button>
          </form>
        </div>
        
        {/* Right Section - Results */}
        <div className="results-section">
          <div className="result">
            <h3>Calculation Results</h3>
            
            {burnRate !== null ? (
              <>
                <div className="burn-rate-display">
                  <p>${burnRate.toFixed(2)}<span style={{fontSize: '14px', fontWeight: 'normal'}}> per month</span></p>
                </div>
                
                <div className="result-details">
                  <div className="detail-row">
                    <span className="label">Starting Cash:</span>
                    <span className="value">${parseFloat(startingCash).toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Ending Cash:</span>
                    <span className="value">${parseFloat(endingCash).toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Time Period:</span>
                    <span className="value">{parseFloat(timePeriod).toFixed(2)} months</span>
                  </div>
                </div>

                <div className="download-section">
                  <h4>Export Results</h4>
                  <button className="download-btn" onClick={downloadPDF}>
                    Download as PDF
                  </button>
                  <button className="download-btn" onClick={downloadExcel}>
                    Download as Excel
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-result">
                Enter values on the left and click "Calculate Burn Rate" to see results
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BurnRateCalculator;
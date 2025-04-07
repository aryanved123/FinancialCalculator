import React, { useState } from 'react';
import "./PayrollCalculation.scss"; // Import SCSS file
import payrollDeductions from "./PayrollDeductions";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const PayrollCalculator = () => {
  const [amount, setAmount] = useState('');
  const [province, setProvince] = useState('Ontario');
  const [netPayment, setNetPayment] = useState(null);
  const [error, setError] = useState("");
   const [deductions, setDeductions] = useState({ tax: 0, cpp: 0, ei: 0 });


  // Handle the amount input change
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
      if (error) {
              setError("");
            }
  };

  // Handle the province selection change
  const handleProvinceChange = (event) => {
    setProvince(event.target.value);
  };
   // Function to Download PDF
    const handleDownloadPDF = () => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Payroll Calculation", 20, 20);
      doc.setFontSize(12);
      doc.text(`Gross Salary: $${amount}`, 20, 40);
      doc.text(`Tax Deducted: $${deductions.tax.toFixed(2)}`, 20, 50);
      doc.text(`CPP Contribution: $${deductions.cpp.toFixed(2)} `, 20, 60);
      doc.text(`EI Deduction: $${deductions.ei.toFixed(2)}`, 20, 70);
       doc.text(`Net Salary: $${netPayment.toFixed(2)}`, 20, 90);
      doc.save("Payroll_Calculation.pdf");
    };

    // Function to Download Excel
    const handleDownloadExcel = () => {
      const ws = XLSX.utils.aoa_to_sheet([
        ["Payroll Calculation"],
        [],
        ["Gross Salary", amount],
        ["Tax Deducted", deductions.tax.toFixed(2)],
        ["CPP Contribution", deductions.cpp.toFixed(2)],
        ["EI Deduction", deductions.ei.toFixed(2)],
         ["Net Salary", netPayment.toFixed(2)],
      ]);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Payroll Calculation");
      XLSX.writeFile(wb, "Payroll_Calculation.xlsx");
    };

  // Calculate the net payment when the button is clicked
  const calculateNetPayment = () => {
        event.preventDefault();  // Stop form from refreshing
      if (!amount || isNaN(amount) || amount <= 0) {
           setError("Please enter a valid gross salary.");
           return;
         }

         const provinceData = payrollDeductions.find(p => p.province === province);

         if (provinceData) {
           const taxAmount = (provinceData.taxRate / 100) * parseFloat(amount);
           const cppAmount = (provinceData.cppRate / 100) * parseFloat(amount);
           const eiAmount = (provinceData.eiRate / 100) * parseFloat(amount);
           const netSalary = parseFloat(amount) - (taxAmount + cppAmount + eiAmount);

           setDeductions({ tax: taxAmount, cpp: cppAmount, ei: eiAmount });
           setNetPayment(netSalary);
    }
  };

   return (
      <div className="calculator-wrapper">
        {/* Header Section */}
        <div className="calculator-header">
          <h2>Payroll Calculator</h2>
        </div>

        {/* Main Container */}
        <div className="calculator-container">
          {/* Input Section (Left Side) */}
          <div className="calculation-section">
            <form>
              <div className="form-group">
                <label>Enter Gross Salary</label>
                <input
                         type="number"
                         id="amount"
                         value={amount}
                         onChange={handleAmountChange}
                         placeholder="Enter your gross salary"
                       />
              </div>
              <div className="form-group">
                <label>Choose a Province</label>
               <select id="province" value={province} onChange={handleProvinceChange}>
                              {payrollDeductions.map((p) => (
                                <option key={p.province} value={p.province}>
                                  {p.province}
                                </option>
                              ))}
                            </select>
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-btn"  onClick={calculateNetPayment} >
                Calculate Net Payment
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
              {netPayment !== null
                ? "Calculated Net Payment"
                : "Payroll Calculation Results"}
            </h3>
            {netPayment !== null ? (
              <div className="result-container">
                {" "}

                <div className="result">
                  <div className="burn-rate-display">
                    <p className="payment-amount">${netPayment.toFixed(2)}</p>

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

export default PayrollCalculator;

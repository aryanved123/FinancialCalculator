import React, { useState } from "react";
import "./LoanCalculator.scss";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

function LoanCalculator() {
  // State for the input fields
  const [loanAmount, setLoanAmount] = useState(1000);
  const [interestRate, setInterestRate] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("1");
  const [paymentFrequency, setPaymentFrequency] = useState("monthly");
  const [calculationResult, setCalculationResult] = useState(null);
  
  // Startup business metrics (optional)
  const [showBusinessMetrics, setShowBusinessMetrics] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState("25000");
  const [monthlyBurnRate, setMonthlyBurnRate] = useState("30000");
  const [runwayMonths, setRunwayMonths] = useState("12");
  const [errors, setErrors] = useState({});

  // Format interest rate to always display 2 decimal places
  const formatInterestRate = (rate) => {
    return parseFloat(rate || 0).toFixed(2);
  };

  // Format number with 2 decimal places
  const formatNumber = (num) => {
    return parseFloat(num || 0).toFixed(2);
  };

  // Validate input to prevent negative values
  const validateInput = (value, field) => {
    if (parseFloat(value) < 0) {
      setErrors(prev => ({...prev, [field]: "Negative values are not allowed"}));
      return false;
    } else {
      setErrors(prev => ({...prev, [field]: null}));
      return true;
    }
  };

  // Handle toggle for business metrics
  const handleToggleBusinessMetrics = () => {
    setShowBusinessMetrics(!showBusinessMetrics);
  };

  // Handle loan amount change
  const handleLoanAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "loanAmount")) {
      setLoanAmount(value);
    }
  };

  // Handle interest rate change
  const handleInterestRateChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "interestRate")) {
      setInterestRate(value);
    }
  };

  // Handle monthly revenue change
  const handleMonthlyRevenueChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "monthlyRevenue")) {
      setMonthlyRevenue(value);
    }
  };

  // Handle monthly burn rate change
  const handleMonthlyBurnRateChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "monthlyBurnRate")) {
      setMonthlyBurnRate(value);
    }
  };

  // Handle runway months change
  const handleRunwayMonthsChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "runwayMonths")) {
      setRunwayMonths(value);
    }
  };

  // Function to calculate loan payment based on frequency
  const calculateLoanPayment = () => {
    const principal = parseFloat(loanAmount);
    const annualInterestRate = parseFloat(interestRate) || 0;
    const loanDurationYears = parseFloat(loanPeriod);

    // Map payment frequency to number of payments per year
    const frequencyMapping = {
      monthly: 12,
      "semi-monthly": 24,
      "bi-weekly": 26,
      weekly: 52,
    };

    const paymentsPerYear = frequencyMapping[paymentFrequency] || 12;
    const totalPayments = paymentsPerYear * loanDurationYears;
    const interestRatePerPeriod = annualInterestRate / 100 / paymentsPerYear;

    // If interest rate is zero, return simple division of amount
    if (annualInterestRate === 0) {
      return {
        paymentAmount: principal / totalPayments,
        totalInterest: 0,
        totalPayments,
        totalCost: principal
      };
    }

    // Loan Payment Formula applied correctly based on frequency
    const payment =
      (principal * interestRatePerPeriod) /
      (1 - Math.pow(1 + interestRatePerPeriod, -totalPayments));

    const totalInterest = payment * totalPayments - principal;
    const totalCost = principal + totalInterest;

    // Business metrics calculations
    let percentageOfRevenue = 0;
    let newBurnRate = 0;
    let newRunway = 0;
    let cashFlowImpact = 0;
    
    if (showBusinessMetrics) {
      const monthlyRevenueVal = parseFloat(monthlyRevenue);
      const monthlyBurnRateVal = parseFloat(monthlyBurnRate);
      const runwayMonthsVal = parseFloat(runwayMonths);
      
      // Calculate monthly payment equivalent regardless of frequency
      const monthlyPaymentEquivalent = (payment * paymentsPerYear) / 12;
      
      // Business impact calculations
      percentageOfRevenue = (monthlyPaymentEquivalent / monthlyRevenueVal) * 100;
      newBurnRate = monthlyBurnRateVal + monthlyPaymentEquivalent;
      cashFlowImpact = monthlyRevenueVal - newBurnRate;
      
      // Calculate new runway
      newRunway = monthlyRevenueVal >= newBurnRate 
                ? Infinity  // If cash flow positive, runway is infinite
                : (runwayMonthsVal * monthlyBurnRateVal) / newBurnRate;
    }

    return {
      paymentAmount: payment,
      totalInterest,
      totalPayments,
      totalCost,
      includesBusinessMetrics: showBusinessMetrics,
      percentageOfRevenue,
      originalBurnRate: parseFloat(monthlyBurnRate),
      newBurnRate,
      originalRunway: parseFloat(runwayMonths),
      newRunway,
      cashFlowImpact,
      monthlyPaymentEquivalent: (payment * paymentsPerYear) / 12
    };
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build list of fields to validate
    const fieldsToValidate = ["loanAmount", "interestRate"];
    
    // Add business metrics if enabled
    if (showBusinessMetrics) {
      fieldsToValidate.push("monthlyRevenue", "monthlyBurnRate", "runwayMonths");
    }
    
    // Validate all required inputs
    const allValid = fieldsToValidate.every(field => {
      const value = {
        loanAmount,
        interestRate,
        monthlyRevenue,
        monthlyBurnRate,
        runwayMonths
      }[field];
      
      return validateInput(value, field);
    });
    
    if (allValid) {
      const result = calculateLoanPayment();
      setCalculationResult(result);
    }
  };

  // Function to download PDF
  const downloadPDF = () => {
    if (!calculationResult) return;
    
    const doc = new jsPDF();
    doc.text("Startup Loan Calculation Summary", 10, 10);
    doc.text(`Loan Amount: $${formatNumber(loanAmount)}`, 10, 20);
    doc.text(`Interest Rate: ${formatInterestRate(interestRate)}%`, 10, 30);
    doc.text(`Loan Period: ${loanPeriod} year(s)`, 10, 40);
    doc.text(`Payment Frequency: ${paymentFrequency.replace('-', ' ')}`, 10, 50);
    doc.text(`Payment Amount: $${formatNumber(calculationResult.paymentAmount)}`, 10, 60);
    doc.text(`Total Interest: $${formatNumber(calculationResult.totalInterest)}`, 10, 70);
    doc.text(`Total Cost: $${formatNumber(calculationResult.totalCost)}`, 10, 80);
    
    // Only include business metrics if enabled
    if (calculationResult.includesBusinessMetrics) {
      doc.text("\nBusiness Impact Analysis:", 10, 90);
      doc.text(`Monthly Payment Equivalent: $${formatNumber(calculationResult.monthlyPaymentEquivalent)}`, 10, 100);
      doc.text(`Percentage of Monthly Revenue: ${formatNumber(calculationResult.percentageOfRevenue)}%`, 10, 110);
      doc.text(`Original Monthly Burn Rate: $${formatNumber(calculationResult.originalBurnRate)}`, 10, 120);
      doc.text(`New Monthly Burn Rate: $${formatNumber(calculationResult.newBurnRate)}`, 10, 130);
      
      if (calculationResult.newRunway === Infinity) {
        doc.text(`Runway Impact: Cash flow positive (infinite runway)`, 10, 140);
      } else {
        doc.text(`Original Runway: ${formatNumber(calculationResult.originalRunway)} months`, 10, 140);
        doc.text(`New Runway: ${formatNumber(calculationResult.newRunway)} months`, 10, 150);
      }
      
      doc.text(`Monthly Cash Flow Impact: $${formatNumber(calculationResult.cashFlowImpact)}`, 10, 160);
    }
    
    doc.save("startup-loan-calculation.pdf");
  };

  // Function to download Excel
  const downloadExcel = () => {
    if (!calculationResult) return;
    
    const data = [
      { "Parameter": "Loan Amount", "Value": `$${formatNumber(loanAmount)}` },
      { "Parameter": "Interest Rate", "Value": `${formatInterestRate(interestRate)}%` },
      { "Parameter": "Loan Period", "Value": `${loanPeriod} year(s)` },
      { "Parameter": "Payment Frequency", "Value": paymentFrequency.replace('-', ' ') },
      { "Parameter": "Payment Amount", "Value": `$${formatNumber(calculationResult.paymentAmount)}` },
      { "Parameter": "Total Payments", "Value": calculationResult.totalPayments },
      { "Parameter": "Total Interest", "Value": `$${formatNumber(calculationResult.totalInterest)}` },
      { "Parameter": "Total Cost", "Value": `$${formatNumber(calculationResult.totalCost)}` }
    ];
    
    // Add business metrics if enabled
    if (calculationResult.includesBusinessMetrics) {
      data.push(
        { "Parameter": "Monthly Payment Equivalent", "Value": `$${formatNumber(calculationResult.monthlyPaymentEquivalent)}` },
        { "Parameter": "Percentage of Monthly Revenue", "Value": `${formatNumber(calculationResult.percentageOfRevenue)}%` },
        { "Parameter": "Original Monthly Burn Rate", "Value": `$${formatNumber(calculationResult.originalBurnRate)}` },
        { "Parameter": "New Monthly Burn Rate", "Value": `$${formatNumber(calculationResult.newBurnRate)}` }
      );
      
      if (calculationResult.newRunway === Infinity) {
        data.push({ "Parameter": "Runway Impact", "Value": "Cash flow positive (infinite runway)" });
      } else {
        data.push(
          { "Parameter": "Original Runway", "Value": `${formatNumber(calculationResult.originalRunway)} months` },
          { "Parameter": "New Runway", "Value": `${formatNumber(calculationResult.newRunway)} months` }
        );
      }
      
      data.push({ "Parameter": "Monthly Cash Flow Impact", "Value": `$${formatNumber(calculationResult.cashFlowImpact)}` });
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Startup Loan Calculation");
    XLSX.writeFile(wb, "startup-loan-calculation.xlsx");
  };

  return (
    <div className="calculator-header">
      <h2>Startup Loan Calculator</h2>
      
      <div className="calculator-container">
        {/* Left Section - Calculation Form */}
        <div className="calculation-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="loanAmount">How much would you like to borrow?</label>
              <div className="input-group">
                <span className="input-group-addon">$</span>
                <input
                  type="number"
                  id="loanAmount"
                  value={loanAmount}
                  onChange={handleLoanAmountChange}
                  placeholder="Enter loan amount"
                  min="1000"
                  step="0.01"
                  required
                />
              </div>
              {errors.loanAmount && <div className="error-message">{errors.loanAmount}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="interestRate">Interest Rate (%)</label>
              <div className="input-group">
                <input
                  type="number"
                  id="interestRate"
                  value={interestRate}
                  onChange={handleInterestRateChange}
                  placeholder="Annual interest rate"
                  step="0.01"
                  min="0"
                  required
                />
                <span className="input-group-addon">%</span>
              </div>
              {errors.interestRate && <div className="error-message">{errors.interestRate}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="loanPeriod">Loan Payment Period (years)</label>
              <select
                id="loanPeriod"
                value={loanPeriod}
                onChange={(e) => setLoanPeriod(e.target.value)}
                required
              >
                {[...Array(10)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1} Year{index > 0 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="paymentFrequency">Loan Payment Frequency</label>
              <select
                id="paymentFrequency"
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value)}
                required
              >
                <option value="monthly">Monthly</option>
                <option value="semi-monthly">Semi-Monthly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            {/* Toggle for Business Metrics */}
            <div className="form-group switch-container">
              <label className="switch-label">
                Include Business Financial Impact
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={showBusinessMetrics}
                    onChange={handleToggleBusinessMetrics}
                  />
                  <span className="slider round"></span>
                </div>
              </label>
            </div>

            {/* Business Metrics Section (conditionally rendered) */}
            {showBusinessMetrics && (
              <div className="business-metrics-section">
                <div className="section-divider">
                  <span>Business Financial Impact</span>
                </div>

                <div className="form-group">
                  <label htmlFor="monthlyRevenue">Monthly Revenue</label>
                  <div className="input-group">
                    <span className="input-group-addon">$</span>
                    <input
                      type="number"
                      id="monthlyRevenue"
                      value={monthlyRevenue}
                      onChange={handleMonthlyRevenueChange}
                      placeholder="Monthly revenue"
                      min="0"
                      step="0.01"
                      required={showBusinessMetrics}
                    />
                  </div>
                  {errors.monthlyRevenue && <div className="error-message">{errors.monthlyRevenue}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="monthlyBurnRate">Current Monthly Burn Rate</label>
                  <div className="input-group">
                    <span className="input-group-addon">$</span>
                    <input
                      type="number"
                      id="monthlyBurnRate"
                      value={monthlyBurnRate}
                      onChange={handleMonthlyBurnRateChange}
                      placeholder="Monthly burn rate"
                      min="0"
                      step="0.01"
                      required={showBusinessMetrics}
                    />
                  </div>
                  {errors.monthlyBurnRate && <div className="error-message">{errors.monthlyBurnRate}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="runwayMonths">Current Runway (months)</label>
                  <input
                    type="number"
                    id="runwayMonths"
                    value={runwayMonths}
                    onChange={handleRunwayMonthsChange}
                    placeholder="Current runway in months"
                    min="0"
                    step="0.01"
                    required={showBusinessMetrics}
                  />
                  {errors.runwayMonths && <div className="error-message">{errors.runwayMonths}</div>}
                </div>
              </div>
            )}

            <button type="submit" className="submit-btn">
              Calculate Payment
            </button>
          </form>
        </div>
        
        {/* Right Section - Results */}
        <div className="results-section">
          <div className="result">
            <h3>Calculation Results</h3>
            
            {calculationResult ? (
              <>
                <div className="burn-rate-display">
                  <p className="payment-amount">
                    ${formatNumber(calculationResult.paymentAmount)}
                    <span className="payment-label"> per {paymentFrequency.replace('-', ' ')} payment</span>
                  </p>
                </div>
                
                <div className="result-details">
                  <div className="detail-section">
                    <h4>Loan Details</h4>
                    <div className="detail-row">
                      <span className="label">Loan Amount:</span>
                      <span className="value">${formatNumber(loanAmount)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Interest Rate:</span>
                      <span className="value">{formatInterestRate(interestRate)}%</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Loan Term:</span>
                      <span className="value">{loanPeriod} year(s)</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Total Payments:</span>
                      <span className="value">{calculationResult.totalPayments}</span>
                    </div>
                    <div className="detail-row highlight-row">
                      <span className="label">Total Interest:</span>
                      <span className="value interest-value">${formatNumber(calculationResult.totalInterest)}</span>
                    </div>
                    <div className="detail-row total-row">
                      <span className="label">Total Cost:</span>
                      <span className="value">${formatNumber(calculationResult.totalCost)}</span>
                    </div>
                  </div>
                  
                  {/* Business metrics section - only show if enabled */}
                  {calculationResult.includesBusinessMetrics && (
                    <div className="detail-section">
                      <h4>Business Impact Analysis</h4>
                      <div className="detail-row">
                        <span className="label">Monthly Payment Equivalent:</span>
                        <span className="value">${formatNumber(calculationResult.monthlyPaymentEquivalent)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">% of Monthly Revenue:</span>
                        <span className="value">{formatNumber(calculationResult.percentageOfRevenue)}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Original Burn Rate:</span>
                        <span className="value">${formatNumber(calculationResult.originalBurnRate)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">New Burn Rate:</span>
                        <span className="value">${formatNumber(calculationResult.newBurnRate)}</span>
                      </div>
                      
                      {calculationResult.newRunway === Infinity ? (
                        <div className="detail-row">
                          <span className="label">Runway Impact:</span>
                          <span className="value positive">Cash flow positive</span>
                        </div>
                      ) : (
                        <>
                          <div className="detail-row">
                            <span className="label">Original Runway:</span>
                            <span className="value">{formatNumber(calculationResult.originalRunway)} months</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">New Runway:</span>
                            <span className="value">{formatNumber(calculationResult.newRunway)} months</span>
                          </div>
                        </>
                      )}
                      
                      <div className="detail-row">
                        <span className="label">Cash Flow Impact:</span>
                        <span className={`value ${calculationResult.cashFlowImpact >= 0 ? 'positive' : 'negative'}`}>
                          ${formatNumber(calculationResult.cashFlowImpact)}
                        </span>
                      </div>
                    </div>
                  )}
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
                Enter values on the left and click "Calculate Payment" to see results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanCalculator;
import React, { useState } from "react";
import "./MortgageCalculator.scss";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

function MortgageCalculator() {
  // State for the input fields
  const [propertyPrice, setPropertyPrice] = useState("500000");
  const [downPayment, setDownPayment] = useState("100000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const [loanTerm, setLoanTerm] = useState("10");
  const [interestRate, setInterestRate] = useState("6.50");
  const [propertyTax, setPropertyTax] = useState("1.50");
  const [insuranceCost, setInsuranceCost] = useState("2400");
  const [maintenanceCost, setMaintenanceCost] = useState("1.20");
  
  // Business metrics (optional)
  const [showBusinessMetrics, setShowBusinessMetrics] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState("25000");
  const [monthlyRunway, setMonthlyRunway] = useState("150000");
  
  const [calculationResult, setCalculationResult] = useState(null);
  const [errors, setErrors] = useState({});

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

  // Handle property price change
  const handlePropertyPriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "propertyPrice")) {
      setPropertyPrice(value);
      
      // Update down payment amount based on percentage if property price changes
      if (value && downPaymentPercent) {
        const newDownPayment = (parseFloat(value) * parseFloat(downPaymentPercent)) / 100;
        setDownPayment(newDownPayment.toFixed(2));
      }
    }
  };

  // Handle down payment change
  const handleDownPaymentChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "downPayment")) {
      setDownPayment(value);
      
      // Update down payment percentage
      if (value && propertyPrice) {
        const newPercentage = (parseFloat(value) / parseFloat(propertyPrice)) * 100;
        setDownPaymentPercent(newPercentage.toFixed(2));
      }
    }
  };

  // Handle down payment percentage change
  const handleDownPaymentPercentChange = (e) => {
    const value = e.target.value;
    if (value === "" || (validateInput(value, "downPaymentPercent") && parseFloat(value) <= 100)) {
      setDownPaymentPercent(value);
      
      // Update down payment amount
      if (value && propertyPrice) {
        const newDownPayment = (parseFloat(propertyPrice) * parseFloat(value)) / 100;
        setDownPayment(newDownPayment.toFixed(2));
      }
    }
  };

  // Handle toggle for business metrics
  const handleToggleBusinessMetrics = () => {
    setShowBusinessMetrics(!showBusinessMetrics);
  };

  // Input handlers for other fields
  const handleInterestRateChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "interestRate")) {
      setInterestRate(value);
    }
  };

  const handlePropertyTaxChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "propertyTax")) {
      setPropertyTax(value);
    }
  };

  const handleInsuranceCostChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "insuranceCost")) {
      setInsuranceCost(value);
    }
  };

  const handleMaintenanceCostChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "maintenanceCost")) {
      setMaintenanceCost(value);
    }
  };

  const handleMonthlyRevenueChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "monthlyRevenue")) {
      setMonthlyRevenue(value);
    }
  };

  const handleMonthlyRunwayChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateInput(value, "monthlyRunway")) {
      setMonthlyRunway(value);
    }
  };

  // Calculate the mortgage
  const calculateMortgage = () => {
    const principal = parseFloat(propertyPrice) - parseFloat(downPayment);
    const annualInterestRate = parseFloat(interestRate);
    const termYears = parseFloat(loanTerm);

    // Monthly interest rate
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    
    // Total number of payments
    const totalPayments = termYears * 12;
    
    let monthlyPrincipalAndInterest = 0;
    
    // If interest rate is zero, simple division
    if (annualInterestRate === 0) {
      monthlyPrincipalAndInterest = principal / totalPayments;
    } else {
      // Standard mortgage formula
      monthlyPrincipalAndInterest = 
        (principal * monthlyInterestRate) / 
        (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));
    }
    
    // Calculate monthly property tax
    const monthlyPropertyTax = (parseFloat(propertyTax) / 100) * parseFloat(propertyPrice) / 12;
    
    // Calculate monthly insurance
    const monthlyInsurance = parseFloat(insuranceCost) / 12;
    
    // Calculate monthly maintenance costs
    const monthlyMaintenance = (parseFloat(maintenanceCost) / 100) * parseFloat(propertyPrice) / 12;
    
    // Total monthly payment
    const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance;
    
    // Total interest paid over loan term
    const totalInterest = (monthlyPrincipalAndInterest * totalPayments) - principal;
    
    // Total cost of ownership over loan term
    const totalCost = principal + totalInterest + (monthlyPropertyTax + monthlyInsurance + monthlyMaintenance) * totalPayments;
    
    // Business metrics (only if enabled)
    let percentageOfRevenue = 0;
    let runwayImpactMonths = 0;
    let cashFlowImpact = 0;
    
    if (showBusinessMetrics) {
      const monthlyRevenueVal = parseFloat(monthlyRevenue);
      const monthlyRunwayVal = parseFloat(monthlyRunway);
      
      // Percentage of revenue going to mortgage
      percentageOfRevenue = (totalMonthlyPayment / monthlyRevenueVal) * 100;
      
      // Impact on runway (in months)
      runwayImpactMonths = monthlyRunwayVal > 0 ? monthlyRunwayVal / totalMonthlyPayment : 0;
      
      // Cash flow analysis (simplified)
      cashFlowImpact = monthlyRevenueVal - totalMonthlyPayment;
    }

    return {
      principal,
      monthlyPrincipalAndInterest,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyMaintenance,
      totalMonthlyPayment,
      totalInterest,
      totalPayments,
      totalCost,
      percentageOfRevenue,
      runwayImpactMonths,
      cashFlowImpact,
      includesBusinessMetrics: showBusinessMetrics
    };
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build list of fields to validate
    const fieldsToValidate = [
      "propertyPrice", 
      "downPayment", 
      "downPaymentPercent", 
      "interestRate", 
      "propertyTax", 
      "insuranceCost", 
      "maintenanceCost"
    ];
    
    // Add business metrics if enabled
    if (showBusinessMetrics) {
      fieldsToValidate.push("monthlyRevenue", "monthlyRunway");
    }
    
    // Validate all required inputs
    const allValid = fieldsToValidate.every(field => {
      const value = {
        propertyPrice,
        downPayment,
        downPaymentPercent,
        interestRate,
        propertyTax,
        insuranceCost,
        maintenanceCost,
        monthlyRevenue,
        monthlyRunway
      }[field];
      
      return validateInput(value, field);
    });
    
    if (allValid) {
      const result = calculateMortgage();
      setCalculationResult(result);
    }
  };

  // Function to download PDF
  const downloadPDF = () => {
    if (!calculationResult) return;
    
    const doc = new jsPDF();
    doc.text("Mortgage Analysis", 10, 10);
    doc.text(`Property Price: $${formatNumber(propertyPrice)}`, 10, 20);
    doc.text(`Down Payment: $${formatNumber(downPayment)} (${formatNumber(downPaymentPercent)}%)`, 10, 30);
    doc.text(`Loan Amount: $${formatNumber(calculationResult.principal)}`, 10, 40);
    doc.text(`Loan Term: ${loanTerm} years`, 10, 50);
    doc.text(`Interest Rate: ${formatNumber(interestRate)}%`, 10, 60);
    doc.text(`Property Tax Rate: ${formatNumber(propertyTax)}%`, 10, 70);
    doc.text(`Insurance Cost: $${formatNumber(insuranceCost)}/year`, 10, 80);
    doc.text(`Maintenance Cost: ${formatNumber(maintenanceCost)}% of property value/year`, 10, 90);
    doc.text("\nMonthly Payment Breakdown:", 10, 100);
    doc.text(`Principal & Interest: $${formatNumber(calculationResult.monthlyPrincipalAndInterest)}`, 10, 110);
    doc.text(`Property Tax: $${formatNumber(calculationResult.monthlyPropertyTax)}`, 10, 120);
    doc.text(`Insurance: $${formatNumber(calculationResult.monthlyInsurance)}`, 10, 130);
    doc.text(`Maintenance: $${formatNumber(calculationResult.monthlyMaintenance)}`, 10, 140);
    doc.text(`Total Monthly Payment: $${formatNumber(calculationResult.totalMonthlyPayment)}`, 10, 150);
    
    // Only include business metrics if enabled
    if (calculationResult.includesBusinessMetrics) {
      doc.text("\nBusiness Impact Analysis:", 10, 160);
      doc.text(`Percentage of Monthly Revenue: ${formatNumber(calculationResult.percentageOfRevenue)}%`, 10, 170);
      doc.text(`Runway Impact: ${formatNumber(calculationResult.runwayImpactMonths)} months`, 10, 180);
      doc.text(`Monthly Cash Flow Impact: $${formatNumber(calculationResult.cashFlowImpact)}`, 10, 190);
      doc.text(`Total Interest Over Loan Term: $${formatNumber(calculationResult.totalInterest)}`, 10, 200);
      doc.text(`Total Cost of Ownership: $${formatNumber(calculationResult.totalCost)}`, 10, 210);
    } else {
      doc.text(`Total Interest Over Loan Term: $${formatNumber(calculationResult.totalInterest)}`, 10, 160);
      doc.text(`Total Cost of Ownership: $${formatNumber(calculationResult.totalCost)}`, 10, 170);
    }
    
    doc.save("mortgage-analysis.pdf");
  };

  // Function to download Excel
  const downloadExcel = () => {
    if (!calculationResult) return;
    
    const data = [
      { "Parameter": "Property Price", "Value": `$${formatNumber(propertyPrice)}` },
      { "Parameter": "Down Payment", "Value": `$${formatNumber(downPayment)} (${formatNumber(downPaymentPercent)}%)` },
      { "Parameter": "Loan Amount", "Value": `$${formatNumber(calculationResult.principal)}` },
      { "Parameter": "Loan Term", "Value": `${loanTerm} years` },
      { "Parameter": "Interest Rate", "Value": `${formatNumber(interestRate)}%` },
      { "Parameter": "Property Tax Rate", "Value": `${formatNumber(propertyTax)}%` },
      { "Parameter": "Insurance Cost", "Value": `$${formatNumber(insuranceCost)}/year` },
      { "Parameter": "Maintenance Cost", "Value": `${formatNumber(maintenanceCost)}% of property value/year` },
      { "Parameter": "Monthly Principal & Interest", "Value": `$${formatNumber(calculationResult.monthlyPrincipalAndInterest)}` },
      { "Parameter": "Monthly Property Tax", "Value": `$${formatNumber(calculationResult.monthlyPropertyTax)}` },
      { "Parameter": "Monthly Insurance", "Value": `$${formatNumber(calculationResult.monthlyInsurance)}` },
      { "Parameter": "Monthly Maintenance", "Value": `$${formatNumber(calculationResult.monthlyMaintenance)}` },
      { "Parameter": "Total Monthly Payment", "Value": `$${formatNumber(calculationResult.totalMonthlyPayment)}` },
      { "Parameter": "Total Interest", "Value": `$${formatNumber(calculationResult.totalInterest)}` },
      { "Parameter": "Total Cost of Ownership", "Value": `$${formatNumber(calculationResult.totalCost)}` }
    ];
    
    // Add business metrics if enabled
    if (calculationResult.includesBusinessMetrics) {
      data.push(
        { "Parameter": "Percentage of Monthly Revenue", "Value": `${formatNumber(calculationResult.percentageOfRevenue)}%` },
        { "Parameter": "Runway Impact", "Value": `${formatNumber(calculationResult.runwayImpactMonths)} months` },
        { "Parameter": "Monthly Cash Flow Impact", "Value": `$${formatNumber(calculationResult.cashFlowImpact)}` }
      );
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mortgage Analysis");
    XLSX.writeFile(wb, "mortgage-analysis.xlsx");
  };

  return (
    <div className="calculator-header">
      <h2>Mortgage Calculator</h2>
      
      <div className="calculator-container">
        {/* Left Section - Calculation Form */}
        <div className="calculation-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="propertyPrice">Property Price</label>
              <div className="input-group">
                <span className="input-group-addon">$</span>
                <input
                  type="number"
                  id="propertyPrice"
                  value={propertyPrice}
                  onChange={handlePropertyPriceChange}
                  placeholder="Enter property price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              {errors.propertyPrice && <div className="error-message">{errors.propertyPrice}</div>}
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="downPayment">Down Payment</label>
                <div className="input-group">
                  <span className="input-group-addon">$</span>
                  <input
                    type="number"
                    id="downPayment"
                    value={downPayment}
                    onChange={handleDownPaymentChange}
                    placeholder="Down payment amount"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                {errors.downPayment && <div className="error-message">{errors.downPayment}</div>}
              </div>

              <div className="form-group half-width">
                <label htmlFor="downPaymentPercent">Down Payment %</label>
                <div className="input-group">
                  <input
                    type="number"
                    id="downPaymentPercent"
                    value={downPaymentPercent}
                    onChange={handleDownPaymentPercentChange}
                    placeholder="Down payment %"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                  <span className="input-group-addon">%</span>
                </div>
                {errors.downPaymentPercent && <div className="error-message">{errors.downPaymentPercent}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="loanTerm">Loan Term</label>
              <select
                id="loanTerm"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                required
              >
                <option value="5">5 Years</option>
                <option value="7">7 Years</option>
                <option value="10">10 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="25">25 Years</option>
                <option value="30">30 Years</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="interestRate">Interest Rate</label>
              <div className="input-group">
                <input
                  type="number"
                  id="interestRate"
                  value={interestRate}
                  onChange={handleInterestRateChange}
                  placeholder="Annual interest rate"
                  min="0"
                  step="0.01"
                  required
                />
                <span className="input-group-addon">%</span>
              </div>
              {errors.interestRate && <div className="error-message">{errors.interestRate}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="propertyTax">Annual Property Tax Rate</label>
              <div className="input-group">
                <input
                  type="number"
                  id="propertyTax"
                  value={propertyTax}
                  onChange={handlePropertyTaxChange}
                  placeholder="Annual property tax rate"
                  min="0"
                  step="0.01"
                  required
                />
                <span className="input-group-addon">%</span>
              </div>
              {errors.propertyTax && <div className="error-message">{errors.propertyTax}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="insuranceCost">Annual Insurance</label>
              <div className="input-group">
                <span className="input-group-addon">$</span>
                <input
                  type="number"
                  id="insuranceCost"
                  value={insuranceCost}
                  onChange={handleInsuranceCostChange}
                  placeholder="Annual insurance premium"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              {errors.insuranceCost && <div className="error-message">{errors.insuranceCost}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="maintenanceCost">Annual Maintenance Cost (% of property value)</label>
              <div className="input-group">
                <input
                  type="number"
                  id="maintenanceCost"
                  value={maintenanceCost}
                  onChange={handleMaintenanceCostChange}
                  placeholder="Maintenance cost as % of property value"
                  min="0"
                  step="0.01"
                  required
                />
                <span className="input-group-addon">%</span>
              </div>
              {errors.maintenanceCost && <div className="error-message">{errors.maintenanceCost}</div>}
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
                  <label htmlFor="monthlyRunway">Monthly Burn Rate/Runway</label>
                  <div className="input-group">
                    <span className="input-group-addon">$</span>
                    <input
                      type="number"
                      id="monthlyRunway"
                      value={monthlyRunway}
                      onChange={handleMonthlyRunwayChange}
                      placeholder="Monthly burn rate"
                      min="0"
                      step="0.01"
                      required={showBusinessMetrics}
                    />
                  </div>
                  {errors.monthlyRunway && <div className="error-message">{errors.monthlyRunway}</div>}
                </div>
              </div>
            )}

            <button type="submit" className="submit-btn">
              Calculate Mortgage
            </button>
          </form>
        </div>
        
        {/* Right Section - Results */}
        <div className="results-section">
          <div className="result">
            <h3>Mortgage Analysis</h3>
            
            {calculationResult ? (
              <>
                <div className="burn-rate-display">
                  <p className="payment-amount">
                    ${formatNumber(calculationResult.totalMonthlyPayment)}
                    <span className="payment-label"> per month</span>
                  </p>
                </div>
                
                <div className="result-details">
                  <div className="detail-section">
                    <h4>Monthly Payment Breakdown</h4>
                    <div className="detail-row">
                      <span className="label">Principal & Interest:</span>
                      <span className="value">${formatNumber(calculationResult.monthlyPrincipalAndInterest)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Property Tax:</span>
                      <span className="value">${formatNumber(calculationResult.monthlyPropertyTax)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Insurance:</span>
                      <span className="value">${formatNumber(calculationResult.monthlyInsurance)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Maintenance:</span>
                      <span className="value">${formatNumber(calculationResult.monthlyMaintenance)}</span>
                    </div>
                  </div>
                  
                  {/* Business metrics section - only show if enabled */}
                  {calculationResult.includesBusinessMetrics && (
                    <div className="detail-section">
                      <h4>Business Impact Analysis</h4>
                      <div className="detail-row">
                        <span className="label">% of Monthly Revenue:</span>
                        <span className="value">{formatNumber(calculationResult.percentageOfRevenue)}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Cash Flow Impact:</span>
                        <span className={`value ${calculationResult.cashFlowImpact >= 0 ? 'positive' : 'negative'}`}>
                          ${formatNumber(calculationResult.cashFlowImpact)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Runway Impact:</span>
                        <span className="value">{formatNumber(calculationResult.runwayImpactMonths)} months</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="detail-row highlight-row">
                    <span className="label">Total Interest:</span>
                    <span className="value interest-value">${formatNumber(calculationResult.totalInterest)}</span>
                  </div>
                  <div className="detail-row total-row">
                    <span className="label">Total Cost of Ownership:</span>
                    <span className="value">${formatNumber(calculationResult.totalCost)}</span>
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
                Enter values on the left and click "Calculate Mortgage" to see results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MortgageCalculator;
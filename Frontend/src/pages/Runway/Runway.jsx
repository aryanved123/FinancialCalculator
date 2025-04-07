import React, { useState } from "react";
import "./Runway.scss";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

const Runway = () => {
  const [cashBalance, setCashBalance] = useState("");
  const [burnRate, setBurnRate] = useState("");
  const [runway, setRunway] = useState(null);

  const calculateRunway = () => {
    if (cashBalance > 0 && burnRate > 0) {
      setRunway((cashBalance / burnRate).toFixed(2));
    } else {
      setRunway("Invalid input");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Cash Balance: $${cashBalance}`, 10, 10);
    doc.text(`Monthly Burn Rate: $${burnRate}`, 10, 20);
    doc.text(`Runway: ${runway} months`, 10, 30);
    doc.save("Runway_Calculator.pdf");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { "Cash Balance ($)": cashBalance, "Monthly Burn Rate ($)": burnRate, "Runway (months)": runway },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Runway Calculator");
    XLSX.writeFile(wb, "Runway_Calculator.xlsx");
  };

  return (
    <div className="runway-calculator">
      <h2>Runway Calculator</h2>
      <div className="input-group">
        <label>Cash Balance ($)</label>
        <input
          type="number"
          value={cashBalance}
          onChange={(e) => setCashBalance(e.target.value)}
          placeholder="Enter cash balance"
        />
      </div>
      <div className="input-group">
        <label>Monthly Burn Rate ($)</label>
        <input
          type="number"
          value={burnRate}
          onChange={(e) => setBurnRate(e.target.value)}
          placeholder="Enter burn rate"
        />
      </div>
      <button onClick={calculateRunway}>Calculate</button>
      {runway !== null && <p className="result">Runway: {runway} months</p>}
      <div className="export-buttons">
        <button onClick={exportToPDF}>Export to PDF</button>
        <button onClick={exportToExcel}>Export to Excel</button>
      </div>
    </div>
  );
};

export default Runway;

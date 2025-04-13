import React, { useState, useEffect, useRef } from "react";
import { Table, Form, Button, Container } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import "../../styles/DigitalPrescription.css";

const DigitalPrescription = () => {
  const [prescription, setPrescription] = useState(() => {
    return JSON.parse(localStorage.getItem("prescription")) || {
      patientId: "",
      date: "",
      guardian: "",
      dob: "",
      age: "",
      sex: "Male",
      occupation: "",
      healthInsuranceNo: "",
      healthCareProvider: "",
      healthCardNo: "",
      patientName: "Asir",
      address: "",
      cellNo: "",
      diagnosedWith: "",
      bloodPressure: "",
      pulseRate: "",
      height: "",
      weight: "",
      allergies: "",
      disabilities: "",
      history: "",
      diet: "",
      followUpPhysician: "",
      medications: Array(7).fill(null).map(() => ({
        unit: "Tablet",
        drug: "",
        dosage: "",
        morning: false,
        afternoon: false,
        evening: false,
        night: false,
      })),
      signature: "",
    };
  });

  const sigCanvas = useRef(null);

  useEffect(() => {
    localStorage.setItem("prescription", JSON.stringify(prescription));
  }, [prescription]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicationChange = (index, field, value) => {
    setPrescription((prev) => {
      const updatedMedications = [...prev.medications];
      if (field === "morning" || field === "afternoon" || field === "evening" || field === "night") {
        updatedMedications[index] = {
          ...updatedMedications[index],
          [field]: !updatedMedications[index][field],
        };
      } else {
        updatedMedications[index] = {
          ...updatedMedications[index],
          [field]: value,
        };
        // Reset dependent fields when unit changes
        if (field === "unit") {
          updatedMedications[index].drug = "";
          updatedMedications[index].dosage = "";
        }
      }
      return { ...prev, medications: updatedMedications };
    });
  };

  const handleClearSignature = () => {
    sigCanvas.current.clear();
    setPrescription((prev) => ({ ...prev, signature: "" }));
  };

  const handleSubmit = () => {
    localStorage.removeItem("prescription");
    setPrescription({
      patientId: "",
      date: "",
      guardian: "",
      dob: "",
      age: "",
      sex: "Male",
      occupation: "",
      healthInsuranceNo: "",
      healthCareProvider: "",
      healthCardNo: "",
      patientName: "Asir",
      address: "",
      cellNo: "",
      diagnosedWith: "",
      bloodPressure: "",
      pulseRate: "",
      height: "",
      weight: "",
      allergies: "",
      disabilities: "",
      history: "",
      diet: "",
      followUpPhysician: "",
      medications: Array(7).fill(null).map(() => ({
        unit: "Tablet",
        drug: "",
        dosage: "",
        morning: false,
        afternoon: false,
        evening: false,
        night: false,
      })),
      signature: "",
    });
    sigCanvas.current.clear();
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
  
    // Add hospital logo with improved path handling
    try {
      doc.addImage("../../assets/download.png", "PNG", 20, 10, 30, 20);
    } catch (error) {
      console.warn("Logo image not found or failed to load:", error);
    }
  
    // Add header
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80);
    doc.text("ARUNA CARDIAC CARE", 105, 15, { align: "center" });
  
    doc.setFontSize(12);
    doc.setTextColor(127, 140, 141);
    doc.text("3B, Trivandrum Rd, Kailash Nagar, Vannarpettai, Tirunelveli", 105, 22, { align: "center" });
    doc.text("Phone: +91 9487 66 55 77 • Email: md@arunacardiaccare.in", 105, 27, { align: "center" });
  
    // Add horizontal lines
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30);
    doc.line(20, 31, 190, 31);
  
    // Rx Symbol
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185);
    doc.text("ACC", 20, 45);
  
    // Patient details section
    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, "bold");
    doc.text("PATIENT INFORMATION", 40, 45);
  
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text(`Name: ${prescription.patientName || "N/A"}`, 40, 52);
    doc.text(`Date: ${prescription.date || "N/A"}`, 140, 52);
  
    // Vitals in a styled box
    doc.setDrawColor(189, 195, 199);
    doc.setFillColor(236, 240, 241);
    doc.roundedRect(20, 58, 170, 25, 3, 3, "FD");
  
    doc.setFont(undefined, "bold");
    doc.text("VITAL SIGNS:", 25, 65);
    doc.setFont(undefined, "normal");
    doc.text(`Blood Pressure: ${prescription.bloodPressure || "N/A"}`, 25, 72);
    doc.text(`Pulse Rate: ${prescription.pulseRate || "N/A"} bpm`, 85, 72);
    doc.text(`Height: ${prescription.height || "N/A"} cm`, 25, 79);
    doc.text(`Weight: ${prescription.weight || "N/A"} kg`, 85, 79);
  
    // Medications section
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text("PRESCRIBED MEDICATIONS", 20, 95);
  
    // Medication table
    doc.setFillColor(41, 128, 185);
    doc.setTextColor(255, 255, 255);
    doc.rect(20, 100, 170, 8, "F");
  
    // Table headers
    doc.setFontSize(9);
    doc.text("#", 30, 105);
    doc.text("Unit", 50, 105);
    doc.text("Medication", 80, 105);
    doc.text("Dosage", 120, 105);
    doc.text("FN", 140, 105); // Morning
    doc.text("AN", 150, 105); // Afternoon
    doc.text("EV", 160, 105); // Evening
    doc.text("NI", 170, 105); // Night
  
    // Table content
    doc.setTextColor(44, 62, 80);
    let yPos = 113;
    prescription.medications.forEach((med, index) => {
      if (med.unit && med.drug && med.dosage) {
        // Add alternating row background
        if (index % 2 === 0) {
          doc.setFillColor(245, 247, 250);
          doc.rect(20, yPos - 4, 170, 7, "F");
        }
  
        doc.setFontSize(10); // Ensure consistent font size for table content
        doc.setFont(undefined, "normal");
        doc.text((index + 1).toString(), 30, yPos); // #
        doc.text(med.unit, 50, yPos);
        doc.text(med.drug, 80, yPos);
        doc.text(med.dosage, 120, yPos);
  
        // Timing ticks (using a professional small checkmark ✔)
        const xPositions = [140, 150, 160, 170]; // FN, AN, EV, NI positions
        const timings = [med.morning, med.afternoon, med.evening, med.night];
        timings.forEach((isChecked, i) => {
          if (isChecked) {
            doc.setFontSize(8); // Smaller font size for tick
            doc.setTextColor(0, 128, 0); // Green for tick
            doc.text("*", xPositions[i], yPos + 1); // Adjusted y-position for alignment
            doc.setFontSize(10); // Reset font size
            doc.setTextColor(44, 62, 80); // Reset color
          }
        });
  
        yPos += 7;
      }
    });
  
    // Add footer with signature
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(20, 250, 190, 250);
  
    // Add signature
    if (sigCanvas.current && sigCanvas.current.isEmpty()) {
      console.warn("Signature canvas is empty. Adding default text instead.");
      doc.setFontSize(10);
      doc.text("No Signature", 130, 260);
    } else if (sigCanvas.current) {
      const signatureData = sigCanvas.current.toDataURL();
      doc.addImage(signatureData, "PNG", 130, 255, 50, 20);
    }
  
    doc.setFont(undefined, "bold");
    doc.text("Doctor's Signature", 130, 280);
  
    // Add footer text
    doc.setFont(undefined, "italic");
    doc.setTextColor(127, 140, 141);
    doc.text("This prescription is valid for 30 days from the date of issue.", 105, 290, { align: "center" });
  
    // Add watermark (bottom left to top right with low opacity)
    doc.saveGraphicsState(); // Save the current graphics state
    doc.setFontSize(50); // Increased font size for better coverage
    doc.setTextColor(200, 200, 200, 0.1); // Very low opacity
    doc.setGState(new doc.GState({ opacity: 0.1 })); // Apply global opacity
    doc.text("ARUNA CARDIAC CARE", 20, 280, { angle: 45 }); // Bottom left to top right
    doc.restoreGraphicsState(); // Restore the graphics state
  
    doc.save("prescription.pdf");
  };

  // Dropdown options
  const unitOptions = ["Tablet", "Syrup", "Injection", "Capsule", "Drops", "Inhaler"];
  const drugOptions = {
    Tablet: ["Aspirin", "Paracetamol", "Ibuprofen"],
    Syrup: ["Cough Syrup", "Antacid Syrup"],
    Injection: ["Insulin", "Heparin"],
    Capsule: ["Omeprazole", "Amoxicillin"],
    Drops: ["Eye Drops", "Nasal Drops"],
    Inhaler: ["Albuterol", "Budesonide"],
  };
  const dosageOptions = {
    Tablet: ["1", "2", "3"],
    Syrup: ["5ml", "10ml", "15ml"],
    Injection: ["0.5ml", "1ml", "2ml"],
    Capsule: ["1", "2", "3"],
    Drops: ["2 drops", "3 drops", "4 drops"],
    Inhaler: ["1 puff", "2 puffs", "3 puffs"],
  };

  // Check if a medication row is filled
  const isRowFilled = (med) => {
    return med.unit && med.drug && med.dosage;
  };

  return (
    <Container className="prescription-container">
      <h2 className="title">Doctor's Medical Prescription</h2>
      <Form>
        <div className="form-grid">
          <Form.Group className="form-field">
            <Form.Label>Patient's Id:</Form.Label>
            <Form.Control
              name="patientId"
              value={prescription.patientId}
              onChange={handleInputChange}
              placeholder="Enter patient's id"
            />
          </Form.Group>

          <Form.Group className="form-field">
            <Form.Label>Date:</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={prescription.date}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="form-field">
            <Form.Label>Blood Pressure:</Form.Label>
            <Form.Control
              name="bloodPressure"
              value={prescription.bloodPressure}
              onChange={handleInputChange}
              placeholder="e.g., 120/80"
            />
          </Form.Group>

          <Form.Group className="form-field">
            <Form.Label>Pulse Rate:</Form.Label>
            <Form.Control
              name="pulseRate"
              value={prescription.pulseRate}
              onChange={handleInputChange}
              placeholder="e.g., 72 bpm"
            />
          </Form.Group>

          <Form.Group className="form-field">
            <Form.Label>Height:</Form.Label>
            <div className="input-with-unit">
              <Form.Control
                name="height"
                value={prescription.height}
                onChange={handleInputChange}
                placeholder="Enter height"
              />
              <span className="unit">cm</span>
            </div>
          </Form.Group>

          <Form.Group className="form-field">
            <Form.Label>Weight:</Form.Label>
            <div className="input-with-unit">
              <Form.Control
                name="weight"
                value={prescription.weight}
                onChange={handleInputChange}
                placeholder="Enter weight"
              />
              <span className="unit">kg</span>
            </div>
          </Form.Group>
        </div>

        <div className="medications-section">
          <h3 className="section-title">Medications</h3>
          <Table className="medications-table">
            <thead>
              <tr>
                <th className="col-num">#</th>
                <th className="col-unit">Unit</th>
                <th className="col-drug">Drug Name</th>
                <th className="col-dosage">Dosage</th>
                <th className="col-timing">Morning</th>
                <th className="col-timing">Afternoon</th>
                <th className="col-timing">Evening</th>
                <th className="col-timing">Night</th>
              </tr>
            </thead>
            <tbody>
              {prescription.medications.map((med, i) => (
                <tr
                  key={i}
                  style={{
                    backgroundColor: isRowFilled(med) ? "#ADD8E6" : "transparent",
                  }}
                >
                  <td>{i + 1}</td>
                  <td>
                    <Form.Select
                      value={med.unit}
                      onChange={(e) => handleMedicationChange(i, "unit", e.target.value)}
                    >
                      <option value="">Select Unit</option>
                      {unitOptions.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Select
                      value={med.drug}
                      onChange={(e) => handleMedicationChange(i, "drug", e.target.value)}
                      disabled={!med.unit}
                    >
                      <option value="">Select Drug</option>
                      {med.unit &&
                        drugOptions[med.unit].map((drug) => (
                          <option key={drug} value={drug}>
                            {drug}
                          </option>
                        ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Select
                      value={med.dosage}
                      onChange={(e) => handleMedicationChange(i, "dosage", e.target.value)}
                      disabled={!med.unit}
                    >
                      <option value="">Select Dosage</option>
                      {med.unit &&
                        dosageOptions[med.unit].map((dosage) => (
                          <option key={dosage} value={dosage}>
                            {dosage}
                          </option>
                        ))}
                    </Form.Select>
                  </td>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={med.morning}
                      onChange={() => handleMedicationChange(i, "morning")}
                      className="timing-checkbox"
                    />
                  </td>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={med.afternoon}
                      onChange={() => handleMedicationChange(i, "afternoon")}
                      className="timing-checkbox"
                    />
                  </td>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={med.evening}
                      onChange={() => handleMedicationChange(i, "evening")}
                      className="timing-checkbox"
                    />
                  </td>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={med.night}
                      onChange={() => handleMedicationChange(i, "night")}
                      className="timing-checkbox"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="signature-section">
          <Form.Label>Doctor's Signature:</Form.Label>
          <div className="signature-pad">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                className: "signature-canvas",
              }}
            />
          </div>
        </div>

        <div className="action-buttons">
          <Button variant="success" onClick={handleGeneratePDF} className="btn-action">
            Generate PDF
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="btn-action">
            Submit
          </Button>
          <Button variant="outline-secondary" onClick={handleClearSignature} className="btn-action">
            Clear Signature
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default DigitalPrescription;